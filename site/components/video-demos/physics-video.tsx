"use client"

import { useEffect, useRef, useState } from "react"
import { VideoDemo } from "./video-demo"

export function PhysicsVideoDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

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
    let lastTime = 0
    let isPaused = true

    // Pendulum parameters with more realistic physics
    const pendulumLength = 150
    const gravity = 9.8
    const damping = 0.02
    const fps = 60
    const timeStep = 1 / fps

    // Multiple pendulums for comparison
    const pendulums = [
      {
        angle: Math.PI / 4,
        angularVelocity: 0,
        length: pendulumLength,
        color: "#ff79c6",
        trailColor: "#ff79c6",
        trailPoints: [],
        mass: 1.0,
      },
      {
        angle: Math.PI / 3,
        angularVelocity: 0,
        length: pendulumLength * 0.8,
        color: "#8be9fd",
        trailColor: "#8be9fd",
        trailPoints: [],
        mass: 0.8,
      },
      {
        angle: Math.PI / 6,
        angularVelocity: 0,
        length: pendulumLength * 1.2,
        color: "#bd93f9",
        trailColor: "#bd93f9",
        trailPoints: [],
        mass: 1.2,
      },
    ]

    // Double pendulum system for chaos demonstration
    const doublePendulum = {
      angle1: Math.PI / 4,
      angle2: Math.PI / 2,
      angularVelocity1: 0,
      angularVelocity2: 0,
      length1: pendulumLength * 0.7,
      length2: pendulumLength * 0.7,
      mass1: 1.0,
      mass2: 1.0,
      color1: "#50fa7b",
      color2: "#ffb86c",
      trailPoints: [],
    }

    // Store data points for the graph
    const graphData = []
    const maxGraphPoints = 300

    // Initialize
    const initialize = () => {
      // Reset pendulums
      pendulums[0].angle = Math.PI / 4
      pendulums[0].angularVelocity = 0
      pendulums[0].trailPoints = []

      pendulums[1].angle = Math.PI / 3
      pendulums[1].angularVelocity = 0
      pendulums[1].trailPoints = []

      pendulums[2].angle = Math.PI / 6
      pendulums[2].angularVelocity = 0
      pendulums[2].trailPoints = []

      // Reset double pendulum
      doublePendulum.angle1 = Math.PI / 4
      doublePendulum.angle2 = Math.PI / 2
      doublePendulum.angularVelocity1 = 0
      doublePendulum.angularVelocity2 = 0
      doublePendulum.trailPoints = []

      // Clear graph data
      graphData.length = 0

      setIsInitialized(true)
    }

    // Draw pendulum simulation with improved visuals
    const drawPendulum = (deltaTime: number) => {
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
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Calculate pendulum physics with improved accuracy
      if (!isPaused) {
        pendulums.forEach((pendulum) => {
          // Use Runge-Kutta method for more accurate physics
          const k1 = pendulum.angularVelocity
          const l1 = -(gravity / pendulum.length) * Math.sin(pendulum.angle) - damping * pendulum.angularVelocity

          const k2 = pendulum.angularVelocity + (l1 * timeStep) / 2
          const l2 =
            -(gravity / pendulum.length) * Math.sin(pendulum.angle + (k1 * timeStep) / 2) -
            damping * (pendulum.angularVelocity + (l1 * timeStep) / 2)

          const k3 = pendulum.angularVelocity + (l2 * timeStep) / 2
          const l3 =
            -(gravity / pendulum.length) * Math.sin(pendulum.angle + (k2 * timeStep) / 2) -
            damping * (pendulum.angularVelocity + (l2 * timeStep) / 2)

          const k4 = pendulum.angularVelocity + l3 * timeStep
          const l4 =
            -(gravity / pendulum.length) * Math.sin(pendulum.angle + k3 * timeStep) -
            damping * (pendulum.angularVelocity + l3 * timeStep)

          pendulum.angle += ((k1 + 2 * k2 + 2 * k3 + k4) * timeStep) / 6
          pendulum.angularVelocity += ((l1 + 2 * l2 + 2 * l3 + l4) * timeStep) / 6

          // Store trail points for visualization
          if (time % 2 === 0) {
            // Only store every few frames to avoid too many points
            pendulum.trailPoints.push({
              x: width / 4 + pendulum.length * Math.sin(pendulum.angle),
              y: height / 3 + pendulum.length * Math.cos(pendulum.angle),
            })

            // Limit trail length
            if (pendulum.trailPoints.length > 50) {
              pendulum.trailPoints.shift()
            }
          }
        })

        // Calculate double pendulum physics (chaotic system)
        // These equations model a double pendulum system
        const g = gravity
        const m1 = doublePendulum.mass1
        const m2 = doublePendulum.mass2
        const l1 = doublePendulum.length1
        const l2 = doublePendulum.length2
        const a1 = doublePendulum.angle1
        const a2 = doublePendulum.angle2
        const a1_v = doublePendulum.angularVelocity1
        const a2_v = doublePendulum.angularVelocity2

        // Complex equations for double pendulum motion
        const num1 = -g * (2 * m1 + m2) * Math.sin(a1)
        const num2 = -m2 * g * Math.sin(a1 - 2 * a2)
        const num3 = -2 * Math.sin(a1 - a2) * m2
        const num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2)
        const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))
        const a1_a = (num1 + num2 + num3 * num4) / den

        const num5 = 2 * Math.sin(a1 - a2)
        const num6 = a1_v * a1_v * l1 * (m1 + m2)
        const num7 = g * (m1 + m2) * Math.cos(a1)
        const num8 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2)
        const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))
        const a2_a = (num5 * (num6 + num7 + num8)) / den2

        // Update double pendulum state
        doublePendulum.angularVelocity1 += a1_a * timeStep
        doublePendulum.angularVelocity2 += a2_a * timeStep
        doublePendulum.angle1 += doublePendulum.angularVelocity1 * timeStep
        doublePendulum.angle2 += doublePendulum.angularVelocity2 * timeStep

        // Add damping to double pendulum
        doublePendulum.angularVelocity1 *= 1 - damping * 0.5
        doublePendulum.angularVelocity2 *= 1 - damping * 0.5

        // Store trail points for double pendulum
        if (time % 2 === 0) {
          const x1 = (width * 3) / 4 + doublePendulum.length1 * Math.sin(doublePendulum.angle1)
          const y1 = height / 3 + doublePendulum.length1 * Math.cos(doublePendulum.angle1)
          const x2 = x1 + doublePendulum.length2 * Math.sin(doublePendulum.angle2)
          const y2 = y1 + doublePendulum.length2 * Math.cos(doublePendulum.angle2)

          doublePendulum.trailPoints.push({ x: x2, y: y2 })

          // Limit trail length
          if (doublePendulum.trailPoints.length > 100) {
            doublePendulum.trailPoints.shift()
          }
        }

        // Store graph data
        if (time % 2 === 0) {
          graphData.push({
            time: time,
            angle1: pendulums[0].angle,
            angle2: pendulums[1].angle,
            angle3: pendulums[2].angle,
            doubleAngle1: doublePendulum.angle1,
            doubleAngle2: doublePendulum.angle2,
          })

          if (graphData.length > maxGraphPoints) {
            graphData.shift()
          }
        }
      }

      // Draw section divider
      ctx.beginPath()
      ctx.moveTo(width / 2, 0)
      ctx.lineTo(width / 2, height * 0.6)
      ctx.strokeStyle = "rgba(68, 71, 90, 0.5)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw section labels
      ctx.save()
      ctx.font = 'bold 16px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillStyle = "#bd93f9"
      ctx.fillText("Simple Pendulums", width / 4 - 80, 30)
      ctx.fillText("Double Pendulum (Chaotic)", (width * 3) / 4 - 120, 30)
      ctx.restore()

      // Draw pendulum support structure for simple pendulums
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(width / 4 - 100, height / 3 - 20)
      ctx.lineTo(width / 4 + 100, height / 3 - 20)
      ctx.lineWidth = 6
      ctx.strokeStyle = "#44475a"
      ctx.stroke()

      // Add support details
      ctx.beginPath()
      ctx.moveTo(width / 4 - 80, height / 3 - 40)
      ctx.lineTo(width / 4 + 80, height / 3 - 40)
      ctx.lineTo(width / 4 + 100, height / 3 - 20)
      ctx.lineTo(width / 4 - 100, height / 3 - 20)
      ctx.closePath()
      ctx.fillStyle = "#282a36"
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = "#6272a4"
      ctx.stroke()
      ctx.restore()

      // Draw pendulum support structure for double pendulum
      ctx.save()
      ctx.beginPath()
      ctx.moveTo((width * 3) / 4 - 100, height / 3 - 20)
      ctx.lineTo((width * 3) / 4 + 100, height / 3 - 20)
      ctx.lineWidth = 6
      ctx.strokeStyle = "#44475a"
      ctx.stroke()

      // Add support details
      ctx.beginPath()
      ctx.moveTo((width * 3) / 4 - 80, height / 3 - 40)
      ctx.lineTo((width * 3) / 4 + 80, height / 3 - 40)
      ctx.lineTo((width * 3) / 4 + 100, height / 3 - 20)
      ctx.lineTo((width * 3) / 4 - 100, height / 3 - 20)
      ctx.closePath()
      ctx.fillStyle = "#282a36"
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = "#6272a4"
      ctx.stroke()
      ctx.restore()

      // Draw simple pendulums
      pendulums.forEach((pendulum, index) => {
        const pivotX = width / 4
        const pivotY = height / 3
        const bobX = pivotX + pendulum.length * Math.sin(pendulum.angle)
        const bobY = pivotY + pendulum.length * Math.cos(pendulum.angle)

        // Draw pendulum trail with fading effect
        ctx.save()
        if (pendulum.trailPoints.length > 1) {
          ctx.beginPath()
          ctx.moveTo(pendulum.trailPoints[0].x, pendulum.trailPoints[0].y)

          for (let i = 1; i < pendulum.trailPoints.length; i++) {
            ctx.lineTo(pendulum.trailPoints[i].x, pendulum.trailPoints[i].y)
          }

          ctx.strokeStyle = pendulum.trailColor
          ctx.lineWidth = 2
          ctx.globalAlpha = 0.3
          ctx.stroke()

          // Draw trail points with fading opacity
          pendulum.trailPoints.forEach((point, i) => {
            const opacity = i / pendulum.trailPoints.length
            ctx.beginPath()
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
            ctx.fillStyle = pendulum.trailColor
            ctx.globalAlpha = opacity
            ctx.fill()
          })
        }
        ctx.restore()

        // Draw pendulum string with shadow for depth
        ctx.save()
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 5
        ctx.shadowOffsetY = 2
        ctx.beginPath()
        ctx.moveTo(pivotX, pivotY)
        ctx.lineTo(bobX, bobY)
        ctx.strokeStyle = "#f8f8f2"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()

        // Draw pendulum pivot
        ctx.beginPath()
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#6272a4"
        ctx.fill()
        ctx.strokeStyle = "#f8f8f2"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw pendulum bob with gradient and glow
        ctx.save()
        const gradient = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 20)
        gradient.addColorStop(0, pendulum.color)
        gradient.addColorStop(1, shadeColor(pendulum.color, -30))

        ctx.shadowColor = pendulum.color
        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.arc(bobX, bobY, 15, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Add highlight to bob
        ctx.beginPath()
        ctx.arc(bobX - 5, bobY - 5, 5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()
        ctx.restore()

        // Draw mass label
        ctx.save()
        ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
        ctx.fillStyle = pendulum.color
        ctx.fillText(`m=${pendulum.mass}kg`, bobX + 20, bobY)
        ctx.restore()
      })

      // Draw double pendulum
      const dp = doublePendulum
      const dp_pivotX = (width * 3) / 4
      const dp_pivotY = height / 3
      const dp_bobX1 = dp_pivotX + dp.length1 * Math.sin(dp.angle1)
      const dp_bobY1 = dp_pivotY + dp.length1 * Math.cos(dp.angle1)
      const dp_bobX2 = dp_bobX1 + dp.length2 * Math.sin(dp.angle2)
      const dp_bobY2 = dp_bobY1 + dp.length2 * Math.cos(dp.angle2)

      // Draw double pendulum trail
      ctx.save()
      if (dp.trailPoints.length > 1) {
        // Create gradient for trail
        const trailGradient = ctx.createLinearGradient(
          dp.trailPoints[0].x,
          dp.trailPoints[0].y,
          dp.trailPoints[dp.trailPoints.length - 1].x,
          dp.trailPoints[dp.trailPoints.length - 1].y,
        )
        trailGradient.addColorStop(0, "#ff79c6")
        trailGradient.addColorStop(0.5, "#bd93f9")
        trailGradient.addColorStop(1, "#8be9fd")

        ctx.beginPath()
        ctx.moveTo(dp.trailPoints[0].x, dp.trailPoints[0].y)

        for (let i = 1; i < dp.trailPoints.length; i++) {
          ctx.lineTo(dp.trailPoints[i].x, dp.trailPoints[i].y)
        }

        ctx.strokeStyle = trailGradient
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.stroke()

        // Draw trail points with fading opacity
        dp.trailPoints.forEach((point, i) => {
          const opacity = i / dp.trailPoints.length
          ctx.beginPath()
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${(i / dp.trailPoints.length) * 120 + 240}, 100%, 70%)`
          ctx.globalAlpha = opacity
          ctx.fill()
        })
      }
      ctx.restore()

      // Draw first pendulum rod
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 5
      ctx.shadowOffsetY = 2
      ctx.beginPath()
      ctx.moveTo(dp_pivotX, dp_pivotY)
      ctx.lineTo(dp_bobX1, dp_bobY1)
      ctx.strokeStyle = "#f8f8f2"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Draw second pendulum rod
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 5
      ctx.shadowOffsetY = 2
      ctx.beginPath()
      ctx.moveTo(dp_bobX1, dp_bobY1)
      ctx.lineTo(dp_bobX2, dp_bobY2)
      ctx.strokeStyle = "#f8f8f2"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Draw first pivot
      ctx.beginPath()
      ctx.arc(dp_pivotX, dp_pivotY, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#6272a4"
      ctx.fill()
      ctx.strokeStyle = "#f8f8f2"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw first bob
      ctx.save()
      const gradient1 = ctx.createRadialGradient(dp_bobX1, dp_bobY1, 0, dp_bobX1, dp_bobY1, 15)
      gradient1.addColorStop(0, dp.color1)
      gradient1.addColorStop(1, shadeColor(dp.color1, -30))

      ctx.shadowColor = dp.color1
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(dp_bobX1, dp_bobY1, 12, 0, Math.PI * 2)
      ctx.fillStyle = gradient1
      ctx.fill()

      // Add highlight
      ctx.beginPath()
      ctx.arc(dp_bobX1 - 4, dp_bobY1 - 4, 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()
      ctx.restore()

      // Draw second bob
      ctx.save()
      const gradient2 = ctx.createRadialGradient(dp_bobX2, dp_bobY2, 0, dp_bobX2, dp_bobY2, 15)
      gradient2.addColorStop(0, dp.color2)
      gradient2.addColorStop(1, shadeColor(dp.color2, -30))

      ctx.shadowColor = dp.color2
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(dp_bobX2, dp_bobY2, 12, 0, Math.PI * 2)
      ctx.fillStyle = gradient2
      ctx.fill()

      // Add highlight
      ctx.beginPath()
      ctx.arc(dp_bobX2 - 4, dp_bobY2 - 4, 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()
      ctx.restore()

      // Draw trace graph
      const graphY = height * 0.75
      const graphHeight = 80
      const graphWidth = width - 80

      // Draw graph background
      ctx.fillStyle = "rgba(40, 42, 54, 0.7)"
      ctx.fillRect(40, graphY - graphHeight - 20, graphWidth, graphHeight + 40)

      // Draw graph border
      ctx.strokeStyle = "#44475a"
      ctx.lineWidth = 1
      ctx.strokeRect(40, graphY - graphHeight - 20, graphWidth, graphHeight + 40)

      // Draw graph axes
      ctx.beginPath()
      ctx.moveTo(40, graphY)
      ctx.lineTo(40 + graphWidth, graphY)
      ctx.strokeStyle = "#6272a4"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw horizontal center line (zero angle)
      ctx.beginPath()
      ctx.moveTo(40, graphY - graphHeight / 2)
      ctx.lineTo(40 + graphWidth, graphY - graphHeight / 2)
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#6272a4"
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      // Draw angle waves
      if (graphData.length > 1) {
        // Draw first pendulum angle
        ctx.beginPath()
        const firstPoint = graphData[0]
        const xScale = graphWidth / maxGraphPoints
        const yScale = graphHeight / (Math.PI * 2)

        ctx.moveTo(40, graphY - (firstPoint.angle1 + Math.PI) * yScale)

        graphData.forEach((point, i) => {
          ctx.lineTo(40 + i * xScale, graphY - (point.angle1 + Math.PI) * yScale)
        })

        ctx.strokeStyle = pendulums[0].color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw second pendulum angle
        ctx.beginPath()
        ctx.moveTo(40, graphY - (firstPoint.angle2 + Math.PI) * yScale)

        graphData.forEach((point, i) => {
          ctx.lineTo(40 + i * xScale, graphY - (point.angle2 + Math.PI) * yScale)
        })

        ctx.strokeStyle = pendulums[1].color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw third pendulum angle
        ctx.beginPath()
        ctx.moveTo(40, graphY - (firstPoint.angle3 + Math.PI) * yScale)

        graphData.forEach((point, i) => {
          ctx.lineTo(40 + i * xScale, graphY - (point.angle3 + Math.PI) * yScale)
        })

        ctx.strokeStyle = pendulums[2].color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw double pendulum angles (if there's enough data)
        if (firstPoint.doubleAngle1 !== undefined) {
          // First angle
          ctx.beginPath()
          ctx.moveTo(40, graphY - (firstPoint.doubleAngle1 + Math.PI) * yScale)

          graphData.forEach((point, i) => {
            ctx.lineTo(40 + i * xScale, graphY - (point.doubleAngle1 + Math.PI) * yScale)
          })

          ctx.strokeStyle = doublePendulum.color1
          ctx.lineWidth = 1.5
          ctx.setLineDash([2, 2])
          ctx.stroke()
          ctx.setLineDash([])

          // Second angle
          ctx.beginPath()
          ctx.moveTo(40, graphY - (firstPoint.doubleAngle2 + Math.PI) * yScale)

          graphData.forEach((point, i) => {
            ctx.lineTo(40 + i * xScale, graphY - (point.doubleAngle2 + Math.PI) * yScale)
          })

          ctx.strokeStyle = doublePendulum.color2
          ctx.lineWidth = 1.5
          ctx.setLineDash([2, 2])
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // Draw labels and annotations
      ctx.fillStyle = "#f8f8f2"
      ctx.font = 'bold 18px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Pendulum Motion Simulation", width / 2 - 140, 30)

      ctx.font = '14px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Angle vs. Time", 50, graphY - graphHeight - 30)

      // Draw legend
      ctx.fillStyle = pendulums[0].color
      ctx.fillRect(width - 180, 20, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Pendulum 1", width - 160, 32)

      ctx.fillStyle = pendulums[1].color
      ctx.fillRect(width - 180, 45, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Pendulum 2", width - 160, 57)

      ctx.fillStyle = pendulums[2].color
      ctx.fillRect(width - 180, 70, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Pendulum 3", width - 160, 82)

      ctx.fillStyle = doublePendulum.color1
      ctx.fillRect(width - 180, 95, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Double P1", width - 160, 107)

      ctx.fillStyle = doublePendulum.color2
      ctx.fillRect(width - 180, 120, 15, 15)
      ctx.fillStyle = "#f8f8f2"
      ctx.fillText("Double P2", width - 160, 132)

      // Draw physics equation
      ctx.fillStyle = "#bd93f9"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("d²θ/dt² + (g/L)sin(θ) + b·dθ/dt = 0", 50, 60)

      // Draw chaos theory note
      ctx.fillStyle = "#ff79c6"
      ctx.font = '12px "SF Mono", SFMono-Regular, ui-monospace, monospace'
      ctx.fillText("Double pendulum exhibits chaotic behavior", (width * 3) / 4 - 120, height / 3 + 180)
      ctx.fillText("Small changes in initial conditions lead to", (width * 3) / 4 - 120, height / 3 + 200)
      ctx.fillText("dramatically different trajectories", (width * 3) / 4 - 120, height / 3 + 220)
    }

    // Helper function to shade colors
    function shadeColor(color: string, percent: number) {
      let R = Number.parseInt(color.substring(1, 3), 16)
      let G = Number.parseInt(color.substring(3, 5), 16)
      let B = Number.parseInt(color.substring(5, 7), 16)

      R = Math.floor((R * (100 + percent)) / 100)
      G = Math.floor((G * (100 + percent)) / 100)
      B = Math.floor((B * (100 + percent)) / 100)

      R = R < 255 ? R : 255
      G = G < 255 ? G : 255
      B = B < 255 ? B : 255

      R = R > 0 ? R : 0
      G = G > 0 ? G : 0
      B = B > 0 ? B : 0

      const RR = R.toString(16).padStart(2, "0")
      const GG = G.toString(16).padStart(2, "0")
      const BB = B.toString(16).padStart(2, "0")

      return `#${RR}${GG}${BB}`
    }

    // Animation loop with timing control for smooth animation
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Only update time at a controlled rate
      if (deltaTime < 100) {
        // Avoid huge jumps if tab was inactive
        time += deltaTime * 0.001
      }

      drawPendulum(deltaTime * 0.001)
      animationFrame = requestAnimationFrame(animate)
    }

    // Listen for play/pause events
    const handlePlayPause = (event: CustomEvent) => {
      isPaused = !event.detail.isPlaying
      setIsPlaying(event.detail.isPlaying)
    }

    // Listen for reset events
    const handleReset = () => {
      time = 0
      initialize()
    }

    // Listen for seek events
    const handleSeek = (event: CustomEvent) => {
      // In a real implementation, we would adjust the simulation time based on progress
    }

    window.addEventListener("videoDemoPlayPause" as any, handlePlayPause)
    window.addEventListener("videoDemoReset" as any, handleReset)
    window.addEventListener("videoDemoSeek" as any, handleSeek)

    // Initialize and start animation
    initialize()
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
      title="Physics Laboratory"
      description="Visualizing classical physics phenomena including pendulum motion, wave mechanics, and chaos theory"
      animationComponent={
        <div className="w-full h-full relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#21222c]">
              <div className="text-[#8be9fd] animate-pulse">Initializing physics simulation...</div>
            </div>
          )}
        </div>
      }
    />
  )
}
