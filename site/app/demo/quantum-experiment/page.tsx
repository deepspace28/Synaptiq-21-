"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { QuantumExperimentDisplay } from "@/components/quantum-experiment-display"

export default function QuantumExperimentPage() {
  const [experimentType, setExperimentType] = useState<"bell" | "ghz" | "teleportation" | "superposition">("bell")
  const [qubits, setQubits] = useState(2)
  const [shots, setShots] = useState(1024)
  const [entanglement, setEntanglement] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runExperiment = async () => {
    setIsRunning(true)
    try {
      // In a real implementation, this would call an API to run the simulation
      // For now, we'll just simulate a delay and return mock results
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock results based on experiment type
      let mockResults
      if (experimentType === "bell") {
        mockResults = {
          experimentTitle: "Bell State Preparation",
          simulationParameters: {
            qubits: 2,
            shots: shots,
            entanglement: true,
            backend: "Qiskit Aer QASM Simulator",
          },
          mathematicalFormalism: [
            "\\ket{\\psi_0} = |00\\rangle",
            "H \\otimes I |00\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle)",
            "CNOT \\frac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)",
          ],
          circuitDescription: `q_0: ──[H]──●──
             │
q_1: ────────X──`,
          measurementData: {
            labels: ["00", "11"],
            values: [Math.floor(shots / 2), Math.floor(shots / 2)],
          },
          insights: `This simulation demonstrates quantum entanglement through the creation of a Bell state.

The results show that measuring one qubit immediately determines the state of the other qubit,
even though each individual outcome is random. This is the quantum mechanical phenomenon that
Einstein famously referred to as "spooky action at a distance."

The equal distribution of outcomes between |00⟩ and |11⟩, with approximately 50% probability each,
confirms the creation of a maximally entangled state.

The absence of |01⟩ and |10⟩ measurement outcomes demonstrates the perfect correlation between the qubits,
which is a signature of entanglement.`,
          codeImplementation: `import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit with 2 qubits and 2 classical bits
circuit = QuantumCircuit(2, 2)

# Step 1: Apply Hadamard gate to the first qubit
circuit.h(0)

# Step 2: Apply CNOT with control qubit 0 and target qubit 1
circuit.cx(0, 1)

# Measure both qubits
circuit.measure([0, 1], [0, 1])

# Use the Qiskit Aer simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})
result = job.result()

# Get the counts of each measurement outcome
counts = result.get_counts(circuit)
print("Measurement counts:", counts)`,
        }
      } else if (experimentType === "ghz") {
        mockResults = {
          experimentTitle: "GHZ State Preparation",
          simulationParameters: {
            qubits: qubits,
            shots: shots,
            entanglement: true,
            backend: "Qiskit Aer QASM Simulator",
          },
          mathematicalFormalism: [
            `\\ket{\\psi_0} = |${"0".repeat(qubits)}\\rangle`,
            `H \\otimes I^{\\otimes ${qubits - 1}} |${"0".repeat(qubits)}\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |${"0".repeat(qubits - 1)}\\rangle = \\frac{1}{\\sqrt{2}}(|${"0".repeat(qubits)}\\rangle + |1${"0".repeat(qubits - 1)}\\rangle)`,
            `\\ket{\\psi_f} = \\frac{1}{\\sqrt{2}}(|${"0".repeat(qubits)}\\rangle + |${"1".repeat(qubits)}\\rangle)`,
          ],
          circuitDescription: generateGHZCircuit(qubits),
          measurementData: {
            labels: ["0".repeat(qubits), "1".repeat(qubits)],
            values: [Math.floor(shots / 2), Math.floor(shots / 2)],
          },
          insights: `This simulation demonstrates the creation of a GHZ state, a maximally entangled state of ${qubits} qubits.

The GHZ state is a generalization of the Bell state to multiple qubits, and it exhibits stronger forms of non-locality.

The results show that measuring any single qubit immediately determines the state of all other qubits.
This perfect correlation between all ${qubits} qubits demonstrates genuine multipartite entanglement.

The equal distribution of outcomes between |${"0".repeat(qubits)}⟩ and |${"1".repeat(qubits)}⟩, with approximately 50% probability each,
confirms the creation of a maximally entangled state.

The GHZ state is particularly interesting because it shows that quantum mechanics violates local realism even for perfect correlations,
not just statistical correlations as in Bell's theorem.`,
          codeImplementation: `import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit with ${qubits} qubits and ${qubits} classical bits
circuit = QuantumCircuit(${qubits}, ${qubits})

# Step 1: Apply Hadamard gate to the first qubit
circuit.h(0)

# Step 2: Apply CNOT gates with control qubit 0 and target qubits 1 through ${qubits - 1}
${Array.from({ length: qubits - 1 }, (_, i) => `circuit.cx(0, ${i + 1})`).join("\n")}

# Measure all qubits
circuit.measure_all()

# Use the Qiskit Aer simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})
result = job.result()

# Get the counts of each measurement outcome
counts = result.get_counts(circuit)
print("Measurement counts:", counts)`,
        }
      } else if (experimentType === "teleportation") {
        mockResults = {
          experimentTitle: "Quantum Teleportation Protocol",
          simulationParameters: {
            qubits: 3,
            shots: shots,
            entanglement: true,
            backend: "Qiskit Aer QASM Simulator",
          },
          mathematicalFormalism: [
            "\\ket{\\psi_s} = \\alpha|0\\rangle_s + \\beta|1\\rangle_s",
            "H|0\\rangle_a = \\frac{1}{\\sqrt{2}}(|0\\rangle_a + |1\\rangle_a)",
            "CNOT_{a,r}\\frac{1}{\\sqrt{2}}(|0\\rangle_a + |1\\rangle_a)|0\\rangle_r = \\frac{1}{\\sqrt{2}}(|0\\rangle_a|0\\rangle_r + |1\\rangle_a|1\\rangle_r)",
            "\\ket{\\Psi} = (\\alpha|0\\rangle_s + \\beta|1\\rangle_s) \\otimes \\frac{1}{\\sqrt{2}}(|0\\rangle_a|0\\rangle_r + |1\\rangle_a|1\\rangle_r)",
          ],
          circuitDescription: `                                                 ┌───┐┌─┐
q_0: ──────────────────■──────────────────────H─┤ M ├┤M├─────────────────────────
                       │                         └───┘└╥┘┌─┐
q_1: ──────────H──■────┼────────────────────────────────╫─┤M├─────────────────────
                  │    │                                 ║ └╥┘     ┌───┐     ┌───┐
q_2: ─────────────X────X────────────────────────────────╫──╫──────┤ X ├─────┤ Z ├
                                                        ║  ║      └─╥─┘     └─╥─┘
c: 3/═════════════════════════════════════════════════════════════════════════════
                                                        0  1        0        1`,
          measurementData: {
            labels: ["000", "001", "010", "011", "100", "101", "110", "111"],
            values: Array.from({ length: 8 }, () => Math.floor(shots / 8)),
          },
          insights: `This simulation demonstrates quantum teleportation, a protocol that transfers a quantum state from one qubit to another using entanglement and classical communication.

The protocol begins with a qubit in an arbitrary state |ψ⟩ = α|0⟩ + β|1⟩ that we wish to teleport.
We create an entangled Bell pair between the auxiliary and receiver qubits.

After performing a Bell measurement on the sender and auxiliary qubits, the receiver qubit's state depends on the measurement outcome.
By applying appropriate corrections (X and/or Z gates) based on the classical measurement results, the original state is reconstructed at the receiver.

This protocol demonstrates several key quantum phenomena:
1. Quantum entanglement as a resource for information transfer
2. The necessity of classical communication in quantum protocols
3. The no-cloning theorem (the original state is destroyed during measurement)

The equal distribution of measurement outcomes confirms that our quantum circuit is working correctly, as theory predicts equal probabilities for each Bell measurement result.`,
          codeImplementation: `import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Define the quantum teleportation circuit
def create_teleportation_circuit(initial_state=[1/np.sqrt(2), 1/np.sqrt(2)]):
    """
    Create a quantum teleportation circuit with the specified initial state.
    
    Args:
        initial_state (list): The state to teleport [alpha, beta]
    
    Returns:
        QuantumCircuit: The quantum teleportation circuit
    """
    # Create a circuit with 3 qubits and 3 classical bits
    qc = QuantumCircuit(3, 3)
    
    # Prepare the state to teleport
    qc.initialize(initial_state, 0)
    qc.barrier()
    
    # Create Bell pair between qubits 1 and 2
    qc.h(1)
    qc.cx(1, 2)
    qc.barrier()
    
    # Bell measurement between qubits 0 and 1
    qc.cx(0, 1)
    qc.h(0)
    qc.barrier()
    
    # Measure qubits 0 and 1
    qc.measure(0, 0)
    qc.measure(1, 1)
    
    # Apply corrections based on measurement outcomes
    qc.x(2).c_if(1, 1)  # Apply X if q1 is 1
    qc.z(2).c_if(0, 1)  # Apply Z if q0 is 1
    
    return qc

# Create the circuit with a specific state to teleport
teleport_circuit = create_teleportation_circuit([1/np.sqrt(2), 1/np.sqrt(2)])

# Execute the circuit
simulator = Aer.get_backend('qasm_simulator')
job = execute(teleport_circuit, simulator, shots=${shots})
result = job.result()
counts = result.get_counts(teleport_circuit)

print("Counts:", counts)`,
        }
      } else {
        // Superposition
        mockResults = {
          experimentTitle: "Quantum Superposition",
          simulationParameters: {
            qubits: qubits,
            shots: shots,
            entanglement: false,
            backend: "Qiskit Aer QASM Simulator",
          },
          mathematicalFormalism: [
            `\\ket{\\psi_0} = |${"0".repeat(qubits)}\\rangle`,
            `H \\otimes I^{\\otimes ${qubits - 1}} |${"0".repeat(qubits)}\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |${"0".repeat(qubits - 1)}\\rangle = \\frac{1}{\\sqrt{2}}(|${"0".repeat(qubits)}\\rangle + |1${"0".repeat(qubits - 1)}\\rangle)`,
          ],
          circuitDescription: generateSuperpositionCircuit(qubits),
          measurementData: {
            labels: ["0".repeat(qubits), "1" + "0".repeat(qubits - 1)],
            values: [Math.floor(shots / 2), Math.floor(shots / 2)],
          },
          insights: `This simulation demonstrates quantum superposition, where a quantum system exists in multiple states simultaneously until measured.

The Hadamard gate creates an equal superposition of states for the first qubit, giving each possible outcome approximately equal probability.
When we measure the system, it collapses to one of the possible states with probabilities determined by the quantum state's amplitude.

The measurement results show the expected statistical distribution, with approximately equal probabilities for |${"0".repeat(qubits)}⟩ and |1${"0".repeat(qubits - 1)}⟩,
confirming that the quantum circuit is functioning as designed.

Superposition is one of the fundamental principles of quantum mechanics that enables quantum computing to perform certain calculations more efficiently than classical computers.
It allows quantum algorithms to explore multiple computational paths simultaneously.`,
          codeImplementation: `import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# Create a quantum circuit with ${qubits} qubits and ${qubits} classical bits
circuit = QuantumCircuit(${qubits}, ${qubits})

# Apply Hadamard gate to the first qubit to create superposition
circuit.h(0)

# Measure all qubits
circuit.measure_all()

# Use the Qiskit Aer simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})
result = job.result()

# Get the counts of each measurement outcome
counts = result.get_counts(circuit)
print("Measurement counts:", counts)`,
        }
      }

      setResults(mockResults)
    } catch (error) {
      console.error("Error running experiment:", error)
    } finally {
      setIsRunning(false)
    }
  }

  // Helper function to generate GHZ circuit ASCII art
  function generateGHZCircuit(numQubits: number): string {
    let circuit = ""
    for (let i = 0; i < numQubits; i++) {
      if (i === 0) {
        circuit += `q_${i}: ──[H]──`
        circuit += "●".repeat(numQubits - 1) + "──\n"
      } else {
        circuit += " ".repeat(9)
        circuit += "│".repeat(i) + " ".repeat(numQubits - i - 1)
        circuit += "\n"
        circuit += `q_${i}: ──��─────`
        circuit += "─".repeat(i - 1) + "X" + "─".repeat(numQubits - i) + "──\n"
      }
    }
    return circuit
  }

  // Helper function to generate superposition circuit ASCII art
  function generateSuperpositionCircuit(numQubits: number): string {
    let circuit = ""
    for (let i = 0; i < numQubits; i++) {
      if (i === 0) {
        circuit += `q_${i}: ──[H]──${"─".repeat(numQubits)}──\n`
      } else {
        circuit += `q_${i}: ──────${"─".repeat(numQubits + 2)}──\n`
      }
    }
    return circuit
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Quantum Experiment Simulator</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Experiment Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="experiment-type">Experiment Type</Label>
                <select
                  id="experiment-type"
                  className="w-full p-2 border rounded mt-1"
                  value={experimentType}
                  onChange={(e) => setExperimentType(e.target.value as any)}
                >
                  <option value="bell">Bell State</option>
                  <option value="ghz">GHZ State</option>
                  <option value="teleportation">Quantum Teleportation</option>
                  <option value="superposition">Quantum Superposition</option>
                </select>
              </div>

              {experimentType !== "teleportation" && (
                <div>
                  <Label htmlFor="qubits">Number of Qubits</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="qubits"
                      min={experimentType === "bell" ? 2 : 1}
                      max={10}
                      step={1}
                      value={[qubits]}
                      onValueChange={(value) => setQubits(value[0])}
                      disabled={experimentType === "bell" || experimentType === "teleportation"}
                    />
                    <span className="w-8 text-center">{qubits}</span>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="shots">Number of Shots</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="shots"
                    min={100}
                    max={10000}
                    step={100}
                    value={[shots]}
                    onValueChange={(value) => setShots(value[0])}
                  />
                  <span className="w-16 text-center">{shots}</span>
                </div>
              </div>

              {experimentType !== "bell" && experimentType !== "teleportation" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="entanglement"
                    checked={entanglement}
                    onCheckedChange={setEntanglement}
                    disabled={experimentType === "ghz"}
                  />
                  <Label htmlFor="entanglement">Enable Entanglement</Label>
                </div>
              )}

              <Button onClick={runExperiment} disabled={isRunning} className="w-full">
                {isRunning ? "Running Simulation..." : "Run Experiment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {results ? (
            <QuantumExperimentDisplay
              experimentTitle={results.experimentTitle}
              simulationParameters={results.simulationParameters}
              mathematicalFormalism={results.mathematicalFormalism}
              circuitDescription={results.circuitDescription}
              measurementData={results.measurementData}
              insights={results.insights}
              codeImplementation={results.codeImplementation}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Experiment Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-gray-500">
                  Configure your experiment parameters and click "Run Experiment" to see results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
