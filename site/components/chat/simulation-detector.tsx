"use client"

import { useEffect, useState } from "react"
import { QuantumSimulator } from "@/components/scientific-simulations/quantum-simulator"
import { DerivationEngine } from "@/components/scientific-simulations/derivation-engine"
import { PhysicsLab } from "@/components/scientific-simulations/physics-lab"
import { ArticleCreator } from "@/components/scientific-simulations/article-creator"
import { PDFAnalyzer } from "@/components/scientific-simulations/pdf-analyzer"
import { ResearchPaperGenerator } from "@/components/scientific-simulations/research-paper-generator"

type SimulationType = "quantum" | "derivation" | "physics" | "article" | "pdf" | "paper" | null

interface SimulationDetectorProps {
  message: string
}

export function SimulationDetector({ message }: SimulationDetectorProps) {
  const [simulationType, setSimulationType] = useState<SimulationType>(null)

  // Detect simulation requests in the user's message
  useEffect(() => {
    const lowerMessage = message.toLowerCase()

    if (
      lowerMessage.includes("quantum") ||
      lowerMessage.includes("double slit") ||
      lowerMessage.includes("entanglement") ||
      lowerMessage.includes("superposition")
    ) {
      setSimulationType("quantum")
    } else if (
      lowerMessage.includes("deriv") ||
      lowerMessage.includes("equation") ||
      lowerMessage.includes("math") ||
      lowerMessage.includes("prove") ||
      lowerMessage.includes("formula")
    ) {
      setSimulationType("derivation")
    } else if (
      lowerMessage.includes("physics") ||
      lowerMessage.includes("mechanics") ||
      lowerMessage.includes("experiment") ||
      lowerMessage.includes("pendul") ||
      lowerMessage.includes("projectile") ||
      lowerMessage.includes("wave") ||
      lowerMessage.includes("simulation")
    ) {
      setSimulationType("physics")
    } else if (
      (lowerMessage.includes("article") || lowerMessage.includes("blog")) &&
      (lowerMessage.includes("generat") || lowerMessage.includes("write") || lowerMessage.includes("create"))
    ) {
      setSimulationType("article")
    } else if (
      lowerMessage.includes("pdf") &&
      (lowerMessage.includes("analy") || lowerMessage.includes("extract") || lowerMessage.includes("read"))
    ) {
      setSimulationType("pdf")
    } else if (
      (lowerMessage.includes("paper") || lowerMessage.includes("research")) &&
      (lowerMessage.includes("generat") || lowerMessage.includes("write") || lowerMessage.includes("create"))
    ) {
      setSimulationType("paper")
    } else {
      setSimulationType(null)
    }
  }, [message])

  // Render appropriate simulation component based on detection
  if (!simulationType) return null

  return (
    <div className="mt-6 border-t border-[#44475a] pt-6">
      <div className="text-sm text-[#8be9fd] mb-3">Interactive Scientific Simulation</div>

      {simulationType === "quantum" && <QuantumSimulator />}
      {simulationType === "derivation" && <DerivationEngine />}
      {simulationType === "physics" && <PhysicsLab />}
      {simulationType === "article" && <ArticleCreator />}
      {simulationType === "pdf" && <PDFAnalyzer />}
      {simulationType === "paper" && <ResearchPaperGenerator />}
    </div>
  )
}
