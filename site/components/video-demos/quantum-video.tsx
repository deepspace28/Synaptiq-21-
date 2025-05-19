"use client"

import { useEffect, useRef, useState } from "react"
import { VideoDemo } from "./video-demo"

export function QuantumVideoDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for better quality
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
    let particles: Particle[] = []
    let wavePoints: WavePoint[] = []
    let detectorHits: DetectorHit[] = []
    let interferencePattern: number[] = []

    // Particle class for better animation
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      opacity: number
      phase: number
      energy: number
      isEntangled: boolean
      entangledParticle: Particle | null
      waveMode: boolean
      probabilityCloud: { x: number; y: number; intensity: number }[]

      constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.vx = 0.5 + Math.random() * 0.5
        this.vy = (Math.random() - 0.5) * 0.2
        this.size = size
        this.color = Math.random() > 0.3 ? "#8be9fd" : "#bd93f9"
        this.opacity = 0.7 + Math.random() * 0.3
        this.phase = Math.random() * Math.PI * 2
        this.energy = 0.5 + Math.random() * 0.5
        this.isEntangled = Math.random() > 0.7
        this.entangledParticle = null
        this.waveMode = false
        this.probabilityCloud = []

        // Generate probability cloud
        for (let i = 0; i < 5; i++) {
          this.probabilityCloud.push({
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
            intensity: Math.random(),
          })
        }
      }

      update(t: number, barrierX: number, slits: { y: number; height: number }[], width: number, height: number) {
        // Move particle
        this.x += this.vx * this.energy
        this.y += this.vy

        // Quantum tunneling effect (rare chance to pass through barrier outside of slits)
        const tunneling = Math.random() > 0.997

        // Check if particle hits barrier
        if (this.x >= barrierX && this.x <= barrierX + 10) {
          let passedThroughSlit = false

          // Check if particle passes through any slit
          for (const slit of slits) {
            if (this.y >= slit.y && this.y <= slit.y + slit.height) {
              passedThroughSlit = true

              // Switch to wave mode after passing through slit
              this.waveMode = true

              // Add wave-like behavior after passing through slit
              this.vy = Math.sin(t * 0.1 + this.phase) * 0.5

              // Slightly adjust velocity based on position in slit
              const slitCenter = slit.y + slit.height / 2
              const distFromCenter = (this.y - slitCenter) / (slit.height / 2)
              this.vy += distFromCenter * 0.2

              // Create wave points at slit
              if (Math.random() > 0.7) {
                wavePoints.push(new WavePoint(this.x, this.y, this.color, t))
              }

              break
            }
          }

          // If particle didn't pass through a slit, reset it (unless tunneling)
          if (!passedThroughSlit && !tunneling) {
            this.reset(barrierX, width, height)
          }
        }

        // Create wave points for particles in wave mode
        if (this.waveMode && Math.random() > 0.9) {
          wavePoints.push(new WavePoint(this.x, this.y, this.color, t))
        }

        // Check if particle hits detector screen
        const screenX = width * 0.8
        if (this.x >= screenX && this.x <= screenX + 5) {
          // Record hit on detector
          detectorHits.push(new DetectorHit(screenX, this.y, this.color))

          // Update interference pattern
          const yBin = Math.floor((this.y / height) * 100)
          if (yBin >= 0 && yBin < 100) {
            if (!interferencePattern[yBin]) interferencePattern[yBin] = 0
            interferencePattern[yBin] += 1
          }

          this.reset(barrierX, width, height)
        }

        // Reset if particle goes off screen
        if (this.x > width || this.y < 0 || this.y > height) {
          this.reset(barrierX, width, height)
        }

        // Update entangled particle if exists
        if (this.isEntangled && this.entangledParticle) {
          // Quantum entanglement effect - opposite movement
          this.entangledParticle.vy = -this.vy
        }
      }

      reset(barrierX: number, width: number, height: number) {
        this.x = Math.random() * (barrierX * 0.8)
        this.y = height * (0.3 + Math.random() * 0.4)
        this.vx = 0.5 + Math.random() * 0.5
        this.vy = (Math.random() - 0.5) * 0.2
        this.phase = Math.random() * Math.PI * 2
        this.energy = 0.5 + Math.random() * 0.5
        this.waveMode = false

        // Generate new probability cloud
        this.probabilityCloud = []
        for (let i = 0; i < 5; i++) {
          this.probabilityCloud.push({
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
            intensity: Math.random(),
          })
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        if (this.waveMode) {
          // Draw as a wave packet when in wave mode
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
          gradient.addColorStop(0, `rgba(139, 233, 253, ${this.opacity * 0.7})`)
          gradient.addColorStop(1, "rgba(139, 233, 253, 0)")

          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // Draw probability cloud
          for (const point of this.probabilityCloud) {
            ctx.beginPath()
            ctx.arc(this.x + point.x, this.y + point.y, this.size * point.intensity, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(189, 147, 249, ${point.intensity * 0.3})`
            ctx.fill()
          }
        } else {
          // Draw as a particle when not in wave mode
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)
          gradient.addColorStop(0, `rgba(139, 233, 253, ${this.opacity})`)
          gradient.addColorStop(1, "rgba(139, 233, 253, 0)")

          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // Add glow effect
          ctx.shadowColor = this.color
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.fill()
        }

        // Draw entanglement line if particle is entangled
        if (this.isEntangled && this.entangledParticle) {
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.lineTo(this.entangledParticle.x, this.entangledParticle.y)
          ctx.strokeStyle = "rgba(255, 121, 198, 0.2)"
          ctx.setLineDash([2, 3])
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.setLineDash([])
        }

        ctx.restore()
      }
    }

    // Wave point class for visualizing wave propagation
    class WavePoint {
      x: number
      y: number
      radius: number
      maxRadius: number
      color: string
      opacity: number
      birthTime: number

      constructor(x: number, y: number, color: string, birthTime: number) {
        this.x = x
        this.y = y
        this.radius = 1
        this.maxRadius = 30 + Math.random() * 20
        this.color = color
        this.opacity = 0.7
        this.birthTime = birthTime
      }

      update(currentTime: number) {
        const age = currentTime - this.birthTime
        this.radius = Math.min(this.maxRadius, age * 5)
        this.opacity = Math.max(0, 0.7 - (this.radius / this.maxRadius) * 0.7)

        return this.opacity > 0.05
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
        gradient.addColorStop(0, `rgba(139, 233, 253, 0)`)
        gradient.addColorStop(0.5, `rgba(139, 233, 253, ${this.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(139, 233, 253, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.restore()
      }
    }

    // Detector hit class for visualizing hits on the detector screen
    class DetectorHit {
      x: number
      y: number
      color: string
      opacity: number
      size: number

      constructor(x: number, y: number, color: string) {
        this.x = x
        this.y = y
        this.color = color
        this.opacity = 1
        this.size = 2 + Math.random() * 2
      }

      update() {
        this.opacity -= 0.005
        return this.opacity > 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 121, 198, ${this.opacity})`
        ctx.fill()

        ctx.restore()
      }
    }

    // Initialize particles
    const initParticles = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const barrierX = width * 0.3
      particles = []
      wavePoints = []
      detectorHits = []
      interferencePattern = new Array(100).fill(0)

      for (let i = 0; i < 50; i++) {
        const x = Math.random() * (barrierX * 0.8)
        const y = height * (0.3 + Math.random() * 0.4)
        const size = 2 + Math.random() * 3
        particles.push(new Particle(x, y, size))
      }

      // Create entangled pairs
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isEntangled && !particles[i].entangledParticle) {
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[j].isEntangled && !particles[j].entangledParticle) {
              particles[i].entangledParticle = particles[j]
              particles[j].entangledParticle = particles[i]
              break
            }
          }
        }
      }

      setIsInitialized(true)
    }

    // Draw double-slit experiment with improved visuals
    const drawDoubleSlit = (t: number) => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear canvas with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
      bgGradient.addColorStop(0, "#1d1e26")
      bgGradient.addColorStop(1, "#21222c")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Draw grid lines for scientific look
      ctx.strokeStyle = "rgba(68, 71, 90, 0.3)"
      ctx.lineWidth = 0.5

      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw barrier
      const barrierX = width * 0.3
      const barrierGradient = ctx.createLinearGradient(barrierX, 0, barrierX + 10, 0)
      barrierGradient.addColorStop(0, "#44475a")
      barrierGradient.addColorStop(0.5, "#6272a4")
      barrierGradient.addColorStop(1, "#44475a")

      ctx.fillStyle = barrierGradient
      ctx.fillRect(barrierX, 0, 10, height)

      // Draw slits with glow effect
      const centerY = height / 2
      const slitHeight = 30
      const slitDistance = 60

      const slits = [
        { y: centerY - slitDistance - slitHeight / 2, height: slitHeight },
        { y: centerY + slitDistance - slitHeight / 2, height: slitHeight },
      ]

      // Draw slit glow
      ctx.save()
      ctx.shadowColor = "#8be9fd"
      ctx.shadowBlur = 15

      for (const slit of slits) {
        ctx.clearRect(barrierX, slit.y, 10, slit.height)

        // Add glow to slits
        ctx.fillStyle = "rgba(139, 233, 253, 0.1)"
        ctx.fillRect(barrierX - 5, slit.y - 5, 20, slit.height + 10)
      }
      ctx.restore()

      // Draw detector screen with gradient
      const screenX = width * 0.8
      const screenGradient = ctx.createLinearGradient(screenX, 0, screenX + 5, 0)
      screenGradient.addColorStop(0, "#282a36")
      screenGradient.addColorStop(1, "#44475a")

      ctx.fillStyle = screenGradient
      ctx.fillRect(screenX, 0, 5, height)

      // Draw wave points
      wavePoints = wavePoints.filter((point) => {
        const isAlive = point.update(t)
        if (isAlive) point.draw(ctx)
        return isAlive
      })

      // Draw detector hits
      detectorHits = detectorHits.filter((hit) => {
        const isAlive = hit.update()
        if (isAlive) hit.draw(ctx)
        return isAlive
      })

      // Create wave pattern on screen with improved visuals
      ctx.save()
      for (let y = 0; y < height; y++) {
        const distFromCenter = Math.abs(y - centerY)

        // Create interference pattern
        const intensity1 = Math.cos(distFromCenter * 0.05 + t * 0.1) ** 2
        const intensity2 = Math.cos(distFromCenter * 0.05 + Math.PI + t * 0.1) ** 2
        const interference = (intensity1 + intensity2) * Math.exp(-distFromCenter * 0.005)

        // Add time-based variation
        const timeVariation = 0.7 + 0.3 * Math.sin(t * 0.05)

        // Add recorded hits to the pattern
        const yBin = Math.floor((y / height) * 100)
        const recordedIntensity = yBin >= 0 && yBin < 100 ? interferencePattern[yBin] / 50 : 0

        // Create gradient for each line
        const lineGradient = ctx.createLinearGradient(screenX, y, screenX + 5, y)
        lineGradient.addColorStop(0, `rgba(139, 233, 253, ${(interference * timeVariation + recordedIntensity) * 0.7})`)
        lineGradient.addColorStop(1, `rgba(189, 147, 249, ${(interference * timeVariation + recordedIntensity) * 0.5})`)

        ctx.fillStyle = lineGradient
        ctx.fillRect(screenX, y, 5, 1)

        // Add glow for high intensity areas
        if (interference > 0.7 || recordedIntensity > 0.5) {
          ctx.shadowColor = "#8be9fd"
          ctx.shadowBlur = 5
          ctx.fillRect(screenX, y, 5, 1)
        }
      }
      ctx.restore()

      // Update and draw particles
      for (const particle of particles) {
        particle.update(t, barrierX, slits, width, height)
        particle.draw(ctx)
      }

      // Draw labels with better styling
      ctx.save()
      ctx.font = '14px "SF Mono", SFMono-Regular, ui-monospace, monospace'

      // Source label
      ctx.fillStyle = "#ff79c6"
      ctx.fillText("Electron Source", width * 0.1 - 40, height * 0.3 - 10)

      // Barrier label
      ctx.fillStyle = "#6272a4"
      ctx.fillText("Double-Slit Barrier", barrierX - 70, height - 20)

      // Screen label
      ctx.fillStyle = "#8be9fd"
      ctx.fillText("Detector Screen", screenX - 60, height - 20)

      // Draw title with shadow for emphasis
      ctx.shadowColor = "rgba(255, 121, 198, 0.5)"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#ff79c6"
      ctx.font = 'bold 18px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Quantum Double-Slit Experiment", width * 0.5 - 150, 30)

      // Draw subtitle
      ctx.shadowBlur = 0
      ctx.fillStyle = "#bd93f9"
      ctx.font = '14px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Wave-Particle Duality Visualization", width * 0.5 - 130, 55)
      ctx.restore()

      // Draw quantum equations
      ctx.save()
      ctx.fillStyle = "rgba(139, 233, 253, 0.7)"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Ψ(x,t) = A·sin(kx-ωt)", width * 0.1, height * 0.1)
      ctx.fillText("λ = h/p", width * 0.1, height * 0.1 + 20)
      ctx.fillText("ΔxΔp ≥ ℏ/2", width * 0.1, height * 0.1 + 40)
      ctx.restore()

      // Draw entanglement info
      ctx.save()
      ctx.fillStyle = "rgba(255, 121, 198, 0.7)"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Quantum Entanglement", width * 0.7, height * 0.1)
      ctx.fillText("Bell's Inequality: |S| ≤ 2", width * 0.7, height * 0.1 + 20)
      ctx.restore()
    }

    // Animation loop with timing control for smooth animation
    let lastTime = 0
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Only update time at a controlled rate
      if (deltaTime < 100) {
        // Avoid huge jumps if tab was inactive
        time += deltaTime * 0.001
      }

      drawDoubleSlit(time)
      animationFrame = requestAnimationFrame(animate)
    }

    // Listen for play/pause events
    const handlePlayPause = (event: CustomEvent) => {
      setIsPlaying(event.detail.isPlaying)
    }

    // Listen for reset events
    const handleReset = () => {
      time = 0
      initParticles()
    }

    // Listen for seek events
    const handleSeek = (event: CustomEvent) => {
      const newProgress = event.detail.progress
      setCurrentProgress(newProgress)
      // In a real implementation, we would adjust the simulation time based on progress
    }

    window.addEventListener("videoDemoPlayPause" as any, handlePlayPause)
    window.addEventListener("videoDemoReset" as any, handleReset)
    window.addEventListener("videoDemoSeek" as any, handleSeek)

    // Initialize and start animation
    initParticles()
    animate(0)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("videoDemoPlayPause" as any, handlePlayPause)
      window.removeEventListener("videoDemoReset" as any, handleReset)
      window.removeEventListener("videoDemoSeek" as any, handleSeek)
    }
  }, [])

  return (
    <VideoDemo
      title="Quantum Physics Simulation"
      description="Visualizing quantum phenomena including wave-particle duality, quantum interference, and entanglement"
      animationComponent={
        <div className="w-full h-full relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#21222c]">
              <div className="text-[#8be9fd] animate-pulse">Initializing quantum simulation...</div>
            </div>
          )}
        </div>
      }
    />
  )
}
