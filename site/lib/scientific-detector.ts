// Utility to detect if a message contains scientific content
export function isScientificContent(content: string): boolean {
  const scientificKeywords = [
    "quantum",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
    "theorem",
    "theory",
    "relativity",
    "particle",
    "atom",
    "molecule",
    "cell",
    "dna",
    "protein",
    "enzyme",
    "integral",
    "derivative",
    "function",
    "matrix",
    "vector",
    "force",
    "energy",
    "momentum",
    "velocity",
    "acceleration",
    "electron",
    "proton",
    "neutron",
    "quark",
    "boson",
    "fermion",
    "wave",
    "frequency",
    "amplitude",
    "wavelength",
  ]

  const lowerContent = content.toLowerCase()
  return scientificKeywords.some((keyword) => lowerContent.includes(keyword))
}

// Extract scientific content from a message for structured rendering
export function extractScientificContent(message: string) {
  // Basic extraction of sections
  const sections = {
    summary: "",
    equations: [] as string[],
    visualization: null as any,
    insights: [] as string[],
    circuitDescription: null as string | null,
  }

  // Extract equations (simple heuristic)
  const equationMatches = message.match(/\$\$(.*?)\$\$/g)
  if (equationMatches) {
    sections.equations = equationMatches.map((eq) => eq.replace(/\$\$/g, ""))
  }

  // Try to extract JSON data for visualization
  const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/)
  if (jsonMatch) {
    try {
      // Clean the matched JSON string to ensure it's valid
      const jsonString = jsonMatch[1].trim()
      // Only attempt to parse if it looks like valid JSON
      if (jsonString.startsWith("{") && jsonString.endsWith("}")) {
        try {
          const jsonData = JSON.parse(jsonString)
          if (jsonData.visualization || jsonData.data || jsonData.chart) {
            sections.visualization = jsonData.visualization || jsonData.data || jsonData.chart
          }
        } catch (e) {
          console.error("Failed to parse JSON in message:", e)
        }
      }
    } catch (e) {
      console.error("Error processing JSON match:", e)
    }
  }

  // Try to extract code blocks that might contain data
  const codeBlocks = message.match(/```(?:javascript|js|json|python|py)?\n([\s\S]*?)\n```/g)
  if (codeBlocks) {
    // Look for circuit descriptions in Python code blocks
    for (const block of codeBlocks) {
      if (
        block.includes("qiskit") ||
        block.includes("QuantumCircuit") ||
        block.includes("qubit") ||
        block.includes("Aer")
      ) {
        sections.circuitDescription = block.replace(/```(?:python|py)?\n/, "").replace(/\n```$/, "")
      }
    }

    // Look for visualization data if not already found
    if (!sections.visualization) {
      for (const block of codeBlocks) {
        try {
          // Extract content between backticks
          const content = block.replace(/```(?:javascript|js|json)?\n/, "").replace(/\n```$/, "")

          // Check if it looks like an object or array
          if (
            (content.trim().startsWith("{") && content.trim().endsWith("}")) ||
            (content.trim().startsWith("[") && content.trim().endsWith("]"))
          ) {
            try {
              const data = JSON.parse(content)
              if (data && typeof data === "object") {
                if (data.visualization || data.data || data.chart) {
                  sections.visualization = data.visualization || data.data || data.chart
                  break
                }
              }
            } catch (e) {
              // Silently continue to the next block if this one isn't valid JSON
              continue
            }
          }
        } catch (e) {
          // Ignore errors and continue
          continue
        }
      }
    }
  }

  // Extract insights (paragraphs after "Insights" or "Conclusions" headers)
  const insightsMatch = message.match(/(?:Insights|Conclusions|Key Points|Summary):([\s\S]*?)(?:\n\n|$)/i)
  if (insightsMatch) {
    sections.insights = insightsMatch[1]
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  // Extract summary (first paragraph or content before first header)
  const summaryMatch = message.match(/^(.*?)(?:\n\n|\n#|\n##)/s)
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim()
  } else {
    // If no clear summary section, use the first paragraph
    const firstParagraph = message.split(/\n\n/)[0]
    if (firstParagraph) {
      sections.summary = firstParagraph.trim()
    }
  }

  return {
    fullContent: message,
    ...sections,
  }
}
