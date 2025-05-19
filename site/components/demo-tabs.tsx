"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScientificContent } from "@/components/scientific-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Sample prompts for each tab
const DEMO_PROMPTS = {
  quantum: "Explain quantum entanglement and the EPR paradox with equations and visualizations",
  blackhole: "Explain black hole entropy, the Bekenstein-Hawking formula, and information paradox",
  math: "Derive the Pythagorean theorem step by step with visual proof",
  physics: "Explain the double pendulum system and its chaotic behavior with equations",
  biology: "Explain DNA replication process with key enzymes and visualization",
  chemistry: "Explain chemical equilibrium with Le Chatelier's principle and visualization",
}

export function DemoTabs() {
  const [activeTab, setActiveTab] = useState("quantum")
  const [customPrompt, setCustomPrompt] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState(DEMO_PROMPTS.quantum)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPrompt(DEMO_PROMPTS[value as keyof typeof DEMO_PROMPTS])
  }

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      setCurrentPrompt(customPrompt)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282a36] border-[#44475a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Scientific Query</CardTitle>
          <CardDescription className="text-[#8be9fd]">
            Enter a scientific query or select from the predefined tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a scientific query..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="bg-[#21222c] border-[#44475a] text-white"
            />
            <Button onClick={handleCustomPrompt} className="bg-[#6272a4] hover:bg-[#44475a]">
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quantum" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 bg-[#21222c] border border-[#44475a] p-1 rounded-md">
          <TabsTrigger
            value="quantum"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Quantum
          </TabsTrigger>
          <TabsTrigger
            value="blackhole"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Black Holes
          </TabsTrigger>
          <TabsTrigger
            value="math"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Mathematics
          </TabsTrigger>
          <TabsTrigger
            value="physics"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Physics
          </TabsTrigger>
          <TabsTrigger
            value="biology"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Biology
          </TabsTrigger>
          <TabsTrigger
            value="chemistry"
            className="data-[state=active]:bg-[#6272a4] data-[state=active]:text-white text-[#8be9fd] hover:text-white hover:bg-[#44475a]"
          >
            Chemistry
          </TabsTrigger>
        </TabsList>

        <div className="bg-[#21222c] rounded-lg p-6 border border-[#44475a] shadow-lg">
          <ScientificContent prompt={currentPrompt} />
        </div>
      </Tabs>
    </div>
  )
}
