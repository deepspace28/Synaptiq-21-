"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { SimulationChat } from "../simulation-chat"

interface GHZStateSimulationProps {
  qubits?: number
  shots?: number
}

export function GHZStateSimulation({ qubits = 3, shots = 1024 }: GHZStateSimulationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<any>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Simulate loading time for the quantum simulation
    const timer = setTimeout(() => {
      const simulationResults = runGHZSimulation(qubits, shots)
      setResults(simulationResults)
      setIsLoading(false)
      setShowChat(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [qubits, shots])

  const runGHZSimulation = (numQubits: number, numShots: number) => {
    // Generate mock results that would come from a real quantum simulation
    const halfShots = Math.floor(numShots / 2)
    const zeroState = "0".repeat(numQubits)
    const oneState = "1".repeat(numQubits)

    // Add slight randomness to the counts to simulate quantum noise
    const zeroCount = halfShots + Math.floor(Math.random() * 20) - 10
    const oneCount = numShots - zeroCount

    return {
      counts: {
        [zeroState]: zeroCount,
        [oneState]: oneCount,
      },
      statevector: {
        // Simplified representation of the statevector
        amplitudes: [
          { state: zeroState, amplitude: 1 / Math.sqrt(2), probability: 0.5 },
          { state: oneState, amplitude: 1 / Math.sqrt(2), probability: 0.5 },
        ],
      },
      circuit: {
        qubits: numQubits,
        gates: [
          { type: "h", qubit: 0 },
          ...Array.from({ length: numQubits - 1 }, (_, i) => ({
            type: "cx",
            control: 0,
            target: i + 1,
          })),
        ],
      },
      parameters: {
        qubits: numQubits,
        shots: numShots,
      },
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GHZ State Simulation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-4 text-lg">Running quantum simulation...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GHZ State Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mathematical" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="mathematical">Mathematical Formalism</TabsTrigger>
              <TabsTrigger value="circuit">Quantum Circuit</TabsTrigger>
              <TabsTrigger value="results">Measurement Results</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="mathematical" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Initial State</h3>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                  $$|\psi_0\rangle = |{results ? `0`.repeat(results.parameters.qubits) : `000`}\rangle$$
                </div>

                <h3>After Hadamard Gate</h3>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                  $|\psi_1\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \otimes |{results ? `0`.repeat(results.parameters.qubits - 1) : `00`}\rangle = \frac{1}{\sqrt{2}}(|{results ? `0`.repeat(results.parameters.qubits) : `000`}\rangle + |1{results ? `0`.repeat(results.parameters.qubits - 1) : `00`}\rangle)$
                </div>

                <h3>After CNOT Gates</h3>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                  $$|\psi_{\text{final}}\rangle = \frac{1}{\sqrt{2}}(|{results ? `0`.repeat(results.parameters.qubits) : `000`}\rangle + |{results ? `1`.repeat(results.parameters.qubits) : `111`}\rangle)$$
                </div>

                <h3>Matrix Representations</h3>
                <p>Hadamard gate:</p>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                  $$H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$
                </div>

                <p>CNOT gate:</p>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                  $$CNOT = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{pmatrix}$$
                </div>
              </div>
            </TabsContent>

            <TabsContent value="circuit" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Quantum Circuit Diagram</h3>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md font-mono whitespace-pre">
                  {results && renderCircuitDiagram(results.circuit)}
                </div>

                <h3>Circuit Description</h3>
                <p>
                  This circuit creates a GHZ state with {results?.parameters.qubits || 3} qubits by:
                </p>
                <ol>
                  <li>Applying a Hadamard gate to the first qubit, creating a superposition</li>
                  <li>Applying CNOT gates from the first qubit to all other qubits, creating entanglement</li>
                </ol>
                <p>
                  The resulting state is a maximally entangled state where all qubits are either all in state |0⟩ or all in state |1⟩.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Measurement Outcomes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Measurement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Count</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {results && Object.entries(results.counts).map(([state, count]: [string, any]) => (
                        <tr key={state}>
                          <td className="px-6 py-4 whitespace-nowrap">{state}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{count}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{(Number(count) / results.parameters.shots).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3>Visualization</h3>
                <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  {results && renderHistogram(results.counts, results.parameters.shots)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Quantum Properties Demonstrated</h3>
                <p>
                  The GHZ state demonstrates several key quantum phenomena:
                </p>
                <ul>
                  <li><strong>Multipartite Entanglement:</strong> The {results?.parameters.qubits || 3} qubits are entangled in a way that cannot be decomposed into simpler entangled states.</li>
                  <li><strong>Quantum Non-locality:</strong> The GHZ state violates local realism in a stronger way than Bell states.</li>
                  <li><strong>Perfect Correlation:</strong> Measuring any qubit immediately determines the state of all other qubits.</li>
                </ul>

                <h3>Statistical Analysis</h3>
                <p>
                  The measurement results show approximately equal probabilities for the states |{results ? "0".repeat(results.parameters.qubits) : "000"}⟩ and |{results ? "1".repeat(results.parameters.qubits) : "111"}⟩, as predicted by quantum theory. 
                  The absence of other measurement outcomes confirms the creation of the GHZ state.
                </p>

                <h3>Applications</h3>
                <p>
                  GHZ states are valuable resources for:
                </p>
                <ul>
                  <li>Quantum error correction</li>
                  <li>Quantum secret sharing</li>
                  <li>Testing quantum mechanics against local hidden variable theories</li>
                  <li>Quantum metrology with enhanced precision</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showChat && results && (
        <SimulationChat
          simulationContext={{
            type: "GHZ State",
            parameters: results.parameters,
            results: {
              counts: results.counts,
              statevector: results.statevector
            }
          }}
        />
      )}
    </>
  )
}

// Helper function to render ASCII circuit diagram
function renderCircuitDiagram(circuit: { qubits: number; gates: any[] }) {
  const numQubits = circuit.qubits
  let diagram = ""

  // Create the initial lines for each qubit
  for (let i = 0; i < numQubits; i++) {
    let line = `q_${i}: `

    // Add Hadamard gate to the first qubit
    if (i === 0) {
      line += "──[H]──"
    } else {
      line += "───────"
    }

    // Add CNOT connections
    for (let j = 1; j < numQubits; j++) {
      if (i === 0) {
        line += "●───"
      } else if (i === j) {
        line += "X───"
      } else {
        line += "┼───"
      }
    }

    diagram += line + "\n"

    // Add vertical connections between qubits
    if (i < numQubits - 1) {
      let connectors = "      "
      for (let j = 1; j < numQubits; j++) {
        if (j === i + 1) {
          connectors += "│   "
        } else {
          connectors += "    "
        }
      }
      diagram += connectors + "\n"
    }
  }

  return diagram
}

// Helper function to render a simple ASCII histogram
function renderHistogram(counts: Record<string, number>, shots: number) {
  const maxBarLength = 40
  let histogram = ""

  Object.entries(counts).forEach(([state, count]) => {
    const percentage = (count as number) / shots
    const barLength = Math.round(percentage * maxBarLength)
    const bar = "█".repeat(barLength)

    histogram += `${state}: ${bar} ${count} (${(percentage * 100).toFixed(1)}%)\n`
  })

  return <pre className="font-mono">{histogram}</pre>
}
