"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { StaggerChildren, StaggerItem } from "@/components/motion"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-background/95 to-background/90 overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="grid" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          <g stroke="white" strokeWidth="0.05">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 5} y1="0" x2={i * 5} y2="100" />
            ))}
          </g>
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative z-20">
        <StaggerChildren className="mx-auto max-w-3xl text-center">
          <StaggerItem>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Build the Future of Science with AI
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
              Accelerate discoveries in quantum mechanics, physics, and mathematics using Synaptiq's specialized AI.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto hover-lift hover-glow"
              >
                <Link href="/demo">
                  Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary/20 hover:bg-primary/10 text-lg px-8 py-6 h-auto hover-lift"
              >
                <Link href="/beta-access">Request Beta Access</Link>
              </Button>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-12 flex justify-center items-center gap-8">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-primary">99.8%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </motion.div>
              <div className="h-12 w-px bg-border"></div>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-primary">24+</div>
                <div className="text-sm text-muted-foreground">Research Papers</div>
              </motion.div>
              <div className="h-12 w-px bg-border"></div>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Researchers</div>
              </motion.div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>

      {/* Animated particles */}
      <ParticleEffect />
    </section>
  )
}

function ParticleEffect() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}
