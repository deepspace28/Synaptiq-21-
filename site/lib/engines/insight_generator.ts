import type { SimulationInterpretation, SimulationResult } from "./dynamicSimulationEngine"
import { logger } from "../logger"

/**
 * Generates an insight based on the simulation result
 * @param result The simulation result
 * @param interpretation The interpretation of the prompt
 * @returns A promise resolving to the generated insight
 */
export async function generateInsight(
  result: SimulationResult,
  interpretation: SimulationInterpretation,
): Promise<string> {
  try {
    logger.info(`Generating insight for ${interpretation.domain} simulation`)

    if (!result.success) {
      return "Unable to generate insight due to simulation failure."
    }

    // Use Groq to generate an insight
    const { groq } = await import("@ai-sdk/groq")
    const { generateText } = await import("ai")

    const systemPrompt = `You are a scientific insight generator. Based on the simulation results provided, generate a concise, insightful explanation that:
    1. Interprets the key findings in plain language
    2. Highlights any interesting patterns or anomalies
    3. Connects the results to broader scientific principles
    4. Suggests potential implications or applications
    
    Your insight should be 2-3 paragraphs, written in a clear, authoritative scientific tone.
    Avoid technical jargon unless necessary, and explain any complex concepts.
    Do not simply restate the numerical results, but provide deeper meaning and context.`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `${systemPrompt}\n\nSimulation Domain: ${interpretation.domain}\nDescription: ${interpretation.description}\nResults Summary: ${result.summary}\nRaw Results: ${JSON.stringify(result.rawOutput)}`,
      temperature: 0.7,
      maxTokens: 512,
    })

    return text.trim()
  } catch (error) {
    logger.error(`Error in generateInsight: ${error instanceof Error ? error.message : String(error)}`)

    // Return a generic insight as fallback
    return "The simulation results demonstrate the expected behavior of the system under the given conditions. Further analysis may reveal additional insights about the underlying principles at work."
  }
}
