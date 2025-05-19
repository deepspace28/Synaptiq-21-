"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, BookOpen, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface MathTheoryPanelProps {
  title: string
  description?: string
  equations: {
    id: string
    label?: string
    equation: string
    explanation?: string
  }[]
  className?: string
}

export function MathTheoryPanel({ title, description, equations, className }: MathTheoryPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeEquation, setActiveEquation] = useState<string | null>(equations[0]?.id || null)

  // Function to handle KaTeX rendering
  const renderEquation = (equation: string) => {
    return `$$${equation}$$`
  }

  return (
    <Card className={cn("border border-gray-800 bg-gray-950 overflow-hidden", className)}>
      <CardHeader className="bg-gray-900 border-b border-gray-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-0">
          {description && <div className="p-4 border-b border-gray-800 text-gray-300 text-sm">{description}</div>}

          <div className="flex flex-col md:flex-row">
            {/* Equation selector */}
            <div className="w-full md:w-1/4 border-r border-gray-800">
              <div className="py-2">
                {equations.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => setActiveEquation(eq.id)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      activeEquation === eq.id
                        ? "bg-gray-800 text-cyan-400 border-l-2 border-cyan-400"
                        : "text-gray-400 hover:bg-gray-900 hover:text-gray-200",
                    )}
                  >
                    {eq.label || `Equation ${eq.id}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Equation display */}
            <div className="w-full md:w-3/4 p-4">
              {equations
                .filter((eq) => eq.id === activeEquation)
                .map((eq) => (
                  <div key={eq.id} className="space-y-4">
                    <div className="py-4 px-6 bg-gray-900 rounded-md overflow-x-auto">
                      <div className="text-center py-2 text-white font-serif text-lg">
                        {renderEquation(eq.equation)}
                      </div>
                    </div>

                    {eq.explanation && (
                      <div className="text-gray-300 text-sm">
                        <h4 className="font-medium text-white mb-2">Explanation:</h4>
                        <p>{eq.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end p-3 border-t border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export Derivation
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
