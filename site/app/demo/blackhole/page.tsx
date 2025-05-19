"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScientificResult } from "@/components/scientific-result"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlackHoleDemoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState(`
# Black Hole Entropy Analysis

Black holes are regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole.

## Bekenstein-Hawking Entropy Formula

The entropy of a black hole is given by the Bekenstein-Hawking formula:

$$S_{BH} = \\frac{k_B c^3 A}{4G\\hbar}$$

Where:
- $S_{BH}$ is the black hole entropy
- $k_B$ is Boltzmann's constant
- $c$ is the speed of light
- $A$ is the area of the event horizon
- $G$ is Newton's gravitational constant
- $\\hbar$ is the reduced Planck constant

## Information Paradox

The black hole information paradox results from the combination of quantum mechanics and general relativity. It suggests that physical information could permanently disappear in a black hole, allowing many physical states to evolve into the same state.

This is a problem because it violates a core principle of quantum mechanics: that information cannot be created or destroyed, only transformed.

## Hawking Radiation

Hawking radiation is black-body radiation that is predicted to be released by black holes due to quantum effects near the event horizon. It causes black holes to lose mass and eventually evaporate.

The temperature of this radiation is:

$$T = \\frac{\\hbar c^3}{8\\pi G M k_B}$$

Where $M$ is the mass of the black hole.
`)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlackHoleSimulation() {
      try {
        setIsLoading(true)
        setError(null)

        // Call the API to get black hole simulation results
        const response = await fetch("/api/simulations/blackhole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt:
              "Simulate black hole entropy changes during evaporation and calculate the information paradox implications",
          }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setResult(data.result)
      } catch (err) {
        console.error("Error fetching black hole simulation:", err)
        setError("Failed to load black hole simulation. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlackHoleSimulation()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Black Hole Entropy Simulation
            </h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
              Visualize how entropy changes during black hole formation and evolution.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            {isLoading ? (
              <Card className="border border-gray-800 bg-gray-900 text-white">
                <CardHeader>
                  <CardTitle>Black Hole Entropy Simulation</CardTitle>
                  <CardDescription>Calculating entropy changes...</CardDescription>
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
                  <CardDescription>Failed to load black hole simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-4 bg-red-900/30 hover:bg-red-800/50"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ScientificResult content={result} />
            )}
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline">
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
