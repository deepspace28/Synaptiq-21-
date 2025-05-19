import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { getMockQuantumData } from "@/lib/mock-quantum-data"
import { executeQuantumSimulation } from "@/lib/engines/quantum_executor"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, parameters = {}, backend = "qiskit" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing required parameter: prompt" }, { status: 400 })
    }

    logger.info(`Received quantum simulation request: ${prompt}`)

    try {
      // Use the Python Qiskit executor
      const result = await executeQuantumSimulation(prompt, {
        ...parameters,
        backend,
      })

      // Return the structured data
      return NextResponse.json({
        summary: result.summary,
        equations: result.equations || [],
        insight: result.insight || "",
        chart: result.chart,
        circuit: result.circuit,
      })
    } catch (error) {
      logger.error(`Error executing quantum simulation: ${error instanceof Error ? error.message : String(error)}`)

      // Fall back to the Groq API if Python execution fails
      const apiKey = process.env.GROQ_API_KEY

      if (!apiKey) {
        logger.warn("GROQ API key is not defined, using mock data")
        return NextResponse.json(getMockQuantumData(prompt))
      }

      // System prompt for quantum simulations - explicitly requesting clean, textbook-style math
      const systemPrompt = `You are Synaptiq's quantum physics expert with deep knowledge of quantum mechanics and quantum computing.
      
      When given a quantum simulation request, provide a comprehensive analysis including:
      
      1. A detailed explanation of the quantum system and its significance
      2. The quantum circuit representation in ASCII art with clear labels
      3. Mathematical equations using clean, textbook-style LaTeX notation
      4. Simulation results with precise probabilities and measurements
      5. Visualization data for plotting results
      6. Insights into the quantum phenomena being demonstrated
      
      DO NOT format your response as JSON. Instead, use markdown with clear sections:
      
      # Summary
      Brief summary of the quantum system and simulation results
      
      # Equations
      - LaTeX equation 1
      - LaTeX equation 2
      
      # Results
      Detailed measurement results and probabilities
      
      # Insight
      Detailed explanation of the quantum behavior and its significance
      
      For Schrödinger's cat simulations, explain the quantum superposition principle and how it applies to the thought experiment.
      
      For entanglement simulations, explain Bell's inequality and non-locality.
      
      For quantum algorithms, explain the computational advantage over classical algorithms.
      
      IMPORTANT: Format all equations in clean, textbook-style LaTeX without unnecessary decorations or colors.
      Use standard notation conventions from quantum mechanics textbooks.`

      logger.info("Calling Groq API with system prompt and user query")

      try {
        // Call the Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Simulate the following quantum system: ${prompt}. Use ${backend} as the backend.`,
              },
            ],
            temperature: 0.5,
            max_tokens: 4000,
            // Removed response_format to get markdown instead of JSON
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          logger.error(`Groq API request failed with status ${response.status}: ${errorText}`)

          // Fall back to mock data if API fails
          logger.info("Falling back to mock data due to API error")
          return NextResponse.json(getMockQuantumData(prompt))
        }

        const data = await response.json()
        logger.info("Received response from Groq API")

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          logger.error("Invalid response format from Groq API", data)

          // Fall back to mock data if response format is invalid
          logger.info("Falling back to mock data due to invalid response format")
          return NextResponse.json(getMockQuantumData(prompt))
        }

        const content = data.choices[0].message.content
        logger.info("Successfully received content from Groq API")

        // Parse the markdown content into structured data
        const structuredData = parseMarkdownContent(content, prompt)

        // Return the structured data
        return NextResponse.json({
          ...structuredData,
          rawContent: content, // Include the raw content for debugging
        })
      } catch (apiError) {
        logger.error(`Error calling Groq API: ${apiError.message}`, apiError)

        // Fall back to mock data if API call fails
        logger.info("Falling back to mock data due to API call error")
        return NextResponse.json(getMockQuantumData(prompt))
      }
    }
  } catch (error) {
    logger.error(`Error in quantum simulation: ${error.message}`, error)

    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "Failed to run quantum simulation",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

/**
 * Parse markdown content into structured data
 */
function parseMarkdownContent(
  content: string,
  prompt: string,
): {
  summary: string
  equations: string[]
  insight: string
  chart?: { title: string; labels: string[]; values: number[] }
} {
  // Default result structure
  const result = {
    summary: "",
    equations: [] as string[],
    insight: "",
    chart: undefined as { title: string; labels: string[]; values: number[] } | undefined,
  }

  // Extract summary
  const summaryMatch = content.match(/# Summary\s+([\s\S]*?)(?=\n#|$)/i)
  if (summaryMatch && summaryMatch[1]) {
    result.summary = summaryMatch[1].trim()
  } else {
    // Fallback: use the first paragraph
    const firstParagraph = content.split("\n\n")[0]
    result.summary = firstParagraph.trim()
  }

  // Extract equations
  const equationsMatch = content.match(/# Equations\s+([\s\S]*?)(?=\n#|$)/i)
  if (equationsMatch && equationsMatch[1]) {
    // Extract equations from bullet points or LaTeX delimiters
    const equationLines = equationsMatch[1].split("\n")
    for (const line of equationLines) {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        const equation = trimmedLine.substring(1).trim()
        if (equation) {
          result.equations.push(equation)
        }
      } else if (trimmedLine.includes("$$")) {
        const equation = trimmedLine.replace(/\$\$/g, "").trim()
        if (equation) {
          result.equations.push(equation)
        }
      } else if (trimmedLine && !trimmedLine.startsWith("#")) {
        result.equations.push(trimmedLine)
      }
    }
  }

  // Also look for inline LaTeX
  const latexMatches = content.matchAll(/\$\$(.*?)\$\$/g)
  for (const match of latexMatches) {
    if (match[1] && match[1].trim()) {
      result.equations.push(match[1].trim())
    }
  }

  // Extract insight
  const insightMatch = content.match(/# Insight\s+([\s\S]*?)(?=\n#|$)/i)
  if (insightMatch && insightMatch[1]) {
    result.insight = insightMatch[1].trim()
  } else {
    // Fallback: look for other sections that might contain insights
    const analysisMatch = content.match(/# (?:Analysis|Discussion|Interpretation)\s+([\s\S]*?)(?=\n#|$)/i)
    if (analysisMatch && analysisMatch[1]) {
      result.insight = analysisMatch[1].trim()
    } else {
      // Use the last paragraph as insight
      const paragraphs = content.split("\n\n")
      result.insight = paragraphs[paragraphs.length - 1].trim()
    }
  }

  // Try to extract chart data from tables or results section
  const resultsMatch = content.match(/# Results\s+([\s\S]*?)(?=\n#|$)/i)
  if (resultsMatch && resultsMatch[1]) {
    const resultsContent = resultsMatch[1]

    // Look for tables with measurement results
    const tableMatch = resultsContent.match(/\|[\s\S]*?\|[\s\S]*?\|/)
    if (tableMatch) {
      try {
        const tableLines = tableMatch[0].split("\n").filter((line) => line.trim().startsWith("|"))

        // Extract headers and data
        if (tableLines.length >= 3) {
          const headers = tableLines[0]
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h)
          const dataRows = tableLines.slice(2).map((line) =>
            line
              .split("|")
              .map((cell) => cell.trim())
              .filter((cell) => cell),
          )

          // Look for state/probability columns
          const stateIndex = headers.findIndex((h) => /state|configuration|outcome|result|bit|qubit/i.test(h))
          const probIndex = headers.findIndex((h) => /prob|frequency|count|result|value|measurement/i.test(h))

          if (stateIndex !== -1 && probIndex !== -1 && dataRows.length > 0) {
            const labels = dataRows.map((row) => row[stateIndex])
            const values = dataRows.map((row) => {
              // Try to extract numeric value, removing % if present
              const val = row[probIndex].replace("%", "")
              return Number.parseFloat(val) || 0
            })

            if (labels.length > 0 && values.length > 0) {
              result.chart = {
                title: "Measurement Results",
                labels,
                values,
              }
            }
          }
        }
      } catch (e) {
        logger.error("Error parsing table for chart data:", e)
      }
    }
  }

  // If we couldn't extract a chart, create a simple one based on the prompt
  if (!result.chart) {
    if (prompt.toLowerCase().includes("entanglement") || prompt.toLowerCase().includes("bell")) {
      result.chart = {
        title: "Bell State Measurement",
        labels: ["00", "11", "01", "10"],
        values: [50, 50, 0, 0],
      }
    } else if (prompt.toLowerCase().includes("schrödinger") || prompt.toLowerCase().includes("cat")) {
      result.chart = {
        title: "Cat State Measurement",
        labels: ["Alive (|0⟩)", "Dead (|1⟩)"],
        values: [50, 50],
      }
    } else {
      result.chart = {
        title: "Quantum State Probabilities",
        labels: ["0", "1"],
        values: [50, 50],
      }
    }
  }

  return result
}
