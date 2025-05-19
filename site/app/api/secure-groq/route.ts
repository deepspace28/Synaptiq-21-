import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens } = await request.json()

    // Use server-side environment variable
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ API key is not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a helpful scientific assistant." },
          { role: "user", content: prompt },
        ],
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "Error from GROQ API", details: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in secure GROQ API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
