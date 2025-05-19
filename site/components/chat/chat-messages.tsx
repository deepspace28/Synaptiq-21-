"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { ScientificLogo } from "@/components/scientific-logo"
import { User, ExternalLink } from "lucide-react"
import type { Message, MessageSection } from "@/types/chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { VisualizationRenderer } from "./visualization-renderer"
import { SimulationDetector } from "@/components/chat/simulation-detector"
import { Button } from "@/components/ui/button"
import { shouldShowSimLabButton } from "@/lib/query-classifier"
import { useChat } from "@/contexts/chat-context"
import { ScientificResult } from "@/components/scientific-result"
import { Skeleton } from "@/components/ui/skeleton"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { navigateToLab } = useChat()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0a0a0a]">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="flex-shrink-0 mr-4 ml-4">
                {message.role === "user" ? (
                  <Avatar className="h-8 w-8 bg-blue-500/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-500" />
                  </Avatar>
                ) : message.role === "assistant" ? (
                  <Avatar className="h-8 w-8 bg-emerald-500/10 flex items-center justify-center">
                    <ScientificLogo variant="simple" className="h-5 w-5 text-emerald-500" />
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 bg-red-500/10 flex items-center justify-center">
                    <span className="text-xs text-red-500">SYS</span>
                  </Avatar>
                )}
              </div>

              <div className="space-y-2 max-w-[80%]">
                {message.role === "user" ? (
                  <div className="rounded-lg px-4 py-2 bg-blue-600 text-white">
                    <p>{message.content}</p>
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Add simulation lab button for experiment requests */}
                    {shouldShowSimLabButton(message.content) && (
                      <div className="mt-2 pt-2 border-t border-blue-500/30">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs bg-blue-700 hover:bg-blue-800 border-blue-500"
                          onClick={() => navigateToLab(message.content)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in Simulation Lab
                        </Button>
                      </div>
                    )}

                    {/* Simulation detection for user messages */}
                    <SimulationDetector message={message.content} />
                  </div>
                ) : message.sections ? (
                  <StructuredResponse message={message} />
                ) : message.role === "assistant" ? (
                  <ParsedMessageContent content={message.content} timestamp={message.timestamp} />
                ) : (
                  <div className="rounded-lg px-4 py-2 bg-gray-800 text-white">
                    <MarkdownRenderer content={message.content} />
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex max-w-3xl">
              <div className="flex-shrink-0 mr-4">
                <Avatar className="h-8 w-8 bg-emerald-500/10 flex items-center justify-center">
                  <ScientificLogo variant="simple" className="h-5 w-5 text-emerald-500" />
                </Avatar>
              </div>

              <div className="w-full max-w-2xl">
                <Card className="border border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-5/6 bg-gray-800" />
                    <div className="py-2">
                      <Skeleton className="h-32 w-full bg-gray-800" />
                    </div>
                    <Skeleton className="h-4 w-2/3 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </AnimatePresence>
    </div>
  )
}

function ParsedMessageContent({ content, timestamp }: { content: string; timestamp: Date }) {
  let structured: any = {}
  try {
    structured = JSON.parse(content)
  } catch (e) {
    // fallback to markdown
  }

  return structured?.summary ? (
    <ScientificResult
      summary={structured.summary}
      equations={structured.equations}
      insight={structured.insight}
      chart={structured.chart}
      timestamp={timestamp}
    />
  ) : (
    <div className="rounded-lg px-4 py-2 bg-gray-800 text-white">
      <MarkdownRenderer content={content} />
      <div className="text-xs opacity-50 mt-1 text-right">
        {timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  )
}

function ResponseSection({ section }: { section: MessageSection }) {
  const sectionTitles: Record<string, string> = {
    summary: "Summary",
    derivation: "Mathematical Derivation",
    visualization: "Visualization",
    insights: "Expert Insights",
  }

  // Skip rendering if content is empty or contains placeholder text
  if (
    !section.content ||
    typeof section.content !== "string" ||
    section.content.trim() === "" ||
    (typeof section.content === "string" &&
      (section.content.includes("No derivation needed") ||
        section.content.includes("Not applicable") ||
        section.content.includes("No visualization needed")))
  ) {
    return null
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-emerald-400">{sectionTitles[section.type] || section.type}</h3>

      {section.type === "visualization" ? (
        <VisualizationRenderer
          content={section.content}
          type={section.content.toLowerCase().includes("table") ? "table" : "chart"}
        />
      ) : (
        <div className="prose prose-invert max-w-none text-sm">
          <MarkdownRenderer content={section.content} />
        </div>
      )}
    </div>
  )
}

function StructuredResponse({ message }: { message: Message }) {
  const { navigateToLab } = useChat()
  const lastUserMessage = useRef<string | null>(null)

  // Find the last user message before this assistant message
  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("synaptiq-chat-messages") || "[]")
    const index = messages.findIndex((msg: any) => msg.id === message.id)
    if (index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          lastUserMessage.current = messages[i].content
          break
        }
      }
    }
  }, [message.id])

  if (!message.sections || message.sections.length === 0) {
    // If no sections, render the content directly with MarkdownRenderer
    return (
      <div className="rounded-lg px-4 py-2 bg-gray-800 text-white">
        <MarkdownRenderer content={message.content} />
        <div className="text-xs opacity-50 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Add simulation lab button if appropriate */}
        {lastUserMessage.current && shouldShowSimLabButton(lastUserMessage.current) && (
          <div className="mt-3 pt-2 border-t border-gray-700">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs bg-emerald-900/40 hover:bg-emerald-800/60 border-emerald-700/50 text-emerald-400"
              onClick={() => navigateToLab(lastUserMessage.current!)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in Simulation Lab
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="border border-gray-800 bg-gray-900 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ScientificLogo variant="simple" className="h-4 w-4 text-emerald-500" />
          Synaptiq Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render the main content with MarkdownRenderer */}
        <div className="prose prose-invert max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>

        {/* Render each section */}
        {message.sections.map((section, index) => (
          <ResponseSection key={index} section={section} />
        ))}

        {/* Add simulation lab button if appropriate */}
        {lastUserMessage.current && shouldShowSimLabButton(lastUserMessage.current) && (
          <div className="mt-3 pt-2 border-t border-gray-700">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs bg-emerald-900/40 hover:bg-emerald-800/60 border-emerald-700/50 text-emerald-400"
              onClick={() => navigateToLab(lastUserMessage.current!)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in Simulation Lab
            </Button>
          </div>
        )}

        <div className="text-xs opacity-50 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </CardContent>
    </Card>
  )
}
