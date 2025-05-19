"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ScientificResult } from "@/components/scientific-result"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Beaker, Atom, Calculator, RefreshCw } from "lucide-react"

export default function LabPage({ searchParams }: { searchParams: { prompt?: string } }) {
  const [activeTab, setActiveTab] = useState("quantum")
  const [prompt, setPrompt] = useState(searchParams.prompt || "")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Simulation parameters
  const [qubits, setQubits] = useState(2)
  const [iterations, setIterations] = useState(1000)
  const [temperature, setTemperature] = useState(298) // Room temperature in Kelvin
  const [precision, setPrecision] = useState(6) // Decimal places for calculations

  useEffect(() => {
    if (searchParams.prompt) {
      setPrompt(searchParams.prompt)
      runSimulation(searchParams.prompt)
    }
  }, [searchParams.prompt])

  async function runSimulation(simulationPrompt: string) {
    try {
      setIsLoading(true)
      setError(null)

      // Determine which API endpoint to use based on the active tab
      let endpoint = "/api/simulations/quantum"
      let params = {}

      if (activeTab === "quantum") {
        endpoint = "/api/simulations/quantum"
        params = { qubits, iterations }
      } else if (activeTab === "physics") {
        endpoint = "/api/simulations/physics"
        params = { temperature, precision }
      } else if (activeTab === "math") {
        endpoint = "/api/simulations/math"
        params = { precision }
      }

      // Call the API to get simulation results
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: simulationPrompt,
          params,
          realtime: true, // Flag to indicate this is a real-time simulation
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      console.error("Error running simulation:", err)
      setError("Failed to run simulation. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      runSimulation(prompt)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-black">
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-white">
              Synaptiq Scientific Laboratory
            </h1>
            <p className="max-w-[85%] leading-normal text-gray-400 sm:text-lg sm:leading-7 md:text-xl">
              Run real-time scientific simulations across quantum physics, mathematics, and more.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <Tabs defaultValue="quantum" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-gray-800 border border-gray-700">
                <TabsTrigger value="quantum" className="data-[state=active]:bg-blue-600">
                  <Atom className="h-4 w-4 mr-2" />
                  Quantum
                </TabsTrigger>
                <TabsTrigger value="physics" className="data-[state=active]:bg-blue-600">
                  <Beaker className="h-4 w-4 mr-2" />
                  Physics
                </TabsTrigger>
                <TabsTrigger value="math" className="data-[state=active]:bg-blue-600">
                  <Calculator className="h-4 w-4 mr-2" />
                  Math
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quantum">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Quantum Simulation Laboratory</CardTitle>
                    <CardDescription className="text-gray-400">
                      Run real-time quantum simulations with adjustable parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a quantum simulation prompt..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          <Search className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Number of Qubits: {qubits}</label>
                          <Slider
                            value={[qubits]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(value) => setQubits(value[0])}
                            className="bg-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Iterations: {iterations}</label>
                          <Slider
                            value={[iterations]}
                            min={100}
                            max={10000}
                            step={100}
                            onValueChange={(value) => setIterations(value[0])}
                            className="bg-gray-800"
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="physics">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Physics Simulation Laboratory</CardTitle>
                    <CardDescription className="text-gray-400">
                      Run real-time physics simulations with adjustable parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a physics simulation prompt..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          <Search className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Temperature (K): {temperature}</label>
                          <Slider
                            value={[temperature]}
                            min={0}
                            max={1000}
                            step={1}
                            onValueChange={(value) => setTemperature(value[0])}
                            className="bg-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Precision: {precision}</label>
                          <Slider
                            value={[precision]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(value) => setPrecision(value[0])}
                            className="bg-gray-800"
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="math">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Mathematical Computation Laboratory</CardTitle>
                    <CardDescription className="text-gray-400">
                      Run real-time mathematical computations with adjustable parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a mathematical computation prompt..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          <Search className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Precision: {precision}</label>
                        <Slider
                          value={[precision]}
                          min={1}
                          max={15}
                          step={1}
                          onValueChange={(value) => setPrecision(value[0])}
                          className="bg-gray-800"
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              {isLoading ? (
                <Card className="border border-gray-800 bg-gray-900 text-white">
                  <CardHeader>
                    <CardTitle>Running Simulation</CardTitle>
                    <CardDescription>Processing your request...</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-5/6 bg-gray-800" />
                    <div className="py-2">
                      <Skeleton className="h-64 w-full bg-gray-800" />
                    </div>
                    <Skeleton className="h-4 w-2/3 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="border border-red-800 bg-red-900/20 text-white">
                  <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Failed to run simulation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{error}</p>
                    <Button
                      onClick={() => runSimulation(prompt)}
                      variant="outline"
                      className="mt-4 bg-red-900/30 hover:bg-red-800/50"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : result ? (
                <div>
                  <div className="flex justify-end mb-2">
                    <Button
                      onClick={() => runSimulation(prompt)}
                      variant="outline"
                      size="sm"
                      className="text-gray-300 border-gray-700 hover:bg-gray-800"
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Refresh Simulation
                    </Button>
                  </div>
                  <ScientificResult content={result} />
                </div>
              ) : (
                <Card className="border border-gray-800 bg-gray-900 text-white">
                  <CardHeader>
                    <CardTitle>Scientific Laboratory</CardTitle>
                    <CardDescription>Enter a simulation prompt to begin</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Beaker className="h-16 w-16 mb-4 text-gray-600" />
                    <p className="text-gray-400">Enter a scientific simulation prompt above to get started.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try "Simulate quantum entanglement" or "Calculate black hole entropy"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
