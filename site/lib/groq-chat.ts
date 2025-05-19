// lib/groq-chat.ts

import type { Message } from "@/types/chat"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

// Smart input classification logic
const isScientificLike = (input: string): boolean => {
  const keywords = [
    "quantum",
    "physics",
    "mechanics",
    "integral",
    "derivative",
    "laplace",
    "fourier",
    "solve",
    "proof",
    "matrix",
    "tensor",
    "wave",
    "particle",
    "electric",
    "magnetic",
    "equation",
    "simulation",
    "field",
    "lattice",
    "thermodynamics",
    "relativity",
    "hbar",
    "math",
    "formula",
    "calculate",
    "computation",
    "algorithm",
    "theory",
    "hypothesis",
    "experiment",
    "observation",
    "measurement",
    "constant",
    "variable",
    "function",
  ]

  const symbolPattern = /[\d=+\-*/^$$$${}[\]√∫∑πφ±×÷]/ // math signs

  return keywords.some((word) => input.toLowerCase().includes(word)) || symbolPattern.test(input)
}

export async function sendChatRequest(messages: Message[], apiKey: string) {
  try {
    // Check if the latest user message is scientific-like
    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")

    if (latestUserMessage && !isScientificLike(latestUserMessage.content)) {
      return "I'm designed for scientific domains like physics, mathematics, and quantum mechanics. Please try a question in one of those areas!"
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error in Groq chat request:", error)
    throw error
  }
}
