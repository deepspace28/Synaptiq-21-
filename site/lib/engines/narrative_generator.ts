import { logger } from "../logger"
import type { SimulationInterpretation } from "./dynamicSimulationEngine"

/**
 * Interface for the scientific narrative
 */
interface ScientificNarrative {
  summary: string
  equations: string[]
  chartData?: {
    type: string
    labels: Array<string | number>
    datasets: Array<{
      label: string
      data: number[]
    }>
  }
  tableData?: {
    headers: string[]
    rows: any[][]
  }
  insights: string
}

/**
 * Generates a scientific narrative based on simulation results
 * @param result The raw simulation result
 * @param interpretation The simulation interpretation
 * @returns A structured scientific narrative
 */
export async function generateScientificNarrative(
  result: any,
  interpretation: SimulationInterpretation,
): Promise<ScientificNarrative> {
  try {
    logger.info(`Generating scientific narrative for ${interpretation.domain} simulation`)

    // First, extract actual data from the result for use in prompting
    const extractedData = {
      summary: result.summary || "",
      equations: result.equations || [],
      states: result.table_data?.rows?.map((row: any[]) => `State ${row[0]}: ${row[2] * 100}%`) || [],
      circuitDescription: result.circuit_description || "",
      decoherenceEffects: result.decoherence_effects || "",
    }

    // Use Groq to generate a narrative based on the actual simulation results
    const { groq } = await import("@ai-sdk/groq")
    const { generateText } = await import("ai")

    const systemPrompt = `You are a scientific narrative generator specialized in quantum mechanics. Based on the ACTUAL simulation results provided, generate a comprehensive scientific explanation in a formal, academic style suitable for a textbook or research paper.
    
    Domain: ${interpretation.domain}
    Description: ${interpretation.description}
    
    ACTUAL SIMULATION RESULTS:
    - Summary: ${extractedData.summary}
    - Circuit Description: ${extractedData.circuitDescription}
    - Equations: ${extractedData.equations.join("; ")}
    - State Probabilities: ${extractedData.states.join(", ")}
    - Decoherence Effects: ${extractedData.decoherenceEffects}
    
    Your narrative should follow this structure:
    1. 🧪 Experiment Title: A concise, formal name of the experiment
    2. 🔧 Simulation Parameters: List all relevant parameters
    3. 🧮 Mathematical Formalism: Key derivations and state evolution using clean LaTeX
    4. 🔁 Quantum Circuit: Description of the circuit implementation
    5. 📊 Measurement Statistics: Analysis of the measurement outcomes
    6. 🧠 Insights & Interpretation: Explanation of quantum mechanical principles demonstrated
    
    Format your response as a JSON object with the following structure:
    {
      "summary": "Concise summary based on the ACTUAL results",
      "equations": ["LaTeX equation 1", "LaTeX equation 2", ...],
      "insights": "Detailed scientific explanation of the REAL results"
    }
    
    IMPORTANT: Base your narrative ONLY on the actual simulation results provided. DO NOT invent or fabricate results that weren't in the simulation.
    IMPORTANT: Format all equations in clean, textbook-style LaTeX without unnecessary decorations or colors.
    IMPORTANT: Maintain an academic tone throughout, as if writing for a scientific publication.`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: systemPrompt,
      temperature: 0.3,
      maxTokens: 1500,
    })

    try {
      // Parse the response as JSON
      const narrative = JSON.parse(text)

      return {
        summary: narrative.summary || extractedData.summary || `Results of ${interpretation.description}`,
        equations: narrative.equations || extractedData.equations || [],
        insights: narrative.insights || "Analysis of the simulation results.",
        // Use the original chart and table data as is
        chartData: result.chart_data,
        tableData: result.table_data,
      }
    } catch (parseError) {
      logger.error(`Error parsing narrative: ${parseError instanceof Error ? parseError.message : String(parseError)}`)

      // If we couldn't parse the JSON, use the raw text as insights
      return {
        summary: extractedData.summary || `Results of ${interpretation.description}`,
        equations: extractedData.equations || [],
        insights: text,
        chartData: result.chart_data,
        tableData: result.table_data,
      }
    }
  } catch (error) {
    logger.error(`Error generating narrative: ${error instanceof Error ? error.message : String(error)}`)

    // Return a minimal narrative based on the actual data we have
    return {
      summary: result.summary || `Results of ${interpretation.description}`,
      equations: result.equations || [],
      insights: "The simulation was completed, but a detailed narrative could not be generated.",
      chartData: result.chart_data,
      tableData: result.table_data,
    }
  }
}
