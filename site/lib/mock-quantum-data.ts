export function getMockQuantumData(prompt: string) {
  // Simple prompt-based mock data
  if (prompt.toLowerCase().includes("entanglement") || prompt.toLowerCase().includes("bell")) {
    return {
      summary: "Quantum entanglement simulation between two qubits showing Bell state correlations",
      equations: [
        "\\ket{\\Phi^+} = \\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{11})",
        "P(\\ket{00}) = P(\\ket{11}) = \\frac{1}{2}",
        "P(\\ket{01}) = P(\\ket{10}) = 0",
      ],
      insight:
        "This simulation demonstrates quantum entanglement, where the measurement of one qubit instantly determines the state of the other, regardless of the distance between them. This is what Einstein referred to as 'spooky action at a distance'. The results show perfect correlation between the two qubits, with both qubits always measured in the same state.",
      chart: {
        title: "Bell State Measurement Results",
        labels: ["00", "11", "01", "10"],
        values: [512, 512, 0, 0],
      },
      rawContent: `# Summary
Quantum entanglement simulation between two qubits showing Bell state correlations

# Equations
- \\ket{\\Phi^+} = \\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{11})
- P(\\ket{00}) = P(\\ket{11}) = \\frac{1}{2}
- P(\\ket{01}) = P(\\ket{10}) = 0

# Results
| State | Probability |
|-------|-------------|
| 00    | 50%         |
| 11    | 50%         |
| 01    | 0%          |
| 10    | 0%          |

# Insight
This simulation demonstrates quantum entanglement, where the measurement of one qubit instantly determines the state of the other, regardless of the distance between them. This is what Einstein referred to as 'spooky action at a distance'. The results show perfect correlation between the two qubits, with both qubits always measured in the same state.`,
    }
  } else if (prompt.toLowerCase().includes("schrödinger") || prompt.toLowerCase().includes("cat")) {
    return {
      summary: "Schrödinger's cat thought experiment simulated as a quantum superposition",
      equations: [
        "\\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{\\text{alive}} + \\ket{\\text{dead}})",
        "\\ket{\\text{alive}} \\equiv \\ket{0}",
        "\\ket{\\text{dead}} \\equiv \\ket{1}",
      ],
      insight:
        "Schrödinger's cat is a famous thought experiment that illustrates the concept of quantum superposition. In this simulation, we represent the cat's state as a qubit in superposition, where the cat is simultaneously alive (|0⟩) and dead (|1⟩) until observed. Upon measurement, the wavefunction collapses to either state with equal probability.",
      chart: {
        title: "Cat State Measurement",
        labels: ["Alive (|0⟩)", "Dead (|1⟩)"],
        values: [512, 512],
      },
      rawContent: `# Summary
Schrödinger's cat thought experiment simulated as a quantum superposition

# Equations
- \\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{\\text{alive}} + \\ket{\\text{dead}})
- \\ket{\\text{alive}} \\equiv \\ket{0}
- \\ket{\\text{dead}} \\equiv \\ket{1}

# Results
| State | Probability |
|-------|-------------|
| Alive (|0⟩) | 50% |
| Dead (|1⟩)  | 50% |

# Insight
Schrödinger's cat is a famous thought experiment that illustrates the concept of quantum superposition. In this simulation, we represent the cat's state as a qubit in superposition, where the cat is simultaneously alive (|0⟩) and dead (|1⟩) until observed. Upon measurement, the wavefunction collapses to either state with equal probability.`,
    }
  } else {
    // Default quantum simulation
    return {
      summary: "Quantum simulation with superposition of states",
      equations: [
        "\\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1})",
        "P(\\ket{0}) = P(\\ket{1}) = \\frac{1}{2}",
      ],
      insight:
        "This simulation demonstrates quantum superposition, where a quantum system exists in multiple states simultaneously until measured. The Hadamard gate creates an equal superposition of states, giving each possible outcome approximately equal probability.",
      chart: {
        title: "Measurement Results",
        labels: ["0", "1"],
        values: [512, 512],
      },
      rawContent: `# Summary
Quantum simulation with superposition of states

# Equations
- \\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1})
- P(\\ket{0}) = P(\\ket{1}) = \\frac{1}{2}

# Results
| State | Probability |
|-------|-------------|
| 0     | 50%         |
| 1     | 50%         |

# Insight
This simulation demonstrates quantum superposition, where a quantum system exists in multiple states simultaneously until measured. The Hadamard gate creates an equal superposition of states, giving each possible outcome approximately equal probability.`,
    }
  }
}
