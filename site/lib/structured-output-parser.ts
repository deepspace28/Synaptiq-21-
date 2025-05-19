/**
 * Parses LLM output and extracts structured scientific data
 * @param content The raw content from the LLM
 * @param type Optional type of content ('quantum', 'thought_experiment', etc.)
 */
export function parseScientificOutput(
  content: string,
  type?: string,
): {
  summary: string
  equations?: string[]
  insight?: string
  chart?: {
    labels: string[]
    values: number[]
    title?: string
  }
  thoughtExperiment?: {
    scenario: string
    principles: string[]
    implications: string[]
  }
} {
  // Default structure
  const result = {
    summary: "",
    equations: [] as string[],
    insight: "",
  }

  // Determine if this is a thought experiment
  const isThoughtExperiment =
    type === "thought_experiment" ||
    content.toLowerCase().includes("thought experiment") ||
    content.toLowerCase().includes("gedankenexperiment") ||
    (content.toLowerCase().includes("schrödinger") && content.toLowerCase().includes("cat")) ||
    content.toLowerCase().includes("twin paradox") ||
    content.toLowerCase().includes("einstein") ||
    content.toLowerCase().includes("maxwell's demon") ||
    content.toLowerCase().includes("quantum interpretation")

  // Extract summary (first paragraph or section titled "Summary")
  const summaryMatch =
    content.match(/(?:^|\n)(?:# Summary|## Summary)\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/) ||
    content.match(/(?:^|\n)(?:Summary:)\s*\n*([\s\S]+?)(?:\n\n|\n#|\n$)/)

  if (summaryMatch) {
    result.summary = summaryMatch[1].trim()
  } else {
    // Use the first paragraph as summary if no explicit summary section
    const firstParagraph = content.split(/\n\s*\n/)[0]
    if (firstParagraph) {
      result.summary = firstParagraph.trim()
    }
  }

  // Extract equations (anything between $$ or in a section titled "Equations")
  const equationMatches = content.matchAll(/\$\$(.*?)\$\$/gs)
  if (equationMatches) {
    for (const match of equationMatches) {
      if (match[1].trim()) {
        result.equations.push(match[1].trim())
      }
    }
  }

  // Also look for equations in code blocks or equation sections
  const equationSectionMatch = content.match(/(?:^|\n)(?:# Equations|## Equations)\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/)
  if (equationSectionMatch) {
    const equationLines = equationSectionMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))

    if (equationLines.length > 0) {
      // If we didn't find any equations with $$ delimiters, use these
      if (result.equations.length === 0) {
        result.equations = equationLines
      }
    }
  }

  // Extract insight (section titled "Insight" or "Analysis")
  const insightMatch =
    content.match(
      /(?:^|\n)(?:# (?:Insight|Analysis|Implications|Conclusion)|## (?:Insight|Analysis|Implications|Conclusion))\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/,
    ) || content.match(/(?:^|\n)(?:Insight:|Analysis:|Implications:|Conclusion:)\s*\n*([\s\S]+?)(?:\n\n|\n#|\n$)/)

  if (insightMatch) {
    result.insight = insightMatch[1].trim()
  } else {
    // Look for the last substantial paragraph as insight
    const paragraphs = content.split(/\n\s*\n/)
    if (paragraphs.length > 1) {
      // Use the last paragraph that's not a code block or equation
      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const para = paragraphs[i].trim()
        if (para && !para.startsWith("```") && !para.includes("$$")) {
          result.insight = para
          break
        }
      }
    }
  }

  // Extract chart data
  // Look for tables that might contain measurement results
  const tableMatch = content.match(/\|[\s\S]*?\|[\s\S]*?\|/)
  if (tableMatch) {
    try {
      const tableLines = tableMatch[0].split("\n").filter((line) => line.trim().startsWith("|"))

      // Extract headers and data
      if (tableLines.length >= 3) {
        // Header, separator, and at least one data row
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
        const stateIndex = headers.findIndex((h) => /state|configuration|outcome|scenario|case/i.test(h))
        const probIndex = headers.findIndex((h) => /prob|frequency|count|result|value|outcome/i.test(h))

        if (stateIndex !== -1 && probIndex !== -1 && dataRows.length > 0) {
          const labels = dataRows.map((row) => row[stateIndex])
          const values = dataRows.map((row) => {
            const val = Number.parseFloat(row[probIndex])
            return isNaN(val) ? 0 : val
          })

          if (labels.length > 0 && values.length > 0) {
            result.chart = {
              labels,
              values,
              title: isThoughtExperiment ? "Theoretical Outcomes" : "Measurement Probabilities",
            }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing table for chart data:", e)
    }
  }

  // If we couldn't extract a chart from tables, look for explicit chart data
  if (!result.chart) {
    const chartMatch = content.match(/(?:^|\n)(?:# Chart Data|## Chart Data)\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/)
    if (chartMatch) {
      try {
        // Try to parse JSON chart data
        const chartText = chartMatch[1].trim()
        const jsonMatch = chartText.match(/```(?:json)?\s*([\s\S]*?)```/)

        if (jsonMatch) {
          const chartData = JSON.parse(jsonMatch[1])
          if (chartData.labels && chartData.values) {
            result.chart = {
              labels: chartData.labels,
              values: chartData.values,
              title: chartData.title || (isThoughtExperiment ? "Theoretical Outcomes" : "Measurement Probabilities"),
            }
          }
        }
      } catch (e) {
        console.error("Error parsing chart data:", e)
      }
    }
  }

  // For Schrödinger's cat specifically, if we don't have chart data yet
  if (!result.chart && content.toLowerCase().includes("schrödinger") && content.toLowerCase().includes("cat")) {
    // Create a default chart for Schrödinger's cat
    result.chart = {
      labels: ["Alive", "Dead"],
      values: [0.5, 0.5],
      title: "Cat State Probabilities",
    }
  }

  // For thought experiments, extract additional structured data
  if (isThoughtExperiment) {
    // Extract the thought experiment scenario
    const scenarioMatch =
      content.match(
        /(?:^|\n)(?:# (?:Scenario|Setup|Experiment Setup)|## (?:Scenario|Setup|Experiment Setup))\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/,
      ) || content.match(/(?:^|\n)(?:Scenario:|Setup:|Experiment Setup:)\s*\n*([\s\S]+?)(?:\n\n|\n#|\n$)/)

    // Extract principles
    const principlesMatch =
      content.match(
        /(?:^|\n)(?:# (?:Principles|Key Concepts|Physics Principles)|## (?:Principles|Key Concepts|Physics Principles))\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/,
      ) || content.match(/(?:^|\n)(?:Principles:|Key Concepts:|Physics Principles:)\s*\n*([\s\S]+?)(?:\n\n|\n#|\n$)/)

    // Extract implications
    const implicationsMatch =
      content.match(
        /(?:^|\n)(?:# (?:Implications|Consequences|Results|Outcomes)|## (?:Implications|Consequences|Results|Outcomes))\s*\n+([\s\S]+?)(?:\n\n|\n#|\n$)/,
      ) || content.match(/(?:^|\n)(?:Implications:|Consequences:|Results:|Outcomes:)\s*\n*([\s\S]+?)(?:\n\n|\n#|\n$)/)

    // Create the thought experiment object
    const thoughtExperiment: {
      scenario: string
      principles: string[]
      implications: string[]
    } = {
      scenario: scenarioMatch ? scenarioMatch[1].trim() : result.summary,
      principles: [],
      implications: [],
    }

    // Process principles
    if (principlesMatch) {
      thoughtExperiment.principles = principlesMatch[1]
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line && (line.startsWith("-") || line.startsWith("*") || /^\d+\./.test(line)))
        .map((line) => line.replace(/^[-*]\s*|\d+\.\s*/, ""))
    }

    // Process implications
    if (implicationsMatch) {
      thoughtExperiment.implications = implicationsMatch[1]
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line && (line.startsWith("-") || line.startsWith("*") || /^\d+\./.test(line)))
        .map((line) => line.replace(/^[-*]\s*|\d+\.\s*/, ""))
    }

    // If we couldn't extract structured lists, use paragraphs
    if (thoughtExperiment.principles.length === 0 && principlesMatch) {
      thoughtExperiment.principles = [principlesMatch[1].trim()]
    }

    if (thoughtExperiment.implications.length === 0 && implicationsMatch) {
      thoughtExperiment.implications = [implicationsMatch[1].trim()]
    }

    // Add the thought experiment data to the result
    result.thoughtExperiment = thoughtExperiment
  }

  return result
}
