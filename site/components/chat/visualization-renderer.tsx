"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface VisualizationRendererProps {
  content: string
  type: "chart" | "table"
}

export function VisualizationRenderer({ content, type }: VisualizationRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (type === "chart" && canvasRef.current) {
      // Clean up previous chart
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      try {
        // Try to parse chart data from content
        let chartData
        try {
          // Look for JSON data in the content
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
          if (jsonMatch && jsonMatch[1]) {
            chartData = JSON.parse(jsonMatch[1])
          } else {
            // If no JSON found, try to extract data from text
            chartData = extractChartData(content)
          }
        } catch (error) {
          console.error("Failed to parse chart data:", error)
          chartData = generateFallbackChartData()
        }

        // Create chart
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          chartRef.current = new Chart(ctx, {
            type: chartData.type || "line",
            data: {
              labels: chartData.labels || [],
              datasets: chartData.datasets || [],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                },
                title: {
                  display: !!chartData.title,
                  text: chartData.title || "",
                  color: "rgba(255, 255, 255, 0.8)",
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
                y: {
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            },
          })
        }
      } catch (error) {
        console.error("Error creating chart:", error)
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [content, type])

  // Extract chart data from text content
  const extractChartData = (text: string) => {
    // Default chart data
    const chartData: any = {
      type: "line",
      labels: [],
      datasets: [
        {
          label: "Data",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }

    // Try to extract data from text
    const lines = text.split("\n")
    let inDataSection = false
    let hasExtractedData = false

    for (const line of lines) {
      // Look for table-like data
      if (line.includes("|") && line.includes("-")) {
        inDataSection = true
        continue
      }

      if (inDataSection && line.includes("|")) {
        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell)

        if (cells.length >= 2) {
          // First cell is label, second is data
          chartData.labels.push(cells[0])
          chartData.datasets[0].data.push(Number.parseFloat(cells[1]) || 0)
          hasExtractedData = true
        }
      }
    }

    // If we couldn't extract data, generate some
    if (!hasExtractedData) {
      return generateFallbackChartData()
    }

    return chartData
  }

  // Generate fallback chart data
  const generateFallbackChartData = () => {
    return {
      type: "line",
      title: "Visualization",
      labels: ["A", "B", "C", "D", "E", "F"],
      datasets: [
        {
          label: "Data Series",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  // Render table from content
  const renderTable = () => {
    try {
      const lines = content.split("\n")
      const tableRows: string[][] = []
      let inTable = false
      let headerRow: string[] = []

      for (const line of lines) {
        if (line.includes("|")) {
          const cells = line
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)

          if (cells.length > 0) {
            if (!inTable) {
              // This is the header row
              headerRow = cells
              inTable = true
            } else if (!line.includes("---")) {
              // Skip separator rows with dashes
              tableRows.push(cells)
            }
          }
        }
      }

      if (headerRow.length === 0) {
        return <div className="text-gray-400">No table data found</div>
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {headerRow.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 text-sm text-gray-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } catch (error) {
      console.error("Error rendering table:", error)
      return <div className="text-red-400">Error rendering table</div>
    }
  }

  return (
    <div className="bg-gray-800 rounded-md p-4 my-2">
      {type === "chart" ? (
        <div className="h-64">
          <canvas ref={canvasRef} />
        </div>
      ) : (
        renderTable()
      )}
    </div>
  )
}
