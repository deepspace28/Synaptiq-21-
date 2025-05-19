"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TutorialStepProps {
  title: string
  description?: string
  stepNumber: number
  totalSteps: number
  onNext?: () => void
  onPrevious?: () => void
  className?: string
  children: React.ReactNode
}

export function TutorialStep({
  title,
  description,
  stepNumber,
  totalSteps,
  onNext,
  onPrevious,
  className,
  children,
}: TutorialStepProps) {
  return (
    <Card className={cn("border border-gray-800 bg-gray-950", className)}>
      <CardHeader className="bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-cyan-400 font-mono mb-1">
              STEP {stepNumber} OF {totalSteps}
            </div>
            <CardTitle className="text-xl font-medium text-white">{title}</CardTitle>
          </div>
          <div className="h-10 w-10 rounded-full bg-cyan-600/20 flex items-center justify-center text-cyan-400 font-bold">
            {stepNumber}
          </div>
        </div>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
      <CardFooter className="border-t border-gray-800 bg-gray-900 flex justify-between p-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!onPrevious || stepNumber === 1}
          className="bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={cn("h-2 w-2 rounded-full", i + 1 === stepNumber ? "bg-cyan-400" : "bg-gray-700")} />
          ))}
        </div>
        <Button
          variant="default"
          onClick={onNext}
          disabled={!onNext || stepNumber === totalSteps}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
