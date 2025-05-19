"use client"

import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"

interface MathRendererProps {
  text: string
}

export function MathRenderer({ text }: MathRendererProps) {
  // Load KaTeX from CDN
  useEffect(() => {
    // Add KaTeX CSS
    const linkElement = document.createElement("link")
    linkElement.rel = "stylesheet"
    linkElement.href = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    linkElement.integrity = "sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    linkElement.crossOrigin = "anonymous"
    document.head.appendChild(linkElement)

    // Add KaTeX script
    const scriptElement = document.createElement("script")
    scriptElement.defer = true
    scriptElement.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"
    scriptElement.integrity = "sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx"
    scriptElement.crossOrigin = "anonymous"
    document.head.appendChild(scriptElement)

    // Add auto-render extension
    const autoRenderScript = document.createElement("script")
    autoRenderScript.defer = true
    autoRenderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
    autoRenderScript.integrity = "sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05"
    autoRenderScript.crossOrigin = "anonymous"
    autoRenderScript.onload = () => {
      // @ts-ignore - renderMathInElement is added by the auto-render script
      if (typeof window.renderMathInElement === "function") {
        // @ts-ignore
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "$$", right: "$$", display: false },
          ],
          throwOnError: false,
        })
      }
    }
    document.head.appendChild(autoRenderScript)

    return () => {
      // Clean up
      document.head.removeChild(linkElement)
      document.head.removeChild(scriptElement)
      document.head.removeChild(autoRenderScript)
    }
  }, [text]) // Re-run when text changes

  return (
    <div className="prose max-w-none math-textbook">
      <ReactMarkdown remarkPlugins={[remarkMath]}>{text}</ReactMarkdown>
    </div>
  )
}
