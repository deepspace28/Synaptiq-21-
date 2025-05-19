"use client"

import { useState } from "react"
import { TutorialStep } from "@/components/tutorial/tutorial-step"
import { QuantumCircuitBuilder } from "@/components/tutorial/quantum-circuit-builder"
import { QuantumStateVisualization } from "@/components/tutorial/quantum-state-visualization"
import { MathTheoryPanel } from "@/components/math-theory-panel"
import { BrandedHistogram } from "@/components/branded-histogram"
import { DynamicInsights } from "@/components/dynamic-insights"
import { CustomizationPanel } from "@/components/customization-panel"
import { NotebookExport } from "@/components/notebook-export"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen } from "lucide-react"

// Gate type from the circuit builder
type GateType = "H" | "X" | "Y" | "Z" | "CNOT" | "SWAP" | "T" | "S"

interface Gate {
  id: string
  type: GateType
  qubit: number
  control?: number
  position: number
}

export default function QuantumComputingTutorial() {
  const [currentStep, setCurrentStep] = useState(1)
  const [circuit, setCircuit] = useState<Gate[]>([])
  const [stateVector, setStateVector] = useState<any[]>([
    { label: "00", amplitude: { real: 1, imag: 0 }, probability: 1 },
    { label: "01", amplitude: { real: 0, imag: 0 }, probability: 0 },
    { label: "10", amplitude: { real: 0, imag: 0 }, probability: 0 },
    { label: "11", amplitude: { real: 0, imag: 0 }, probability: 0 },
  ])
  const [simulationResults, setSimulationResults] = useState<any>({
    counts: { "00": 500, "01": 0, "10": 0, "11": 0 },
    totalShots: 500,
  })
  const [customParams, setCustomParams] = useState({
    shots: 500,
    noise: 0,
    visualization: "histogram",
    colorScheme: "#00BFFF",
  })

  // Total number of steps in the tutorial
  const totalSteps = 5

  // Handle circuit changes
  const handleCircuitChange = (gates: Gate[]) => {
    setCircuit(gates)
  }

  // Simulate running the quantum circuit
  const runCircuit = (gates: Gate[]) => {
    // This is a simplified simulation - in a real app, this would call a quantum simulator
    let newStateVector = [
      { label: "00", amplitude: { real: 1, imag: 0 }, probability: 1 },
      { label: "01", amplitude: { real: 0, imag: 0 }, probability: 0 },
      { label: "10", amplitude: { real: 0, imag: 0 }, probability: 0 },
      { label: "11", amplitude: { real: 0, imag: 0 }, probability: 0 },
    ]

    // Apply gates in sequence (simplified)
    gates.forEach((gate) => {
      switch (gate.type) {
        case "H":
          // Hadamard gate on qubit 0
          if (gate.qubit === 0) {
            newStateVector = [
              {
                label: "00",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
              {
                label: "01",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "10",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
              {
                label: "11",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
            ]
          }
          // Hadamard gate on qubit 1
          else if (gate.qubit === 1) {
            newStateVector = [
              {
                label: "00",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
              {
                label: "01",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
              {
                label: "10",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "11",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
            ]
          }
          break
        case "X":
          // X gate (NOT) on qubit 0
          if (gate.qubit === 0) {
            newStateVector = [
              {
                label: "00",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "01",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "10",
                amplitude: { real: 1, imag: 0 },
                probability: 1,
              },
              {
                label: "11",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
            ]
          }
          // X gate on qubit 1
          else if (gate.qubit === 1) {
            newStateVector = [
              {
                label: "00",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "01",
                amplitude: { real: 1, imag: 0 },
                probability: 1,
              },
              {
                label: "10",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "11",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
            ]
          }
          break
        case "CNOT":
          // CNOT gate with control on qubit 0, target on qubit 1
          if (gate.control === 0 && gate.qubit === 1) {
            newStateVector = [
              {
                label: "00",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
              {
                label: "01",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "10",
                amplitude: { real: 0, imag: 0 },
                probability: 0,
              },
              {
                label: "11",
                amplitude: { real: 1 / Math.sqrt(2), imag: 0 },
                probability: 0.5,
              },
            ]
          }
          break
        // Add more gates as needed
      }
    })

    setStateVector(newStateVector)

    // Generate measurement results based on the state vector
    const counts: Record<string, number> = {}
    const shots = customParams.shots

    newStateVector.forEach((state) => {
      const expectedCount = Math.round(state.probability * shots)
      // Add some noise if enabled
      const noise = customParams.noise > 0 ? Math.random() * customParams.noise * shots : 0
      counts[state.label] = Math.max(0, Math.round(expectedCount + noise))
    })

    // Normalize counts to match total shots
    const totalCounts = Object.values(counts).reduce((sum, count) => sum + count, 0)
    if (totalCounts > 0) {
      Object.keys(counts).forEach((key) => {
        counts[key] = Math.round((counts[key] / totalCounts) * shots)
      })
    }

    setSimulationResults({
      counts,
      totalShots: shots,
    })
  }

  // Handle parameter changes
  const handleParameterChange = (id: string, value: any) => {
    setCustomParams((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Get histogram data from simulation results
  const getHistogramData = () => {
    const { counts } = simulationResults
    return {
      labels: Object.keys(counts),
      values: Object.values(counts).map((count) => count / simulationResults.totalShots),
    }
  }

  // Tutorial content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Welcome to the Quantum Computing Tutorial! In this interactive guide, you'll learn the basics of quantum
              computing and how to build quantum circuits.
            </p>

            <p className="text-gray-300">
              Quantum computing is a revolutionary approach to computation that leverages the principles of quantum
              mechanics to perform calculations. Unlike classical bits that can be either 0 or 1, quantum bits (qubits)
              can exist in a superposition of both states simultaneously.
            </p>

            <MathTheoryPanel
              title="Quantum Computing Fundamentals"
              description="The mathematical foundation of quantum computing"
              equations={[
                {
                  id: "qubit",
                  label: "Qubit State",
                  equation: "|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle",
                  explanation:
                    "A qubit can exist in a superposition of states |0⟩ and |1⟩, where α and β are complex amplitudes with |α|² + |β|² = 1.",
                },
                {
                  id: "measurement",
                  label: "Measurement",
                  equation: "P(|0\\rangle) = |\\alpha|^2, \\quad P(|1\\rangle) = |\\beta|^2",
                  explanation:
                    "When measured, a qubit collapses to either |0⟩ or |1⟩ with probabilities determined by the squared magnitudes of the amplitudes.",
                },
                {
                  id: "hadamard",
                  label: "Hadamard Gate",
                  equation: "H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}",
                  explanation:
                    "The Hadamard gate creates a superposition, transforming |0⟩ to (|0⟩ + |1⟩)/√2 and |1⟩ to (|0⟩ - |1⟩)/√2.",
                },
              ]}
            />

            <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-md p-4">
              <h3 className="text-lg font-medium text-white mb-2">What You'll Learn</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>The basics of quantum computing and qubits</li>
                <li>How to build and visualize quantum circuits</li>
                <li>Understanding quantum gates and their effects</li>
                <li>Creating entanglement and superposition</li>
                <li>Analyzing quantum simulation results</li>
              </ul>
            </div>

            <p className="text-gray-300">
              Click "Next" to begin your quantum journey! In the next step, you'll learn about quantum gates and start
              building your first circuit.
            </p>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Quantum gates are the building blocks of quantum circuits. They manipulate qubits in various ways, similar
              to how classical logic gates manipulate classical bits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-800 bg-gray-900">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Common Quantum Gates</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Hadamard (H) Gate</h4>
                      <p className="text-sm text-gray-300">
                        Creates superposition by transforming |0⟩ to (|0⟩ + |1⟩)/√2 and |1⟩ to (|0⟩ - |1⟩)/√2.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Pauli-X (X) Gate</h4>
                      <p className="text-sm text-gray-300">
                        The quantum equivalent of the NOT gate, flipping |0⟩ to |1⟩ and vice versa.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">CNOT Gate</h4>
                      <p className="text-sm text-gray-300">
                        A two-qubit gate that flips the target qubit if the control qubit is |1⟩, creating entanglement.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Phase Gates (S, T)</h4>
                      <p className="text-sm text-gray-300">
                        Introduce phase shifts without changing probabilities, essential for quantum algorithms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Try It Yourself</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Build a simple circuit with a Hadamard gate on qubit 0. This will create a superposition state.
                </p>

                <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                    <li>Click on the "Gates" tab</li>
                    <li>Select the "H" gate</li>
                    <li>Make sure "Target Qubit" is set to 0</li>
                    <li>Click "Add Gate"</li>
                    <li>Switch back to the "Circuit" tab</li>
                    <li>Click "Run Circuit" to see the results</li>
                  </ol>
                </div>
              </div>
            </div>

            <QuantumCircuitBuilder
              numQubits={2}
              maxGates={5}
              onCircuitChange={handleCircuitChange}
              onRunCircuit={runCircuit}
            />

            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Quantum State</h3>
              <QuantumStateVisualization stateVector={stateVector} />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Quantum entanglement is a phenomenon where qubits become correlated in such a way that the quantum state
              of each qubit cannot be described independently. This is one of the most powerful features of quantum
              computing.
            </p>

            <MathTheoryPanel
              title="Quantum Entanglement"
              description="The mathematical description of entangled quantum states"
              equations={[
                {
                  id: "bell",
                  label: "Bell State",
                  equation: "|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)",
                  explanation:
                    "A maximally entangled two-qubit state where measuring one qubit instantly determines the state of the other, regardless of distance.",
                },
                {
                  id: "circuit",
                  label: "Bell Circuit",
                  equation: "|\\Phi^+\\rangle = CNOT(H \\otimes I)|00\\rangle",
                  explanation:
                    "The Bell state can be created by applying a Hadamard gate to the first qubit, followed by a CNOT gate with the first qubit as control and the second as target.",
                },
              ]}
            />

            <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-md p-4">
              <h3 className="text-lg font-medium text-white mb-2">Creating a Bell State</h3>
              <p className="text-gray-300 mb-4">
                Let's create a Bell state, one of the simplest examples of quantum entanglement. Follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Add a Hadamard (H) gate to qubit 0</li>
                <li>Add a CNOT gate with control qubit 0 and target qubit 1</li>
                <li>Run the circuit to see the entangled state</li>
              </ol>
            </div>

            <QuantumCircuitBuilder
              numQubits={2}
              maxGates={5}
              onCircuitChange={handleCircuitChange}
              onRunCircuit={runCircuit}
            />

            <div className="mt-6">
              <Tabs defaultValue="state">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="state">Quantum State</TabsTrigger>
                  <TabsTrigger value="histogram">Measurement Histogram</TabsTrigger>
                </TabsList>
                <TabsContent value="state" className="mt-4">
                  <QuantumStateVisualization stateVector={stateVector} />
                </TabsContent>
                <TabsContent value="histogram" className="mt-4">
                  <BrandedHistogram
                    title="Measurement Results"
                    description={`Distribution of ${simulationResults.totalShots} shots`}
                    data={getHistogramData()}
                    height={300}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6">
              <DynamicInsights
                data={{
                  title: "Bell State Analysis",
                  results: {
                    x: Object.keys(simulationResults.counts),
                    y: Object.values(simulationResults.counts).map(
                      (count: number) => count / simulationResults.totalShots,
                    ),
                  },
                }}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Now that you understand the basics of quantum circuits and entanglement, let's explore how to customize
              your quantum simulations and analyze the results in more detail.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Simulation Parameters</h3>
                <CustomizationPanel
                  parameters={[
                    {
                      id: "shots",
                      label: "Number of Shots",
                      type: "slider",
                      defaultValue: 500,
                      min: 100,
                      max: 1000,
                      step: 100,
                    },
                    {
                      id: "noise",
                      label: "Noise Level",
                      type: "slider",
                      defaultValue: 0,
                      min: 0,
                      max: 0.2,
                      step: 0.01,
                    },
                    {
                      id: "visualization",
                      label: "Visualization Type",
                      type: "select",
                      defaultValue: "histogram",
                      options: [
                        { label: "Histogram", value: "histogram" },
                        { label: "Pie Chart", value: "pie" },
                      ],
                    },
                    {
                      id: "colorScheme",
                      label: "Color Scheme",
                      type: "color",
                      defaultValue: "#00BFFF",
                    },
                  ]}
                  onParameterChange={handleParameterChange}
                />

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Experiment with Circuits</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Try building different circuits and observe how they affect the quantum state and measurement
                    results. Here are some ideas:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                    <li>Apply H gates to both qubits</li>
                    <li>Create a circuit with X and H gates</li>
                    <li>Try different control-target combinations with CNOT</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Circuit Builder</h3>
                <QuantumCircuitBuilder
                  numQubits={2}
                  maxGates={5}
                  onCircuitChange={handleCircuitChange}
                  onRunCircuit={runCircuit}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Simulation Results</h3>
              <BrandedHistogram
                title="Measurement Results"
                description={`Distribution of ${simulationResults.totalShots} shots with noise level ${customParams.noise}`}
                data={getHistogramData()}
                height={300}
              />
            </div>

            <div className="mt-6">
              <DynamicInsights
                data={{
                  title: "Quantum Circuit Analysis",
                  results: {
                    x: Object.keys(simulationResults.counts),
                    y: Object.values(simulationResults.counts).map(
                      (count: number) => count / simulationResults.totalShots,
                    ),
                  },
                }}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-gray-300">
              Congratulations on completing the Quantum Computing Tutorial! You've learned about quantum gates,
              entanglement, and how to build and analyze quantum circuits.
            </p>

            <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-md p-4">
              <h3 className="text-lg font-medium text-white mb-2">What You've Learned</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>The basics of quantum computing and qubits</li>
                <li>How to use quantum gates like H, X, and CNOT</li>
                <li>Creating quantum entanglement with Bell states</li>
                <li>Visualizing quantum states and measurement results</li>
                <li>Customizing quantum simulations with different parameters</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-800 bg-gray-900">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Next Steps</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Explore More Circuits</h4>
                      <p className="text-sm text-gray-300">
                        Try building more complex circuits with different gate combinations and analyze their behavior.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Learn Quantum Algorithms</h4>
                      <p className="text-sm text-gray-300">
                        Dive into quantum algorithms like Grover's search or Shor's factoring algorithm.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Quantum Programming</h4>
                      <p className="text-sm text-gray-300">
                        Explore quantum programming languages and frameworks like Qiskit, Cirq, or Q#.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Documentation</h4>
                      <p className="text-sm text-gray-300">
                        Explore our comprehensive documentation on quantum computing and simulations.
                      </p>
                      <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm">
                        View Documentation
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Tutorials</h4>
                      <p className="text-sm text-gray-300">
                        Check out more advanced tutorials on quantum algorithms and applications.
                      </p>
                      <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm">
                        Browse Tutorials
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Community</h4>
                      <p className="text-sm text-gray-300">
                        Join our community of quantum enthusiasts to share ideas and get help.
                      </p>
                      <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm">
                        Join Community
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Explore More Tutorials
              </Button>
              <NotebookExport
                title="Quantum Computing Tutorial"
                description="Interactive tutorial on quantum computing basics"
                simulationData={{
                  domain: "quantum",
                  title: "Quantum Computing Tutorial",
                  description: "Interactive tutorial on quantum computing basics",
                }}
                parameters={customParams}
                results={simulationResults}
                equations={[
                  "\\left|\\psi\\right\\rangle = \\alpha\\left|0\\right\\rangle + \\beta\\left|1\\right\\rangle",
                  "\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}}(\\left|00\\right\\rangle + \\left|11\\right\\rangle)",
                ]}
                insights={[
                  "Quantum superposition allows qubits to exist in multiple states simultaneously",
                  "Quantum entanglement creates correlations between qubits that have no classical analog",
                  "Quantum gates manipulate qubits in ways that enable powerful quantum algorithms",
                ]}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quantum Computing Tutorial</h1>
        <p className="text-gray-400">
          An interactive guide to understanding quantum computing concepts and building quantum circuits
        </p>
      </div>

      <TutorialStep
        title={
          currentStep === 1
            ? "Introduction to Quantum Computing"
            : currentStep === 2
              ? "Quantum Gates and Circuits"
              : currentStep === 3
                ? "Quantum Entanglement"
                : currentStep === 4
                  ? "Customizing Quantum Simulations"
                  : "Conclusion and Next Steps"
        }
        description={
          currentStep === 1
            ? "Learn the basics of quantum computing and qubits"
            : currentStep === 2
              ? "Understand quantum gates and how to build circuits"
              : currentStep === 3
                ? "Explore quantum entanglement and Bell states"
                : currentStep === 4
                  ? "Customize simulations and analyze results"
                  : "Recap what you've learned and explore next steps"
        }
        stepNumber={currentStep}
        totalSteps={totalSteps}
        onNext={currentStep < totalSteps ? () => setCurrentStep(currentStep + 1) : undefined}
        onPrevious={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
      >
        {renderStepContent()}
      </TutorialStep>
    </div>
  )
}
