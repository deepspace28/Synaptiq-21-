import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { executePythonCode } from "@/lib/python-executor"
import { generateQiskitCode } from "@/lib/qiskit-generator"

// Define fallback results for when everything fails
const FALLBACK_SIMULATION_RESULT = {
  title: "Quantum Simulation (Fallback)",
  description: "This is a fallback simulation result when the API is unavailable.",
  circuit: `
    q0: ───H───
    q1: ───X───
  `,
  measurements: {
    headers: ["State", "Probability"],
    rows: [
      ["00", "0.0"],
      ["01", "0.5"],
      ["10", "0.5"],
      ["11", "0.0"],
    ],
  },
  insights: [
    "This is a fallback simulation when the API is unavailable.",
    "In a real simulation, you would see actual quantum computation results.",
  ],
  codeSnippet: `
# This is a fallback code snippet
from qiskit import QuantumCircuit, Aer, execute
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.x(1)
qc.measure([0, 1], [0, 1])
  `,
}

export async function POST(request: Request) {
  try {
    // Add CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers })
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing required parameter: prompt" }, { status: 400, headers })
    }

    logger.info(`Received simulation request: ${prompt}`)

    try {
      // Generate Qiskit code based on the prompt
      const qiskitCode = generateQiskitCode(prompt)
      logger.info("Generated Qiskit code")

      // Execute the Qiskit code
      const result = await executePythonCode(qiskitCode)
      logger.info("Executed Qiskit code successfully")

      // Validate the result
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response from Python execution")
      }

      // Return the result
      return NextResponse.json(result, { headers })
    } catch (error) {
      logger.error(`Error in quantum simulation: ${error instanceof Error ? error.message : String(error)}`)

      // Return a fallback result with error information
      return NextResponse.json(
        {
          ...FALLBACK_SIMULATION_RESULT,
          error: `Simulation error: ${error instanceof Error ? error.message : String(error)}`,
          title: "Simulation (Fallback)",
          description: "There was an error running the quantum simulation. Showing fallback data.",
          explanation: `Error details: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 200, headers }, // Return 200 with fallback data instead of error
      )
    }
  } catch (error) {
    logger.error(`Error in simulation API: ${error instanceof Error ? error.message : String(error)}`)

    // Return a fallback result with error information
    return NextResponse.json(
      {
        ...FALLBACK_SIMULATION_RESULT,
        error: `API error: ${error instanceof Error ? error.message : String(error)}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 200 }, // Return 200 with fallback data instead of error
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
