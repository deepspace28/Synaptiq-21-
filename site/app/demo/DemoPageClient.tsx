"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Atom, Calculator, Beaker, ArrowRight } from "lucide-react"

export default function DemoPageClient() {
  const [quantumPrompt, setQuantumPrompt] = useState("Simulate quantum entanglement between two qubits")
  const [mathPrompt, setMathPrompt] = useState("Prove the Pythagorean theorem step by step")
  const [physicsPrompt, setPhysicsPrompt] = useState("Simulate a double pendulum system with chaotic behavior")

  return (
    <div className="flex min-h-screen flex-col bg-[#282a36]">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] text-white">
              Synaptiq Scientific Simulations
            </h1>
            <p className="max-w-[85%] leading-normal text-[#8be9fd] sm:text-lg sm:leading-7 md:text-xl">
              Experience our advanced scientific simulation capabilities through these interactive virtual laboratories.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <Tabs defaultValue="quantum" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-[#44475a]">
                <TabsTrigger
                  value="quantum"
                  className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white"
                >
                  <Atom className="h-4 w-4 mr-2" />
                  Quantum Physics
                </TabsTrigger>
                <TabsTrigger value="math" className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white">
                  <Calculator className="h-4 w-4 mr-2" />
                  Mathematics
                </TabsTrigger>
                <TabsTrigger
                  value="physics"
                  className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white"
                >
                  <Beaker className="h-4 w-4 mr-2" />
                  Physics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quantum">
                <Card className="bg-[#44475a] border-[#6272a4] text-white">
                  <CardHeader>
                    <CardTitle>Quantum Physics Simulation</CardTitle>
                    <CardDescription className="text-[#f8f8f2] opacity-80">
                      Simulate quantum systems using Qiskit and advanced AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="quantum-prompt" className="text-sm font-medium text-[#f8f8f2] block mb-2">
                          Simulation Prompt
                        </label>
                        <Input
                          id="quantum-prompt"
                          value={quantumPrompt}
                          onChange={(e) => setQuantumPrompt(e.target.value)}
                          className="bg-[#282a36] border-[#6272a4] text-white"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#f8f8f2] mb-2">Example Simulations:</h3>
                        <ul className="space-y-2 text-sm text-[#f8f8f2] opacity-80">
                          <li>• Quantum entanglement between two qubits</li>
                          <li>• Quantum teleportation protocol</li>
                          <li>• Grover's search algorithm</li>
                          <li>• Quantum Fourier transform</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="bg-[#ff79c6] hover:bg-[#ff92d0] text-[#282a36] w-full">
                      <Link href={`/demo/quantum?prompt=${encodeURIComponent(quantumPrompt)}`}>
                        Run Quantum Simulation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="math">
                <Card className="bg-[#44475a] border-[#6272a4] text-white">
                  <CardHeader>
                    <CardTitle>Mathematical Proof Generator</CardTitle>
                    <CardDescription className="text-[#f8f8f2] opacity-80">
                      Generate step-by-step mathematical proofs with SymPy and advanced reasoning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="math-prompt" className="text-sm font-medium text-[#f8f8f2] block mb-2">
                          Mathematical Query
                        </label>
                        <Input
                          id="math-prompt"
                          value={mathPrompt}
                          onChange={(e) => setMathPrompt(e.target.value)}
                          className="bg-[#282a36] border-[#6272a4] text-white"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#f8f8f2] mb-2">Example Queries:</h3>
                        <ul className="space-y-2 text-sm text-[#f8f8f2] opacity-80">
                          <li>• Prove the Pythagorean theorem</li>
                          <li>• Derive the quadratic formula</li>
                          <li>• Solve a system of linear equations</li>
                          <li>• Find the derivative of a complex function</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="bg-[#50fa7b] hover:bg-[#69ff96] text-[#282a36] w-full">
                      <Link href={`/demo/math?prompt=${encodeURIComponent(mathPrompt)}`}>
                        Generate Mathematical Proof
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="physics">
                <Card className="bg-[#44475a] border-[#6272a4] text-white">
                  <CardHeader>
                    <CardTitle>Physics Simulation</CardTitle>
                    <CardDescription className="text-[#f8f8f2] opacity-80">
                      Simulate physical systems with advanced computational models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="physics-prompt" className="text-sm font-medium text-[#f8f8f2] block mb-2">
                          Simulation Prompt
                        </label>
                        <Input
                          id="physics-prompt"
                          value={physicsPrompt}
                          onChange={(e) => setPhysicsPrompt(e.target.value)}
                          className="bg-[#282a36] border-[#6272a4] text-white"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#f8f8f2] mb-2">Example Simulations:</h3>
                        <ul className="space-y-2 text-sm text-[#f8f8f2] opacity-80">
                          <li>• Double pendulum with chaotic behavior</li>
                          <li>• N-body gravitational simulation</li>
                          <li>• Fluid dynamics in a pipe</li>
                          <li>• Wave interference patterns</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="bg-[#bd93f9] hover:bg-[#d1a8ff] text-[#282a36] w-full">
                      <Link href={`/demo/blackhole?prompt=${encodeURIComponent(physicsPrompt)}`}>
                        Run Physics Simulation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
