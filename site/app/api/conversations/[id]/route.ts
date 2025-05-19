import { type NextRequest, NextResponse } from "next/server"
import { getConversation, updateConversationTitle, deleteConversation } from "@/lib/conversation-service"
import { rateLimiter, getRateLimitResponse } from "@/lib/rate-limiter"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Get conversation ID from URL params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 })
    }

    // Get conversation
    const conversation = await getConversation(id)

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
          conversation: {
            _id: id,
            userId: userId,
            title: "New Conversation",
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { status: 404 },
      )
    }

    // Add rate limit headers to response
    const headers = new Headers()
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return NextResponse.json({ conversation }, { headers })
  } catch (error) {
    console.error("❌ Error getting conversation:", error)
    return NextResponse.json(
      {
        error: "Failed to get conversation.",
        conversation: {
          _id: params.id,
          userId: "anonymous",
          title: "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Get conversation ID from URL params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 })
    }

    // Get request body
    const { title } = await req.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 })
    }

    // Update conversation title
    const conversation = await updateConversationTitle(id, title)

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
          conversation: {
            _id: id,
            userId: userId,
            title: title,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { status: 404 },
      )
    }

    // Add rate limit headers to response
    const headers = new Headers()
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return NextResponse.json({ conversation }, { headers })
  } catch (error) {
    console.error("❌ Error updating conversation:", error)
    return NextResponse.json({ error: "Failed to update conversation." }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Get conversation ID from URL params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 })
    }

    // Delete conversation
    const success = await deleteConversation(id)

    if (!success) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 })
    }

    // Add rate limit headers to response
    const headers = new Headers()
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    headers.set("X-RateLimit-Reset", rateLimit.reset.toString())

    return NextResponse.json({ success: true }, { headers })
  } catch (error) {
    console.error("❌ Error deleting conversation:", error)
    return NextResponse.json({ error: "Failed to delete conversation." }, { status: 500 })
  }
}
