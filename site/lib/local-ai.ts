/**
 * Simple fallback AI that provides basic responses when the main API is unavailable
 */
export class LocalAI {
  private static readonly RESPONSES = {
    greeting: [
      "Hello! I'm currently operating in offline mode with limited capabilities.",
      "Hi there! I'm running in local mode with basic functionality.",
      "Greetings! I'm currently in fallback mode with limited responses.",
    ],
    quantum: [
      "Quantum entanglement is a phenomenon where particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others.",
      "In quantum physics, entangled particles remain connected so that actions performed on one affect the other, even when separated by great distances.",
      "Quantum entanglement occurs when pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others.",
    ],
    math: [
      "I can help with basic math in offline mode. For complex equations, I'll need to reconnect to the main API.",
      "While offline, I can assist with simple calculations. Complex mathematical problems require the online service.",
      "I can provide basic mathematical guidance while offline, but detailed solutions require the full online service.",
    ],
    physics: [
      "Physics explores how the universe behaves. I can discuss basic concepts while offline.",
      "I can cover fundamental physics principles in offline mode, but detailed analysis requires the online service.",
      "While offline, I can explain basic physics concepts, but in-depth discussions need the full online service.",
    ],
    fallback: [
      "I'm currently operating in offline mode with limited capabilities. I'll be able to provide more detailed responses when the API service is back online.",
      "While offline, I can only provide basic responses. Please try again when the API service is available for more comprehensive assistance.",
      "I'm running in local fallback mode with limited functionality. For more detailed responses, please try again when the API service is restored.",
    ],
  }

  /**
   * Get a response based on the user's message
   */
  static getResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    // Check for greetings
    if (this.containsAny(lowerMessage, ["hello", "hi", "hey", "greetings"])) {
      return this.getRandomResponse("greeting")
    }

    // Check for quantum physics related queries
    if (this.containsAny(lowerMessage, ["quantum", "entanglement", "superposition", "qubit"])) {
      return this.getRandomResponse("quantum")
    }

    // Check for math related queries
    if (this.containsAny(lowerMessage, ["math", "equation", "calculus", "algebra", "solve"])) {
      return this.getRandomResponse("math")
    }

    // Check for physics related queries
    if (this.containsAny(lowerMessage, ["physics", "gravity", "force", "energy", "motion"])) {
      return this.getRandomResponse("physics")
    }

    // Fallback response
    return this.getRandomResponse("fallback")
  }

  /**
   * Check if a string contains any of the given keywords
   */
  private static containsAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword))
  }

  /**
   * Get a random response from the given category
   */
  private static getRandomResponse(category: keyof typeof LocalAI.RESPONSES): string {
    const responses = this.RESPONSES[category]
    const randomIndex = Math.floor(Math.random() * responses.length)
    return responses[randomIndex]
  }
}
