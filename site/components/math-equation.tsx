"use client"

import { useEffect, useRef } from "react"

interface MathEquationProps {
  equation: string
  display?: boolean
  className?: string
}

export function MathEquation({ equation, display = true, className = "" }: MathEquationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Check if KaTeX is available
      if (typeof window !== "undefined" && (window as any).katex) {
        const katex = (window as any).katex

        try {
          katex.render(display ? `\\displaystyle ${equation}` : equation, containerRef.current, {
            throwOnError: false,
            displayMode: display,
            output: "html",
            trust: true,
            strict: false,
          })
        } catch (err) {
          console.error("Error rendering equation:", err)
          containerRef.current.textContent = display ? `$$${equation}$$` : `$${equation}$`
        }
      } else {
        // Fallback if KaTeX is not available
        containerRef.current.textContent = display ? `$$${equation}$$` : `$${equation}$`
      }
    }
  }, [equation, display])

  const baseClasses = "font-serif text-black dark:text-white"
  const displayClasses = display ? "block my-4 text-center" : "inline"
  const combinedClasses = `${baseClasses} ${displayClasses} ${className}`

  return <div ref={containerRef} className={combinedClasses} />
}
