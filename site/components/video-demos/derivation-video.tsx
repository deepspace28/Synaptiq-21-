"use client"

import { useState, useEffect, useRef } from "react"
import { VideoDemo } from "./video-demo"

export function DerivationVideoDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const derivationSteps = [
    {
      title: "Starting with the wave equation:",
      equation:
        "\\nabla^2 \\Psi(\\mathbf{r}, t) = \\frac{1}{v^2}\\frac{\\partial^2 \\Psi(\\mathbf{r}, t)}{\\partial t^2}",
      explanation: "This is the classical wave equation that describes how waves propagate through space and time.",
      visualHint: "wave",
    },
    {
      title: "For a free particle, the energy-momentum relationship is:",
      equation: "E = \\frac{p^2}{2m}",
      explanation: "This is the non-relativistic energy-momentum relation for a free particle of mass m.",
      visualHint: "particle",
    },
    {
      title: "Using the de Broglie relations:",
      equation: "p = \\hbar k, \\quad E = \\hbar \\omega",
      explanation:
        "These relations connect the particle properties (momentum p, energy E) with wave properties (wave vector k, angular frequency ω).",
      visualHint: "deBroglie",
    },
    {
      title: "We can substitute these into a wave function:",
      equation: "\\Psi(\\mathbf{r}, t) = A e^{i(\\mathbf{k} \\cdot \\mathbf{r} - \\omega t)}",
      explanation: "This is a plane wave solution, representing a particle with definite momentum and energy.",
      visualHint: "wavefunction",
    },
    {
      title: "Taking derivatives:",
      equation:
        "\\frac{\\partial \\Psi}{\\partial t} = -i\\omega \\Psi, \\quad \\frac{\\partial^2 \\Psi}{\\partial t^2} = -\\omega^2 \\Psi, \\quad \\nabla^2 \\Psi = -k^2 \\Psi",
      explanation: "We calculate the derivatives of our wave function to substitute into the wave equation.",
      visualHint: "derivatives",
    },
    {
      title: "Substituting and simplifying:",
      equation: "i\\hbar \\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2 \\Psi",
      explanation:
        "After substitution and algebraic manipulation, we arrive at the time-dependent Schrödinger equation for a free particle.",
      visualHint: "substitution",
    },
    {
      title: "Adding a potential term V(r) gives us the full Schrödinger equation:",
      equation:
        "i\\hbar \\frac{\\partial \\Psi(\\mathbf{r}, t)}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r}) \\right] \\Psi(\\mathbf{r}, t)",
      explanation:
        "This is the complete time-dependent Schrödinger equation, the fundamental equation of quantum mechanics.",
      visualHint: "potential",
    },
  ]

  // Function to advance to the next step
  const advanceStep = () => {
    if (currentStep < derivationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Reset to beginning when reaching the end
      setCurrentStep(0)
      setIsPlaying(false)
    }
  }

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      // Advance to next step every 5 seconds
      timeoutRef.current = setTimeout(advanceStep, 5000)
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, currentStep])

  // Reset animation when component mounts
  useEffect(() => {
    setCurrentStep(0)
    setIsVisible(true)

    return () => {
      setIsVisible(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle external play/pause from VideoDemo component
  useEffect(() => {
    // This function will be called by the VideoDemo component
    const handlePlayPause = (event: CustomEvent) => {
      setIsPlaying(event.detail.isPlaying)
    }

    // Handle reset event
    const handleReset = () => {
      setCurrentStep(0)
      setProgress(0)
    }

    // Handle seek event
    const handleSeek = (event: CustomEvent) => {
      const newProgress = event.detail.progress
      setProgress(newProgress)

      // Calculate which step to show based on progress
      const stepIndex = Math.min(derivationSteps.length - 1, Math.floor((newProgress / 100) * derivationSteps.length))
      setCurrentStep(stepIndex)
    }

    window.addEventListener("videoDemoPlayPause" as any, handlePlayPause)
    window.addEventListener("videoDemoReset" as any, handleReset)
    window.addEventListener("videoDemoSeek" as any, handleSeek)

    return () => {
      window.removeEventListener("videoDemoPlayPause" as any, handlePlayPause)
      window.removeEventListener("videoDemoReset" as any, handleReset)
      window.removeEventListener("videoDemoSeek" as any, handleSeek)
    }
  }, [derivationSteps.length])

  // Canvas visualization effect
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation variables
    let animationFrame: number
    let time = 0

    // Draw visualization based on current step
    const drawVisualization = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Get current visual hint
      const visualHint = derivationSteps[currentStep].visualHint

      // Draw based on visual hint
      switch (visualHint) {
        case "wave":
          drawWave(ctx, width, height, time)
          break
        case "particle":
          drawParticle(ctx, width, height, time)
          break
        case "deBroglie":
          drawDeBroglie(ctx, width, height, time)
          break
        case "wavefunction":
          drawWaveFunction(ctx, width, height, time)
          break
        case "derivatives":
          drawDerivatives(ctx, width, height, time)
          break
        case "substitution":
          drawSubstitution(ctx, width, height, time)
          break
        case "potential":
          drawPotential(ctx, width, height, time)
          break
        default:
          break
      }

      time += 0.02
      animationFrame = requestAnimationFrame(drawVisualization)
    }

    // Draw wave visualization
    function drawWave(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      // Draw wave
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.05 + time) * 30
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = "#8be9fd"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw wave particles
      for (let x = 0; x < width; x += 30) {
        const y = height / 2 + Math.sin(x * 0.05 + time) * 30
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#ff79c6"
        ctx.fill()
      }

      // Draw wave equation
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Wave Equation", width / 2 - 60, 30)

      ctx.restore()
    }

    // Draw particle visualization
    function drawParticle(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      // Draw particle trajectory
      const x = (time * 50) % width
      const y = height / 2

      // Draw trajectory line
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.strokeStyle = "#44475a"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw particle
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10)
      gradient.addColorStop(0, "#ff79c6")
      gradient.addColorStop(1, "#bd93f9")
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw velocity vector
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 20, y)
      ctx.strokeStyle = "#50fa7b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw arrowhead
      ctx.beginPath()
      ctx.moveTo(x + 20, y)
      ctx.lineTo(x + 15, y - 5)
      ctx.lineTo(x + 15, y + 5)
      ctx.closePath()
      ctx.fillStyle = "#50fa7b"
      ctx.fill()

      // Draw energy-momentum label
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Energy-Momentum Relation", width / 2 - 120, 30)

      ctx.restore()
    }

    // Draw de Broglie visualization
    function drawDeBroglie(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      // Draw particle
      const x = (time * 30) % width
      const y = height / 2

      // Draw wave associated with particle
      ctx.beginPath()
      for (let i = 0; i < width; i++) {
        const waveY = y + Math.sin((i - x) * 0.1) * 20
        if (i === 0) {
          ctx.moveTo(i, waveY)
        } else {
          ctx.lineTo(i, waveY)
        }
      }
      ctx.strokeStyle = "rgba(139, 233, 253, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw particle
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#ff79c6"
      ctx.fill()

      // Draw de Broglie label
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("de Broglie Wave-Particle Duality", width / 2 - 150, 30)

      ctx.restore()
    }

    // Draw wave function visualization
    function drawWaveFunction(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      // Draw complex wave function
      const centerY = height / 2

      // Draw real part
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.cos(x * 0.05 - time) * 30
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#8be9fd"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw imaginary part
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.05 - time) * 30
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#ff79c6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw legend
      ctx.fillStyle = "#8be9fd"
      ctx.fillRect(width - 120, 20, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Real part", width - 100, 32)

      ctx.fillStyle = "#ff79c6"
      ctx.fillRect(width - 120, 45, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Imaginary part", width - 100, 57)

      // Draw wave function label
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Complex Wave Function", width / 2 - 100, 30)

      ctx.restore()
    }

    // Draw derivatives visualization
    function drawDerivatives(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      const centerY = height / 2

      // Draw original function
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.05 + time) * 20
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#8be9fd"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw first derivative
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.cos(x * 0.05 + time) * 20
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#ff79c6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw second derivative
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = centerY - Math.sin(x * 0.05 + time) * 20
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#50fa7b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw legend
      ctx.fillStyle = "#8be9fd"
      ctx.fillRect(width - 120, 20, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Function", width - 100, 32)

      ctx.fillStyle = "#ff79c6"
      ctx.fillRect(width - 120, 45, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("First derivative", width - 100, 57)

      ctx.fillStyle = "#50fa7b"
      ctx.fillRect(width - 120, 70, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Second derivative", width - 100, 82)

      // Draw derivatives label
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Derivatives of Wave Function", width / 2 - 130, 30)

      ctx.restore()
    }

    // Draw substitution visualization
    function drawSubstitution(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      // Draw Schrödinger equation formation
      const centerY = height / 2

      // Draw wave packet
      for (let i = 0; i < 5; i++) {
        const amplitude = 30 * Math.exp(-((i - 2) ** 2) / 2)

        ctx.beginPath()
        for (let x = 0; x < width; x++) {
          const frequency = 0.05 + i * 0.01
          const y = centerY + Math.sin(x * frequency + time) * amplitude * Math.exp(-((x - width / 2) ** 2) / 10000)
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        const alpha = 0.7 - i * 0.1
        ctx.strokeStyle = `rgba(139, 233, 253, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw probability density
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const y = height - 50 + Math.exp(-((x - width / 2) ** 2) / 5000) * -40
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = "#ff79c6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill probability density
      ctx.beginPath()
      ctx.moveTo(0, height - 50)
      for (let x = 0; x < width; x++) {
        const y = height - 50 + Math.exp(-((x - width / 2) ** 2) / 5000) * -40
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width, height - 50)
      ctx.closePath()
      ctx.fillStyle = "rgba(255, 121, 198, 0.3)"
      ctx.fill()

      // Draw labels
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Schrödinger Equation (Free Particle)", width / 2 - 160, 30)

      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#8be9fd"
      ctx.fillText("Wave Function", 20, 60)

      ctx.fillStyle = "#ff79c6"
      ctx.fillText("Probability Density |Ψ|²", 20, height - 70)

      ctx.restore()
    }

    // Draw potential visualization
    function drawPotential(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      ctx.save()

      const centerY = height / 2

      // Draw potential well
      ctx.beginPath()
      ctx.moveTo(0, centerY + 80)
      ctx.lineTo(width * 0.3, centerY + 80)
      ctx.lineTo(width * 0.3, centerY - 80)
      ctx.lineTo(width * 0.7, centerY - 80)
      ctx.lineTo(width * 0.7, centerY + 80)
      ctx.lineTo(width, centerY + 80)
      ctx.strokeStyle = "#ff79c6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill potential well
      ctx.fillStyle = "rgba(255, 121, 198, 0.1)"
      ctx.fill()

      // Draw energy levels
      for (let n = 1; n <= 3; n++) {
        const energyY = centerY + 80 - n * 40

        ctx.beginPath()
        ctx.moveTo(width * 0.3, energyY)
        ctx.lineTo(width * 0.7, energyY)
        ctx.strokeStyle = `rgba(80, 250, 123, ${0.5 + n * 0.1})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw wave function for this energy level
        ctx.beginPath()
        for (let x = width * 0.3; x <= width * 0.7; x++) {
          const normalizedX = (x - width * 0.3) / (width * 0.4)
          const amplitude = 30 * Math.sin(n * Math.PI * normalizedX)
          const y = energyY + amplitude

          if (x === width * 0.3) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.strokeStyle = "#8be9fd"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Label energy level
        ctx.fillStyle = "#50fa7b"
        ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
        ctx.fillText(`E${n}`, width * 0.28 - 20, energyY + 5)
      }

      // Draw labels
      ctx.font = '16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Schrödinger Equation with Potential", width / 2 - 160, 30)

      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#ff79c6"
      ctx.fillText("Potential V(x)", 20, 60)

      ctx.fillStyle = "#8be9fd"
      ctx.fillText("Wave Functions Ψn(x)", 20, 80)

      ctx.restore()
    }

    // Start animation
    drawVisualization()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [currentStep])

  return (
    <VideoDemo
      title="Schrödinger Equation Derivation"
      description="Step-by-step mathematical derivation with interactive visualizations"
      animationComponent={
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-y-auto bg-gradient-to-b from-[#282a36] to-[#21222c]">
          <h2 className="text-2xl font-bold text-[#ff79c6] mb-6 text-center">Schrödinger Equation Derivation</h2>

          {/* Progress indicator */}
          <div className="w-full max-w-3xl mb-4 flex items-center justify-center">
            <div className="flex space-x-2">
              {derivationSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-[#ff79c6] scale-125"
                      : index < currentStep
                        ? "bg-[#bd93f9]"
                        : "bg-[#44475a]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Visualization canvas */}
          <div className="w-full max-w-3xl h-[200px] mb-4 bg-[#21222c] rounded-lg overflow-hidden border border-[#44475a]">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="space-y-8 w-full max-w-3xl">
            {derivationSteps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentStep
                    ? "opacity-100 transform translate-y-0 scale-100"
                    : index < currentStep
                      ? "opacity-30 transform -translate-y-8 scale-95"
                      : "opacity-0 transform translate-y-10 scale-95 absolute pointer-events-none"
                }`}
                style={{ position: index !== currentStep && index > currentStep ? "absolute" : "relative" }}
              >
                <p className={`text-[#8be9fd] mb-2 font-semibold ${index === currentStep ? "text-lg" : "text-base"}`}>
                  {step.title}
                </p>
                <div
                  className={`bg-[#282a36] p-6 rounded-lg border ${
                    index === currentStep ? "border-[#ff79c6] shadow-lg shadow-[#ff79c6]/20" : "border-[#44475a]"
                  } text-center transition-all duration-500`}
                >
                  {/* LaTeX equation */}
                  <div
                    className="mb-4 overflow-x-auto py-2"
                    dangerouslySetInnerHTML={{
                      __html: `\\[${step.equation}\\]`,
                    }}
                  />

                  {/* Explanation with fade-in effect */}
                  <p
                    className={`text-[#6272a4] text-sm italic transition-opacity duration-1000 ${
                      index === currentStep ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {step.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
