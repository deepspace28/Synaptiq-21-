import { logger } from "./logger"

/**
 * Enhances simulation results with insights from the Grok API
 * @param result The simulation result to enhance
 * @param prompt The original user prompt
 * @returns Enhanced simulation result with additional insights
 */
export async function enhanceWithGrokInsights(result: any, prompt: string): Promise<any> {
  try {
    if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      logger.warn("NEXT_PUBLIC_GROQ_API_KEY not set, skipping Grok insights")
      return result
    }

    // Create a prompt for Grok to generate insights
    const insightPrompt = `
You are a quantum physics expert. Based on the following quantum simulation results, provide 3-5 insightful observations about the quantum phenomena demonstrated.

Simulation type: ${result.title}
Description: ${result.description}
Measurement results: ${JSON.stringify(result.chart_data?.datasets?.[0]?.data || [])}
States measured: ${JSON.stringify(result.chart_data?.labels || [])}

Please provide your insights in a clear, educational manner suitable for someone learning quantum computing.
`

    // Call the Grok API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a quantum physics expert providing insights on quantum simulation results.",
          },
          {
            role: "user",
            content: insightPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok API returned status ${response.status}`)
    }

    const grokResponse = await response.json()
    const insights = grokResponse.choices?.[0]?.message?.content

    if (insights) {
      // Enhance the original result with Grok insights
      return {
        ...result,
        explanation: result.explanation + "\n\n" + insights,
        grokInsights: insights,
      }
    }

    return result
  } catch (error) {
    logger.error(`Error in enhanceWithGrokInsights: ${error instanceof Error ? error.message : String(error)}`)
    // Return the original result if enhancement fails
    return result
  }
}
