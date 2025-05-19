"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, ImageIcon, Paperclip, X } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    await onSendMessage(message)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop speech recognition
  }

  return (
    <div className="border-t border-gray-800 bg-[#0a0a0a] p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 text-gray-400"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-10 text-gray-400"
            disabled={disabled}
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Attach image</span>
          </Button>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a scientific question..."
            className="min-h-[50px] max-h-[200px] resize-none pl-20 pr-20 py-3 rounded-full bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
            disabled={disabled}
          />

          <div className="absolute right-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={isRecording ? "text-red-500" : "text-gray-400"}
              onClick={toggleRecording}
              disabled={disabled}
            >
              {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || disabled}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>

        {disabled && (
          <p className="text-xs text-red-400 mt-2 text-center">
            You've reached your query limit. Please log in or request beta access to continue.
          </p>
        )}
      </form>
    </div>
  )
}
