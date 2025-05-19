"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface StateVector {
  label: string
  amplitude: { real: number; imag: number }
  probability: number
}

interface QuantumStateVisualizationProps {
  stateVector: StateVector[]
  className?: string
}

export function QuantumStateVisualization({ stateVector, className }: QuantumStateVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeView, setActiveView] = useState<"bloch" | "bar" | "circle">("bar")

  // Format complex number
  const formatComplex = (complex: { real: number; imag: number }) => {
    const real = complex.real.toFixed(2)
    const imag = complex.imag.toFixed(2)

    if (complex.imag >= 0) {
      return `${real} + ${imag}i`
    } else {
      return `${real} - ${Math.abs(complex.imag).toFixed(2)}i`
    }
  }

  // Draw the bar chart visualization
  useEffect(() => {
    if (!canvasRef.current || activeView !== "bar") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const barWidth = width / stateVector.length / 1.5
    const spacing = (width - barWidth * stateVector.length) / (stateVector.length + 1)

    // Draw bars
    stateVector.forEach((state, i) => {
      const x = spacing + i * (barWidth + spacing)
      const barHeight = state.probability * (height - 60)

      // Draw probability bar
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
      gradient.addColorStop(0, "rgba(0, 191, 255, 0.8)")
      gradient.addColorStop(1, "rgba(0, 107, 143, 0.8)")

      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)

      // Draw border
      ctx.strokeStyle = "rgba(0, 191, 255, 1)"
      ctx.lineWidth = 1
      ctx.strokeRect(x, height - barHeight, barWidth, barHeight)

      // Draw label
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(state.label, x + barWidth / 2, height - 10)

      // Draw probability
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "10px Arial"
      ctx.fillText(`${(state.probability * 100).toFixed(1)}%`, x + barWidth / 2, height - barHeight - 5)
    })
  }, [stateVector, activeView])

  // Draw the circle (phase) visualization
  useEffect(() => {
    if (!canvasRef.current || activeView !== "circle") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 30

    // Draw coordinate system
    ctx.strokeStyle = "rgba(100, 100, 100, 0.5)"
    ctx.lineWidth = 1

    // Draw x and y axes
    ctx.beginPath()
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.stroke()

    // Draw circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"
    ctx.stroke()

    // Draw state vectors
    stateVector.forEach((state, i) => {
      const amplitude = state.amplitude
      const magnitude = Math.sqrt(amplitude.real ** 2 + amplitude.imag ** 2)
      const phase = Math.atan2(amplitude.imag, amplitude.real)

      // Calculate position
      const x = centerX + radius * magnitude * Math.cos(phase)
      const y = centerY - radius * magnitude * Math.sin(phase)

      // Draw vector
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = `hsl(${(i * 360) / stateVector.length}, 80%, 60%)`
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = `hsl(${(i * 360) / stateVector.length}, 80%, 60%)`
      ctx.fill()

      // Draw label
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(state.label, x + 10 * Math.cos(phase), y - 10 * Math.sin(phase))
    })
  }, [stateVector, activeView])

  // Draw the Bloch sphere visualization (simplified)
  useEffect(() => {
    if (!canvasRef.current || activeView !== "bloch") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 30

    // Draw Bloch sphere (simplified as a circle)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw axes
    // Z-axis (vertical)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.strokeStyle = "rgba(0, 191, 255, 0.8)"
    ctx.lineWidth = 1
    ctx.stroke()

    // X-axis (horizontal)
    ctx.beginPath()
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.strokeStyle = "rgba(255, 100, 100, 0.8)"
    ctx.lineWidth = 1
    ctx.stroke()

    // Y-axis (coming out of the screen, represented as a circle)
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(100, 255, 100, 0.8)"
    ctx.fill()

    // Label axes
    ctx.fillStyle = "rgba(0, 191, 255, 0.8)"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("|0⟩", centerX, centerY - radius - 10)
    ctx.fillText("|1⟩", centerX, centerY + radius + 15)

    ctx.fillStyle = "rgba(255, 100, 100, 0.8)"
    ctx.fillText("|+⟩", centerX + radius + 15, centerY)
    ctx.fillText("|-⟩", centerX - radius - 15, centerY)

    // If we have a simple qubit state (2 states), draw it on the Bloch sphere
    if (stateVector.length === 2) {
      const alpha = stateVector[0].amplitude
      const beta = stateVector[1].amplitude

      // Calculate theta and phi from amplitudes (simplified)
      const theta = 2 * Math.acos(Math.sqrt(stateVector[0].probability))
      const phi = Math.atan2(beta.imag, beta.real) - Math.atan2(alpha.imag, alpha.real)

      // Convert to Cartesian coordinates
      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(theta)

      // Draw the state vector (simplified 2D projection)
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + x, centerY - z) // Note: y-axis is inverted in canvas
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw the point
      ctx.beginPath()
      ctx.arc(centerX + x, centerY - z, 5, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()

      // Draw the state label
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("ψ", centerX + x + 10, centerY - z - 10)
    } else {
      // For multi-qubit states, show a message
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bloch sphere visualization", centerX, centerY - 20)
      ctx.fillText("only available for single-qubit states", centerX, centerY + 20)
    }
  }, [stateVector, activeView])

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="bar" value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="circle">Phase Circle</TabsTrigger>
          <TabsTrigger value="bloch">Bloch Sphere</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-4">
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <canvas ref={canvasRef} width={500} height={300} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circle" className="mt-4">
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <canvas ref={canvasRef} width={500} height={300} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bloch" className="mt-4">
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <canvas ref={canvasRef} width={500} height={300} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-white mb-2">State Vector</h3>
            <div className="space-y-2">
              {stateVector.map((state, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="font-mono">|{state.label}⟩:</div>
                  <div className="font-mono text-cyan-400">{formatComplex(state.amplitude)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-800 bg-gray-900">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-white mb-2">Probabilities</h3>
            <div className="space-y-2">
              {stateVector.map((state, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="font-mono">P(|{state.label}⟩):</div>
                  <div className="font-mono text-cyan-400">{(state.probability * 100).toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
