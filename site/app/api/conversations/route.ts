import { type NextRequest, NextResponse } from "next/server"
import { createConversation, getUserConversations } from "@/lib/conversation-service"
import { rateLimiter, getRateLimitResponse } from "@/lib/rate-limiter"

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const userType = req.headers.get("x-user-type") || "anonymous"
    const userId = req.headers.get("x-user-id") || "anonymous"

    const rateLimit = await rateLimiter(req, userType as "anonymous" | "free" | "premium", userId)

    // Check if rate limit is exceeded
    const rateLimitResponse = getRateLimitResponse(rateLimit)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get user ID from request headers or query params
    const userIdParam = req.nextUrl.searchParams.get("userId")
    const actualUserId = userId !== "anonymous" ? userId : userIdParam

    if (!actualUserId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 })
    }

    // Get conversations for the user
    const conversations = await getUserConversations(actualUserId)

    // Add rate limit headers to response
    const headers = new Headers()
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return NextResponse.json({ conversations: conversations || [] }, { headers })
  } catch (error) {
    console.error("❌ Error getting conversations:", error)
    return NextResponse.json({ error: "Failed to get conversations.", conversations: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const userType = req.headers.get("x-user-type") || "anonymous"
    const userId = req.headers.get("x-user-id") || "anonymous"

    const rateLimit = await rateLimiter(req, userType as "anonymous" | "free" | "premium", userId)

    // Check if rate limit is exceeded
    const rateLimitResponse = getRateLimitResponse(rateLimit)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get user ID from request body or headers
    const { userId: bodyUserId } = await req.json()
    const actualUserId = userId !== "anonymous" ? userId : bodyUserId

    if (!actualUserId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 })
    }

    // Create a new conversation
    const conversation = await createConversation(actualUserId)

    // Add rate limit headers to response
    const headers = new Headers()
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return NextResponse.json({ conversation }, { headers })
  } catch (error) {
    console.error("❌ Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation." }, { status: 500 })
  }
}
