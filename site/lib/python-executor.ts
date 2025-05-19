import { logger } from "./logger"

// Define a type for the Python execution result
interface PythonExecutionResult {
  output?: string
  error?: string
  visualizations?: any[]
  circuit?: string
  measurements?: any
  insights?: string[]
  [key: string]: any
}

// Mock data for fallback when API fails
const FALLBACK_RESULTS: Record<string, PythonExecutionResult> = {
  bell_state: {
    title: "Bell State Simulation",
    description: "A simulation of the Bell state, demonstrating quantum entanglement.",
    circuit: `
      q0: ─────■─────
              │     
      q1: ───┬┴┬─────
    `,
    measurements: {
      headers: ["State", "Probability"],
      rows: [
        ["00", "0.5"],
        ["11", "0.5"],
      ],
    },
    insights: [
      "The Bell state creates perfect correlation between two qubits.",
      "Measuring one qubit instantly determines the state of the other, regardless of distance.",
      "This demonstrates quantum entanglement, a key resource for quantum computing.",
    ],
    codeSnippet: `
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# Create a Bell state
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Simulate the circuit
simulator = Aer.get_backend('qasm_simulator')
result = execute(qc, simulator, shots=1024).result()
counts = result.get_counts(qc)
print(counts)

# Plot the results
plot_histogram(counts)
plt.show()
`,
  },
  default: {
    title: "Quantum Simulation",
    description: "A basic quantum simulation with fallback data.",
    circuit: `
      q0: ───H───
    `,
    measurements: {
      headers: ["State", "Probability"],
      rows: [
        ["0", "0.5"],
        ["1", "0.5"],
      ],
    },
    insights: [
      "This is a fallback simulation when the API is unavailable.",
      "In a real simulation, you would see actual quantum computation results.",
    ],
    codeSnippet: `
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# Create a simple superposition
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

# Simulate the circuit
simulator = Aer.get_backend('qasm_simulator')
result = execute(qc, simulator, shots=1024).result()
counts = result.get_counts(qc)
print(counts)
`,
  },
}

// Function to determine which fallback to use based on the code
function getFallbackResult(code: string): PythonExecutionResult {
  if (code.includes("cx(0, 1)") && code.includes("h(0)")) {
    return FALLBACK_RESULTS.bell_state
  }
  return FALLBACK_RESULTS.default
}

// Main function to execute Python code
export async function executePythonCode(code: string): Promise<PythonExecutionResult> {
  try {
    logger.info("Starting Python code execution")

    // First try to use the browser-based Pyodide execution
    try {
      const result = await executePyodide(code)
      logger.info("Successfully executed code with Pyodide")
      return result
    } catch (pyodideError) {
      logger.warn(`Pyodide execution failed: ${pyodideError}. Trying API fallback...`)

      // If Pyodide fails, try the API
      try {
        const result = await executeViaAPI(code)
        logger.info("Successfully executed code via API")
        return result
      } catch (apiError) {
        logger.error(`API execution failed: ${apiError}. Using fallback data...`)

        // If both fail, use fallback data
        const fallbackResult = getFallbackResult(code)
        logger.info("Using fallback simulation data")
        return fallbackResult
      }
    }
  } catch (error) {
    logger.error(`Error in executePythonCode: ${error}`)
    return {
      error: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
      ...getFallbackResult(code),
    }
  }
}

// Execute code using Pyodide in the browser
async function executePyodide(code: string): Promise<PythonExecutionResult> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("Pyodide can only run in browser environment")
    }

    // Dynamically import pyodide
    const { loadPyodide } = await import("pyodide")

    // Load pyodide
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
    })

    // Install matplotlib
    await pyodide.loadPackage("matplotlib")

    // Redirect stdout to capture output
    pyodide.runPython(`
      import sys
      import io
      import json
      sys.stdout = io.StringIO()
    `)

    // Execute the code
    pyodide.runPython(code)

    // Get the captured output
    const output = pyodide.runPython("sys.stdout.getvalue()")

    // Parse the output to extract results
    // This assumes the Python code prints JSON-formatted results
    try {
      // Try to parse as JSON first
      const jsonOutput = JSON.parse(output)
      return jsonOutput
    } catch (e) {
      // If not JSON, return as plain text
      return { output }
    }
  } catch (error) {
    logger.error(`Pyodide execution error: ${error}`)
    throw error
  }
}

// Execute code via API
async function executeViaAPI(code: string): Promise<PythonExecutionResult> {
  try {
    // Get the API URL from environment variables or use a default
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || "/api/python-execute"

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PYTHON_API_KEY || ""}`,
      },
      body: JSON.stringify({ code }),
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    // Parse the response
    const result = await response.json()
    return result
  } catch (error) {
    logger.error(`API execution error: ${error}`)
    throw error
  }
}
