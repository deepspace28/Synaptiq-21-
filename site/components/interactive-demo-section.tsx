"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Atom, BrainCircuit, ActivityIcon as Function } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeInUp, StaggerChildren, StaggerItem } from "@/components/motion"

interface DemoCardProps {
  title: string
  description: string
  icon: React.ReactNode
  demoPath: string
  isActive: boolean
  onClick: () => void
}

function DemoCard({ title, description, icon, demoPath, isActive, onClick }: DemoCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} whileTap={{ y: 0 }}>
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300 border-border/40 hover:border-foreground/20 hover-glow",
          isActive ? "border-foreground/40 shadow-lg" : "border-border/40",
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-background to-muted/30 opacity-0 transition-opacity duration-300",
            isActive && "opacity-100",
          )}
        />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-muted p-2">{icon}</div>
            <div className="text-xs font-medium text-muted-foreground">Interactive Demo</div>
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="rounded-md border border-border/40 bg-muted/30 p-4">
            <p className="text-sm italic">"{description}"</p>
          </div>
          <div
            className={cn(
              "h-32 rounded-md border border-border/40 bg-muted/30 flex items-center justify-center transition-all duration-300",
              isActive && "border-foreground/20",
            )}
          >
            {isActive ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                <DemoPreview title={title} />
              </motion.div>
            ) : (
              <span className="text-sm text-muted-foreground">Preview will appear here</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="relative">
          <Button asChild variant="outline" className="w-full">
            <Link href={demoPath}>
              Try This Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function DemoPreview({ title }: { title: string }) {
  if (title === "Quantum Mechanics Query") {
    return (
      <div className="text-xs text-muted-foreground p-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-primary">Q:</span> Explain quantum entanglement
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-2"
        >
          <span className="text-primary">A:</span> Quantum entanglement occurs when particles become connected in such a
          way that the quantum state of each particle cannot be described independently...
        </motion.div>
      </div>
    )
  }

  if (title === "Black Hole Entropy Simulation") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
          <motion.circle
            cx="50"
            cy="30"
            r="15"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            initial={{ r: 5 }}
            animate={{ r: 15 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.path
            d="M 10,45 C 20,50 80,50 90,45"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.path
            d="M 10,15 C 20,10 80,10 90,15"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
        </svg>
      </div>
    )
  }

  if (title === "Mathematical Proof Generator") {
    return (
      <div className="text-xs text-muted-foreground p-2 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <span className="text-primary">Step 1:</span> Consider a right triangle with sides a, b, c
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <span className="text-primary">Step 2:</span> Construct squares on each side...
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
          <span className="text-primary">Step 3:</span> Compare areas to prove a² + b² = c²
        </motion.div>
      </div>
    )
  }

  return null
}

export function InteractiveDemoSection() {
  const [activeCard, setActiveCard] = useState<number>(0)

  const demoCards = [
    {
      title: "Quantum Mechanics Query",
      description: "Explain quantum entanglement clearly.",
      icon: <Atom className="h-5 w-5" />,
      demoPath: "/demo/quantum",
    },
    {
      title: "Black Hole Entropy Simulation",
      description: "Visualize entropy changes in black hole formation.",
      icon: <BrainCircuit className="h-5 w-5" />,
      demoPath: "/demo/blackhole",
    },
    {
      title: "Mathematical Proof Generator",
      description: "Generate step-by-step mathematical proofs.",
      icon: <Function className="h-5 w-5" />,
      demoPath: "/demo/math",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <FadeInUp>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Experience Scientific Innovation
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Preview Synaptiq's powerful scientific reasoning capabilities.
              </p>
            </div>
          </div>
        </FadeInUp>
        <StaggerChildren className="mx-auto grid gap-6 py-8 md:grid-cols-3 lg:gap-8">
          {demoCards.map((card, index) => (
            <StaggerItem key={index}>
              <DemoCard
                title={card.title}
                description={card.description}
                icon={card.icon}
                demoPath={card.demoPath}
                isActive={activeCard === index}
                onClick={() => setActiveCard(index)}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
