import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CookbookPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Synaptiq Cookbook</h1>
        <p className="mt-4 text-lg text-gray-300">
          A collection of recipes and examples to help you build scientific applications with the Synaptiq API.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Popular Recipes</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/cookbook/quantum-simulation"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Quantum Simulation</h3>
              <p className="mt-1 text-sm text-gray-400">
                Learn how to simulate quantum systems and visualize the results.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View recipe</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/mathematical-derivation"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Mathematical Derivation</h3>
              <p className="mt-1 text-sm text-gray-400">
                Generate step-by-step mathematical proofs with LaTeX formatting.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View recipe</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/research-analysis"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Research Paper Analysis</h3>
              <p className="mt-1 text-sm text-gray-400">
                Extract insights and key findings from scientific literature.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View recipe</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/data-visualization"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Scientific Data Visualization</h3>
              <p className="mt-1 text-sm text-gray-400">Create publication-ready visualizations of scientific data.</p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View recipe</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Examples by Field</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/cookbook/examples/quantum"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Quantum Physics</h3>
              <p className="mt-1 text-sm text-gray-400">
                Examples for quantum mechanics, quantum computing, and quantum field theory.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View examples</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/examples/mathematics"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Mathematics</h3>
              <p className="mt-1 text-sm text-gray-400">
                Examples for calculus, linear algebra, differential equations, and more.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View examples</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/examples/chemistry"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Chemistry</h3>
              <p className="mt-1 text-sm text-gray-400">
                Examples for molecular modeling, reaction kinetics, and spectroscopy.
              </p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View examples</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/cookbook/examples/biology"
              className="group rounded-lg border border-[#222222] p-4 transition-colors hover:border-[#333333] hover:bg-[#151515]"
            >
              <h3 className="font-medium text-white">Biology</h3>
              <p className="mt-1 text-sm text-gray-400">Examples for genomics, protein folding, and systems biology.</p>
              <div className="mt-3 flex items-center text-sm text-purple-400">
                <span>View examples</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Getting Started</h2>
          <p className="mt-2 text-gray-300">
            If you're new to the Synaptiq API, we recommend starting with these resources:
          </p>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>
              <Link href="/docs" className="text-purple-400 hover:underline">
                Documentation
              </Link>{" "}
              - Learn about the Synaptiq API and how to use it
            </li>
            <li>
              <Link href="/docs/guide" className="text-purple-400 hover:underline">
                The Researcher's Guide to Synaptiq
              </Link>{" "}
              - A comprehensive guide to using Synaptiq for scientific research
            </li>
            <li>
              <Link href="/docs/models" className="text-purple-400 hover:underline">
                Models and Pricing
              </Link>{" "}
              - Learn about the different Synaptiq models and their pricing
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
