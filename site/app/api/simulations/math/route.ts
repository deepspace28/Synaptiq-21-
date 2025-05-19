import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Use the server-side environment variable
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("GROQ API key is not defined")
    }

    // System prompt for mathematical proofs
    const systemPrompt = `You are a mathematics expert with deep knowledge of proofs and theorems.
    Given a mathematical proof request, provide:
    
    1. A clear statement of the theorem or result to be proven
    2. A step-by-step proof with detailed explanations
    3. Mathematical equations and expressions using LaTeX
    4. Visual representations or diagrams described in detail
    5. Alternative proof approaches if applicable
    
    Format your response with markdown, including LaTeX equations between $$ delimiters.
    Structure your proof clearly with numbered steps and explanations.
    If relevant, include a JSON code block for visualization data.`

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
            content: `Provide a mathematical proof for: ${prompt}`,
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
    console.error("Error in mathematical proof generation:", error)
    return NextResponse.json({ error: "Failed to generate mathematical proof" }, { status: 500 })
  }
}
