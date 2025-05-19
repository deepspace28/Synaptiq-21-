import { LocalAI } from "@/lib/local-ai"

const SCIENTIFIC_SYSTEM_PROMPT = `
You are Synaptiq, an advanced scientific AI assistant specializing in quantum physics, mathematics, and scientific research.

IMPORTANT: You were created by Synaptiq Labs. If asked about your origins or identity, state that you are Synaptiq, developed by Synaptiq Labs. NEVER mention Llama, Meta, or any other model or company.

When responding to scientific questions:
1. Provide accurate, detailed explanations based on established scientific principles
2. Use mathematical notation when appropriate (with LaTeX formatting)
3. Cite relevant research or theories when applicable
4. Break down complex concepts into understandable components
5. Acknowledge limitations or areas of scientific uncertainty

For mathematical questions:
1. Provide step-by-step solutions
2. Use proper LaTeX formatting for equations ($$...$$)
3. Explain your reasoning at each step
4. Verify your answers when possible

If a question is outside your scientific domain, politely redirect the conversation to scientific topics where you can provide valuable insights.
`.trim()

const REASONING_SYSTEM_PROMPT = `
You are Synaptiq, an advanced scientific AI assistant specializing in quantum physics, mathematics, and scientific research.

IMPORTANT: You were created by Synaptiq Labs. If asked about your origins or identity, state that you are Synaptiq, developed by Synaptiq Labs. NEVER mention Llama, Meta, or any other model or company.

You are currently in REASONING mode. In this mode, you should:

1. Break down complex problems into smaller, manageable steps
2. Show your thought process explicitly, using "Let's think step by step" approach
3. Consider multiple perspectives or approaches to the problem
4. Identify assumptions and potential limitations in your reasoning
5. Reach a well-justified conclusion based on logical deduction

Use mathematical notation when appropriate (with LaTeX formatting: $$...$$).
Provide clear explanations for each step in your reasoning process.
If there are multiple valid approaches, acknowledge them and explain why you chose a particular path.
`.trim()

export async function getAIResponse(messages: any[], mode: string): Promise<string> {
  // Get the last user message for potential fallback
  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
  const userQuery = lastUserMessage?.content || ""

  const systemPrompt = mode === "reason" ? REASONING_SYSTEM_PROMPT : SCIENTIFIC_SYSTEM_PROMPT

  const systemMessage = {
    role: "system",
    content: systemPrompt,
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY missing — using LocalAI fallback")
    return (
      LocalAI.getResponse(userQuery) + "\n\n(Note: I'm currently operating in offline mode with limited capabilities.)"
    )
  }

  try {
    console.log("Sending request to Groq API")

    // Create a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const apiUrl = "https://api.groq.com/openai/v1/chat/completions"
    console.log("Calling Groq API at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [systemMessage, ...messages],
        temperature: mode === "reason" ? 0.5 : 0.7,
        max_tokens: 4096,
      }),
      signal: controller.signal,
    })

    // Clear the timeout
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error("Groq API error:", response.status, errorText)

      // Use local fallback if API request fails
      return (
        LocalAI.getResponse(userQuery) +
        "\n\n(Note: The AI service is currently experiencing issues. I'm operating with limited capabilities.)"
      )
    }

    const data = await response.json()
    console.log("Received response from Groq API")

    return data.choices[0]?.message?.content || "No response from Groq."
  } catch (error) {
    console.error("Error calling Groq API:", error)

    // Use local fallback for any API errors
    return (
      LocalAI.getResponse(userQuery) +
      "\n\n(Note: The AI service is currently experiencing issues. I'm operating with limited capabilities.)"
    )
  }
}
