import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Search, Moon } from "lucide-react"
import { ScientificLogo } from "@/components/scientific-logo"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Synaptiq Cookbook",
  description: "Recipes and examples for the Synaptiq Scientific AI API",
}

export default function CookbookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <header className="border-b border-[#222222] bg-[#0f0f0f]">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <ScientificLogo className="h-8 w-8 text-white" />
              <span className="text-xl font-semibold">Synaptiq</span>
            </Link>
            <nav className="hidden md:flex">
              <div className="flex space-x-6">
                <Link href="/docs" className="font-medium text-gray-400 hover:text-gray-300">
                  Documentation
                </Link>
                <Link href="/cookbook" className="font-medium text-white hover:text-gray-300">
                  Cookbook
                </Link>
              </div>
            </nav>
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
          <nav className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Recipes</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cookbook" className="block text-sm text-white hover:text-gray-300">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/cookbook/quantum-simulation" className="block text-sm text-gray-400 hover:text-gray-300">
                    Quantum Simulation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookbook/mathematical-derivation"
                    className="block text-sm text-gray-400 hover:text-gray-300"
                  >
                    Mathematical Derivation
                  </Link>
                </li>
                <li>
                  <Link href="/cookbook/research-analysis" className="block text-sm text-gray-400 hover:text-gray-300">
                    Research Paper Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/cookbook/data-visualization" className="block text-sm text-gray-400 hover:text-gray-300">
                    Scientific Data Visualization
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Examples</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cookbook/examples/quantum" className="block text-sm text-gray-400 hover:text-gray-300">
                    Quantum Physics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookbook/examples/mathematics"
                    className="block text-sm text-gray-400 hover:text-gray-300"
                  >
                    Mathematics
                  </Link>
                </li>
                <li>
                  <Link href="/cookbook/examples/chemistry" className="block text-sm text-gray-400 hover:text-gray-300">
                    Chemistry
                  </Link>
                </li>
                <li>
                  <Link href="/cookbook/examples/biology" className="block text-sm text-gray-400 hover:text-gray-300">
                    Biology
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Service status:</span>
                <span className="text-green-500">Available</span>
              </div>
            </div>
            <div className="border-t border-[#222222] pt-4">
              <Link href="/discord" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300">
                <ScientificLogo className="h-5 w-5 text-gray-400" />
                <span>Synaptiq API Developer Discord</span>
              </Link>
              <Link
                href="/support"
                className="mt-3 flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400">@</span>
                <span>Email Synaptiq Support</span>
              </Link>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
