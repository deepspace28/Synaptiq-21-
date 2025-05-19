import { logger } from "../logger"

export interface SimulationInterpretation {
  type: "quantum" | "physics" | "symbolic" | "conceptual"
  engine: "qiskit" | "scipy" | "sympy" | "llm"
  requiresCircuit: boolean
  params: Record<string, any>
}

/**
 * Interprets a simulation prompt to understand the user's intent and extract parameters
 * @param prompt The user's prompt
 * @returns A structured interpretation of the prompt
 */
export async function interpretSimulationPrompt(
  prompt: string,
  context: Record<string, any> = {},
): Promise<SimulationInterpretation> {
  try {
    logger.info(`Interpreting simulation prompt: ${prompt}`)

    // Call the Groq API to interpret the prompt
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Analyze this scientific query and return a JSON object with:
        - type: "quantum", "physics", "symbolic", or "conceptual"
        - engine: "qiskit", "scipy", "sympy", or "llm"
        - requiresCircuit: boolean (true if this needs a quantum circuit)
        - params: object with relevant parameters

        Query: "${prompt}"
        
        For Schrödinger's cat or quantum superposition, use:
        {
          "type": "quantum",
          "engine": "qiskit",
          "requiresCircuit": true,
          "params": {
            "qubits": 2,
            "shots": 1024,
            "entangle": true
          }
        }
        
        For physics simulations, use:
        {
          "type": "physics",
          "engine": "scipy",
          "requiresCircuit": false,
          "params": {
            relevant parameters...
          }
        }
        
        Return ONLY the JSON object, no explanations.`,
        temperature: 0.1,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to interpret prompt: ${res.statusText}`)
    }

    const parsed = await res.json()

    // Validate the response
    if (!parsed.type || !parsed.engine) {
      throw new Error("Invalid interpretation response: missing required fields")
    }

    // Ensure params exists
    if (!parsed.params) {
      parsed.params = {}
    }

    // Apply defaults for Schrödinger's cat if detected
    if (
      prompt.toLowerCase().includes("schrödinger") ||
      prompt.toLowerCase().includes("schrodinger") ||
      prompt.toLowerCase().includes("cat")
    ) {
      if (parsed.type === "quantum") {
        parsed.params.qubits = parsed.params.qubits || 2
        parsed.params.shots = parsed.params.shots || 1024
        parsed.params.entangle = parsed.params.entangle !== false // default to true
      }
    }

    return parsed as SimulationInterpretation
  } catch (error) {
    logger.error(`Error interpreting prompt: ${error instanceof Error ? error.message : String(error)}`)

    // Fallback interpretation
    return {
      type: "quantum",
      engine: "qiskit",
      requiresCircuit: true,
      params: {
        qubits: 2,
        shots: 1024,
        entangle: true,
      },
    }
  }
}
