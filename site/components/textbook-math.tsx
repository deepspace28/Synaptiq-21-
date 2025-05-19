"use client"

import { useEffect, useRef } from "react"

interface TextbookMathProps {
  equation: string
  display?: boolean
  className?: string
}

export function TextbookMath({ equation, display = true, className = "" }: TextbookMathProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // @ts-ignore - renderMathInElement is added by the KaTeX auto-render script
    if (typeof window.katex !== "undefined" && typeof window.katex.render === "function") {
      try {
        // @ts-ignore
        window.katex.render(equation, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          output: "html",
        })
      } catch (error) {
        console.error("Error rendering math:", error)
        if (containerRef.current) {
          containerRef.current.textContent = equation
        }
      }
    } else {
      // Fallback if KaTeX is not loaded
      if (containerRef.current) {
        containerRef.current.textContent = equation
      }
    }
  }, [equation, display])

  return (
    <div
      ref={containerRef}
      className={`textbook-math ${display ? "textbook-math-display" : "textbook-math-inline"} ${className}`}
      aria-label={`Math equation: ${equation}`}
    />
  )
}
