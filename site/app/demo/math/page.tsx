"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScientificResult } from "@/components/scientific-result"
import { Skeleton } from "@/components/ui/skeleton"

export default function MathDemoPage({ searchParams }: { searchParams: { prompt?: string } }) {
  const [prompt, setPrompt] = useState(searchParams.prompt || "Prove the Pythagorean theorem step by step")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.prompt) {
      setPrompt(searchParams.prompt)
      generateMathProof(searchParams.prompt)
    } else if (prompt) {
      generateMathProof(prompt)
    }
  }, [searchParams.prompt])

  async function generateMathProof(mathPrompt: string) {
    try {
      setIsLoading(true)
      setError(null)

      // Call the API to get mathematical proof
      const response = await fetch("/api/simulations/math", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: mathPrompt,
          backend: "sympy",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      console.error("Error generating mathematical proof:", err)
      setError("Failed to generate mathematical proof. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      generateMathProof(prompt)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#282a36]">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-white">
              Mathematical Proof Generator
            </h1>
            <p className="max-w-[85%] leading-normal text-[#8be9fd] sm:text-lg sm:leading-7 md:text-xl">
              Generate step-by-step mathematical proofs with SymPy and advanced reasoning.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <Card className="mb-8 bg-[#44475a] border-[#6272a4] text-white">
              <CardHeader>
                <CardTitle>Mathematical Query</CardTitle>
                <CardDescription className="text-[#f8f8f2] opacity-80">
                  Enter a mathematical problem or theorem to prove
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="math-prompt" className="text-sm font-medium text-[#f8f8f2] block mb-2">
                      Mathematical Query
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="math-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-[#282a36] border-[#6272a4] text-white"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#50fa7b] hover:bg-[#69ff96] text-[#282a36]"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card className="border border-[#6272a4] bg-[#44475a] text-white">
                <CardHeader>
                  <CardTitle>Generating Mathematical Proof</CardTitle>
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
                  <CardDescription>Failed to generate mathematical proof</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <Button
                    onClick={() => generateMathProof(prompt)}
                    variant="outline"
                    className="mt-4 bg-red-900/30 hover:bg-red-800/50"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : result ? (
              <ScientificResult content={result} />
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
