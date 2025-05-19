import type { SVGProps } from "react"

export function Circuit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4" />
      <path d="M6 12H2" />
      <path d="M18 6h-4" />
      <path d="M10 6H6" />
      <path d="M14 6h-4v12h4" />
      <path d="M18 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
      <path d="M10 18H6" />
      <path d="M6 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  )
}
