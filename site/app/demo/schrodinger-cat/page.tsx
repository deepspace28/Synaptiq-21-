"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScientificResult } from "@/components/scientific-result"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SchrodingerCatPage() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || "Simulate Schrödinger's cat quantum state"

  const [prompt, setPrompt] = useState(initialPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [advancedSettings, setAdvancedSettings] = useState({
    qubits: 2,
    shots: 1024,
    noiseModel: "none",
    decoherence: false,
    decoherenceRate: 0.01,
    measurementError: 0.0,
    gateError: 0.0,
  })

  useEffect(() => {
    if (initialPrompt) {
      runSimulation(initialPrompt)
    }
  }, [initialPrompt])

  async function runSimulation(simulationPrompt: string, settings = advancedSettings) {
    try {
      setIsLoading(true)
      setError(null)

      // Construct a request that properly incorporates the simulation settings
      const response = await fetch("/api/dynamic-simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: simulationPrompt,
          context: {
            simulationType: "quantum",
            parameters: {
              ...settings,
              // Ensure we're actually running the simulation with real parameters
              previewMode: false,
              executeReal: true,
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error fetching simulation:", err)
      setError(`Failed to run simulation: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      runSimulation(prompt, advancedSettings)
    }
  }

  const handleSettingsChange = (key: string, value: any) => {
    setAdvancedSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const [showWarning, setShowWarning] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-[#282a36]">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-white">
              Schrödinger&apos;s Cat Simulation
            </h1>
            <p className="max-w-[85%] leading-normal text-[#8be9fd] sm:text-lg sm:leading-7 md:text-xl">
              Experience a dynamic quantum simulation of the famous Schrödinger&apos;s cat thought experiment
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <Card className="mb-8 bg-[#44475a] border-[#6272a4] text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quantum Simulation Parameters</span>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 border-[#6272a4]">
                        <Settings2 className="h-4 w-4" />
                        <span className="sr-only">Advanced settings</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-[#282a36] border-[#6272a4] text-white">
                      <SheetHeader>
                        <SheetTitle className="text-white">Advanced Settings</SheetTitle>
                        <SheetDescription className="text-[#f8f8f2] opacity-80">
                          Configure the quantum simulation parameters
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                          <Label htmlFor="qubits">Number of Qubits</Label>
                          <Select
                            value={advancedSettings.qubits.toString()}
                            onValueChange={(value) => handleSettingsChange("qubits", Number.parseInt(value))}
                          >
                            <SelectTrigger className="bg-[#44475a] border-[#6272a4] text-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#44475a] border-[#6272a4] text-white">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} qubit{num > 1 ? "s" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="shots">Number of Shots</Label>
                          <Select
                            value={advancedSettings.shots.toString()}
                            onValueChange={(value) => handleSettingsChange("shots", Number.parseInt(value))}
                          >
                            <SelectTrigger className="bg-[#44475a] border-[#6272a4] text-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#44475a] border-[#6272a4] text-white">
                              {[128, 256, 512, 1024, 2048, 4096].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} shots
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="noiseModel">Noise Model</Label>
                          <Select
                            value={advancedSettings.noiseModel}
                            onValueChange={(value) => handleSettingsChange("noiseModel", value)}
                          >
                            <SelectTrigger className="bg-[#44475a] border-[#6272a4] text-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#44475a] border-[#6272a4] text-white">
                              <SelectItem value="none">None (Ideal)</SelectItem>
                              <SelectItem value="thermal">Thermal</SelectItem>
                              <SelectItem value="depolarizing">Depolarizing</SelectItem>
                              <SelectItem value="amplitude_damping">Amplitude Damping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="decoherence">Simulate Decoherence</Label>
                            <Switch
                              id="decoherence"
                              checked={advancedSettings.decoherence}
                              onCheckedChange={(checked) => handleSettingsChange("decoherence", checked)}
                            />
                          </div>
                        </div>
                        {advancedSettings.decoherence && (
                          <div className="grid gap-2">
                            <Label htmlFor="decoherenceRate">
                              Decoherence Rate: {advancedSettings.decoherenceRate.toFixed(3)}
                            </Label>
                            <Slider
                              id="decoherenceRate"
                              min={0}
                              max={0.1}
                              step={0.001}
                              value={[advancedSettings.decoherenceRate]}
                              onValueChange={([value]) => handleSettingsChange("decoherenceRate", value)}
                              className="py-4"
                            />
                          </div>
                        )}
                        <div className="grid gap-2">
                          <Label htmlFor="measurementError">
                            Measurement Error: {advancedSettings.measurementError.toFixed(3)}
                          </Label>
                          <Slider
                            id="measurementError"
                            min={0}
                            max={0.1}
                            step={0.001}
                            value={[advancedSettings.measurementError]}
                            onValueChange={([value]) => handleSettingsChange("measurementError", value)}
                            className="py-4"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gateError">Gate Error: {advancedSettings.gateError.toFixed(3)}</Label>
                          <Slider
                            id="gateError"
                            min={0}
                            max={0.1}
                            step={0.001}
                            value={[advancedSettings.gateError]}
                            onValueChange={([value]) => handleSettingsChange("gateError", value)}
                            className="py-4"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => runSimulation(prompt, advancedSettings)}
                          className="bg-[#ff79c6] hover:bg-[#ff92d0] text-[#282a36]"
                        >
                          Apply & Run Simulation
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardTitle>
                <CardDescription className="text-[#f8f8f2] opacity-80">
                  Customize your quantum simulation prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="simulation-prompt" className="text-sm font-medium text-[#f8f8f2] block mb-2">
                      Simulation Prompt
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="simulation-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-[#282a36] border-[#6272a4] text-white"
                        placeholder="Describe the quantum system you want to simulate..."
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#ff79c6] hover:bg-[#ff92d0] text-[#282a36]"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                          "Run"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {showWarning && (
              <Alert className="mt-2 bg-amber-100 border-amber-300 text-amber-800">
                <AlertTitle>Real Quantum Simulation</AlertTitle>
                <AlertDescription>
                  This now runs actual quantum simulations using Qiskit. Results are computed dynamically for each
                  request.
                  <Button
                    variant="link"
                    className="p-0 ml-2 text-amber-800 underline"
                    onClick={() => setShowWarning(false)}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <Card className="border border-[#6272a4] bg-[#44475a] text-white">
                <CardHeader>
                  <CardTitle>Running Quantum Simulation</CardTitle>
                  <CardDescription className="text-[#f8f8f2] opacity-80">
                    Computing quantum states and probabilities...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-3/4 bg-[#282a36]" />
                  <Skeleton className="h-4 w-full bg-[#282a36]" />
                  <Skeleton className="h-4 w-5/6 bg-[#282a36]" />
                  <div className="py-2">
                    <Skeleton className="h-64 w-full bg-[#282a36]" />
                  </div>
                  <Skeleton className="h-4 w-2/3 bg-[#282a36]" />
                  <Skeleton className="h-4 w-1/2 bg-[#282a36]" />
                </CardContent>
              </Card>
            ) : error ? (
              <Alert variant="destructive" className="border border-red-800 bg-red-900/20 text-white">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button
                  onClick={() => runSimulation(prompt, advancedSettings)}
                  variant="outline"
                  className="mt-4 bg-red-900/30 hover:bg-red-800/50"
                >
                  Retry
                </Button>
              </Alert>
            ) : result ? (
              <>
                <ScientificResult content={result.rawContent || JSON.stringify(result)} />

                <Accordion type="single" collapsible className="mt-8 bg-[#44475a] rounded-lg border border-[#6272a4]">
                  <AccordionItem value="explanation" className="border-b-[#6272a4]">
                    <AccordionTrigger className="px-4 text-white hover:bg-[#50536a] hover:no-underline">
                      Understanding Schrödinger&apos;s Cat
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-[#f8f8f2]">
                      <p className="mb-4">
                        Schrödinger&apos;s cat is a famous thought experiment devised by physicist Erwin Schrödinger in
                        1935. It illustrates the paradoxical nature of quantum superposition when applied to everyday
                        objects.
                      </p>
                      <p className="mb-4">
                        In the thought experiment, a cat is placed in a sealed box with a radioactive atom, a Geiger
                        counter, and a vial of poison. If the radioactive atom decays, the Geiger counter detects it and
                        triggers the release of the poison, killing the cat. According to quantum mechanics, until the
                        box is opened and the system is observed, the radioactive atom exists in a superposition of
                        decayed and not-decayed states, which means the cat is simultaneously alive and dead.
                      </p>
                      <p>
                        In our quantum simulation, we represent this system using qubits. The state |0⟩ represents the
                        &quot;alive&quot; state, while |1⟩ represents the &quot;dead&quot; state. The superposition is
                        created using quantum gates, and measurement causes the wavefunction to collapse to one of the
                        possible states.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <Card className="border border-[#6272a4] bg-[#44475a] text-white">
                <CardHeader>
                  <CardTitle>Ready to Run Simulation</CardTitle>
                  <CardDescription className="text-[#f8f8f2] opacity-80">
                    Enter a prompt above to start the quantum simulation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#f8f8f2]">Try prompts like:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-[#f8f8f2]">
                    <li>Simulate Schrödinger&apos;s cat in a superposition state</li>
                    <li>Create a quantum circuit for Schrödinger&apos;s cat with 3 qubits</li>
                    <li>Model Schrödinger&apos;s cat with decoherence effects</li>
                    <li>Simulate Schrödinger&apos;s cat with 50% probability of decay</li>
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline" className="border-[#6272a4] text-[#f8f8f2] hover:bg-[#44475a]">
                <Link href="/demo">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Demos
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
