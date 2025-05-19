export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastUpdated: Date
}

// Helper function to serialize dates for localStorage
function serializeConversation(conversation: Conversation): any {
  return {
    ...conversation,
    createdAt: conversation.createdAt.toISOString(),
    lastUpdated: conversation.lastUpdated.toISOString(),
    messages: conversation.messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    })),
  }
}

// Helper function to deserialize dates from localStorage
function deserializeConversation(data: any): Conversation {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    lastUpdated: new Date(data.lastUpdated),
    messages: data.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })),
  }
}

// Generate a title from the first user message
function generateTitle(content: string): string {
  // Truncate to first 30 chars or first sentence, whichever is shorter
  const firstSentence = content.split(/[.!?]/)[0].trim()
  const truncated = firstSentence.length > 30 ? firstSentence.substring(0, 27) + "..." : firstSentence

  return truncated || "New Conversation"
}

export const ConversationStorage = {
  // Create a new conversation
  create(): Conversation {
    const now = new Date()
    const conversation: Conversation = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: "New Conversation",
      messages: [],
      createdAt: now,
      lastUpdated: now,
    }

    // Save to localStorage
    const conversations = this.getAll()
    localStorage.setItem(
      "synaptiq-conversations",
      JSON.stringify([serializeConversation(conversation), ...conversations.map(serializeConversation)]),
    )

    return conversation
  },

  // Get all conversations
  getAll(): Conversation[] {
    try {
      const data = localStorage.getItem("synaptiq-conversations")
      if (!data) return []

      return JSON.parse(data).map(deserializeConversation)
    } catch (error) {
      console.error("Error getting conversations:", error)
      return []
    }
  },

  // Get a specific conversation by ID
  get(id: string): Conversation | null {
    const conversations = this.getAll()
    return conversations.find((c) => c.id === id) || null
  },

  // Add a message to a conversation
  addMessage(conversationId: string, message: Message): void {
    const conversations = this.getAll()
    const conversation = conversations.find((c) => c.id === conversationId)

    if (!conversation) return

    // Add message
    conversation.messages.push(message)

    // Update lastUpdated
    conversation.lastUpdated = new Date()

    // If this is the first user message, generate a title
    if (conversation.messages.length === 1 && message.role === "user") {
      conversation.title = generateTitle(message.content)
    }

    // Save to localStorage
    localStorage.setItem("synaptiq-conversations", JSON.stringify(conversations.map(serializeConversation)))
  },

  // Update conversation title
  updateTitle(conversationId: string, title: string): void {
    const conversations = this.getAll()
    const conversation = conversations.find((c) => c.id === conversationId)

    if (!conversation) return

    conversation.title = title
    conversation.lastUpdated = new Date()

    localStorage.setItem("synaptiq-conversations", JSON.stringify(conversations.map(serializeConversation)))
  },

  // Delete a conversation
  delete(conversationId: string): void {
    const conversations = this.getAll()
    const filtered = conversations.filter((c) => c.id !== conversationId)

    localStorage.setItem("synaptiq-conversations", JSON.stringify(filtered.map(serializeConversation)))
  },
}
