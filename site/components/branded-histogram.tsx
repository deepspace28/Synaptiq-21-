"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Chart from "chart.js/auto"

interface BrandedHistogramProps {
  title: string
  description?: string
  data: {
    labels: string[]
    values: number[]
    colors?: string[]
  }
  className?: string
  showControls?: boolean
  showLegend?: boolean
  showGrid?: boolean
  height?: number
}

export function BrandedHistogram({
  title,
  description,
  data,
  className,
  showControls = true,
  showLegend = true,
  showGrid = true,
  height = 300,
}: BrandedHistogramProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Default Synaptiq brand colors
  const defaultColors = [
    "rgba(0, 210, 255, 0.7)",
    "rgba(0, 180, 255, 0.7)",
    "rgba(0, 150, 255, 0.7)",
    "rgba(0, 120, 255, 0.7)",
    "rgba(0, 90, 255, 0.7)",
  ]

  // Use provided colors or default brand colors
  const barColors = data.colors || defaultColors

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create gradient for bars
    const gradients = data.labels.map((_, index) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      const color = barColors[index % barColors.length]
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color.replace("0.7", "0.2"))
      return gradient
    })

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: title,
            data: data.values,
            backgroundColor: gradients,
            borderColor: barColors.map((color) => color.replace("0.7", "1")),
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showLegend,
            position: "top",
            labels: {
              color: "rgb(200, 200, 200)",
              font: {
                family: "'Inter', sans-serif",
              },
              usePointStyle: true,
              pointStyle: "rect",
            },
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "rgb(255, 255, 255)",
            bodyColor: "rgb(200, 200, 200)",
            borderColor: "rgba(0, 180, 255, 0.3)",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 4,
            titleFont: {
              family: "'Inter', sans-serif",
              weight: "600",
            },
            bodyFont: {
              family: "'Inter', sans-serif",
            },
            displayColors: false,
          },
          // Add Synaptiq watermark
          watermark: {
            image: "/logo.png",
            opacity: 0.1,
            width: 100,
            height: 30,
            alignToChartArea: true,
            position: {
              x: "right",
              y: "bottom",
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: showGrid,
              color: "rgba(100, 100, 100, 0.1)",
            },
            ticks: {
              color: "rgb(180, 180, 180)",
              font: {
                family: "'Inter', sans-serif",
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: showGrid,
              color: "rgba(100, 100, 100, 0.1)",
            },
            ticks: {
              color: "rgb(180, 180, 180)",
              font: {
                family: "'Inter', sans-serif",
              },
              callback: (value) => {
                // Format large numbers with k, M, etc.
                if (Number(value) >= 1000000) {
                  return (Number(value) / 1000000).toFixed(1) + "M"
                } else if (Number(value) >= 1000) {
                  return (Number(value) / 1000).toFixed(1) + "k"
                } else {
                  return value
                }
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, showLegend, showGrid, height, barColors, title])

  const handleDownload = () => {
    if (!chartRef.current) return

    const link = document.createElement("a")
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-histogram.png`
    link.href = chartRef.current.toDataURL("image/png")
    link.click()
  }

  const handleZoomIn = () => {
    if (!chartInstance.current) return

    const scales = chartInstance.current.scales
    const yScale = scales.y

    if (yScale.max && yScale.min) {
      const range = yScale.max - yScale.min
      const newMax = yScale.max - range * 0.2

      chartInstance.current.options.scales = {
        ...chartInstance.current.options.scales,
        y: {
          ...chartInstance.current.options.scales?.y,
          max: newMax,
        },
      }

      chartInstance.current.update()
    }
  }

  const handleZoomOut = () => {
    if (!chartInstance.current) return

    const scales = chartInstance.current.scales
    const yScale = scales.y

    if (yScale.max && yScale.min) {
      const range = yScale.max - yScale.min
      const newMax = yScale.max + range * 0.2

      chartInstance.current.options.scales = {
        ...chartInstance.current.options.scales,
        y: {
          ...chartInstance.current.options.scales?.y,
          max: newMax,
        },
      }

      chartInstance.current.update()
    }
  }

  const handleReset = () => {
    if (!chartInstance.current) return

    chartInstance.current.resetZoom()
    chartInstance.current.update()
  }

  return (
    <Card className={cn("border border-gray-800 bg-gray-950", className)}>
      <CardHeader className="bg-gray-900 border-b border-gray-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
          {showControls && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleReset}
                title="Reset View"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="p-4">
        <div style={{ height: `${height}px` }} className="relative">
          <canvas ref={chartRef} />

          {/* Synaptiq branding watermark */}
          <div className="absolute bottom-2 right-2 opacity-30 pointer-events-none">
            <div className="text-xs text-cyan-500 font-semibold">SYNAPTIQ</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
