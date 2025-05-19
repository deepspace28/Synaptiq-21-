"use client"

import { useState } from "react"
import { Copy, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Prompt {
  id: string
  title: string
  text: string
  category: string
  difficulty: "basic" | "intermediate" | "advanced"
}

interface PromptShowcaseProps {
  prompts: Prompt[]
  category: string
  onSelectPrompt?: (prompt: Prompt) => void
}

export function PromptShowcase({ prompts, category, onSelectPrompt }: PromptShowcaseProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const filteredPrompts = prompts.filter((prompt) => prompt.category === category)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full bg-[#282a36] border-[#44475a] hover:border-[#6272a4] transition-all duration-200 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-[#f8f8f2] text-lg">{prompt.title}</CardTitle>
                  <Badge className={`${getDifficultyColor(prompt.difficulty)}`}>
                    {prompt.difficulty.charAt(0).toUpperCase() + prompt.difficulty.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="text-[#6272a4]">{category} prompt</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="bg-[#21222c] p-3 rounded-md border border-[#44475a] text-[#f8f8f2] text-sm font-mono overflow-y-auto max-h-32">
                  {prompt.text}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#8be9fd] border-[#44475a] hover:bg-[#44475a] hover:text-[#f8f8f2]"
                  onClick={() => copyToClipboard(prompt.text, prompt.id)}
                >
                  {copiedId === prompt.id ? "Copied!" : "Copy"}
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#bd93f9] hover:bg-[#ff79c6] text-white"
                  onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
                >
                  Try It
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
