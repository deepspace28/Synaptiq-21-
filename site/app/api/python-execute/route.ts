import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

// Define a fallback response for when execution fails
const FALLBACK_RESPONSE = {
  output: "Fallback output: The Python execution service is currently unavailable.",
  error: "Service unavailable - using fallback data",
}

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: "Missing required parameter: code" }, { status: 400, headers })
    }

    logger.info("Received Python execution request")

    try {
      // Get the API URL and key from environment variables
      const apiUrl = process.env.PYTHON_API_URL
      const apiKey = process.env.PYTHON_API_KEY

      // Check if API URL and key are available
      if (!apiUrl || !apiKey) {
        logger.error("Missing API URL or API Key")
        return NextResponse.json(
          { ...FALLBACK_RESPONSE, error: "API configuration missing" },
          { status: 200, headers }, // Return 200 with fallback data
        )
      }

      // Make the API request with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ code }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if the request was successful
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} ${errorText}`)
      }

      // Parse the response
      const result = await response.json()
      return NextResponse.json(result, { headers })
    } catch (error) {
      logger.error(`Python execution error: ${error instanceof Error ? error.message : String(error)}`)

      // Return a fallback response
      return NextResponse.json(
        {
          ...FALLBACK_RESPONSE,
          error: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 200, headers }, // Return 200 with fallback data
      )
    }
  } catch (error) {
    logger.error(`API error: ${error instanceof Error ? error.message : String(error)}`)

    // Return a fallback response
    return NextResponse.json(
      {
        ...FALLBACK_RESPONSE,
        error: `API error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 200, headers }, // Return 200 with fallback data
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
