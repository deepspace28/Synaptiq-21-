"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendIcon, AlertCircle, Lightbulb } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
  isError?: boolean
}

function isValidString(value: any): boolean {
  return value !== null && value !== undefined && typeof value === "string"
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hello! I'm the demo version of Synaptiq, a specialized AI assistant for scientific research. I can provide basic information about quantum mechanics, physics, mathematics, and other scientific domains. Try asking me a scientific question!",
  },
]

// Scientific mock responses with LaTeX
const mockResponses: Record<string, string> = {
  quantum: `
## Quantum Mechanics

Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles.

The Schrödinger equation is central to quantum mechanics:

\`\`\`math
i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)
\`\`\`

Where:
- \$$ \\Psi(\\mathbf{r}, t) \$$ is the wave function
- \$$ i \$$ is the imaginary unit
- \$$ \\hbar \$$ is the reduced Planck constant
- \$$ \\hat{H} \$$ is the Hamiltonian operator

The uncertainty principle, formulated by Werner Heisenberg, states that:

\`\`\`math
\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}
\`\`\`

This means we cannot simultaneously know both the position and momentum of a particle with arbitrary precision.
  `,
  relativity: `
## Theory of Relativity

Einstein's theory of relativity consists of two physical theories: special relativity and general relativity.

The famous mass-energy equivalence formula:

\`\`\`math
E = mc^2
\`\`\`

Where:
- \$$ E \$$ is energy
- \$$ m \$$ is mass
- \$$ c \$$ is the speed of light in vacuum

In general relativity, the Einstein field equations are:

\`\`\`math
G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}
\`\`\`

These equations describe how the curvature of spacetime is related to the energy and momentum of matter and radiation.
  `,
  mathematics: `
## Mathematics

Mathematics is the study of numbers, quantity, structure, space, and change.

The quadratic formula for solving equations of the form \$$ ax^2 + bx + c = 0 \$$ is:

\`\`\`math
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\`\`\`

Euler's identity is considered one of the most beautiful equations in mathematics:

\`\`\`math
e^{i\\pi} + 1 = 0
\`\`\`

It connects five fundamental mathematical constants:
- \$$ e \$$ (Euler's number)
- \$$ i \$$ (imaginary unit)
- \$$ \\pi \$$ (pi)
- \$$ 1 \$$ (multiplicative identity)
- \$$ 0 \$$ (additive identity)
  `,
  thermodynamics: `
## Thermodynamics

Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, entropy, and physical properties of matter.

The first law of thermodynamics states that energy cannot be created or destroyed, only transformed:

\`\`\`math
\\Delta U = Q - W
\`\`\`

Where:
- \$$ \\Delta U \$$ is the change in internal energy
- \$$ Q \$$ is the heat added to the system
- \$$ W \$$ is the work done by the system

The entropy formula is:

\`\`\`math
S = k_B \\ln W
\`\`\`

Where:
- \$$ S \$$ is entropy
- \$$ k_B \$$ is Boltzmann's constant
- \$$ W \$$ is the number of microstates
  `,
  complex: `
## Complex Mathematical Equations

Here are some complex mathematical equations that demonstrate the LaTeX rendering capabilities:

### Maxwell's Equations

Maxwell's equations in differential form:

\`\`\`math
\\begin{align}
\\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\cdot \\vec{B} &= 0 \\\\
\\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\
\\nabla \\times \\vec{B} &= \\mu_0\\vec{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\vec{E}}{\\partial t}
\\end{align}
\`\`\`

### Navier-Stokes Equation

The Navier-Stokes equation for incompressible flow:

\`\`\`math
\\rho \\left( \\frac{\\partial \\vec{v}}{\\partial t} + \\vec{v} \\cdot \\nabla \\vec{v} \\right) = -\\nabla p + \\mu \\nabla^2 \\vec{v} + \\vec{f}
\`\`\`

### Fourier Transform

The Fourier transform pair:

\`\`\`math
\\begin{align}
F(\\omega) &= \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} \\, dt \\\\
f(t) &= \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) e^{i\\omega t} \\, d\\omega
\\end{align}
\`\`\`

### Cauchy-Riemann Equations

For a complex function $f(z) = u(x,y) + iv(x,y)$ to be analytic, it must satisfy:

\`\`\`math
\\begin{align}
\\frac{\\partial u}{\\partial x} &= \\frac{\\partial v}{\\partial y} \\\\
\\frac{\\partial u}{\\partial y} &= -\\frac{\\partial v}{\\partial x}
\\end{align}
\`\`\`

### Einstein Field Equations

The full Einstein field equations with cosmological constant:

\`\`\`math
R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}
\`\`\`

### Schrödinger Equation

The time-dependent Schrödinger equation:

\`\`\`math
i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left [ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right ] \\Psi(\\mathbf{r},t)
\`\`\`

### Dirac Equation

The Dirac equation in covariant form:

\`\`\`math
(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0
\`\`\`

Where $\\gamma^\\mu$ are the Dirac gamma matrices.
  `,
}

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!isValidString(input) || !input.trim() || isLoading) return

    // Clear any previous errors
    setError(null)

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a mock response based on keywords in the user's message
      let responseContent = "I'm not sure how to respond to that. Could you ask me a scientific question?"

      const lowerCaseInput = input.toLowerCase()

      if (
        lowerCaseInput.includes("quantum") ||
        lowerCaseInput.includes("particle") ||
        lowerCaseInput.includes("wave")
      ) {
        responseContent = mockResponses.quantum
      } else if (
        lowerCaseInput.includes("relativity") ||
        lowerCaseInput.includes("einstein") ||
        lowerCaseInput.includes("spacetime")
      ) {
        responseContent = mockResponses.relativity
      } else if (
        lowerCaseInput.includes("math") ||
        lowerCaseInput.includes("equation") ||
        lowerCaseInput.includes("formula")
      ) {
        responseContent = mockResponses.mathematics
      } else if (
        lowerCaseInput.includes("thermo") ||
        lowerCaseInput.includes("heat") ||
        lowerCaseInput.includes("energy")
      ) {
        responseContent = mockResponses.thermodynamics
      } else if (
        lowerCaseInput.includes("complex") ||
        lowerCaseInput.includes("advanced") ||
        lowerCaseInput.includes("test latex")
      ) {
        responseContent = mockResponses.complex
      }

      // Add the assistant's response
      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error fetching response:", error)

      // Add an error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])

      // Set the error state
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showComplexEquations = () => {
    setInput("Show me complex equations")
    handleSend()
  }

  return (
    <Card className="border border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Synaptiq Demo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}. Please try again or refresh the page.</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.isError
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask a scientific question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !isValidString(input) || !input.trim()}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={showComplexEquations} disabled={isLoading}>
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show complex LaTeX equations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
