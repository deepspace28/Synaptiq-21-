import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { executeQuantumSimulation } from "@/lib/engines/quantum_executor"
import { detectSimulationType } from "@/lib/engines/simulationRouter"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, parameters = {} } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing required parameter: prompt" }, { status: 400 })
    }

    logger.info(`Received dynamic simulation request: ${prompt}`)

    // Detect the type of simulation
    const simulationType = detectSimulationType(prompt)
    logger.info(`Detected simulation type: ${simulationType}`)

    // Handle different simulation types
    if (simulationType === "quantum") {
      try {
        // Use the Python Qiskit executor for quantum simulations
        const result = await executeQuantumSimulation(prompt, parameters)

        // Convert the result to the expected format
        return NextResponse.json({
          title: result.summary.split("with")[0].trim() || "Quantum Simulation",
          equations: result.equations || [],
          chartType: "bar",
          formula: null,
          range: { min: 0, max: result.chart?.labels.length || 10, steps: result.chart?.labels.length || 10 },
          dataset: result.chart?.labels.map((label, i) => ({
            x: i,
            y: result.chart?.values[i] || 0,
            label: label,
          })),
          parameters: [
            {
              name: "qubits",
              label: "Number of Qubits",
              default: parameters.qubits || 2,
              min: 1,
              max: 5,
              unit: "",
            },
            {
              name: "shots",
              label: "Number of Shots",
              default: parameters.shots || 1024,
              min: 100,
              max: 10000,
              unit: "",
            },
          ],
          explanation: result.insight || "Quantum simulation results.",
        })
      } catch (error) {
        logger.error(`Error in quantum simulation: ${error instanceof Error ? error.message : String(error)}`)

        // Fallback to a simple quantum simulation
        return NextResponse.json({
          title: "Quantum Superposition",
          equations: ["\\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1})"],
          chartType: "bar",
          formula: null,
          dataset: [
            { x: 0, y: 50, label: "|0⟩" },
            { x: 1, y: 50, label: "|1⟩" },
          ],
          parameters: [
            {
              name: "qubits",
              label: "Number of Qubits",
              default: 1,
              min: 1,
              max: 5,
              unit: "",
            },
          ],
          explanation: "A quantum bit in superposition has equal probability of being measured as 0 or 1.",
        })
      }
    } else if (simulationType === "physics") {
      // Simple pendulum simulation
      return NextResponse.json({
        title: "Simple Pendulum",
        equations: ["\\theta(t) = \\theta_0 \\cos(\\omega t)", "\\omega = \\sqrt{\\frac{g}{L}}"],
        chartType: "line",
        formula: "amplitude * Math.sin(Math.sqrt(gravity / length) * x) * Math.exp(-damping * x / 10)",
        range: { min: 0, max: 20, steps: 200 },
        parameters: [
          {
            name: "length",
            label: "Pendulum Length",
            default: parameters.length || 1,
            min: 0.1,
            max: 5,
            unit: "m",
          },
          {
            name: "gravity",
            label: "Gravity",
            default: parameters.gravity || 9.8,
            min: 1,
            max: 20,
            unit: "m/s²",
          },
          {
            name: "amplitude",
            label: "Initial Angle",
            default: parameters.amplitude || 1,
            min: 0.1,
            max: 2,
            unit: "rad",
          },
          {
            name: "damping",
            label: "Damping",
            default: parameters.damping || 0.2,
            min: 0,
            max: 1,
            unit: "",
          },
        ],
        explanation:
          "The simple pendulum exhibits harmonic motion when the angle is small. The period depends on the length of the pendulum and the gravitational acceleration.",
      })
    } else if (simulationType === "math") {
      // Wave function simulation
      return NextResponse.json({
        title: "Wave Function",
        equations: ["f(x) = A \\sin(kx - \\omega t + \\phi)"],
        chartType: "line",
        formula: "amplitude * Math.sin(frequency * x - phase)",
        range: { min: -10, max: 10, steps: 200 },
        parameters: [
          {
            name: "amplitude",
            label: "Amplitude",
            default: parameters.amplitude || 1,
            min: 0.1,
            max: 2,
            unit: "",
          },
          {
            name: "frequency",
            label: "Frequency",
            default: parameters.frequency || 1,
            min: 0.1,
            max: 5,
            unit: "Hz",
          },
          {
            name: "phase",
            label: "Phase",
            default: parameters.phase || 0,
            min: 0,
            max: 6.28,
            unit: "rad",
          },
        ],
        explanation: "The wave function describes a traveling wave with adjustable amplitude, frequency, and phase.",
      })
    } else {
      // 3D visualization
      return NextResponse.json({
        title: "3D Function Visualization",
        equations: ["f(x,y) = \\sin(\\sqrt{x^2 + y^2})"],
        chartType: "3d",
        formula: null,
        parameters: [
          {
            name: "scale",
            label: "Scale",
            default: parameters.scale || 1,
            min: 0.1,
            max: 2,
            unit: "",
          },
          {
            name: "resolution",
            label: "Resolution",
            default: parameters.resolution || 50,
            min: 10,
            max: 100,
            unit: "points",
          },
        ],
        explanation:
          "This 3D visualization shows a function of two variables, creating a surface in three-dimensional space.",
      })
    }
  } catch (error) {
    logger.error(`Error in dynamic simulation: ${error instanceof Error ? error.message : String(error)}`)

    return NextResponse.json(
      {
        error: "Failed to process simulation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
