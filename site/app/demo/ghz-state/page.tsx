import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GHZStateSimulation } from "@/components/quantum-simulations/ghz-state-simulation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function GHZStatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GHZ State Quantum Simulation</CardTitle>
              <CardDescription>
                Exploring the Greenberger-Horne-Zeilinger (GHZ) state, a maximally entangled quantum state
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                The GHZ state is a notable multi-qubit entangled state that demonstrates quantum non-locality beyond
                what Bell states show. It is defined as:
              </p>
              <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-center">
                {"$|\\text{GHZ}\\rangle = \\frac{1}{\\sqrt{2}}(|00...0\\rangle + |11...1\\rangle)$"}
              </div>
              <p>
                This simulation demonstrates the creation and measurement of a GHZ state using quantum gates. The
                results show the perfect correlation between qubits that is characteristic of this entangled state.
              </p>
            </CardContent>
          </Card>

          <GHZStateSimulation qubits={3} shots={1024} />

          <Card>
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-x-auto">
                <code className="language-python">
                  {`import numpy as np
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram, plot_bloch_multivector
from qiskit.quantum_info import Statevector

# Create a quantum circuit with 3 qubits and 3 classical bits
circuit = QuantumCircuit(3, 3)

# Step 1: Apply Hadamard gate to the first qubit
circuit.h(0)

# Step 2: Apply CNOT gates with control qubit 0 and target qubits 1 and 2
circuit.cx(0, 1)
circuit.cx(0, 2)

# Get the statevector before measurement
statevector_sim = Aer.get_backend('statevector_simulator')
job_sv = execute(circuit, statevector_sim)
state = job_sv.result().get_statevector()
print("Statevector:", state)

# Measure all qubits
circuit.measure([0, 1, 2], [0, 1, 2])

# Use the Qiskit Aer simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=1024)
result = job.result()

# Get the counts of each measurement outcome
counts = result.get_counts(circuit)
print("Measurement counts:", counts)

# Calculate probabilities
total_shots = sum(counts.values())
probabilities = {outcome: count/total_shots for outcome, count in counts.items()}
print("Probabilities:", probabilities)

# Visualize the results
plot_histogram(counts)

# Visualize the statevector (before measurement)
plot_bloch_multivector(state)`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
