"use client"

import { useState } from "react"
import { PhysicsVideoDemo } from "./physics-video"
import { PromptShowcase } from "./prompt-showcase"
import { scientificPrompts } from "./scientific-prompts"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export function MathematicsDemoTab() {
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [showDemo, setShowDemo] = useState(true)

  const handleSelectPrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
    setShowDemo(false)
  }

  const handleBackToDemo = () => {
    setShowDemo(true)
  }

  return (
    <div className="w-full">
      {showDemo ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#f8f8f2] mb-2">Mathematical Proofs & Equations</h3>
            <p className="text-[#bd93f9] mb-6">
              Synaptiq excels at mathematical reasoning, proofs, and equation solving. This demonstration shows how
              complex mathematical concepts are visualized and explained.
            </p>
            <PhysicsVideoDemo />
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#f8f8f2] mb-4">Try These Mathematics Prompts</h3>
            <p className="text-[#bd93f9] mb-6">
              Challenge Synaptiq with advanced mathematical problems, from number theory to chaos theory.
            </p>
            <PromptShowcase prompts={scientificPrompts} category="mathematics" onSelectPrompt={handleSelectPrompt} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Button
            variant="outline"
            size="sm"
            className="mb-4 text-[#8be9fd] border-[#44475a] hover:bg-[#44475a] hover:text-[#f8f8f2]"
            onClick={handleBackToDemo}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demo
          </Button>

          <div className="bg-[#282a36] border border-[#44475a] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#f8f8f2] mb-2">{selectedPrompt?.title}</h3>
            <div className="bg-[#21222c] p-4 rounded-md border border-[#44475a] text-[#f8f8f2] font-mono mb-4">
              {selectedPrompt?.text}
            </div>

            <div className="bg-[#21222c] p-6 rounded-md border border-[#44475a] min-h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block rounded-full bg-[#44475a] p-4 mb-4">
                    <svg
                      className="animate-spin h-8 w-8 text-[#8be9fd]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-[#bd93f9] text-lg">Synaptiq is processing your query...</p>
                  <p className="text-[#6272a4] mt-2">
                    This would display the actual AI response in a real implementation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
