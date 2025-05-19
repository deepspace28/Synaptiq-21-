"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { QuantumSimulationReport } from "@/components/quantum-simulation-report"

export default function QuantumDemoPage({ searchParams }: { searchParams: { prompt?: string } }) {
  const [prompt, setPrompt] = useState(searchParams.prompt || "Simulate quantum entanglement between two qubits")
  const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    rawContent?: string
    metadata?: {
      id: string
      backend: string
      timestamp: string
    }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{
    apiResponse?: any
    errorDetails?: string
    requestTime?: string
    responseTime?: string
  }>({})

  useEffect(() => {
    if (searchParams.prompt) {
      setPrompt(searchParams.prompt)
      setSubmittedPrompt(searchParams.prompt)
    }
  }, [searchParams.prompt])

  useEffect(() => {
    if (submittedPrompt) {
      runQuantumSimulation(submittedPrompt)
    }
  }, [submittedPrompt])

  async function runQuantumSimulation(simulationPrompt: string) {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)
      setDebugInfo({
        requestTime: new Date().toISOString(),
      })

      console.log("Running quantum simulation with prompt:", simulationPrompt)

      // Call the API to get quantum simulation results
      const response = await fetch("/api/simulations/quantum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: simulationPrompt,
          backend: "qiskit",
        }),
      })

      const responseTime = new Date().toISOString()

      // First try to get the response as text to avoid JSON parsing errors
      const responseText = await response.text()

      let data: any
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", parseError)

        // Generate a simulation ID
        const simId = `QSIM-${Math.floor(1000 + Math.random() * 9000)}`

        // If parsing fails, just use the raw text with metadata
        setResult({
          rawContent: responseText,
          metadata: {
            id: simId,
            backend: "Synaptiq Engine v0.1 (Qiskit wrapper)",
            timestamp: new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }),
          },
        })
        return
      }

      setDebugInfo((prev) => ({
        ...prev,
        apiResponse: data,
        responseTime,
      }))

      console.log("API response:", data)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${data.error || "Unknown error"}`)
      }

      if (data.error) {
        setDebugInfo((prev) => ({
          ...prev,
          errorDetails: data.details || data.error,
        }))
        throw new Error(data.error)
      }

      // Generate a simulation ID
      const simId = `QSIM-${Math.floor(1000 + Math.random() * 9000)}`

      // Set the result with metadata
      setResult({
        rawContent: data.rawContent || responseText,
        metadata: {
          id: simId,
          backend: "Synaptiq Engine v0.1 (Qiskit wrapper)",
          timestamp: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
          }),
        },
      })
    } catch (err) {
      console.error("Error fetching quantum simulation:", err)
      setError(`${err instanceof Error ? err.message : "Unknown error"}`)
      setDebugInfo((prev) => ({
        ...prev,
        errorDetails: err instanceof Error ? err.stack : String(err),
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setSubmittedPrompt(prompt)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#282a36]">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-white">
              Quantum Physics Simulation
            </h1>
            <p className="max-w-[85%] leading-normal text-[#8be9fd] sm:text-lg sm:leading-7 md:text-xl">
              Experience how Synaptiq simulates quantum systems using Qiskit and advanced AI models.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <Card className="mb-8 bg-[#44475a] border-[#6272a4] text-white">
              <CardHeader>
                <CardTitle>Quantum Simulation Parameters</CardTitle>
                <CardDescription className="text-[#f8f8f2] opacity-80">
                  Customize your quantum simulation
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
                        placeholder="Enter your quantum simulation prompt"
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
                          "Run Simulation"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Debug information */}
            {(error || Object.keys(debugInfo).length > 0) && (
              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem
                  value="debug"
                  className="border border-yellow-500 bg-yellow-900/20 text-white rounded-md"
                >
                  <AccordionTrigger className="px-4 py-2 text-sm font-medium">Debug Information</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 text-xs">
                      {debugInfo.requestTime && (
                        <div>
                          <strong>Request Time:</strong> {debugInfo.requestTime}
                        </div>
                      )}
                      {debugInfo.responseTime && (
                        <div>
                          <strong>Response Time:</strong> {debugInfo.responseTime}
                        </div>
                      )}
                      {debugInfo.errorDetails && (
                        <div>
                          <strong>Error Details:</strong>
                          <pre className="mt-1 p-2 bg-black/30 rounded overflow-auto max-h-40">
                            {debugInfo.errorDetails}
                          </pre>
                        </div>
                      )}
                      {debugInfo.apiResponse && (
                        <div>
                          <strong>API Response:</strong>
                          <pre className="mt-1 p-2 bg-black/30 rounded overflow-auto max-h-40">
                            {JSON.stringify(debugInfo.apiResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {isLoading ? (
              <Card className="border border-[#6272a4] bg-[#44475a] text-white">
                <CardHeader>
                  <CardTitle>Running Quantum Simulation</CardTitle>
                  <CardDescription className="text-[#f8f8f2] opacity-80">This may take a moment...</CardDescription>
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
              <Card className="border border-red-800 bg-red-900/20 text-white">
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>Failed to load quantum simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => setSubmittedPrompt(prompt)}
                    variant="outline"
                    className="mt-4 bg-red-900/30 hover:bg-red-800/50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </CardFooter>
              </Card>
            ) : result?.rawContent ? (
              <QuantumSimulationReport
                simulationData={{
                  prompt: submittedPrompt || "",
                  rawContent: result.rawContent,
                  metadata: result.metadata,
                }}
              />
            ) : submittedPrompt ? (
              <Card className="border border-[#6272a4] bg-[#44475a] text-white">
                <CardHeader>
                  <CardTitle>No Results</CardTitle>
                  <CardDescription className="text-[#f8f8f2] opacity-80">No output to display.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Try a different prompt or check the API connection.</p>
                </CardContent>
              </Card>
            ) : null}

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
