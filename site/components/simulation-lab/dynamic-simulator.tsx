"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DynamicControls } from "./dynamic-controls"
import { DynamicOutput } from "./dynamic-output"
import { generateSimulation } from "@/lib/scientific-engine"
import { enhanceWithGrokInsights } from "@/lib/grok-insights"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function DynamicSimulator({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [simulationData, setSimulationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  useEffect(() => {
    if (prompt) {
      generateSimulation(prompt)
    }
  }, [prompt])

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const handleRunSimulation = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const simulation = await generateSimulation(prompt)
      const enhancedSimulation = await enhanceWithGrokInsights(simulation, prompt)
      setSimulationData(enhancedSimulation)
    } catch (err) {
      setError("Failed to generate simulation. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleParameterChange = (params: any) => {
    setSimulationData((prev: any) => ({ ...prev, parameters: params }))
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output" disabled={!simulationData && !isLoading}>
            Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Scientific Simulation</CardTitle>
              <CardDescription>Enter a prompt to generate a simulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter a simulation prompt..."
                    value={prompt}
                    onChange={handlePromptChange}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleRunSimulation} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Run Simulation"}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : simulationData ? (
            <>
              <DynamicControls simulationData={simulationData} onParameterChange={handleParameterChange} />
              <DynamicOutput result={simulationData} />
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">Run a simulation to see results here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
