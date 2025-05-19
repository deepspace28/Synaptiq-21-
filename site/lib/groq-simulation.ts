// Update this file to use our secure API route instead of directly accessing the API key

export async function runGroqSimulation(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  },
) {
  try {
    // Use our secure API route instead of directly using the API key
    const response = await fetch("/api/secure-groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: options?.model || "llama3-70b-8192",
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1024,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error from secure GROQ API: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in GROQ simulation:", error)
    throw error
  }
}
