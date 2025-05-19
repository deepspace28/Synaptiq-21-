"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  type: "primary" | "trend" | "anomaly" | "suggestion"
  title: string
  description: string
  confidence?: number
}

interface DynamicInsightsProps {
  data: any
  title?: string
  className?: string
  onRefresh?: () => void
  isLoading?: boolean
}

export function DynamicInsights({
  data,
  title = "Analysis Insights",
  className,
  onRefresh,
  isLoading = false,
}: DynamicInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  // Generate insights based on data
  useEffect(() => {
    if (!data) return

    // This would typically call an API or use a more sophisticated algorithm
    // For demo purposes, we'll generate some sample insights
    const generatedInsights = generateInsightsFromData(data)
    setInsights(generatedInsights)
  }, [data])

  // Function to generate insights from data
  // In a real implementation, this would be much more sophisticated
  const generateInsightsFromData = (data: any): Insight[] => {
    const sampleInsights: Insight[] = []

    // Check if we have results data
    if (data.results) {
      // Primary insight about the overall pattern
      sampleInsights.push({
        id: "primary-1",
        type: "primary",
        title: "Quantum State Distribution",
        description:
          "The quantum state distribution shows a clear preference for certain states, indicating the system is behaving as expected under the applied operations.",
        confidence: 0.92,
      })

      // Look for trends in the data
      if (Array.isArray(data.results.x) && Array.isArray(data.results.y)) {
        const increasing = data.results.y.slice(1).every((val: number, i: number) => val >= data.results.y[i])
        const decreasing = data.results.y.slice(1).every((val: number, i: number) => val <= data.results.y[i])

        if (increasing) {
          sampleInsights.push({
            id: "trend-1",
            type: "trend",
            title: "Increasing Trend Detected",
            description: "The data shows a consistent increasing trend, suggesting a cumulative effect in the system.",
            confidence: 0.85,
          })
        } else if (decreasing) {
          sampleInsights.push({
            id: "trend-2",
            type: "trend",
            title: "Decreasing Trend Detected",
            description: "The data shows a consistent decreasing trend, suggesting a decay or dissipation effect.",
            confidence: 0.83,
          })
        }
      }

      // Look for anomalies (simplified)
      if (Array.isArray(data.results.y)) {
        const mean = data.results.y.reduce((sum: number, val: number) => sum + val, 0) / data.results.y.length
        const outliers = data.results.y.filter((val: number) => Math.abs(val - mean) > mean * 0.5)

        if (outliers.length > 0) {
          sampleInsights.push({
            id: "anomaly-1",
            type: "anomaly",
            title: "Potential Anomalies Detected",
            description: `Detected ${outliers.length} potential anomalies in the data that deviate significantly from the mean value.`,
            confidence: 0.78,
          })
        }
      }
    }

    // Add suggestions based on the simulation type
    if (data.title) {
      if (data.title.toLowerCase().includes("quantum")) {
        sampleInsights.push({
          id: "suggestion-1",
          type: "suggestion",
          title: "Try Different Quantum Gates",
          description:
            "Experiment with different quantum gate configurations to observe how they affect the final state distribution.",
          confidence: 0.88,
        })
      } else if (data.title.toLowerCase().includes("wave")) {
        sampleInsights.push({
          id: "suggestion-2",
          type: "suggestion",
          title: "Adjust Boundary Conditions",
          description: "Modifying the boundary conditions could reveal interesting wave interference patterns.",
          confidence: 0.86,
        })
      }
    }

    // If we couldn't generate any insights, add a default one
    if (sampleInsights.length === 0) {
      sampleInsights.push({
        id: "default-1",
        type: "primary",
        title: "Initial Analysis",
        description:
          "The data appears to follow expected patterns. Try adjusting parameters to observe changes in the system behavior.",
        confidence: 0.7,
      })
    }

    return sampleInsights
  }

  // Filter insights based on active tab
  const filteredInsights = activeTab === "all" ? insights : insights.filter((insight) => insight.type === activeTab)

  // Icon mapping for insight types
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "primary":
        return <Lightbulb className="h-5 w-5 text-cyan-400" />
      case "trend":
        return <TrendingUp className="h-5 w-5 text-emerald-400" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />
      case "suggestion":
        return <Sparkles className="h-5 w-5 text-purple-400" />
      default:
        return <Lightbulb className="h-5 w-5 text-cyan-400" />
    }
  }

  // Background color mapping for insight types
  const getInsightBackground = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-cyan-950/30 border-cyan-900/50"
      case "trend":
        return "bg-emerald-950/30 border-emerald-900/50"
      case "anomaly":
        return "bg-amber-950/30 border-amber-900/50"
      case "suggestion":
        return "bg-purple-950/30 border-purple-900/50"
      default:
        return "bg-gray-900 border-gray-800"
    }
  }

  return (
    <Card className={cn("border border-gray-800 bg-gray-950", className)}>
      <CardHeader className="bg-gray-900 border-b border-gray-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-1">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-900 rounded-none border-b border-gray-800 p-0">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="primary"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
            >
              Primary
            </TabsTrigger>
            <TabsTrigger
              value="trend"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
            >
              Trends
            </TabsTrigger>
            <TabsTrigger
              value="anomaly"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
            >
              Anomalies
            </TabsTrigger>
            <TabsTrigger
              value="suggestion"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
            >
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="p-0 m-0">
            <div className="p-4 space-y-3">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight) => (
                  <div key={insight.id} className={cn("p-3 rounded-md border", getInsightBackground(insight.type))}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1 flex items-center justify-between">
                          {insight.title}
                          {insight.confidence && (
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-300">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400">No insights available for this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
