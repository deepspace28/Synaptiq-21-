import { logger } from "./logger"

// Interface for Python execution result
interface PyodideResult {
  output?: string
  error?: string
  [key: string]: any
}

// Global variable to track if Pyodide is loaded
let pyodideReadyPromise: Promise<any> | null = null
let pyodideInstance: any = null
let pyodideLoadFailed = false

// Initialize Pyodide
export async function initPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoadFailed) throw new Error("Pyodide previously failed to load")

  if (!pyodideReadyPromise) {
    logger.info("Starting Pyodide initialization")

    pyodideReadyPromise = (async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          throw new Error("Pyodide can only run in browser environment")
        }

        // Load the pyodide module
        const { loadPyodide } = await import("pyodide")

        // Initialize pyodide
        const pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        })

        // Load matplotlib
        await pyodide.loadPackage(["matplotlib", "numpy"])

        // Setup stdout/stderr capture
        pyodide.runPython(`
          import sys
          import io
          import json
          
          class CaptureOutput:
              def __init__(self):
                  self.stdout = io.StringIO()
                  self.stderr = io.StringIO()
                  self.old_stdout = sys.stdout
                  self.old_stderr = sys.stderr
              
              def __enter__(self):
                  sys.stdout = self.stdout
                  sys.stderr = self.stderr
                  return self
              
              def __exit__(self, exc_type, exc_val, exc_tb):
                  sys.stdout = self.old_stdout
                  sys.stderr = self.old_stderr
              
              def get_output(self):
                  return self.stdout.getvalue()
              
              def get_error(self):
                  return self.stderr.getvalue()
        `)

        logger.info("Pyodide initialized successfully")
        return pyodide
      } catch (error) {
        logger.error(`Pyodide initialization failed: ${error}`)
        pyodideLoadFailed = true
        throw error
      }
    })()
  }

  try {
    pyodideInstance = await pyodideReadyPromise
    return pyodideInstance
  } catch (error) {
    logger.error(`Failed to get Pyodide instance: ${error}`)
    throw error
  }
}

// Execute Python code in the browser
export async function executePythonInBrowser(code: string): Promise<PyodideResult> {
  try {
    // Try to get the Pyodide instance
    const pyodide = await initPyodide()

    // Execute the code with output capture
    const result = pyodide.runPython(`
      with CaptureOutput() as capture:
          try:
              ${code}
              error = None
          except Exception as e:
              error = str(e)
          
          output = capture.get_output()
          stderr = capture.get_error()
      
      # Return the results
      {"output": output, "error": error, "stderr": stderr}
    `)

    return result.toJs()
  } catch (error) {
    logger.error(`Browser Python execution error: ${error}`)
    return {
      error: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
      output: "Error executing Python code in browser",
    }
  }
}

// Check if Pyodide is available
export function isPyodideAvailable(): boolean {
  return !pyodideLoadFailed && (pyodideInstance !== null || pyodideReadyPromise !== null)
}

// Get Pyodide loading status
export function getPyodideStatus(): "not_started" | "loading" | "ready" | "failed" {
  if (pyodideLoadFailed) return "failed"
  if (pyodideInstance) return "ready"
  if (pyodideReadyPromise) return "loading"
  return "not_started"
}
