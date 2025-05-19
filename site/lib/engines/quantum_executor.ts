import { logger } from "../logger"

interface QuantumSimulationResult {
  summary: string
  equations?: string[]
  insight?: string
  chart?: {
    labels: string[]
    values: number[]
  }
  circuit?: string
}

/**
 * Runs a quantum simulation based on the provided parameters
 * @param prompt The original user prompt
 * @param params The parameters for the simulation
 * @returns The simulation result
 */
export async function executeQuantumSimulation(
  prompt: string,
  params: Record<string, any>,
): Promise<QuantumSimulationResult> {
  try {
    logger.info(`Running quantum simulation with params: ${JSON.stringify(params)}`)

    // For now, we'll use mock data to ensure the UI works correctly
    // In a production environment, this would call the Python API
    return mockQuantumSimulation(prompt, params)
  } catch (error) {
    logger.error(`Error running quantum simulation: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

/**
 * Provides a mock quantum simulation result
 */
function mockQuantumSimulation(prompt: string, params: Record<string, any>): QuantumSimulationResult {
  const lowerPrompt = prompt.toLowerCase()
  const qubits = params.qubits || 2
  const shots = params.shots || 1024

  // Determine the type of simulation based on the prompt
  let simulationType = "superposition"
  if (lowerPrompt.includes("bell") || lowerPrompt.includes("entangle")) {
    simulationType = "bell_state"
  } else if (lowerPrompt.includes("ghz")) {
    simulationType = "ghz_state"
  } else if (lowerPrompt.includes("teleport")) {
    simulationType = "teleportation"
  } else if (lowerPrompt.includes("grover")) {
    simulationType = "grover"
  } else if (lowerPrompt.includes("fourier") || lowerPrompt.includes("qft")) {
    simulationType = "qft"
  }

  // Generate appropriate states and counts based on the simulation type
  let states: string[] = []
  let counts: number[] = []
  let equations: string[] = []
  let insight = ""
  let circuit = ""
  let title = ""

  switch (simulationType) {
    case "bell_state":
      states = ["00", "11"]
      counts = [Math.floor(shots * 0.51), Math.floor(shots * 0.49)]
      equations = [
        "\\ket{\\psi_0} = \\ket{00}",
        "H \\otimes I \\ket{00} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1}) \\otimes \\ket{0} = \\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{10})",
        "CNOT(\\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{10})) = \\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{11})",
      ]
      insight =
        "This simulation demonstrates the Bell state, one of the simplest examples of quantum entanglement. The Bell state is created by applying a Hadamard gate to the first qubit, putting it in a superposition, and then applying a CNOT gate with the first qubit as control and the second as target. The resulting state is an entangled state where measuring one qubit immediately determines the state of the other qubit."
      circuit = `
q_0: ──[H]──●──
           │
q_1: ──────X──
      `
      title = "Bell State Simulation"
      break

    case "ghz_state":
      states = ["0".repeat(qubits), "1".repeat(qubits)]
      counts = [Math.floor(shots * 0.51), Math.floor(shots * 0.49)]
      equations = [
        `\\ket{\\psi_0} = \\ket{${"0".repeat(qubits)}}`,
        `H \\otimes I^{\\otimes ${qubits - 1}} \\ket{${"0".repeat(qubits)}} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1}) \\otimes \\ket{${"0".repeat(qubits - 1)}} = \\frac{1}{\\sqrt{2}}(\\ket{${"0".repeat(qubits)}} + \\ket{1${"0".repeat(qubits - 1)}})`,
        `\\text{After CNOT gates: } \\ket{\\psi_f} = \\frac{1}{\\sqrt{2}}(\\ket{${"0".repeat(qubits)}} + \\ket{${"1".repeat(qubits)}})`,
      ]
      insight = `This simulation demonstrates the GHZ state, a multi-qubit entangled state named after Greenberger, Horne, and Zeilinger. The GHZ state is created by applying a Hadamard gate to the first qubit, putting it in a superposition, and then applying CNOT gates with the first qubit as control and all other qubits as targets. The resulting state is a maximally entangled state where all qubits are correlated.`
      circuit = `q_0: ──[H]──●──●──...──●──\n`
      for (let i = 1; i < qubits; i++) {
        circuit += `q_${i}: ──────X──${i > 1 ? "─" : ""}──...──${i < qubits - 1 ? "─" : ""}──X──\n`
      }
      title = `${qubits}-Qubit GHZ State Simulation`
      break

    case "teleportation":
      states = ["000", "001", "010", "011", "100", "101", "110", "111"]
      counts = states.map(() => Math.floor(shots / states.length))
      equations = [
        "\\text{Initial state: } \\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{0} + e^{i\\pi/4}\\ket{1}) \\otimes \\ket{00}",
        "\\text{After Bell pair: } \\ket{\\psi} = \\frac{1}{\\sqrt{2}}(\\ket{0} + e^{i\\pi/4}\\ket{1}) \\otimes \\frac{1}{\\sqrt{2}}(\\ket{00} + \\ket{11})",
        "\\text{After Bell measurement: } \\ket{\\psi} = \\ket{m_1 m_2} \\otimes X^{m_2}Z^{m_1}\\frac{1}{\\sqrt{2}}(\\ket{0} + e^{i\\pi/4}\\ket{1})",
      ]
      insight =
        "This simulation demonstrates quantum teleportation, a protocol that transfers a quantum state from one qubit to another using entanglement and classical communication. The protocol begins by preparing a Bell pair (entangled qubits 1 and 2). Then, a Bell measurement is performed on the source qubit (0) and one half of the Bell pair (qubit 1). Based on the measurement results, classical corrections (X and Z gates) are applied to the target qubit (2)."
      circuit = `
q_0: ──[H]──[RZ(π/4)]──●────[H]──M────────────
                       │           ↓
q_1: ──[H]────────────●────M──────↓───────────
                      │      ↓    │
q_2: ───────────────X─┼─────┼────┼─[X]─[Z]─M─
                       │      │    │  ↑   ↑  ↓
c_0: ═════════════════╪═════╪════╪══╪═══|═══
                       │      │    ↓  │   │
c_1: ═════════════════╪═════╪════════|═══
                              ↓
c_2: ═════════════════════════════════════
      `
      title = "Quantum Teleportation Simulation"
      break

    case "grover":
      states = Array.from({ length: 2 ** Math.min(qubits, 3) }, (_, i) =>
        i.toString(2).padStart(Math.min(qubits, 3), "0"),
      )
      // Make one state have a much higher probability (the "marked" state)
      const markedIndex = Math.floor(Math.random() * states.length)
      counts = states.map((_, i) =>
        i === markedIndex ? Math.floor(shots * 0.8) : Math.floor((shots * 0.2) / (states.length - 1)),
      )
      equations = [
        "\\text{Initial state: } \\ket{\\psi_0} = \\frac{1}{\\sqrt{2^n}}\\sum_{x=0}^{2^n-1}\\ket{x}",
        `\\text{Marked state: } \\ket{${states[markedIndex]}}`,
        "\\text{Oracle: } O\\ket{x} = \\begin{cases} -\\ket{x} & \\text{if } x = \\text{marked state} \\\\ \\ket{x} & \\text{otherwise} \\end{cases}",
        "\\text{Diffusion: } D = 2\\ket{s}\\bra{s} - I \\text{ where } \\ket{s} = \\frac{1}{\\sqrt{2^n}}\\sum_{x=0}^{2^n-1}\\ket{x}",
      ]
      insight = `This simulation demonstrates Grover's algorithm, a quantum algorithm for unstructured search problems. The algorithm searches for a marked item in an unsorted database of N = 2^${qubits} items with quadratic speedup compared to classical algorithms. While a classical search would require O(N) queries, Grover's algorithm requires only O(√N) queries.`
      circuit = `
Grover's Algorithm Circuit:
1. Initialize all qubits with Hadamard gates
2. Repeat for optimal number of iterations:
   a. Apply Oracle to mark state |${states[markedIndex]}⟩
   b. Apply Diffusion operator
3. Measure all qubits
      `
      title = `Grover's Algorithm Simulation (${qubits} qubits)`
      break

    case "qft":
      states = Array.from({ length: 2 ** Math.min(qubits, 3) }, (_, i) =>
        i.toString(2).padStart(Math.min(qubits, 3), "0"),
      )
      counts = states.map(() => Math.floor(shots / states.length))
      equations = [
        "\\text{QFT: } \\text{QFT}\\ket{j} = \\frac{1}{\\sqrt{2^n}}\\sum_{k=0}^{2^n-1}e^{2\\pi i jk/2^n}\\ket{k}",
        "\\text{Hadamard: } H\\ket{0} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1}), H\\ket{1} = \\frac{1}{\\sqrt{2}}(\\ket{0} - \\ket{1})",
        "\\text{Controlled-Phase: } R_k\\ket{1} = e^{2\\pi i/2^k}\\ket{1}",
      ]
      insight =
        "This simulation demonstrates the Quantum Fourier Transform (QFT), a quantum version of the classical Discrete Fourier Transform. The QFT transforms a quantum state from the computational basis to the Fourier basis. It's a key component in many quantum algorithms, including Shor's factoring algorithm, quantum phase estimation, and quantum counting."
      circuit = `
Quantum Fourier Transform Circuit:
1. Apply Hadamard gates to each qubit
2. Apply controlled phase rotations
3. Swap qubits for correct output order
4. Measure all qubits
      `
      title = `Quantum Fourier Transform Simulation (${qubits} qubits)`
      break

    default: // superposition
      if (qubits === 1) {
        states = ["0", "1"]
        counts = [Math.floor(shots * 0.51), Math.floor(shots * 0.49)]
        equations = [
          "\\ket{\\psi_0} = \\ket{0}",
          "H\\ket{0} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1})",
          "\\ket{\\psi_1} = \\frac{1}{\\sqrt{2}}(\\ket{0} + \\ket{1})",
        ]
        insight =
          "This simulation demonstrates quantum superposition, where a quantum system exists in multiple states simultaneously until measured. The Hadamard gate creates an equal superposition of states, giving each possible outcome approximately equal probability."
        circuit = `
q_0: ──[H]──
        `
        title = "Quantum Superposition Simulation"
      } else {
        states = []
        for (let i = 0; i < Math.min(2 ** qubits, 8); i++) {
          states.push(i.toString(2).padStart(qubits, "0"))
        }
        counts = states.map(() => Math.floor(shots / states.length))
        equations = [
          `\\ket{\\psi_0} = \\ket{${"0".repeat(qubits)}}`,
          `\\text{After Hadamard gates: } \\ket{\\psi} = \\frac{1}{\\sqrt{2^${qubits}}}\\sum_{x=0}^{2^${qubits}-1}\\ket{x}`,
        ]
        insight = `This simulation demonstrates a ${qubits}-qubit system in superposition. After applying Hadamard gates to all qubits, the system exists in a superposition of all ${2 ** qubits} possible states with equal probability.`
        circuit = Array.from({ length: qubits }, (_, i) => `q_${i}: ──[H]──`).join("\n")
        title = `${qubits}-Qubit Superposition Simulation`
      }
      break
  }

  return {
    summary: title,
    equations,
    insight,
    chart: {
      labels: states,
      values: counts,
    },
    circuit,
  }
}
