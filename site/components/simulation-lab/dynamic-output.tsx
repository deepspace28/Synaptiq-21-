"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, AlertTriangle } from "lucide-react"

interface DynamicOutputProps {
  result: any
}

export function DynamicOutput({ result }: DynamicOutputProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("visualization")

  // Handle missing or malformed data
  const title = result?.title || "Simulation Result"
  const description = result?.description || "No description available"
  const circuit = result?.circuit || "No circuit diagram available"
  const codeSnippet = result?.codeSnippet || "# No code available"
  const error = result?.error || null

  // Handle missing measurement data
  const measurementData = result?.measurements || {
    headers: ["State", "Probability"],
    rows: [["N/A", "N/A"]],
  }

  // Handle missing insights
  const insights = result?.insights || ["No insights available"]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const blob = new Blob([codeSnippet], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.py`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="circuit">Circuit</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Measurement Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        {measurementData.headers.map((header: string, i: number) => (
                          <th
                            key={i}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {measurementData.rows.map((row: string[], rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: string, cellIndex: number) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Simple bar chart visualization */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Probability Distribution</h3>
                  <div className="h-64 flex items-end space-x-1">
                    {measurementData.rows.map((row: string[], i: number) => {
                      const state = row[0]
                      const prob = Number.parseFloat(row[1]) || 0
                      return (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                            style={{ height: `${Math.max(prob * 100, 1)}%` }}
                          ></div>
                          <span className="text-xs mt-1 truncate w-full text-center">{state}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Insights</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {insights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="circuit" className="pt-4">
              <div className="font-mono text-sm whitespace-pre overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded">
                {circuit}
              </div>
            </TabsContent>

            <TabsContent value="code" className="pt-4">
              <div className="flex justify-end space-x-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeSnippet)}
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCode} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="font-mono text-sm whitespace-pre overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded">
                {codeSnippet}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
