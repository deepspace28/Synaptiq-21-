import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Search, Moon, AlertCircle, MessageSquare, Github, LifeBuoy } from "lucide-react"
import { ScientificLogo } from "@/components/scientific-logo"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Synaptiq Documentation (Beta)",
  description: "Beta documentation for the Synaptiq Scientific AI API",
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <header className="border-b border-[#222222] bg-[#0f0f0f]">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <ScientificLogo className="h-8 w-8 text-white" />
              <span className="text-xl font-semibold">Synaptiq</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
              <nav className="flex">
                <div className="flex space-x-6">
                  <Link href="/docs" className="font-medium text-white hover:text-gray-300">
                    Documentation
                  </Link>
                  <Link href="/cookbook" className="font-medium text-gray-400 hover:text-gray-300">
                    Cookbook
                  </Link>
                </div>
              </nav>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex h-10 w-64 items-center rounded-md border border-[#222222] bg-[#151515] px-3">
                <Search className="mr-2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
                />
                <div className="rounded border border-[#333333] px-1.5 text-xs text-gray-400">Ctrl+K</div>
              </div>
            </div>
            <button className="rounded-full p-2 text-gray-400 hover:bg-[#222222]">
              <Moon className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
              <span className="text-sm font-medium">S</span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-72 border-r border-[#222222] bg-[#0f0f0f] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">Synaptiq API</span>
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
            </div>
            <Link href="/beta-feedback" className="text-purple-400 hover:text-purple-300 text-sm">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
          <nav className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Getting Started</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="block text-sm text-white hover:text-gray-300">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/docs/introduction" className="block text-sm text-gray-400 hover:text-gray-300">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guide" className="block text-sm text-gray-400 hover:text-gray-300">
                    The Researcher's Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/models" className="block text-sm text-gray-400 hover:text-gray-300">
                    Models
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/beta-limitations"
                    className="flex items-center text-sm text-gray-400 hover:text-gray-300"
                  >
                    <span>Beta Limitations</span>
                    <span className="ml-2 bg-yellow-600 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/limits" className="block text-sm text-gray-400 hover:text-gray-300">
                    Consumption and Rate Limits
                  </Link>
                </li>
                <li>
                  <Link href="/docs/explorer" className="block text-sm text-gray-400 hover:text-gray-300">
                    Usage Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/docs/credits" className="block text-sm text-gray-400 hover:text-gray-300">
                    Free Credits
                  </Link>
                </li>
                <li>
                  <Link href="/docs/debugging" className="block text-sm text-gray-400 hover:text-gray-300">
                    Debugging Errors
                  </Link>
                </li>
                <li>
                  <Link href="/docs/whats-new" className="block text-sm text-gray-400 hover:text-gray-300">
                    What's New?
                  </Link>
                </li>
                <li>
                  <Link href="/docs/faq" className="block text-sm text-gray-400 hover:text-gray-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">API Reference</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/api/chat" className="block text-sm text-gray-400 hover:text-gray-300">
                    Chat Completions
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api/simulations" className="block text-sm text-gray-400 hover:text-gray-300">
                    Scientific Simulations
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api/math" className="block text-sm text-gray-400 hover:text-gray-300">
                    Mathematical Derivations
                  </Link>
                </li>
                <li className="flex items-center justify-between">
                  <Link href="/docs/api/research" className="block text-sm text-gray-400 hover:text-gray-300">
                    Research Analysis
                  </Link>
                  <span className="rounded bg-[#333333] px-1.5 py-0.5 text-xs text-white">new</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white flex items-center">
                <span>Beta Program</span>
                <span className="ml-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">BETA</span>
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/beta/roadmap" className="block text-sm text-gray-400 hover:text-gray-300">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/docs/beta/feedback" className="block text-sm text-gray-400 hover:text-gray-300">
                    Providing Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/docs/beta/known-issues" className="block text-sm text-gray-400 hover:text-gray-300">
                    Known Issues
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Beta status:</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
            <div className="border-t border-[#222222] pt-4">
              <Link href="/discord" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300">
                <Github className="h-5 w-5 text-gray-400" />
                <span>Synaptiq Beta GitHub</span>
              </Link>
              <Link
                href="/support"
                className="mt-3 flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300"
              >
                <LifeBuoy className="h-5 w-5 text-gray-400" />
                <span>Beta Support</span>
              </Link>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8 rounded-lg border border-yellow-600/30 bg-yellow-950/20 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-3 h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-500">Beta Documentation</h3>
                <p className="mt-1 text-sm text-yellow-200/70">
                  This documentation is for the Synaptiq API beta. Features and APIs may change without notice. Please
                  provide feedback to help us improve.
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-950/50"
                  >
                    <Link href="/docs/beta/feedback">Submit Feedback</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
