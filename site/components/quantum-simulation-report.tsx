"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"

interface QuantumSimulationReportProps {
  simulationData: {
    prompt: string
    rawContent?: string
    metadata?: {
      id: string
      backend: string
      timestamp: string
    }
  }
}

export function QuantumSimulationReport({ simulationData }: QuantumSimulationReportProps) {
  const [copied, setCopied] = useState(false)
  const [reportData, setReportData] = useState<{
    title: string
    description: string
    mathematicalFormalism: string[]
    circuitDiagram: string
    visualizations: {
      type: string
      data: any
      description: string
    }[]
    measurementData: {
      headers: string[]
      rows: any[][]
    } | null
    codeSnippet: string
    insights: string
  } | null>(null)

  useEffect(() => {
    if (simulationData.rawContent) {
      // Parse the simulation content and generate the report
      const parsedReport = parseSimulationContent(simulationData.prompt, simulationData.rawContent)
      setReportData(parsedReport)
    }
  }, [simulationData])

  const parseSimulationContent = (prompt: string, content: string) => {
    // Default report structure
    const report = {
      title: "Quantum Simulation Report",
      description: "Analysis of quantum simulation results",
      mathematicalFormalism: [] as string[],
      circuitDiagram: "",
      visualizations: [] as { type: string; data: any; description: string }[],
      measurementData: null as { headers: string[]; rows: any[][] } | null,
      codeSnippet: "",
      insights: "",
    }

    // Extract title from prompt
    if (prompt.toLowerCase().includes("schrödinger") || prompt.toLowerCase().includes("schrodinger")) {
      report.title = "Schrödinger's Cat Quantum Simulation"
      report.description =
        "Analysis of quantum superposition and measurement in the context of Schrödinger's cat thought experiment"
    } else if (prompt.toLowerCase().includes("entangle")) {
      report.title = "Quantum Entanglement Simulation"
      report.description = "Analysis of quantum entanglement between multiple qubits"
    } else if (prompt.toLowerCase().includes("teleport")) {
      report.title = "Quantum Teleportation Simulation"
      report.description = "Analysis of quantum teleportation protocol"
    } else {
      // Generic title based on prompt
      report.title = `Quantum Simulation: ${prompt.split(" ").slice(0, 5).join(" ")}...`
    }

    // Extract mathematical formalism (LaTeX equations)
    const equationMatches = content.match(/\$\$(.*?)\$\$/gs)
    if (equationMatches) {
      report.mathematicalFormalism = equationMatches.map((eq) => eq.replace(/\$\$/g, "").trim())
    }

    // Extract circuit description
    const circuitMatch = content.match(/Circuit Description:([\s\S]*?)(?=\n\n|$)/i)
    if (circuitMatch) {
      report.circuitDiagram = circuitMatch[1].trim()
    } else {
      // Generate a basic circuit diagram based on the prompt
      if (prompt.toLowerCase().includes("entangle")) {
        report.circuitDiagram = generateEntanglementCircuit()
      } else if (prompt.toLowerCase().includes("hadamard")) {
        report.circuitDiagram = generateHadamardCircuit()
      } else if (prompt.toLowerCase().includes("teleport")) {
        report.circuitDiagram = generateTeleportationCircuit()
      } else {
        report.circuitDiagram = generateBasicCircuit()
      }
    }

    // Extract insights
    const insightMatch = content.match(/Insight:([\s\S]*?)(?=\n\n|$)/i)
    if (insightMatch) {
      report.insights = insightMatch[1].trim()
    } else {
      // Extract the last substantial paragraph as insight
      const paragraphs = content.split(/\n\s*\n/)
      if (paragraphs.length > 1) {
        for (let i = paragraphs.length - 1; i >= 0; i--) {
          const para = paragraphs[i].trim()
          if (para && !para.startsWith("```") && !para.includes("$$")) {
            report.insights = para
            break
          }
        }
      }
    }

    // Generate code snippet based on the simulation type
    report.codeSnippet = generateCodeSnippet(prompt)

    // Extract or generate visualizations
    if (prompt.toLowerCase().includes("entangle")) {
      report.visualizations.push({
        type: "entanglement",
        data: {
          labels: ["00", "01", "10", "11"],
          values: [0.5, 0, 0, 0.5],
        },
        description: "Measurement probabilities showing entanglement correlation",
      })
    } else if (prompt.toLowerCase().includes("hadamard") || prompt.toLowerCase().includes("superposition")) {
      report.visualizations.push({
        type: "superposition",
        data: {
          labels: ["0", "1"],
          values: [0.5, 0.5],
        },
        description: "Equal superposition state measurement probabilities",
      })
    }

    // Extract measurement data if available
    const tableMatch = content.match(/\|[\s\S]*?\|[\s\S]*?\|/)
    if (tableMatch) {
      try {
        const tableLines = tableMatch[0].split("\n").filter((line) => line.trim().startsWith("|"))

        if (tableLines.length >= 3) {
          const headers = tableLines[0]
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h)

          const dataRows = tableLines.slice(2).map((line) =>
            line
              .split("|")
              .map((cell) => cell.trim())
              .filter((cell) => cell),
          )

          report.measurementData = {
            headers,
            rows: dataRows,
          }
        }
      } catch (e) {
        console.error("Error parsing table:", e)
      }
    }

    return report
  }

  // Function to generate ASCII circuit diagrams
  const generateBasicCircuit = () => {
    return `
q_0: ─────────────────
                      
q_1: ─────────────────
    `
  }

  const generateHadamardCircuit = () => {
    return `
q_0: ──────[H]──────────
                        
q_1: ──────────────────
    `
  }

  const generateEntanglementCircuit = () => {
    return `
q_0: ──────[H]─────●─────
                   │     
q_1: ─────────────X─────
    `
  }

  const generateTeleportationCircuit = () => {
    return `
q_0: ──────[H]─────●───────[H]───M────────────
                   │                          
q_1: ─────────────X───────●────M──────────────
                          │                   
q_2: ────────────────────X───────[X]^m1─[Z]^m0
    `
  }

  // Function to generate code snippets
  const generateCodeSnippet = (prompt: string) => {
    if (prompt.toLowerCase().includes("entangle")) {
      return `
import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit with 2 qubits
circuit = QuantumCircuit(2, 2)

# Apply Hadamard to first qubit
circuit.h(0)

# Apply CNOT to entangle qubits
circuit.cx(0, 1)

# Measure both qubits
circuit.measure([0, 1], [0, 1])

# Run the simulation
simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, simulator, shots=1024)
result = job.result()
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)
`
    } else if (prompt.toLowerCase().includes("hadamard") || prompt.toLowerCase().includes("superposition")) {
      return `
import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram, plot_bloch_multivector

# Create a quantum circuit with 1 qubit
circuit = QuantumCircuit(1, 1)

# Apply Hadamard to create superposition
circuit.h(0)

# Get the statevector
simulator = Aer.get_backend('statevector_simulator')
job = execute(circuit, simulator)
state = job.result().get_statevector()

# Visualize on Bloch sphere
plot_bloch_multivector(state)

# Measure the qubit
circuit.measure(0, 0)

# Run the measurement simulation
qasm_simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, qasm_simulator, shots=1024)
result = job.result()
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)
`
    } else if (prompt.toLowerCase().includes("teleport")) {
      return `
import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit with 3 qubits
circuit = QuantumCircuit(3, 2)

# Prepare the state to teleport (qubit 0)
circuit.x(0)  # Let's teleport |1⟩
# circuit.h(0)  # Uncomment to teleport |+⟩

# Create entanglement between qubits 1 and 2
circuit.h(1)
circuit.cx(1, 2)

# Begin teleportation protocol
circuit.cx(0, 1)
circuit.h(0)

# Measure qubits 0 and 1
circuit.measure([0, 1], [0, 1])

# Apply corrections on qubit 2 based on measurements
circuit.cx(1, 2).c_if(1, 1)  # Apply X if qubit 1 is 1
circuit.cz(0, 2).c_if(0, 1)  # Apply Z if qubit 0 is 1

# Run the simulation
simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, simulator, shots=1024)
result = job.result()
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)
`
    } else {
      return `
import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit
qubits = 2
circuit = QuantumCircuit(qubits, qubits)

# Add gates based on your experiment
# circuit.h(0)  # Hadamard on qubit 0
# circuit.cx(0, 1)  # CNOT with control qubit 0, target qubit 1

# Measure all qubits
circuit.measure_all()

# Run the simulation
simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, simulator, shots=1024)
result = job.result()
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)
`
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadReport = () => {
    if (!reportData) return

    // Create markdown content
    let markdown = `# ${reportData.title}\n\n`
    markdown += `${reportData.description}\n\n`

    markdown += `## Mathematical Formalism\n\n`
    reportData.mathematicalFormalism.forEach((eq) => {
      markdown += `$$${eq}$$\n\n`
    })

    markdown += `## Quantum Circuit\n\n`
    markdown += "```\n" + reportData.circuitDiagram + "\n```\n\n"

    markdown += `## Code Implementation\n\n`
    markdown += "```python\n" + reportData.codeSnippet + "\n```\n\n"

    if (reportData.measurementData) {
      markdown += `## Measurement Data\n\n`

      // Create table header
      markdown += "| " + reportData.measurementData.headers.join(" | ") + " |\n"
      markdown += "| " + reportData.measurementData.headers.map(() => "---").join(" | ") + " |\n"

      // Create table rows
      reportData.measurementData.rows.forEach((row) => {
        markdown += "| " + row.join(" | ") + " |\n"
      })

      markdown += "\n"
    }

    markdown += `## Insights\n\n${reportData.insights}\n`

    // Create a blob and download
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportData.title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!reportData) {
    return <div>Loading report...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{reportData.title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(simulationData.rawContent || "")}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-2">Copy Raw</span>
          </Button>
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="h-4 w-4" />
            <span className="ml-2">Download Report</span>
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <CardContent className="p-6 space-y-8">
          {/* Experiment Overview */}
          <div className="mb-8">
            <p className="text-lg mb-4">{reportData.description}</p>
            <p className="text-sm">{simulationData.prompt}</p>
            {simulationData.metadata && (
              <div className="mt-4 text-xs grid grid-cols-3 gap-2 text-gray-500">
                <div>
                  <strong>Simulation ID:</strong> {simulationData.metadata.id}
                </div>
                <div>
                  <strong>Backend:</strong> {simulationData.metadata.backend}
                </div>
                <div>
                  <strong>Timestamp:</strong> {simulationData.metadata.timestamp}
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Formalism */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Mathematical Formalism</h3>
            <div className="space-y-6">
              {reportData.mathematicalFormalism.length > 0 ? (
                reportData.mathematicalFormalism.map((eq, idx) => (
                  <div key={idx} className="py-4">
                    <div className="text-lg font-serif text-center">$${eq}$$</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No mathematical formalism available for this simulation.</p>
              )}
            </div>
          </div>

          {/* Quantum Circuit */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Quantum Circuit</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <pre className="font-mono whitespace-pre">{reportData.circuitDiagram}</pre>
            </div>
          </div>

          {/* Visualizations - Only show if there are any */}
          {reportData.visualizations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Visualizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.visualizations.map((viz, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <h4 className="text-sm font-medium mb-2">{viz.description}</h4>
                    <div className="h-40 flex items-center justify-center">
                      {/* Simple bar chart visualization */}
                      <div className="flex h-32 items-end space-x-2">
                        {viz.data.labels.map((label: string, i: number) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className="w-8 bg-gray-600 dark:bg-gray-400"
                              style={{ height: `${viz.data.values[i] * 100}%` }}
                            ></div>
                            <span className="text-xs mt-1">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Measurement Data */}
          {reportData.measurementData && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Measurement Data</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      {reportData.measurementData.headers.map((header, idx) => (
                        <th key={idx} className="text-left p-2 border-b border-gray-200 dark:border-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.measurementData.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="p-2 border-b border-gray-200 dark:border-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Insights</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <p className="whitespace-pre-wrap">{reportData.insights}</p>
            </div>
          </div>

          {/* Code Implementation */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Code Implementation</h3>
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(reportData.codeSnippet)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">Copy Code</span>
              </Button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-x-auto">
              <pre className="font-mono">{reportData.codeSnippet}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
