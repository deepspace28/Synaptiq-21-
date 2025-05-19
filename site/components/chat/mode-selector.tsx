"use client"

import type React from "react"

import { useChat } from "@/contexts/chat-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, FlaskConical, MessageSquare, Layers } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { InteractionMode } from "@/types/chat"

export function ModeSelector() {
  const { interactionMode, setInteractionMode } = useChat()

  const modes: {
    id: InteractionMode
    label: string
    icon: React.ReactNode
    description: string
  }[] = [
    {
      id: "exploratory",
      label: "Exploratory Thought",
      icon: <Lightbulb className="h-4 w-4" />,
      description: "Explore scientific concepts with detailed explanations and connections",
    },
    {
      id: "hypothesis",
      label: "Hypothesis Generation",
      icon: <FlaskConical className="h-4 w-4" />,
      description: "Generate testable scientific hypotheses based on your queries",
    },
    {
      id: "debate",
      label: "Debate Mode",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Examine multiple scientific perspectives on complex topics",
    },
    {
      id: "co-creation",
      label: "Co-Creation Canvas",
      icon: <Layers className="h-4 w-4" />,
      description: "Collaboratively develop scientific ideas and frameworks",
    },
  ]

  return (
    <div className="border-b border-gray-800 px-4 py-2 bg-[#0a0a0a]">
      <TooltipProvider>
        <Tabs value={interactionMode} onValueChange={(value) => setInteractionMode(value as InteractionMode)}>
          <TabsList className="grid grid-cols-4 bg-gray-900">
            {modes.map((mode) => (
              <Tooltip key={mode.id}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={mode.id}
                    className="flex items-center gap-2 data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white"
                  >
                    {mode.icon}
                    <span className="hidden sm:inline">{mode.label}</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white border-gray-800">
                  <p>{mode.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </Tabs>
      </TooltipProvider>
    </div>
  )
}
