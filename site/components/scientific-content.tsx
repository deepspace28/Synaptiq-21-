"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { type ScientificResponse, generateScientificContent } from "@/lib/scientific-engine"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ScientificContentProps {
  prompt: string
  initialData?: ScientificResponse
}

export function ScientificContent({ prompt, initialData }: ScientificContentProps) {
  const [data, setData] = useState<ScientificResponse | null>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData && prompt) {
      fetchData()
    }
  }, [prompt, initialData])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await generateScientificContent(prompt)
      setData(response)
    } catch (err) {
      setError("Failed to generate scientific content. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generating Scientific Content</CardTitle>
          <CardDescription>Please wait while we analyze your query...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Data</CardTitle>
          <CardDescription>No scientific content available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Please try a different query.</p>
        </CardContent>
      </Card>
    )
  }

  // Ensure all properties have default values
  const safeData = {
    title: data.title || "Scientific Analysis",
    summary: data.summary || "No summary available.",
    equations: Array.isArray(data.equations) ? data.equations : [],
    visualization: {
      type: data.visualization?.type || "chart",
      data: data.visualization?.data || { type: "line", x: [0, 1, 2, 3, 4, 5], y: [0, 1, 4, 9, 16, 25] },
    },
    insights: Array.isArray(data.insights) ? data.insights : [],
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{safeData.title}</CardTitle>
        <CardDescription>Scientific Analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground">{safeData.summary}</p>
        </div>

        {safeData.equations.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Key Equations</h3>
            <div className="space-y-2">
              {safeData.equations.map((equation, index) => (
                <div key={index} className="p-3 bg-muted rounded-md overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: `$$${equation}$$` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2">Visualization</h3>
          {safeData.visualization.type === "chart" &&
            safeData.visualization.data &&
            Array.isArray(safeData.visualization.data.x) &&
            Array.isArray(safeData.visualization.data.y) && (
              <div className="h-64 w-full bg-muted rounded-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={safeData.visualization.data.x.map((x, i) => ({
                      x,
                      y: safeData.visualization.data.y[i] || 0,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          {safeData.visualization.type === "table" &&
            safeData.visualization.data &&
            Array.isArray(safeData.visualization.data.headers) &&
            Array.isArray(safeData.visualization.data.rows) && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {safeData.visualization.data.headers.map((header, i) => (
                        <th key={i} className="border border-muted p-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {safeData.visualization.data.rows.map((row, i) => (
                      <tr key={i}>
                        {Array.isArray(row) &&
                          row.map((cell, j) => (
                            <td key={j} className="border border-muted p-2">
                              {cell}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          {safeData.visualization.type === "image" && safeData.visualization.data && (
            <div className="flex justify-center">
              <img
                src={
                  (safeData.visualization.data.url as string) ||
                  "/placeholder.svg?height=300&width=500&query=scientific visualization"
                }
                alt={safeData.title}
                className="max-h-64 rounded-md"
              />
            </div>
          )}
          {(!safeData.visualization.type ||
            (safeData.visualization.type === "chart" &&
              (!safeData.visualization.data ||
                !Array.isArray(safeData.visualization.data.x) ||
                !Array.isArray(safeData.visualization.data.y)))) && (
            <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">No visualization data available</p>
            </div>
          )}
        </div>

        {safeData.insights.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Key Insights</h3>
            <ul className="list-disc list-inside space-y-1">
              {safeData.insights.map((insight, index) => (
                <li key={index} className="text-muted-foreground">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
