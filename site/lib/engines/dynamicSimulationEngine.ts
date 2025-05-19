import { logger } from "../logger"
import type { SimulationResult as BaseSimulationResult } from "./dynamicSimulationEngine"
import { executeQuantumSimulation } from "./quantum_executor"
import { executeSymbolicSimulation } from "./symbolic_executor"
import { executePhysicsSimulation } from "./physics_executor"
import { generateInsight } from "./insight_generator"

/**
 * Processes a scientific prompt and returns the simulation result
 * @param prompt The user's prompt
 * @param context Optional context for the simulation
 * @returns A promise that resolves to the simulation result
 */
export async function processScientificPrompt(request: {
  prompt: string
  context?: Record<string, any>
}): Promise<SimulationResult> {
  const { prompt, context = {} } = request
  const startTime = Date.now()

  try {
    logger.info(`Processing scientific prompt: ${prompt}`)

    // 1. Interpret the prompt
    const { interpretSimulationPrompt } = await import("./simulation_interpreter")
    const interpretation = await interpretSimulationPrompt(prompt, context)

    // 2. Execute the simulation based on the interpretation
    let result: SimulationResult

    switch (interpretation.engine) {
      case "qiskit":
        result = await executeQuantumSimulation(interpretation)
        break
      case "sympy":
        result = await executeSymbolicSimulation(interpretation)
        break
      case "scipy":
        result = await executePhysicsSimulation(interpretation)
        break
      default:
        result = {
          success: false,
          summary: "Unsupported simulation engine",
          error: `Engine ${interpretation.engine} is not supported`,
        }
        break
    }

    // 3. Generate an insight based on the results
    if (result.success) {
      try {
        const insight = await generateInsight(result, interpretation)
        result.insights = insight
      } catch (insightError) {
        logger.error(
          `Error generating insight: ${insightError instanceof Error ? insightError.message : String(insightError)}`,
        )
        result.insights = "Simulation completed successfully, but an insight could not be generated."
      }
    }

    const executionTime = Date.now() - startTime
    logger.info(`Simulation completed in ${executionTime}ms`)

    return { ...result, executionTime }
  } catch (error) {
    logger.error(`Error in processScientificPrompt: ${error instanceof Error ? error.message : String(error)}`)
    return {
      success: false,
      summary: "Failed to process scientific prompt",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export interface SimulationInterpretation {
  type: "quantum" | "physics" | "symbolic" | "conceptual"
  engine: "qiskit" | "scipy" | "sympy" | "llm"
  requiresCircuit: boolean
  params: Record<string, any>
  description: string
  domain: string
}

export interface SimulationResult extends BaseSimulationResult {}
