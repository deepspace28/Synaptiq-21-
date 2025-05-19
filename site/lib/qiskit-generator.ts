import { logger } from "./logger"

/**
 * Generates Qiskit code based on a prompt
 * @param prompt The user prompt
 * @returns Qiskit code as a string
 */
export function generateQiskitCode(prompt: string): string {
  logger.info(`Generating Qiskit code for prompt: ${prompt}`)

  // Extract key parameters from the prompt
  const numQubits = extractNumQubits(prompt)
  const numShots = extractNumShots(prompt)

  // Determine the type of simulation based on the prompt
  if (prompt.toLowerCase().includes("bell") || prompt.toLowerCase().includes("entangle")) {
    return generateBellStateCode(numQubits, numShots)
  } else if (prompt.toLowerCase().includes("ghz")) {
    return generateGHZStateCode(numQubits, numShots)
  } else if (prompt.toLowerCase().includes("superposition")) {
    return generateSuperpositionCode(numQubits, numShots)
  } else if (prompt.toLowerCase().includes("teleport")) {
    return generateTeleportationCode(numShots)
  } else if (prompt.toLowerCase().includes("grover")) {
    return generateGroverCode(numQubits, numShots)
  } else if (prompt.toLowerCase().includes("qft") || prompt.toLowerCase().includes("fourier")) {
    return generateQFTCode(numQubits, numShots)
  } else {
    // Default to a simple superposition circuit
    return generateSuperpositionCode(numQubits, numShots)
  }
}

/**
 * Extracts the number of qubits from a prompt
 */
function extractNumQubits(prompt: string): number {
  const match = prompt.match(/(\d+)\s*qubit/i)
  return match ? Number.parseInt(match[1], 10) : 2
}

/**
 * Extracts the number of shots from a prompt
 */
function extractNumShots(prompt: string): number {
  const match = prompt.match(/(\d+)\s*shots/i)
  return match ? Number.parseInt(match[1], 10) : 1024
}

/**
 * Generates code for a Bell state
 */
function generateBellStateCode(numQubits = 2, shots = 1024): string {
  return `
# Bell State Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create a quantum circuit with 2 qubits
circuit = QuantumCircuit(2, 2)

# Apply H gate to the first qubit
circuit.h(0)

# Apply CNOT gate with control qubit 0 and target qubit 1
circuit.cx(0, 1)

# Measure all qubits
circuit.measure_all()

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}

/**
 * Generates code for a GHZ state
 */
function generateGHZStateCode(numQubits = 3, shots = 1024): string {
  return `
# GHZ State Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create a quantum circuit with ${numQubits} qubits
circuit = QuantumCircuit(${numQubits}, ${numQubits})

# Apply H gate to the first qubit
circuit.h(0)

# Apply CNOT gates to entangle all qubits
${Array.from({ length: numQubits - 1 }, (_, i) => `circuit.cx(0, ${i + 1})`).join("\n")}

# Measure all qubits
circuit.measure_all()

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}

/**
 * Generates code for a superposition state
 */
function generateSuperpositionCode(numQubits = 1, shots = 1024): string {
  return `
# Superposition Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create a quantum circuit with ${numQubits} qubits
circuit = QuantumCircuit(${numQubits}, ${numQubits})

# Apply H gates to all qubits
${Array.from({ length: numQubits }, (_, i) => `circuit.h(${i})`).join("\n")}

# Measure all qubits
circuit.measure_all()

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}

/**
 * Generates code for quantum teleportation
 */
function generateTeleportationCode(shots = 1024): string {
  return `
# Quantum Teleportation Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create a quantum circuit with 3 qubits and 3 classical bits
circuit = QuantumCircuit(3, 3)

# Prepare the state to teleport (qubit 0)
circuit.x(0)  # Let's teleport |1⟩
circuit.h(0)  # Or we can teleport a superposition state

# Create entanglement between qubits 1 and 2
circuit.h(1)
circuit.cx(1, 2)

# Bell measurement on qubits 0 and 1
circuit.cx(0, 1)
circuit.h(0)
circuit.measure([0, 1], [0, 1])

# Apply corrections on qubit 2 depending on measurement outcomes
circuit.cx(1, 2)
circuit.cz(0, 2)

# Measure the teleported qubit
circuit.measure(2, 2)

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}

/**
 * Generates code for Grover's algorithm
 */
function generateGroverCode(numQubits = 2, shots = 1024): string {
  return `
# Grover's Algorithm Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Number of qubits
n = ${numQubits}

# Create a quantum circuit with n qubits
circuit = QuantumCircuit(n, n)

# Apply H gates to all qubits
for i in range(n):
    circuit.h(i)

# Apply the oracle (mark the state |11...1⟩)
# For simplicity, we'll use a Z gate with n-1 controls
if n > 1:
    circuit.x(n-1)
    circuit.h(n-1)
    
    # Apply multi-controlled X gate
    for i in range(n-1):
        circuit.cx(i, n-1)
    
    circuit.h(n-1)
    circuit.x(n-1)

# Apply the diffusion operator
for i in range(n):
    circuit.h(i)
    circuit.x(i)

# Apply multi-controlled Z gate
if n > 1:
    circuit.h(n-1)
    
    # Apply multi-controlled X gate
    for i in range(n-1):
        circuit.cx(i, n-1)
    
    circuit.h(n-1)

for i in range(n):
    circuit.x(i)
    circuit.h(i)

# Measure all qubits
circuit.measure_all()

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}

/**
 * Generates code for Quantum Fourier Transform
 */
function generateQFTCode(numQubits = 3, shots = 1024): string {
  return `
# Quantum Fourier Transform Circuit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np
import math

# Number of qubits
n = ${numQubits}

# Create a quantum circuit with n qubits
circuit = QuantumCircuit(n, n)

# Prepare an initial state (e.g., |1⟩)
circuit.x(0)

# Define the QFT function
def qft(circuit, n):
    for i in range(n):
        circuit.h(i)
        for j in range(i+1, n):
            circuit.cp(math.pi/float(2**(j-i)), j, i)
    
    # Swap qubits
    for i in range(n//2):
        circuit.swap(i, n-i-1)
    
    return circuit

# Apply QFT
qft(circuit, n)

# Measure all qubits
circuit.measure_all()

# Use Aer's qasm_simulator
simulator = Aer.get_backend('qasm_simulator')

# Execute the circuit on the simulator
job = execute(circuit, simulator, shots=${shots})

# Get the result
result = job.result()

# Get the counts (measurement outcomes)
counts = result.get_counts(circuit)

# Plot the results
plot_histogram(counts)

# Print the circuit
print(circuit.draw())
`
}
