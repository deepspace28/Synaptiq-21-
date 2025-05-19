import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Beaker, Clock, Sparkles } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-sm text-gray-400">Getting started</p>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">Welcome to the Synaptiq Beta</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          Welcome to the Synaptiq beta documentation! You're among the first to experience our Scientific AI API. During
          this beta phase, we're actively developing and refining our models and APIs based on your feedback.
        </p>

        <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-8 border border-[#222222]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-white">Synaptiq 2: Beta Access</h2>
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
              </div>
              <p className="mt-2 text-gray-400">
                You now have access to Synaptiq 2, our newest and most intelligent family of scientific language models.
                Make your first API call in seconds.
              </p>
            </div>
            <Button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
              Get your API key
            </Button>
          </div>

          <div className="mt-12 flex">
            <div className="flex-1">
              <div className="relative mt-8 rounded-lg bg-[#0f0f0f] p-6">
                <div className="absolute -top-4 left-4 rounded bg-[#151515] px-2 py-1 text-xs text-gray-400">
                  python (OpenAI SDK)
                </div>
                <pre className="text-sm text-gray-300">
                  <code>
                    {`from openai import OpenAI

client = OpenAI(
    api_key=SYNAPTIQ_API_KEY,
    base_url="https://api.synaptiq.contact/v1",
)

completion = client.chat.completions.create(
    model="synaptiq-2-beta",
    messages=[
        {"role": "user", "content": "Explain quantum entanglement"}
    ]
)
`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-purple-600/30 bg-purple-950/20 p-4">
          <div className="flex items-start">
            <Beaker className="mr-3 h-5 w-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-400">Beta Program Information</h3>
              <p className="mt-1 text-sm text-purple-200/70">
                As a beta tester, you have early access to our API and models. We're actively developing and improving
                our services based on your feedback. Please note that during the beta:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-purple-200/70 list-disc pl-5">
                <li>APIs and features may change without notice</li>
                <li>There may be occasional service interruptions</li>
                <li>Some features may have limitations or be incomplete</li>
                <li>Your feedback is invaluable to help us improve</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Beta Quick Start</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 text-white">1</div>
            <h3 className="mt-3 font-medium text-white">Get your beta API key</h3>
            <p className="mt-1 text-sm text-gray-400">Generate your API key to start making requests</p>
            <Link href="/docs/api-keys" className="mt-3 flex items-center text-sm text-purple-400 hover:underline">
              <span>Get your API key</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 text-white">2</div>
            <h3 className="mt-3 font-medium text-white">Explore beta models</h3>
            <p className="mt-1 text-sm text-gray-400">Learn about our beta models and their capabilities</p>
            <Link href="/docs/models" className="mt-3 flex items-center text-sm text-purple-400 hover:underline">
              <span>Explore models</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 text-white">3</div>
            <h3 className="mt-3 font-medium text-white">Make your first request</h3>
            <p className="mt-1 text-sm text-gray-400">Send your first API request to Synaptiq</p>
            <Link href="/docs/guide" className="mt-3 flex items-center text-sm text-purple-400 hover:underline">
              <span>Follow the guide</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Beta Scientific Capabilities</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">Quantum Physics</h3>
              <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">BETA</span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Simulate quantum systems, solve quantum mechanical problems, and visualize results
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Updated 3 days ago</span>
            </div>
            <Link
              href="/docs/capabilities/quantum"
              className="mt-3 flex items-center text-sm text-purple-400 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">Mathematical Derivations</h3>
              <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">BETA</span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Generate step-by-step mathematical proofs with proper LaTeX formatting
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Updated 1 week ago</span>
            </div>
            <Link
              href="/docs/capabilities/math"
              className="mt-3 flex items-center text-sm text-purple-400 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">Research Analysis</h3>
              <span className="bg-yellow-600 text-white text-xs px-1.5 py-0.5 rounded-full">COMING SOON</span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Extract insights from scientific papers and summarize research findings
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Sparkles className="mr-1 h-3 w-3" />
              <span>Launching next week</span>
            </div>
            <Link
              href="/docs/capabilities/research"
              className="mt-3 flex items-center text-sm text-purple-400 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">Data Visualization</h3>
              <span className="bg-yellow-600 text-white text-xs px-1.5 py-0.5 rounded-full">COMING SOON</span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Create publication-ready visualizations of scientific data and results
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Sparkles className="mr-1 h-3 w-3" />
              <span>Launching in 2 weeks</span>
            </div>
            <Link
              href="/docs/capabilities/visualization"
              className="mt-3 flex items-center text-sm text-purple-400 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Beta Feedback</h2>
          <p className="mt-2 text-gray-400">
            Your feedback is crucial to improving Synaptiq during this beta phase. Please share your experiences, report
            issues, and suggest improvements.
          </p>
          <div className="mt-4 flex space-x-4">
            <Link
              href="/docs/beta/feedback"
              className="rounded-md border border-purple-600 bg-purple-600/10 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600/20"
            >
              Submit Feedback
            </Link>
            <Link
              href="/docs/beta/known-issues"
              className="rounded-md border border-[#333333] px-4 py-2 text-sm font-medium text-white hover:bg-[#222222]"
            >
              View Known Issues
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
