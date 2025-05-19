// import * as env from "@/app/env"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Use the server-side environment variable
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("GROQ API key is not defined")
    }

    // System prompt for physics simulations
    const systemPrompt = `You are a physics expert capable of simulating and explaining physical phenomena.
    Given a physics simulation request, provide:
    
    1. A detailed explanation of the physical system
    2. The governing equations and principles using LaTeX
    3. Simulation results with appropriate visualizations
    4. Analysis of the system behavior and key insights
    
    Format your response with markdown, including LaTeX equations between $$ delimiters.
    Include a JSON code block for visualization data with appropriate arrays for plotting.`

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
            content: `Simulate the following physics scenario: ${prompt}`,
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
    console.error("Error in physics simulation:", error)
    return NextResponse.json({ error: "Failed to run physics simulation" }, { status: 500 })
  }
}
