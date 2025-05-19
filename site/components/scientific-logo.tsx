import type { SVGProps } from "react"

interface ScientificLogoProps extends SVGProps<SVGSVGElement> {
  variant?: "default" | "simple"
}

export function ScientificLogo({ variant = "default", className, ...props }: ScientificLogoProps) {
  if (variant === "simple") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <polygon points="12 2 19 7 19 17 12 22 5 17 5 7" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="5" y1="7" x2="19" y2="7" />
        <line x1="5" y1="17" x2="19" y2="17" />
      </svg>
    )
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Abstract geometric shape */}
      <polygon points="32,4 56,20 56,44 32,60 8,44 8,20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polygon points="32,12 48,22 48,42 32,52 16,42 16,22" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polygon points="32,20 40,25 40,35 32,40 24,35 24,25" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Connecting lines */}
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="8" y1="20" x2="56" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="8" y1="44" x2="56" y2="44" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />

      {/* Center point */}
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  )
}
