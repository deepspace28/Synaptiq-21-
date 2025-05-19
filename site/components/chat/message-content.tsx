"use client"

import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ScientificResult } from "@/components/scientific-result"

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  let structured: any = {}
  try {
    structured = JSON.parse(content)
  } catch (e) {
    // fallback to markdown
  }

  return structured?.summary ? (
    <ScientificResult
      summary={structured.summary}
      equations={structured.equations}
      insight={structured.insight}
      chart={structured.chart}
    />
  ) : (
    <MarkdownRenderer content={content} />
  )
}
