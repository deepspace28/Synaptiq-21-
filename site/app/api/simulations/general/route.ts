import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Use the server-side environment variable
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("GROQ API key is not defined")
    }

    // System prompt for general scientific simulations
    const systemPrompt = `You are a scientific simulation engine capable of explaining and simulating various scientific phenomena.
    Given a simulation request, provide:
    
    1. A detailed explanation of the scientific concept
    2. Mathematical equations and formulas using LaTeX
    3. Simulation results with appropriate visualizations
    4. Key insights and implications
    
    Format your response with markdown, including LaTeX equations between $$ delimiters.
    Include a JSON code block for visualization data if applicable.`

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
            content: `Simulate the following scientific scenario: ${prompt}`,
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
    const result = data.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in scientific simulation:", error)
    return NextResponse.json({ error: "Failed to run scientific simulation" }, { status: 500 })
  }
}
