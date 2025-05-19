"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Mic,
  Plus,
  Search,
  Sparkles,
  Lightbulb,
  Beaker,
  Trash2,
  Edit,
  MoreVertical,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { ScientificLogo } from "@/components/scientific-logo"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { type Conversation, ConversationStorage, type Message } from "@/lib/conversation-storage"
import { v4 as uuidv4 } from "uuid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ChatMode = "normal" | "search" | "reason"

interface ApiStatus {
  status: "ok" | "error" | "unknown"
  services: {
    groq: {
      configured: boolean
      status: string
    }
  }
}

export function SynaptiqChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [chatMode, setChatMode] = useState<ChatMode>("normal")
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [isCheckingApi, setIsCheckingApi] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineMessage(false)
      checkApiHealth() // Check API health when coming back online
    }
    const handleOffline = () => setShowOfflineMessage(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    setShowOfflineMessage(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check API health on mount and periodically
  useEffect(() => {
    checkApiHealth()

    // Check API health every 5 minutes
    const intervalId = setInterval(checkApiHealth, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Function to check API health
  const checkApiHealth = async () => {
    if (!navigator.onLine) return

    setIsCheckingApi(true)
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setApiStatus(data)
      } else {
        setApiStatus({
          status: "error",
          services: {
            groq: {
              configured: false,
              status: "unavailable",
            },
          },
        })
      }
    } catch (error) {
      console.error("Error checking API health:", error)
      setApiStatus({
        status: "error",
        services: {
          groq: {
            configured: false,
            status: "unavailable",
          },
        },
      })
    } finally {
      setIsCheckingApi(false)
    }
  }

  // Load conversations on mount
  useEffect(() => {
    const loadedConversations = ConversationStorage.getAll()
    setConversations(loadedConversations)

    // Set current conversation to the most recent one or create a new one
    if (loadedConversations.length > 0) {
      // Sort by lastUpdated and get the most recent
      const mostRecent = [...loadedConversations].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())[0]
      setCurrentConversation(mostRecent)
    } else {
      const newConv = ConversationStorage.create()
      setConversations([newConv])
      setCurrentConversation(newConv)
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  // Focus input after sending message
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const createNewConversation = () => {
    const newConv = ConversationStorage.create()
    setConversations((prev) => [newConv, ...prev])
    setCurrentConversation(newConv)
    setInput("")
    setChatMode("normal")
    setError(null)
  }

  const switchConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      setCurrentConversation(conversation)
      setInput("")
      setChatMode("normal")
      setError(null)
    }
  }

  const deleteConversation = (id: string) => {
    ConversationStorage.delete(id)
    setConversations((prev) => prev.filter((c) => c.id !== id))

    // If we deleted the current conversation, switch to another one or create new
    if (currentConversation?.id === id) {
      const remaining = conversations.filter((c) => c.id !== id)
      if (remaining.length > 0) {
        setCurrentConversation(remaining[0])
      } else {
        const newConv = ConversationStorage.create()
        setConversations([newConv])
        setCurrentConversation(newConv)
      }
      setChatMode("normal")
      setError(null)
    }

    setDeleteConfirmId(null)
  }

  const updateConversationTitle = (id: string, title: string) => {
    if (!title.trim()) return

    ConversationStorage.updateTitle(id, title)
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title, lastUpdated: new Date() } : c)))

    if (currentConversation?.id === id) {
      setCurrentConversation((prev) => (prev ? { ...prev, title, lastUpdated: new Date() } : prev))
    }

    setEditingTitle(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentConversation) return

    // Reset any previous errors
    setError(null)

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Add message to current conversation
    ConversationStorage.addMessage(currentConversation.id, userMessage)

    // Update state
    const updatedConversation = ConversationStorage.get(currentConversation.id)
    setCurrentConversation(updatedConversation || null)

    // Refresh conversations list to update titles and order
    setConversations(ConversationStorage.getAll())

    setInput("")
    setIsLoading(true)

    try {
      // Check if we're offline
      if (!navigator.onLine) {
        throw new Error("You appear to be offline. Please check your internet connection and try again.")
      }

      // Choose the appropriate API endpoint based on the chat mode
      const endpoint = chatMode === "search" ? "/api/search" : "/api/chat"

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      // First, check API health before making the request
      const healthCheck = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      }).catch(() => null)

      let apiHealthOk = false

      if (healthCheck && healthCheck.ok) {
        const healthData = await healthCheck.json()
        apiHealthOk = healthData.services.groq.status === "available"

        if (!apiHealthOk) {
          console.warn("API health check failed before chat request:", healthData)
        }
      }

      // Proceed with the chat request even if health check failed (might still work)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedConversation?.messages.map(({ role, content }) => ({ role, content })) || [],
          mode: chatMode,
          query: userMessage.content, // Send the raw query for search mode
        }),
        signal: controller.signal,
        cache: "no-store", // Prevent caching
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        console.error(`Server returned ${response.status}: ${errorText}`)
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data) // Debug log

      // If we have an error message in the response, handle it
      if (data.error) {
        throw new Error(data.error)
      }

      let responseText = ""

      // Handle different response structures
      if (data.text) {
        responseText = data.text
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        responseText = data.choices[0].message.content
      } else if (data.content) {
        responseText = data.content
      } else {
        // Fallback if no expected response format is found
        console.error("Unexpected API response structure:", data)
        responseText = "I received your message, but had trouble processing it. Please try again."
      }

      // Reset retry count on successful response
      setRetryCount(0)

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      }

      // Add assistant message to conversation
      ConversationStorage.addMessage(currentConversation.id, assistantMessage)

      // Update state
      const finalConversation = ConversationStorage.get(currentConversation.id)
      setCurrentConversation(finalConversation || null)

      // Refresh conversations list
      setConversations(ConversationStorage.getAll())

      // Check API health after successful response
      checkApiHealth()
    } catch (error) {
      console.error("Chat error:", error)

      // Increment retry count
      setRetryCount((prev) => prev + 1)

      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      // Create a fallback response based on the mode and retry count
      let fallbackMessage = ""

      if (retryCount >= 2) {
        // After multiple retries, provide a more helpful message
        fallbackMessage = `I apologize, but I'm still having trouble connecting to the server. This might be due to:
        
1. Server maintenance
2. High traffic volume
3. Network connectivity issues

You can try:
- Refreshing the page
- Checking your internet connection
- Trying again in a few minutes

In the meantime, I can still try to help with basic questions using my core knowledge.`
      } else {
        fallbackMessage = `I apologize, but I encountered an error: ${errorMessage}. Please try again later.`

        if (chatMode === "search") {
          fallbackMessage +=
            "\n\nI'm unable to search the web at the moment. Would you like me to answer based on my general knowledge instead?"
        } else if (chatMode === "reason") {
          fallbackMessage +=
            "\n\nI'm unable to use reasoning mode at the moment. Would you like me to provide a standard response instead?"
        }
      }

      // Add error message
      const errorResponseMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: fallbackMessage,
        timestamp: new Date(),
      }

      ConversationStorage.addMessage(currentConversation.id, errorResponseMessage)

      // Update state
      const errorConversation = ConversationStorage.get(currentConversation.id)
      setCurrentConversation(errorConversation || null)

      // Refresh conversations list
      setConversations(ConversationStorage.getAll())

      // Check API health after error
      checkApiHealth()
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const goToSimulations = () => {
    router.push("/simulations")
  }

  const toggleChatMode = (mode: ChatMode) => {
    setChatMode((currentMode) => (currentMode === mode ? "normal" : mode))
  }

  // Group conversations by date
  const todayConversations = conversations
    .filter((c) => {
      const today = new Date()
      return c.lastUpdated.toDateString() === today.toDateString()
    })
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  const yesterdayConversations = conversations
    .filter((c) => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return c.lastUpdated.toDateString() === yesterday.toDateString()
    })
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  const olderConversations = conversations
    .filter((c) => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return (
        c.lastUpdated.toDateString() !== today.toDateString() &&
        c.lastUpdated.toDateString() !== yesterday.toDateString()
      )
    })
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] p-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <ScientificLogo className="h-6 w-6 text-white" />
            <h1 className="text-lg font-medium">Synaptiq</h1>
          </div>

          {/* API Status Indicator */}
          {apiStatus && (
            <div className="flex items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full mr-2",
                  apiStatus.services.groq.status === "available" ? "bg-green-500" : "bg-red-500",
                )}
              ></div>
              <span className="text-xs text-gray-400 mr-2">
                {apiStatus.services.groq.status === "available" ? "API Online" : "API Issues"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={checkApiHealth}
                disabled={isCheckingApi}
              >
                <RefreshCw className={cn("h-4 w-4", isCheckingApi && "animate-spin")} />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Offline warning */}
      {showOfflineMessage && (
        <div className="bg-amber-900/30 border-b border-amber-800 p-2 text-center text-amber-200 text-sm">
          <AlertTriangle className="inline-block h-4 w-4 mr-2" />
          You are currently offline. Some features may be unavailable.
        </div>
      )}

      {/* API Status warning */}
      {apiStatus && apiStatus.services.groq.status !== "available" && !showOfflineMessage && (
        <div className="bg-red-900/30 border-b border-red-800 p-2 text-center text-red-200 text-sm">
          <AlertTriangle className="inline-block h-4 w-4 mr-2" />
          The AI service is currently experiencing issues. Responses may be limited.
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#2a2a2a] bg-[#1a1a1a] hidden md:block">
          <div className="p-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a]"
              onClick={createNewConversation}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>

          {todayConversations.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Today</div>
              <div className="space-y-1 px-2 mb-4">
                {todayConversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md hover:bg-[#2a2a2a] text-gray-300 text-sm truncate pr-8",
                        currentConversation?.id === conv.id && "bg-[#2a2a2a]",
                      )}
                      onClick={() => switchConversation(conv.id)}
                    >
                      {editingTitle === conv.id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => updateConversationTitle(conv.id, newTitle)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateConversationTitle(conv.id, newTitle)
                            }
                          }}
                          className="bg-[#3a3a3a] text-white border-none rounded px-2 py-1 w-full focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        conv.title
                      )}
                    </button>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] cursor-pointer"
                            onClick={() => {
                              setEditingTitle(conv.id)
                              setNewTitle(conv.title)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setDeleteConfirmId(conv.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {yesterdayConversations.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Yesterday</div>
              <div className="space-y-1 px-2 mb-4">
                {yesterdayConversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md hover:bg-[#2a2a2a] text-gray-300 text-sm truncate pr-8",
                        currentConversation?.id === conv.id && "bg-[#2a2a2a]",
                      )}
                      onClick={() => switchConversation(conv.id)}
                    >
                      {editingTitle === conv.id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => updateConversationTitle(conv.id, newTitle)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateConversationTitle(conv.id, newTitle)
                            }
                          }}
                          className="bg-[#3a3a3a] text-white border-none rounded px-2 py-1 w-full focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        conv.title
                      )}
                    </button>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] cursor-pointer"
                            onClick={() => {
                              setEditingTitle(conv.id)
                              setNewTitle(conv.title)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setDeleteConfirmId(conv.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {olderConversations.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Previous 7 Days</div>
              <div className="space-y-1 px-2">
                {olderConversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md hover:bg-[#2a2a2a] text-gray-300 text-sm truncate pr-8",
                        currentConversation?.id === conv.id && "bg-[#2a2a2a]",
                      )}
                      onClick={() => switchConversation(conv.id)}
                    >
                      {editingTitle === conv.id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => updateConversationTitle(conv.id, newTitle)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateConversationTitle(conv.id, newTitle)
                            }
                          }}
                          className="bg-[#3a3a3a] text-white border-none rounded px-2 py-1 w-full focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        conv.title
                      )}
                    </button>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] cursor-pointer"
                            onClick={() => {
                              setEditingTitle(conv.id)
                              setNewTitle(conv.title)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-[#3a3a3a] text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setDeleteConfirmId(conv.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col max-h-full overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!currentConversation || currentConversation.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-3xl font-medium mb-2">What can I help with?</h2>
                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                  <div
                    className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#3a3a3a] cursor-pointer"
                    onClick={() => setInput("Explain quantum entanglement")}
                  >
                    <Search className="h-5 w-5 text-gray-400 mb-2" />
                    <h3 className="font-medium mb-1">Explain quantum entanglement</h3>
                    <p className="text-sm text-gray-400">Learn about this fascinating quantum phenomenon</p>
                  </div>
                  <div
                    className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#3a3a3a] cursor-pointer"
                    onClick={() => setInput("Solve the differential equation dy/dx = 2xy")}
                  >
                    <Sparkles className="h-5 w-5 text-gray-400 mb-2" />
                    <h3 className="font-medium mb-1">Solve a differential equation</h3>
                    <p className="text-sm text-gray-400">Get step-by-step solutions to complex problems</p>
                  </div>
                </div>
              </div>
            ) : (
              currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.role === "assistant" ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[80%]",
                      message.role === "assistant" ? "bg-[#1a1a1a] p-4 rounded-lg" : "bg-[#2a2a2a] p-4 rounded-lg",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-4 bg-[#2a2a2a] text-white flex items-center justify-center">
                          <ScientificLogo className="h-5 w-5" />
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="prose prose-invert max-w-none">
                            <MarkdownRenderer content={message.content} />
                          </div>
                        </div>
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="overflow-hidden">
                        <div className="prose prose-invert max-w-none">
                          <p>{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start justify-start">
                <div className="bg-[#1a1a1a] p-4 rounded-lg max-w-[80%]">
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-4 bg-[#2a2a2a] text-white flex items-center justify-center">
                      <ScientificLogo className="h-5 w-5" />
                    </Avatar>
                    <div className="flex space-x-2 items-center">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center p-2">
                <Alert variant="destructive" className="bg-red-900/20 border border-red-800 text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Error: {error}</AlertDescription>
                </Alert>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="relative rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] focus-within:border-[#5a5a5a]">
                <Textarea
                  ref={(el) => {
                    textareaRef.current = el
                    inputRef.current = el
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={chatMode === "search" ? "Search the web..." : "Ask anything"}
                  className="min-h-[24px] max-h-[200px] resize-none py-3 px-4 rounded-xl bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />

                {/* Action buttons below the input */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[#3a3a3a]">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 rounded-lg hover:text-white hover:bg-[#2a2a2a] transition-all",
                        chatMode === "search"
                          ? "text-white bg-[#2a2a2a] shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          : "text-gray-400",
                      )}
                      onClick={() => toggleChatMode("search")}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      <span>Search</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 rounded-lg hover:text-white hover:bg-[#2a2a2a] transition-all",
                        chatMode === "reason"
                          ? "text-white bg-[#2a2a2a] shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          : "text-gray-400",
                      )}
                      onClick={() => toggleChatMode("reason")}
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      <span>Reason</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                      onClick={goToSimulations}
                    >
                      <Beaker className="h-4 w-4 mr-1" />
                      <span>Simulations</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                      disabled={isLoading}
                    >
                      <Mic className="h-5 w-5" />
                      <span className="sr-only">Voice input</span>
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      className="h-8 w-8 rounded-lg bg-[#3a3a3a] text-white hover:bg-[#4a4a4a] disabled:bg-[#2a2a2a] disabled:text-gray-500"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mode indicator */}
              {chatMode !== "normal" && (
                <div className="text-xs text-center mt-2">
                  {chatMode === "search" && (
                    <span className="text-gray-400">Search mode active - I'll search the web for information</span>
                  )}
                  {chatMode === "reason" && (
                    <span className="text-gray-400">Reason mode active - I'll provide step-by-step reasoning</span>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this conversation? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteConversation(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Make sure to export the component as default as well
export default SynaptiqChat
