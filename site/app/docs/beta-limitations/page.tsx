import Link from "next/link"
import { AlertCircle, Clock, ArrowRight } from "lucide-react"

export default function BetaLimitationsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-sm text-gray-400">Getting Started</p>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">Beta Limitations</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-950/20 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-3 h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-500">Beta Status</h3>
              <p className="mt-1 text-sm text-yellow-200/70">
                Synaptiq is currently in beta. The limitations listed on this page are temporary and will be addressed
                before the general availability release.
              </p>
            </div>
          </div>
        </div>

        <p>
          During the beta phase, Synaptiq has certain limitations that you should be aware of when building with our
          API. We're actively working to address these limitations and appreciate your patience and feedback.
        </p>

        <h2 className="mt-8 text-2xl font-semibold text-white">Current Beta Limitations</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-[#222222] p-6">
            <h3 className="text-xl font-medium text-white">API Rate Limits</h3>
            <p className="mt-2 text-gray-400">During the beta, all accounts have the following rate limits:</p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maximum of 60 requests per minute</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maximum of 10,000 tokens per minute</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maximum of 100,000 tokens per day</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Expected to increase in 2 weeks</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-6">
            <h3 className="text-xl font-medium text-white">Model Limitations</h3>
            <p className="mt-2 text-gray-400">Our beta models have the following limitations:</p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maximum context length of 16,000 tokens (will increase to 32,000 in the full release)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Limited knowledge of scientific papers published after January 2023</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Occasional inconsistencies in mathematical derivations for very complex problems</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Quantum simulation accuracy may vary for systems with more than 10 qubits</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Continuous improvements throughout beta</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-6">
            <h3 className="text-xl font-medium text-white">Feature Availability</h3>
            <p className="mt-2 text-gray-400">Some features are not yet available in the beta:</p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Advanced data visualization capabilities (coming in 2 weeks)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Full research paper analysis (coming next week)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Custom fine-tuning of models (coming before general availability)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Batch processing for large-scale simulations (coming before general availability)</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Feature roadmap updated weekly</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-6">
            <h3 className="text-xl font-medium text-white">API Stability</h3>
            <p className="mt-2 text-gray-400">During the beta phase:</p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>API endpoints may change with limited notice</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Response formats may be updated and improved</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Occasional planned maintenance windows (announced 24 hours in advance)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Model behavior may change as we improve capabilities</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>API will stabilize before general availability</span>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Reporting Issues</h2>
        <p>
          If you encounter any issues or limitations not listed here, please report them through our beta feedback
          channel. Your feedback helps us improve Synaptiq for everyone.
        </p>

        <div className="mt-4">
          <Link
            href="/docs/beta/feedback"
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <span>Submit Beta Feedback</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Beta Roadmap</h2>
        <p>
          We're continuously working to improve Synaptiq and address the limitations mentioned above. Visit our roadmap
          page to see what improvements are coming and when.
        </p>

        <div className="mt-4">
          <Link href="/docs/beta/roadmap" className="inline-flex items-center text-purple-400 hover:text-purple-300">
            <span>View Beta Roadmap</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
