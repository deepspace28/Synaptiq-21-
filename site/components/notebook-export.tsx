"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileDown, Copy, Check, Code, FileText, BookOpen } from "lucide-react"

interface NotebookExportProps {
  title: string
  description?: string
  simulationData: any
  parameters: Record<string, any>
  results: any
  equations?: string[]
  insights?: string[]
}

export function NotebookExport({
  title,
  description,
  simulationData,
  parameters,
  results,
  equations = [],
  insights = [],
}: NotebookExportProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<"jupyter" | "markdown" | "python">("jupyter")

  // Generate Python code from the simulation
  const generatePythonCode = () => {
    // This is a simplified example - in a real app, this would be more sophisticated
    return `
import numpy as np
import matplotlib.pyplot as plt
from IPython.display import display, Math
${simulationData.domain === "quantum" ? "import qiskit\nfrom qiskit import QuantumCircuit, Aer, execute\nfrom qiskit.visualization import plot_histogram" : ""}

# Simulation Parameters
parameters = {
${Object.entries(parameters)
  .map(([key, value]) => `    "${key}": ${typeof value === "string" ? `"${value}"` : value},`)
  .join("\n")}
}

# Run Simulation
def run_simulation(params):
    # Simulation logic would go here
    # This is a placeholder implementation
    x = np.linspace(0, 10, 100)
    y = np.sin(params["frequency"] * x) * params["amplitude"]
    
    return {
        "x": x,
        "y": y
    }

# Execute simulation
results = run_simulation(parameters)

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(results["x"], results["y"], 'b-')
plt.title("${title}")
plt.xlabel("X")
plt.ylabel("Y")
plt.grid(True)
plt.show()

# Display equations
${equations.map((eq) => `display(Math(r"${eq}"))`).join("\n")}

# Insights
${insights.map((insight) => `print(f"INSIGHT: ${insight}")`).join("\n")}
`
  }

  // Generate Jupyter notebook content
  const generateJupyterNotebook = () => {
    const cells = [
      {
        cell_type: "markdown",
        metadata: {},
        source: [`# ${title}`, "", description || ""].join("\n"),
      },
      {
        cell_type: "markdown",
        metadata: {},
        source: ["## Parameters", "", "The following parameters were used in this simulation:"].join("\n"),
      },
      {
        cell_type: "code",
        metadata: {},
        source: [`parameters = ${JSON.stringify(parameters, null, 2)}`],
        execution_count: null,
        outputs: [],
      },
      {
        cell_type: "markdown",
        metadata: {},
        source: ["## Simulation Code"].join("\n"),
      },
      {
        cell_type: "code",
        metadata: {},
        source: generatePythonCode().split("\n"),
        execution_count: null,
        outputs: [],
      },
      {
        cell_type: "markdown",
        metadata: {},
        source: ["## Results", "", "The simulation produced the following results:"].join("\n"),
      },
      {
        cell_type: "code",
        metadata: {},
        source: [
          `import matplotlib.pyplot as plt`,
          ``,
          `# Plot results`,
          `plt.figure(figsize=(10, 6))`,
          `plt.plot(results["x"], results["y"])`,
          `plt.title("${title}")`,
          `plt.xlabel("X")`,
          `plt.ylabel("Y")`,
          `plt.grid(True)`,
          `plt.show()`,
        ],
        execution_count: null,
        outputs: [],
      },
    ]

    if (equations.length > 0) {
      cells.push({
        cell_type: "markdown",
        metadata: {},
        source: ["## Mathematical Formulation", "", "The simulation is based on the following equations:"].join("\n"),
      })

      cells.push({
        cell_type: "markdown",
        metadata: {},
        source: equations.map((eq) => `$$${eq}$$`).join("\n\n"),
      })
    }

    if (insights.length > 0) {
      cells.push({
        cell_type: "markdown",
        metadata: {},
        source: ["## Insights", "", "Analysis of the simulation results:"].join("\n"),
      })

      cells.push({
        cell_type: "markdown",
        metadata: {},
        source: insights.map((insight) => `- ${insight}`).join("\n"),
      })
    }

    return JSON.stringify(
      {
        cells,
        metadata: {
          kernelspec: {
            display_name: "Python 3",
            language: "python",
            name: "python3",
          },
          language_info: {
            codemirror_mode: {
              name: "ipython",
              version: 3,
            },
            file_extension: ".py",
            mimetype: "text/x-python",
            name: "python",
            nbconvert_exporter: "python",
            pygments_lexer: "ipython3",
            version: "3.8.10",
          },
        },
        nbformat: 4,
        nbformat_minor: 5,
      },
      null,
      2,
    )
  }

  // Generate Markdown content
  const generateMarkdown = () => {
    let markdown = `# ${title}\n\n`

    if (description) {
      markdown += `${description}\n\n`
    }

    markdown += `## Parameters\n\n`
    markdown += `The following parameters were used in this simulation:\n\n`
    markdown += "```json\n"
    markdown += JSON.stringify(parameters, null, 2)
    markdown += "\n```\n\n"

    if (equations.length > 0) {
      markdown += `## Mathematical Formulation\n\n`
      markdown += `The simulation is based on the following equations:\n\n`

      equations.forEach((eq) => {
        markdown += `$$${eq}$$\n\n`
      })
    }

    markdown += `## Simulation Code\n\n`
    markdown += "```python\n"
    markdown += generatePythonCode()
    markdown += "\n```\n\n"

    markdown += `## Results\n\n`
    markdown += `The simulation produced the following results:\n\n`

    // Add a placeholder for the chart (in a real app, you might generate and embed an image)
    markdown += `![${title} Results](chart_placeholder.png)\n\n`

    if (insights.length > 0) {
      markdown += `## Insights\n\n`
      markdown += `Analysis of the simulation results:\n\n`

      insights.forEach((insight) => {
        markdown += `- ${insight}\n`
      })
    }

    markdown += `\n---\n\nGenerated by Synaptiq Scientific Simulation Platform`

    return markdown
  }

  // Get the export content based on the selected format
  const getExportContent = () => {
    switch (exportFormat) {
      case "jupyter":
        return generateJupyterNotebook()
      case "markdown":
        return generateMarkdown()
      case "python":
        return generatePythonCode()
      default:
        return ""
    }
  }

  // Get the file extension based on the selected format
  const getFileExtension = () => {
    switch (exportFormat) {
      case "jupyter":
        return ".ipynb"
      case "markdown":
        return ".md"
      case "python":
        return ".py"
      default:
        return ".txt"
    }
  }

  // Copy content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getExportContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download the notebook
  const downloadNotebook = () => {
    const content = getExportContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}${getFileExtension()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileDown className="h-4 w-4" />
          Export Notebook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Export Simulation Notebook</DialogTitle>
          <DialogDescription className="text-gray-400">
            Export your simulation as a notebook to continue your analysis or share with others.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="jupyter" value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="jupyter" className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Jupyter
            </TabsTrigger>
            <TabsTrigger value="markdown" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="python" className="flex items-center gap-1.5">
              <Code className="h-4 w-4" />
              Python
            </TabsTrigger>
          </TabsList>

          <div className="border border-gray-800 rounded-md bg-gray-900 p-4 h-[300px] overflow-auto">
            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{getExportContent()}</pre>
          </div>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy to Clipboard"}
          </Button>
          <Button onClick={downloadNotebook}>
            <Download className="h-4 w-4 mr-2" />
            Download{" "}
            {exportFormat === "jupyter" ? "Notebook" : exportFormat === "markdown" ? "Markdown" : "Python Script"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
