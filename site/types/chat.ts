export type InteractionMode = "exploratory" | "hypothesis" | "debate" | "co-creation"

export type MessageRole = "user" | "assistant" | "system"

export interface MessageSection {
  type: "summary" | "derivation" | "visualization" | "insights"
  content: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  sections?: MessageSection[]
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  interactionMode: InteractionMode
  queriesRemaining: number
  isGuest: boolean
}
