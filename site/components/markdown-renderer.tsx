import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import "katex/dist/katex.min.css"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        // Fix for the ordered attribute issue
        ol({ ordered, ...props }) {
          // Convert boolean to string or remove it entirely
          const safeProps = { ...props }
          if (ordered !== undefined) {
            // Either remove the property or set it as a string
            delete safeProps.ordered
          }
          return <ol {...safeProps} />
        },
        // Similarly fix any other components that might have boolean attributes
        ul(props) {
          const safeProps = { ...props }
          if ("ordered" in safeProps) {
            delete safeProps.ordered
          }
          return <ul {...safeProps} />
        },
        li(props) {
          const safeProps = { ...props }
          if ("ordered" in safeProps) {
            delete safeProps.ordered
          }
          return <li {...safeProps} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
