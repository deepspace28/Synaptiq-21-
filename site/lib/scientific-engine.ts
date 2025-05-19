// Define the types for our scientific engine responses
export interface ScientificResponse {
  title: string
  summary: string
  equations: string[]
  visualization: {
    type: "chart" | "table" | "3d" | "image"
    data: any
  }
  parameters?: {
    name: string
    label: string
    default: number
    min: number
    max: number
    unit: string
  }[]
  insights: string[]
}

// System prompt for scientific derivations and explanations
const SCIENTIFIC_SYSTEM_PROMPT = `You are a scientific engine that generates detailed, accurate scientific content.
Given a scientific query, generate:

1. A title for the scientific concept
2. A clear, concise summary (3-5 sentences)
3. Key equations in LaTeX format
4. Visualization data (for charts or tables)
5. Key insights or implications (3-5 bullet points)

Respond in strict JSON format with these fields:
{
  "title": "string",
  "summary": "string",
  "equations": ["equation1", "equation2"],
  "visualization": {
    "type": "chart|table|3d|image",
    "data": {}
  },
  "insights": ["insight1", "insight2", "insight3"]
}

For charts, include x and y arrays. For tables, include headers and rows arrays.
Ensure all LaTeX is properly formatted with escape characters.
DO NOT include any comments, explanations, or non-JSON content in your response.`

// Function to clean JSON string
function cleanJsonString(str: string): string {
  // Remove comments (both // and /* */)
  let cleaned = str.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")

  // Remove trailing commas
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1")

  // Replace single quotes with double quotes for JSON compatibility
  cleaned = cleaned.replace(/'/g, '"')

  return cleaned
}

// Function to extract JSON from a string that might contain markdown or other content
function extractJsonFromString(str: string): string {
  // Try to extract JSON from code blocks first
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
  const codeBlockMatch = str.match(codeBlockRegex)

  if (codeBlockMatch && codeBlockMatch[1]) {
    return cleanJsonString(codeBlockMatch[1])
  }

  // If no code block, try to find JSON object directly
  const jsonObjectRegex = /(\{[\s\S]*\})/
  const jsonObjectMatch = str.match(jsonObjectRegex)

  if (jsonObjectMatch && jsonObjectMatch[1]) {
    return cleanJsonString(jsonObjectMatch[1])
  }

  // If all else fails, return the cleaned original string
  return cleanJsonString(str)
}

import { runGroqSimulation } from "./groq-simulation"

export async function generateScientificContent(
  query: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  },
) {
  try {
    // Use the updated groq-simulation that uses our secure API route
    const result = await runGroqSimulation(query, options)
    return result
  } catch (error) {
    console.error("Error generating scientific content:", error)
    throw error
  }
}

// Update the generateSimulation function
export async function generateSimulation(prompt: string) {
  try {
    const systemPrompt = `You are a scientific experiment compiler. Given a freeform experiment request, return:

A title

Governing equations (in LaTeX)

Input parameters (name, label, default, min, max, unit)

A formula or dataset for graphing

Chart type (line, scatter, 3D)

A 3-5 sentence explanation of the result
Respond in strict JSON format.
DO NOT include any comments, explanations, or non-JSON content in your response.`

    // Use the secure API route instead of direct API call
    const response = await fetch("/api/secure-groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    console.log("Raw API response:", content)

    // Parse the JSON response
    try {
      const jsonString = extractJsonFromString(content)
      console.log("Extracted JSON string:", jsonString)

      return JSON.parse(jsonString)
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      console.log("Raw response:", content)

      // Fallback to a simple simulation if parsing fails
      return {
        title: "Simple Pendulum Simulation",
        equations: ["\\theta(t) = \\theta_0 \\cos(\\omega t)", "\\omega = \\sqrt{\\frac{g}{L}}"],
        parameters: [
          {
            name: "length",
            label: "Pendulum Length (L)",
            default: 1,
            min: 0.1,
            max: 5,
            unit: "m",
          },
          {
            name: "gravity",
            label: "Gravity (g)",
            default: 9.8,
            min: 1,
            max: 20,
            unit: "m/s²",
          },
          {
            name: "initialAngle",
            label: "Initial Angle (θ₀)",
            default: 30,
            min: 0,
            max: 90,
            unit: "°",
          },
        ],
        chartType: "line",
        explanation:
          "This simulation shows the motion of a simple pendulum. The period of oscillation depends on the length of the pendulum and the gravitational acceleration. For small angles, the motion is approximately simple harmonic.",
      }
    }
  } catch (error) {
    console.error("Error generating simulation:", error)
    throw error
  }
}
