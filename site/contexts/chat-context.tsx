"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Message } from "@/types/chat"
import { v4 as uuidv4 } from "uuid"

// Define the interaction modes
export type InteractionMode = "chat" | "research" | "teaching"

// Define the chat state
interface ChatState {
  messages: Message[]
  isLoading: boolean
  interactionMode: InteractionMode
  isGuest: boolean
  queriesRemaining: number
}

// Define the chat context
interface ChatContextType {
  chatState: ChatState
  sendMessage: (content: string) => void
  clearMessages: () => void
  setInteractionMode: (mode: InteractionMode) => void
  showBetaModal: boolean
  setShowBetaModal: (show: boolean) => void
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  showLimitModal: boolean
  setShowLimitModal: (show: boolean) => void
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
  navigateToLab: (prompt: string) => void
}

// Create the chat context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Create the chat provider
export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    interactionMode: "chat",
    isGuest: true,
    queriesRemaining: 5,
  })

  const [showBetaModal, setShowBetaModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("synaptiq-chat-messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Convert string timestamps back to Date objects
        const messagesWithDateTimestamps = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setChatState((prev) => ({ ...prev, messages: messagesWithDateTimestamps }))
      } catch (error) {
        console.error("Error parsing saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("synaptiq-chat-messages", JSON.stringify(chatState.messages))
  }, [chatState.messages])

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (chatState.isGuest && chatState.queriesRemaining <= 0) {
      setShowLimitModal(true)
      return
    }

    // Create a new user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    // Update the chat state with the new message
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a new assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `I've processed your query about "${content}". Here's what I found...`,
        timestamp: new Date(),
      }

      // Update the chat state with the assistant message
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        queriesRemaining: prev.isGuest ? prev.queriesRemaining - 1 : prev.queriesRemaining,
      }))
    } catch (error) {
      console.error("Error sending message:", error)

      // Create an error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, but I encountered an error processing your request. Please try again later.",
        timestamp: new Date(),
      }

      // Update the chat state with the error message
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }))
    }
  }

  // Function to clear messages
  const clearMessages = () => {
    setChatState((prev) => ({ ...prev, messages: [] }))
  }

  // Function to set the interaction mode
  const setInteractionMode = (mode: InteractionMode) => {
    setChatState((prev) => ({ ...prev, interactionMode: mode }))
  }

  // Function to navigate to the lab page with a prompt
  const navigateToLab = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt)
    router.push(`/lab?prompt=${encodedPrompt}`)
  }

  return (
    <ChatContext.Provider
      value={{
        chatState,
        sendMessage,
        clearMessages,
        setInteractionMode,
        showBetaModal,
        setShowBetaModal,
        showLoginModal,
        setShowLoginModal,
        showLimitModal,
        setShowLimitModal,
        showUpgradeModal,
        setShowUpgradeModal,
        navigateToLab,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// Create a hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
