"use client"
import { Card, CardContent } from "@/components/ui/card"

interface QuantumExperimentProps {
  experimentTitle: string
  simulationParameters: {
    qubits: number
    shots: number
    entanglement: boolean
    backend: string
  }
  mathematicalFormalism: string[]
  circuitDescription: string
  measurementData: {
    labels: string[]
    values: number[]
  }
  insights: string
  codeImplementation: string
}

export function QuantumExperimentDisplay({
  experimentTitle,
  simulationParameters,
  mathematicalFormalism,
  circuitDescription,
  measurementData,
  insights,
  codeImplementation,
}: QuantumExperimentProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold mb-2">🧪 {experimentTitle}</h2>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🔧 Simulation Parameters</h3>
        <Card>
          <CardContent className="pt-6">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Number of qubits:</strong> {simulationParameters.qubits}
              </li>
              <li>
                <strong>Shot count:</strong> {simulationParameters.shots}
              </li>
              <li>
                <strong>Entanglement:</strong> {simulationParameters.entanglement ? "Yes" : "No"}
              </li>
              <li>
                <strong>Backend:</strong> {simulationParameters.backend}
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🧮 Mathematical Formalism</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {mathematicalFormalism.map((equation, index) => (
                <div key={index} className="py-2 text-center">
                  $${equation}$$
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🔁 Quantum Circuit</h3>
        <Card>
          <CardContent className="pt-6">
            <pre className="font-mono text-sm whitespace-pre overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 rounded">
              {circuitDescription}
            </pre>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">📊 Measurement Statistics</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Measurement</th>
                    <th className="text-left py-2 px-4">Count</th>
                    <th className="text-left py-2 px-4">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {measurementData.labels.map((label, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{label}</td>
                      <td className="py-2 px-4">{measurementData.values[index]}</td>
                      <td className="py-2 px-4">
                        {(measurementData.values[index] / simulationParameters.shots).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Histogram</h4>
                <div className="h-64 flex items-end space-x-2">
                  {measurementData.labels.map((label, index) => {
                    const maxValue = Math.max(...measurementData.values)
                    const height = (measurementData.values[index] / maxValue) * 100
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-16 bg-gray-600 dark:bg-gray-400" style={{ height: `${height}%` }}></div>
                        <span className="mt-2 text-sm">{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🧠 Insights & Interpretation</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{insights}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🧾 Code Implementation</h3>
        <Card>
          <CardContent className="pt-6">
            <pre className="font-mono text-sm whitespace-pre overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 rounded">
              {codeImplementation}
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
