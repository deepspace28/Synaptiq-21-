import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { parseScientificOutput } from "@/lib/structured-output-parser"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing required parameter: prompt" }, { status: 400 })
    }

    logger.info(`Received thought experiment request: ${prompt}`)

    // Call the Groq API to get a response
    const { groq } = await import("@ai-sdk/groq")
    const { generateText } = await import("ai")

    const systemPrompt = `You are a theoretical physicist specializing in thought experiments. Analyze the following request and provide a detailed scientific thought experiment:

    ${prompt}

    Your response should include:
    1. A clear summary of the thought experiment scenario
    2. The key physics principles or concepts involved
    3. Any relevant equations in LaTeX format
    4. The theoretical outcomes or implications
    5. The significance of this thought experiment in physics

    Structure your response with clear sections:
    - Summary
    - Scenario
    - Principles
    - Equations (if applicable)
    - Implications
    - Conclusion

    For well-known thought experiments like Schrödinger's cat, Einstein's elevator, or Maxwell's demon, provide the canonical description along with modern interpretations.`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: systemPrompt,
      temperature: 0.5,
      maxTokens: 2000,
    })

    // Parse the text into structured format
    const structuredOutput = parseScientificOutput(text, "thought_experiment")

    // Return the structured output
    return NextResponse.json(structuredOutput)
  } catch (error) {
    logger.error(`Error in thought experiment API: ${error instanceof Error ? error.message : String(error)}`)

    return NextResponse.json(
      {
        error: "Failed to process thought experiment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
