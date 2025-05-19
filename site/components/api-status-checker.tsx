"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type ApiServiceStatus = "available" | "unavailable" | "unknown" | "unconfigured"

interface ApiService {
  configured: boolean
  status: ApiServiceStatus
  message?: string
}

interface ApiHealthResponse {
  status: "operational" | "degraded" | "error"
  timestamp: string
  environment: string
  services: {
    groq: ApiService
    [key: string]: ApiService
  }
}

export function ApiStatusChecker() {
  const [status, setStatus] = useState<ApiHealthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showDiagnosticDialog, setShowDiagnosticDialog] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null)
  const [isDiagnosing, setIsDiagnosing] = useState(false)

  const checkApiHealth = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`Health check failed with status: ${response.status}`)
        setStatus({
          status: "error",
          timestamp: new Date().toISOString(),
          environment: "unknown",
          services: {
            groq: {
              configured: false,
              status: "unavailable",
              message: `Health endpoint returned ${response.status}`,
            },
          },
        })
        return
      }

      const data = await response.json()
      setStatus(data)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Error checking API health:", error)
      setStatus({
        status: "error",
        timestamp: new Date().toISOString(),
        environment: "unknown",
        services: {
          groq: {
            configured: false,
            status: "unavailable",
            message: error instanceof Error ? error.message : "Unknown error",
          },
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runDiagnostic = async () => {
    setIsDiagnosing(true)
    setDiagnosticResult(null)

    try {
      // Step 1: Check network connectivity
      if (!navigator.onLine) {
        setDiagnosticResult("Network issue: Your device appears to be offline. Please check your internet connection.")
        return
      }

      // Step 2: Check API health
      const healthResponse = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      })

      if (!healthResponse.ok) {
        setDiagnosticResult(
          `API health check failed with status: ${healthResponse.status}. The server may be experiencing issues.`,
        )
        return
      }

      const healthData = await healthResponse.json()

      // Step 3: Test a simple API request
      const testResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello, this is a test message." }],
          mode: "normal",
        }),
      })

      if (!testResponse.ok) {
        setDiagnosticResult(
          `Test API request failed with status: ${testResponse.status}. The chat service may be unavailable.`,
        )
        return
      }

      const testData = await testResponse.json()

      // Compile diagnostic results
      let resultMessage = "Diagnostic Results:\n\n"
      resultMessage += `Environment: ${healthData.environment}\n`
      resultMessage += `API Status: ${healthData.status}\n`
      resultMessage += `Groq API: ${healthData.services.groq.status}\n`

      if (healthData.services.groq.message) {
        resultMessage += `Groq Message: ${healthData.services.groq.message}\n`
      }

      resultMessage += "\nTest Request: "
      resultMessage += testData.text ? "Successful" : "Failed to get a proper response"

      if (healthData.services.groq.status !== "available") {
        resultMessage +=
          "\n\nRecommendation: The Groq API appears to be unavailable. The system will use local fallback responses until the service is restored."
      } else if (testData.text && testData.text.includes("offline mode")) {
        resultMessage +=
          "\n\nRecommendation: Although the API health check passed, the system is still using fallback responses. This may indicate an authentication or rate limiting issue."
      } else {
        resultMessage += "\n\nAll systems appear to be operational."
      }

      setDiagnosticResult(resultMessage)
    } catch (error) {
      setDiagnosticResult(`Diagnostic failed with error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsDiagnosing(false)
    }
  }

  useEffect(() => {
    checkApiHealth()

    // Check every 2 minutes
    const interval = setInterval(checkApiHealth, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading && !status) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800/70 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs flex items-center">
        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        Checking API status...
      </div>
    )
  }

  if (!status) {
    return null
  }

  const isOperational = status.status === "operational"

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        {showDetails && (
          <div className="mb-2 p-3 bg-gray-900/90 border border-gray-800 rounded-md text-xs text-white shadow-lg w-64">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">API Status</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white"
                onClick={() => setShowDetails(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Groq API</span>
                  <span className={status.services.groq.status === "available" ? "text-green-400" : "text-red-400"}>
                    {status.services.groq.status}
                  </span>
                </div>
                {status.services.groq.message && (
                  <p className="text-gray-500 text-[10px] truncate" title={status.services.groq.message}>
                    {status.services.groq.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center">
              <span className="text-gray-500">
                Last checked: {lastChecked ? new Date(lastChecked).toLocaleTimeString() : "Never"}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-gray-400 hover:text-white"
                  onClick={() => setShowDiagnosticDialog(true)}
                >
                  <Info className="h-3 w-3 mr-1" />
                  Diagnose
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-gray-400 hover:text-white"
                  onClick={checkApiHealth}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs
                ${
                  isOperational
                    ? "bg-green-900/30 border border-green-800 text-green-300 hover:bg-green-900/50"
                    : "bg-red-900/30 border border-red-800 text-red-300 hover:bg-red-900/50"
                }
              `}
            >
              {isOperational ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {isOperational ? "API Connected" : "API Issues"}
              <Info className="h-3 w-3 ml-1 opacity-70" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Click for API status details</p>
          </TooltipContent>
        </Tooltip>

        {/* Diagnostic Dialog */}
        <Dialog open={showDiagnosticDialog} onOpenChange={setShowDiagnosticDialog}>
          <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white max-w-md">
            <DialogHeader>
              <DialogTitle>API Diagnostic</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {isDiagnosing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mb-4" />
                  <p className="text-gray-300">Running diagnostic tests...</p>
                </div>
              ) : diagnosticResult ? (
                <pre className="bg-[#0f0f0f] p-4 rounded-md text-xs text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {diagnosticResult}
                </pre>
              ) : (
                <p className="text-gray-300">
                  This will run a series of tests to diagnose API connectivity issues. Click "Run Diagnostic" to begin.
                </p>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDiagnosticDialog(false)}
                className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
              >
                Close
              </Button>
              <Button
                onClick={runDiagnostic}
                disabled={isDiagnosing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isDiagnosing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run Diagnostic"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
