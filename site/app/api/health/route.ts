import { NextResponse } from "next/server"

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET() {
  try {
    // Check if GROQ API key is available
    const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY

    // Initialize status
    let groqStatus = {
      status: "unknown",
      message: "Not checked",
    }

    // Actually test the Groq API connection
    if (groqApiKey) {
      try {
        // Create a timeout for the fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch("https://api.groq.com/openai/v1/models", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        })

        // Clear the timeout
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          groqStatus = {
            status: "available",
            message: `Connected to Groq API, ${data.data?.length || 0} models available`,
          }
        } else {
          const errorText = await response.text().catch(() => "Unknown error")
          groqStatus = {
            status: "unavailable",
            message: `Groq API returned ${response.status}: ${errorText}`,
          }
        }
      } catch (error) {
        console.error("Error checking Groq API:", error)
        groqStatus = {
          status: "unavailable",
          message: error instanceof Error ? error.message : "Unknown error",
        }
      }
    } else {
      groqStatus = { status: "unconfigured", message: "GROQ_API_KEY not set" }
    }

    // Determine overall system status
    const systemStatus = groqStatus.status === "available" ? "operational" : "degraded"

    // Return health check response
    return NextResponse.json(
      {
        status: systemStatus,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "unknown",
        services: {
          groq: {
            configured: !!groqApiKey,
            status: groqStatus.status,
            message: groqStatus.message,
          },
        },
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          groq: {
            status: "unavailable",
            message: "Health check failed",
          },
        },
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
