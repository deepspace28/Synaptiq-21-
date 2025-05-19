import { runQuantumSimulation } from "./quantumEngine"
import { runPhysicsSimulation } from "./physicsEngine"
import { runMathSimulation } from "./mathEngine"
import { executeQuantumSimulation } from "./quantum_executor"
import type {
  SimulationType,
  SimulationRequest,
  SimulationResponse,
  ScientificResultPayload,
} from "../../types/simulation"
import { logger } from "../logger"

/**
 * Detects the type of simulation based on the prompt
 * @param prompt The user's prompt or query string
 * @returns The detected simulation type
 */
export function detectSimulationType(prompt: string): SimulationType {
  // Convert to lowercase for case-insensitive matching
  const lowerPrompt = prompt.toLowerCase()

  // Quantum physics keywords
  const quantumKeywords = [
    "quantum",
    "qubit",
    "superposition",
    "entanglement",
    "qiskit",
    "quantum gate",
    "quantum circuit",
    "quantum computer",
    "quantum mechanics",
    "quantum state",
    "quantum algorithm",
    "quantum error",
    "quantum supremacy",
    "quantum advantage",
    "bloch sphere",
    "quantum teleportation",
    "quantum cryptography",
    "quantum key",
    "quantum fourier",
    "shor",
    "grover",
    "hadamard",
    "cnot",
    "pauli",
  ]

  // Classical physics keywords
  const physicsKeywords = [
    "classical physics",
    "mechanics",
    "kinematics",
    "dynamics",
    "force",
    "motion",
    "newton",
    "gravity",
    "acceleration",
    "velocity",
    "momentum",
    "energy",
    "thermodynamics",
    "heat",
    "temperature",
    "pressure",
    "entropy",
    "fluid",
    "electromagnetism",
    "electric",
    "magnetic",
    "field",
    "wave",
    "optics",
    "relativity",
    "einstein",
    "spacetime",
    "black hole",
    "pendulum",
    "oscillation",
  ]

  // Math/symbolic keywords
  const mathKeywords = [
    "math",
    "equation",
    "formula",
    "calculus",
    "derivative",
    "integral",
    "algebra",
    "polynomial",
    "function",
    "variable",
    "solve",
    "simplify",
    "expand",
    "factor",
    "limit",
    "series",
    "differential",
    "matrix",
    "vector",
    "eigenvalue",
    "eigenvector",
    "linear",
    "nonlinear",
    "proof",
    "theorem",
    "lemma",
    "corollary",
    "sympy",
    "symbolic",
    "expression",
  ]

  // Count matches for each category
  const quantumMatches = quantumKeywords.filter((keyword) => lowerPrompt.includes(keyword)).length
  const physicsMatches = physicsKeywords.filter((keyword) => lowerPrompt.includes(keyword)).length
  const mathMatches = mathKeywords.filter((keyword) => lowerPrompt.includes(keyword)).length

  // Determine the most likely category
  if (quantumMatches > physicsMatches && quantumMatches > mathMatches) {
    return "quantum"
  } else if (physicsMatches > quantumMatches && physicsMatches > mathMatches) {
    return "physics"
  } else if (mathMatches > quantumMatches && mathMatches > physicsMatches) {
    return "math"
  }

  // If no clear winner or no matches, check for specific patterns
  if (lowerPrompt.includes("simulate") || lowerPrompt.includes("simulation")) {
    if (lowerPrompt.includes("quantum")) return "quantum"
    if (lowerPrompt.includes("physics")) return "physics"
  }

  if (
    lowerPrompt.includes("solve") ||
    lowerPrompt.includes("equation") ||
    lowerPrompt.includes("prove") ||
    lowerPrompt.includes("calculate")
  ) {
    return "math"
  }

  // Default to unknown if we can't determine
  return "unknown"
}

/**
 * Routes the simulation request to the appropriate engine
 * @param request The simulation request containing the prompt and optional parameters
 * @returns A promise that resolves to the simulation response
 */
export async function routeSimulation(request: SimulationRequest): Promise<SimulationResponse> {
  const { prompt, parameters = {} } = request
  const startTime = Date.now()

  try {
    // Detect the type of simulation
    const simulationType = detectSimulationType(prompt)
    let result: ScientificResultPayload

    // Route to the appropriate engine
    switch (simulationType) {
      case "quantum":
        try {
          // Use the real Qiskit simulation
          logger.info(`Running quantum simulation with Python Qiskit for prompt: ${prompt}`)
          const qiskitResult = await executeQuantumSimulation(prompt, parameters)

          // Convert the Qiskit result to the expected format
          result = {
            summary: qiskitResult.summary,
            equations: qiskitResult.equations || [],
            insight: qiskitResult.insight || "",
            charts: qiskitResult.chart
              ? [
                  {
                    title: "Quantum Measurement Results",
                    labels: qiskitResult.chart.labels,
                    values: qiskitResult.chart.values,
                  },
                ]
              : undefined,
          }
        } catch (qiskitError) {
          logger.error(
            `Error in Qiskit simulation: ${qiskitError instanceof Error ? qiskitError.message : String(qiskitError)}`,
          )
          // Fall back to the mock simulation if Qiskit fails
          result = await runQuantumSimulation(prompt, parameters)
        }
        break
      case "physics":
        result = await runPhysicsSimulation(prompt, parameters)
        break
      case "math":
        result = await runMathSimulation(prompt, parameters)
        break
      default:
        // If we can't determine the type, try math as a fallback
        result = await runMathSimulation(prompt, parameters)
        break
    }

    const executionTime = Date.now() - startTime

    return {
      type: simulationType,
      result,
      executionTime,
    }
  } catch (error) {
    const executionTime = Date.now() - startTime

    return {
      type: "unknown",
      result: {
        summary: `Error processing simulation: ${error instanceof Error ? error.message : String(error)}`,
        equations: [],
        insight: "An error occurred while processing your simulation request.",
      },
      executionTime,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Handles a simulation request and returns the result
 * @param prompt The user's prompt or query string
 * @param parameters Optional parameters for the simulation
 * @returns A promise that resolves to the simulation response
 */
export async function handleSimulationRequest(
  prompt: string,
  parameters: Record<string, any> = {},
): Promise<SimulationResponse> {
  return routeSimulation({ prompt, parameters })
}
