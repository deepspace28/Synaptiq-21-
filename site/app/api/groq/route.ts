import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, temperature = 0.2 } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing required parameter: prompt" }, { status: 400 })
    }

    logger.info(`Received Groq API request`)

    // Use Groq to interpret the prompt
    const { groq } = await import("@ai-sdk/groq")
    const { generateText } = await import("ai")

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature,
      maxTokens: 1500,
    })

    try {
      // Try to parse as JSON
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    } catch (parseError) {
      // If not valid JSON, return the raw text
      return NextResponse.json({
        type: "quantum",
        engine: "qiskit",
        requiresCircuit: true,
        params: {
          qubits: 2,
          shots: 1024,
          entangle: true,
        },
      })
    }
  } catch (error) {
    logger.error(`Error in Groq API: ${error instanceof Error ? error.message : String(error)}`)

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
