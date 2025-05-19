import { DynamicSimulator } from "@/components/simulation-lab/dynamic-simulator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimulationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Quantum Simulations</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Run real quantum simulations using Qiskit and explore quantum computing concepts.
          </p>
        </div>

        <DynamicSimulator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Prompts</CardTitle>
              <CardDescription>Try these prompts to explore different quantum simulations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Bell State</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">"Create a Bell state with 2 qubits"</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">GHZ State</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">"Simulate a 3-qubit GHZ state"</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Quantum Teleportation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">"Run a quantum teleportation protocol"</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Grover's Algorithm</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "Demonstrate Grover's search algorithm with 3 qubits"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Quantum Simulations</CardTitle>
              <CardDescription>Understanding quantum computing concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Quantum simulations allow you to explore quantum computing concepts without access to actual quantum
                hardware. These simulations use Qiskit, IBM's open-source quantum computing framework, to simulate
                quantum circuits.
              </p>
              <p className="text-sm">
                The simulations run on a classical computer but accurately model quantum behavior, including
                superposition, entanglement, and quantum measurement.
              </p>
              <p className="text-sm">
                Enter a prompt describing the quantum system or algorithm you want to simulate, and the system will
                generate and execute the appropriate Qiskit code, returning the results with visualizations and
                explanations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
