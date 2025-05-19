"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, RefreshCw } from "lucide-react"
import { DynamicSimulator } from "./dynamic-simulator"

interface DynamicLabProps {
  initialPrompt?: string
}

export function DynamicLab({ initialPrompt = "" }: DynamicLabProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [inputPrompt, setInputPrompt] = useState(initialPrompt)
  const [simulation, setSimulation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate simulation when prompt changes
  useEffect(() => {
    if (prompt) {
      generateSimulation(prompt)
    }
  }, [prompt])

  const generateSimulation = async (promptText: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call an API to generate the simulation
      // For now, we'll just simulate a delay and return a mock simulation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock simulation data
      const mockSimulation = {
        title: `Simulation: ${promptText.slice(0, 30)}${promptText.length > 30 ? "..." : ""}`,
        equations: ["E = mc^2", "F = ma", "\\nabla \\cdot E = \\frac{\\rho}{\\epsilon_0}"],
        parameters: [
          {
            name: "mass",
            label: "Mass",
            default: 10,
            min: 1,
            max: 100,
            unit: "kg",
          },
          {
            name: "velocity",
            label: "Initial Velocity",
            default: 5,
            min: 0,
            max: 20,
            unit: "m/s",
          },
          {
            name: "time",
            label: "Simulation Time",
            default: 10,
            min: 1,
            max: 60,
            unit: "s",
          },
        ],
        chartType: "line",
        explanation: `This simulation explores the behavior of ${promptText}. The results show how the system evolves over time based on the initial conditions and parameters.`,
        prompt: promptText, // Store the original prompt
      }

      setSimulation(mockSimulation)
    } catch (err) {
      console.error("Error generating simulation:", err)
      setError("Failed to generate simulation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPrompt.trim()) {
      setPrompt(inputPrompt.trim())
    }
  }

  const handleRetry = () => {
    if (prompt) {
      generateSimulation(prompt)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Synaptiq Dynamic Scientific Lab</CardTitle>
          <CardDescription>Enter a scientific prompt to generate an interactive simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g., Simulate quantum tunneling through a potential barrier"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputPrompt.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button variant="outline" onClick={handleRetry} className="shrink-0">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DynamicSimulator simulation={simulation} isLoading={isLoading} />
    </div>
  )
}
