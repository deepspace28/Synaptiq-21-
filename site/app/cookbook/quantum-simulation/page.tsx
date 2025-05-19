export default function QuantumSimulationPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Recipe</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Quantum Simulation</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          This recipe shows how to use the Synaptiq API to simulate quantum systems and visualize the results.
        </p>

        <h2 className="text-2xl font-semibold text-white">Overview</h2>
        <p>
          Synaptiq's quantum simulation capabilities allow you to model quantum systems, run simulations, and visualize
          the results. This is particularly useful for researchers in quantum physics, quantum computing, and related
          fields.
        </p>

        <h2 className="text-2xl font-semibold text-white">Example: Bell State Preparation</h2>
        <p>
          In this example, we'll use the Synaptiq API to simulate the preparation of a Bell state, one of the simplest
          examples of quantum entanglement.
        </p>

        <div className="rounded-lg bg-[#151515] p-6 border border-[#222222]">
          <pre className="text-sm text-gray-300">
            <code>
              {`from openai import OpenAI

client = OpenAI(
    api_key=SYNAPTIQ_API_KEY,
    base_url="https://api.synaptiq.contact/v1",
)

prompt = """
Simulate the following quantum experiment: Bell state preparation.

Initialize two qubits in the |00⟩ state.
Apply a Hadamard gate to the first qubit.
Apply a CNOT gate with the first qubit as control and the second as target.
Show the mathematical derivation, quantum circuit, and measurement statistics.
"""

completion = client.chat.completions.create(
    model="synaptiq-2-quantum",
    messages=[
        {"role": "user", "content": prompt}
    ]
)

print(completion.choices[0].message.content)
`}
            </code>
          </pre>
        </div>

        <h2 className="text-2xl font-semibold text-white">Response Format</h2>
        <p>The response will include:</p>

        <ul className="ml-6 mt-4 list-disc space-y-2">
          <li>
            <span className="font-medium text-white">Mathematical Formalism:</span> Step-by-step derivation of the
            quantum state evolution
          </li>
          <li>
            <span className="font-medium text-white">Quantum Circuit:</span> ASCII representation of the quantum circuit
          </li>
          <li>
            <span className="font-medium text-white">Measurement Statistics:</span> Probabilities of different
            measurement outcomes
          </li>
          <li>
            <span className="font-medium text-white">Insights:</span> Explanation of the quantum phenomena demonstrated
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white">Example Response</h2>
        <div className="rounded-lg bg-[#151515] p-6 border border-[#222222]">
          <h3 className="text-xl font-medium text-white">Bell State Preparation and Analysis</h3>

          <h4 className="mt-4 font-medium text-white">Mathematical Formalism</h4>
          <p className="mt-2 text-gray-300">We begin with a 2-qubit system in the ground state:</p>
          <p className="mt-2 text-gray-300">|ψ₀⟩ = |00⟩</p>
          <p className="mt-2 text-gray-300">First, we apply a Hadamard gate to the first qubit:</p>
          <p className="mt-2 text-gray-300">H|0⟩ = (1/√2)(|0⟩ + |1⟩)</p>
          <p className="mt-2 text-gray-300">So our state becomes:</p>
          <p className="mt-2 text-gray-300">|ψ₁⟩ = (1/√2)(|0⟩ + |1⟩) ⊗ |0⟩ = (1/√2)(|00⟩ + |10⟩)</p>
          <p className="mt-2 text-gray-300">
            Next, we apply a CNOT gate with the first qubit as control and the second as target:
          </p>
          <p className="mt-2 text-gray-300">CNOT|ψ₁⟩ = (1/√2)(|00⟩ + |11⟩)</p>
          <p className="mt-2 text-gray-300">
            This is the Bell state |Φ⁺⟩, one of the maximally entangled two-qubit states.
          </p>

          <h4 className="mt-4 font-medium text-white">Quantum Circuit</h4>
          <pre className="mt-2 text-sm text-gray-300">
            <code>
              {`q_0: ──[H]──●──
             │
q_1: ────────X──`}
            </code>
          </pre>

          <h4 className="mt-4 font-medium text-white">Measurement Statistics</h4>
          <p className="mt-2 text-gray-300">
            When we measure this Bell state, quantum theory predicts we should observe either both qubits in state |0⟩
            or both in state |1⟩, with equal probability (50% each).
          </p>
          <pre className="mt-2 text-sm text-gray-300">
            <code>
              {`| Measurement | Count | Probability |
|-------------|-------|------------|
| 00          | 512   | 0.5        |
| 11          | 512   | 0.5        |
| 01          | 0     | 0.0        |
| 10          | 0     | 0.0        |`}
            </code>
          </pre>

          <h4 className="mt-4 font-medium text-white">Insights</h4>
          <p className="mt-2 text-gray-300">
            This experiment demonstrates quantum entanglement, one of the most profound phenomena in quantum mechanics.
            The key observations:
          </p>
          <ol className="ml-6 mt-2 list-decimal space-y-1 text-gray-300">
            <li>The qubits are in a superposition of states until measured.</li>
            <li>
              After entanglement, the measurement outcomes of the two qubits are perfectly correlated - if one is
              measured as |0⟩, the other will always be |0⟩, and similarly for |1⟩.
            </li>
            <li>
              This correlation persists regardless of the spatial separation between the qubits, which Einstein famously
              referred to as "spooky action at a distance."
            </li>
            <li>
              The Bell state created here (|Φ⁺⟩) is maximally entangled, meaning it cannot be factored into a product of
              individual qubit states.
            </li>
          </ol>
        </div>

        <h2 className="text-2xl font-semibold text-white">Advanced Options</h2>
        <p>You can customize your quantum simulation by specifying additional parameters:</p>

        <ul className="ml-6 mt-4 list-disc space-y-2">
          <li>
            <span className="font-medium text-white">Number of qubits:</span> Specify the number of qubits in your
            simulation
          </li>
          <li>
            <span className="font-medium text-white">Gate sequence:</span> Specify the sequence of quantum gates to
            apply
          </li>
          <li>
            <span className="font-medium text-white">Measurement basis:</span> Specify the basis in which to measure the
            qubits
          </li>
          <li>
            <span className="font-medium text-white">Visualization type:</span> Request specific visualizations, such as
            Bloch sphere or probability histogram
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white">Related Recipes</h2>
        <ul className="ml-6 mt-4 list-disc space-y-2">
          <li>
            <a href="/cookbook/quantum-teleportation" className="text-purple-400 hover:underline">
              Quantum Teleportation
            </a>
          </li>
          <li>
            <a href="/cookbook/grover-algorithm" className="text-purple-400 hover:underline">
              Grover's Search Algorithm
            </a>
          </li>
          <li>
            <a href="/cookbook/quantum-fourier-transform" className="text-purple-400 hover:underline">
              Quantum Fourier Transform
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
