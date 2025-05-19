import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IntroductionPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Introduction</p>
        <h1 className="mt-2 text-4xl font-bold text-white">What is Synaptiq?</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p>
          Synaptiq is a family of Scientific Language Models (SLMs) developed by{" "}
          <Link href="/" className="text-purple-400 hover:underline">
            Synaptiq
          </Link>
          .
        </p>

        <p>
          Inspired by the scientific method, Synaptiq is a maximally truth-seeking AI that provides insightful,
          unfiltered truths about scientific phenomena and mathematical concepts.
        </p>

        <p>
          Synaptiq offers an API for developers to programmatically interact with our Synaptiq{" "}
          <span className="font-medium text-white">models</span>. The same models power our consumer facing services
          such as{" "}
          <Link href="/" className="font-medium text-white hover:underline">
            Synaptiq.contact
          </Link>
          , the <span className="font-medium text-white">iOS</span> and{" "}
          <span className="font-medium text-white">Android</span> apps, as well as{" "}
          <span className="font-medium text-white">Synaptiq in X experience</span>.
        </p>

        <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-8 border border-[#222222]">
          <h2 className="text-2xl font-semibold text-white">Build with Synaptiq 2</h2>
          <p className="mt-2 text-gray-400">
            To access the Synaptiq 2 models via API, please create a Synaptiq account and an API key.
          </p>
          <Button className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
            Create an API key
          </Button>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">
          What is the Synaptiq API? How is it different from Synaptiq in other services?
        </h2>
        <p>
          The Synaptiq API is a toolkit for developers to integrate Synaptiq's scientific models into their own
          applications; the Synaptiq API provides the building blocks to create new AI experiences for scientific
          research and education.
        </p>

        <p>
          To get started building with the Synaptiq API, please head to{" "}
          <Link href="/docs/guide" className="font-medium text-white hover:underline">
            The Researcher's Guide to Synaptiq
          </Link>
          .
        </p>

        <h2 className="mt-8 text-2xl font-semibold text-white">Synaptiq API use cases in science</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <h3 className="font-medium text-white">Quantum Physics Simulations</h3>
            <p className="mt-1 text-sm text-gray-400">
              Run complex quantum simulations with unprecedented accuracy and visualization capabilities.
            </p>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <h3 className="font-medium text-white">Mathematical Problem Solving</h3>
            <p className="mt-1 text-sm text-gray-400">
              Generate step-by-step solutions to complex mathematical problems with proper LaTeX formatting.
            </p>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <h3 className="font-medium text-white">Research Paper Analysis</h3>
            <p className="mt-1 text-sm text-gray-400">
              Extract key insights, methodologies, and findings from scientific literature.
            </p>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <h3 className="font-medium text-white">Scientific Data Visualization</h3>
            <p className="mt-1 text-sm text-gray-400">
              Create publication-ready visualizations of complex scientific data and results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
