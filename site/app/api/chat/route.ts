import { NextResponse } from "next/server"
import { getAIResponse } from "@/lib/ai"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req: Request) {
  try {
    console.log("==== API ROUTE CALLED ====")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Environment:", process.env.NODE_ENV)
    console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY)
    console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0)

    console.log("Chat API request received:", new Date().toISOString())

    let body
    try {
      body = await req.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json(
        { error: "Invalid request body", text: "I couldn't process your request. Please try again." },
        { status: 400, headers: corsHeaders },
      )
    }

    const { messages, mode } = body

    if (!Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return NextResponse.json(
        { error: "Messages must be an array", text: "There was an issue with your request format." },
        { status: 400, headers: corsHeaders },
      )
    }

    // First check API health
    let apiAvailable = false
    try {
      const healthCheck = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      })

      if (healthCheck.ok) {
        const healthData = await healthCheck.json()
        apiAvailable = healthData.services.groq.status === "available"
      }
    } catch (error) {
      console.warn("Failed to check API health:", error)
      // Continue with the request anyway, it might still work
    }

    // Get response from centralized AI service
    const text = await getAIResponse(messages, mode)

    return NextResponse.json(
      { text },
      {
        status: 200,
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error("==== CHAT API ERROR ====")
    console.error("Error type:", error.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)

    console.error("Unhandled error in chat API:", error)

    // Use local fallback for any unhandled errors
    return NextResponse.json(
      {
        text: "I'm sorry, but I encountered an unexpected error. Please try again later.",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
