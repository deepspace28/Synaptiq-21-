"use client"

import { useState, useEffect } from "react"
import { MathTheoryPanel } from "@/components/math-theory-panel"
import { BrandedHistogram } from "@/components/branded-histogram"
import { DynamicInsights } from "@/components/dynamic-insights"
import { CustomizationPanel } from "@/components/customization-panel"
import { NotebookExport } from "@/components/notebook-export"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RefreshCw } from "lucide-react"

export default function SimulationComponentsPage() {
  const [simulationData, setSimulationData] = useState({
    title: "Quantum Harmonic Oscillator",
    description: "Simulation of a quantum harmonic oscillator system",
    domain: "quantum",
    chartType: "line",
    explanation: "The quantum harmonic oscillator is a quantum-mechanical analog of the classical harmonic oscillator.",
    equations: [
      "\\hat{H} = \\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2\\hat{x}^2",
      "E_n = \\hbar\\omega\\left(n + \\frac{1}{2}\\right)",
      "\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-\\frac{m\\omega x^2}{2\\hbar}}H_n\\left(\\sqrt{\\frac{m\\omega}{\\hbar}}x\\right)",
    ],
  })

  const [parameters, setParameters] = useState({
    frequency: 1.0,
    amplitude: 1.0,
    mass: 1.0,
    numLevels: 5,
    showProbability: true,
    colorScheme: "#00BFFF",
  })

  const [results, setResults] = useState({
    x: Array.from({ length: 100 }, (_, i) => i / 10),
    y: Array.from({ length: 100 }, (_, i) => Math.sin(i / 10) * Math.exp(-Math.pow(i / 10 - 5, 2) / 10)),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("visualization")

  // Simulate running the simulation
  const runSimulation = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate new results based on parameters
      const newX = Array.from({ length: 100 }, (_, i) => i / 10)
      const newY = Array.from(
        { length: 100 },
        (_, i) =>
          Math.sin((parameters.frequency * i) / 10) *
          parameters.amplitude *
          Math.exp(-Math.pow(i / 10 - 5, 2) / (parameters.mass * 2)),
      )

      setResults({
        x: newX,
        y: newY,
      })

      setIsLoading(false)
    }, 1500)
  }

  // Handle parameter changes
  const handleParameterChange = (id: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Generate histogram data from results
  const getHistogramData = () => {
    // Create 10 bins from the y values
    const min = Math.min(...results.y)
    const max = Math.max(...results.y)
    const range = max - min
    const binSize = range / 10

    const bins = Array(10).fill(0)

    results.y.forEach((y) => {
      const binIndex = Math.min(Math.floor((y - min) / binSize), 9)
      bins[binIndex]++
    })

    return {
      labels: Array(10)
        .fill(0)
        .map((_, i) => `${(min + i * binSize).toFixed(2)}`),
      values: bins,
    }
  }

  // Sample insights for the demo
  const sampleInsights = [
    "The energy levels of the quantum harmonic oscillator are equally spaced, unlike classical systems.",
    "The ground state energy is non-zero, demonstrating the quantum mechanical zero-point energy.",
    "The probability distribution shows characteristic nodes and anti-nodes of the quantum wavefunction.",
  ]

  // Parameter configurations for the customization panel
  const parameterConfigs = [
    {
      id: "frequency",
      label: "Frequency (ω)",
      type: "slider" as const,
      defaultValue: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      unit: "Hz",
    },
    {
      id: "amplitude",
      label: "Amplitude",
      type: "slider" as const,
      defaultValue: 1.0,
      min: 0.1,
      max: 2.0,
      step: 0.1,
    },
    {
      id: "mass",
      label: "Mass",
      type: "slider" as const,
      defaultValue: 1.0,
      min: 0.1,
      max: 10.0,
      step: 0.1,
      unit: "m",
    },
    {
      id: "numLevels",
      label: "Energy Levels",
      type: "slider" as const,
      defaultValue: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    {
      id: "showProbability",
      label: "Show Probability Distribution",
      type: "switch" as const,
      defaultValue: true,
    },
    {
      id: "colorScheme",
      label: "Color Scheme",
      type: "color" as const,
      defaultValue: "#00BFFF",
    },
  ]

  // Run simulation on initial load
  useEffect(() => {
    runSimulation()
  }, [])

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Simulation Components</h1>
        <p className="text-gray-400">
          Interactive components for scientific simulations with LaTeX support, branded visualizations, and dynamic
          insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-800 bg-gray-950">
            <CardHeader className="bg-gray-900 border-b border-gray-800 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white">{simulationData.title}</CardTitle>
                <Button onClick={runSimulation} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="visualization" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-gray-900 rounded-none border-b border-gray-800 p-0">
                  <TabsTrigger
                    value="visualization"
                    className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
                  >
                    Visualization
                  </TabsTrigger>
                  <TabsTrigger
                    value="histogram"
                    className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
                  >
                    Histogram
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
                  >
                    Data
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visualization" className="p-0 m-0">
                  <div className="p-4">
                    <div className="aspect-[16/9] bg-gray-900 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        {isLoading ? (
                          <div className="flex flex-col items-center">
                            <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                            <p>Simulating...</p>
                          </div>
                        ) : (
                          <div className="w-full h-full p-4">
                            {/* This would be a proper visualization in a real app */}
                            <svg width="100%" height="100%" viewBox="0 0 800 400">
                              <path
                                d={`M 0,200 ${results.x.map((x, i) => `L ${x * 80},${200 - results.y[i] * 100}`).join(" ")}`}
                                fill="none"
                                stroke="#00BFFF"
                                strokeWidth="3"
                              />
                              <line x1="0" y1="200" x2="800" y2="200" stroke="#666" strokeWidth="1" />
                              <line x1="0" y1="0" x2="0" y2="400" stroke="#666" strokeWidth="1" />
                              <text x="780" y="220" fill="#999" fontSize="12">
                                x
                              </text>
                              <text x="10" y="20" fill="#999" fontSize="12">
                                ψ(x)
                              </text>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="histogram" className="p-0 m-0">
                  <div className="p-4">
                    <BrandedHistogram
                      title="Probability Distribution"
                      description="Histogram of probability values from the quantum simulation"
                      data={getHistogramData()}
                      height={300}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="data" className="p-0 m-0">
                  <div className="p-4 overflow-auto max-h-[400px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-900">
                          <th className="p-2 text-left text-gray-300 border-b border-gray-800">Index</th>
                          <th className="p-2 text-left text-gray-300 border-b border-gray-800">x</th>
                          <th className="p-2 text-left text-gray-300 border-b border-gray-800">ψ(x)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.x.slice(0, 20).map((x, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-gray-950" : "bg-gray-900"}>
                            <td className="p-2 text-gray-300 border-b border-gray-800">{i}</td>
                            <td className="p-2 text-gray-300 border-b border-gray-800">{x.toFixed(2)}</td>
                            <td className="p-2 text-gray-300 border-b border-gray-800">{results.y[i].toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {results.x.length > 20 && (
                      <div className="text-center py-2 text-gray-400 text-sm">
                        Showing 20 of {results.x.length} rows
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <MathTheoryPanel
            title="Quantum Harmonic Oscillator Theory"
            description="The quantum harmonic oscillator is one of the most important model systems in quantum mechanics."
            equations={[
              {
                id: "hamiltonian",
                label: "Hamiltonian",
                equation: "\\hat{H} = \\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2\\hat{x}^2",
                explanation:
                  "The Hamiltonian operator represents the total energy of the system, with kinetic and potential energy terms.",
              },
              {
                id: "energy",
                label: "Energy Levels",
                equation: "E_n = \\hbar\\omega\\left(n + \\frac{1}{2}\\right)",
                explanation: "The energy levels are quantized and equally spaced, with a non-zero ground state energy.",
              },
              {
                id: "wavefunction",
                label: "Wavefunction",
                equation:
                  "\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-\\frac{m\\omega x^2}{2\\hbar}}H_n\\left(\\sqrt{\\frac{m\\omega}{\\hbar}}x\\right)",
                explanation: "The wavefunction for the nth energy eigenstate, where H_n are the Hermite polynomials.",
              },
              {
                id: "probability",
                label: "Probability Density",
                equation: "P(x) = |\\psi_n(x)|^2",
                explanation:
                  "The probability density of finding the particle at position x when in the nth energy eigenstate.",
              },
            ]}
            className="mb-6"
          />

          <div className="flex justify-end">
            <NotebookExport
              title={simulationData.title}
              description={simulationData.description}
              simulationData={simulationData}
              parameters={parameters}
              results={results}
              equations={simulationData.equations}
              insights={sampleInsights}
            />
          </div>
        </div>

        <div className="space-y-6">
          <CustomizationPanel
            parameters={parameterConfigs}
            onParameterChange={handleParameterChange}
            onReset={() => {
              const defaultParams = parameterConfigs.reduce(
                (acc, param) => {
                  acc[param.id] = param.defaultValue
                  return acc
                },
                {} as Record<string, any>,
              )

              setParameters(defaultParams)
            }}
            onSave={() => {
              // In a real app, this would save the configuration
              alert("Configuration saved!")
            }}
          />

          <DynamicInsights
            data={{
              title: simulationData.title,
              results: results,
            }}
            onRefresh={() => runSimulation()}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
