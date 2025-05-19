"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ScientificResultProps {
  summary?: string
  equations?: string[]
  insight?: string
  chart?: {
    title?: string
    labels: string[]
    values: number[]
  }
  timestamp?: Date
}

export function ScientificResult({ summary, equations = [], insight, chart, timestamp }: ScientificResultProps) {
  // Check if we have valid content to display
  if (!summary && equations.length === 0 && !insight && !chart?.labels?.length) {
    return <p className="text-muted-foreground">No valid scientific output to display.</p>
  }

  // Create a simple ASCII bar chart
  const renderAsciiChart = () => {
    if (!chart || !chart.labels || !chart.values || chart.labels.length === 0 || chart.values.length === 0) {
      return null
    }

    const maxValue = Math.max(...chart.values)
    const maxBarLength = 40 // Maximum number of characters for the longest bar

    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
        <h3 className="text-lg font-medium mb-2">{chart.title || "Measurement Results"}</h3>
        <div className="font-mono text-sm">
          {chart.labels.map((label, index) => {
            const value = chart.values[index]
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
            const barLength = Math.round((percentage / 100) * maxBarLength)
            const bar = "█".repeat(barLength)
            const formattedValue = value.toFixed(4)
            const formattedPercentage = percentage.toFixed(1)

            return (
              <div key={index} className="mb-1">
                <div className="flex items-center">
                  <span className="w-16 inline-block">{label}:</span>
                  <span className="text-blue-800 dark:text-blue-300">{bar}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {formattedValue} ({formattedPercentage}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Quantum Simulation Results</CardTitle>
        {timestamp && <p className="text-sm text-gray-500">{timestamp.toLocaleString()}</p>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="equations" disabled={equations.length === 0}>
              Equations
            </TabsTrigger>
            <TabsTrigger value="insight" disabled={!insight}>
              Insight
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p>{summary}</p>
              {chart && renderAsciiChart()}
            </div>
          </TabsContent>

          <TabsContent value="equations" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              {equations.map((equation, index) => (
                <div key={index} className="my-4 p-2 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto">
                  <div className="text-center py-2">$${equation}$$</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insight" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p>{insight}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
