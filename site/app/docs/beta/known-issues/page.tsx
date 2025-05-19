import { AlertCircle, Bug, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function KnownIssuesPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-sm text-gray-400">Beta Program</p>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">Known Issues</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          This page lists known issues in the current beta version of Synaptiq. We're actively working to address these
          issues and appreciate your patience.
        </p>

        <div className="rounded-lg border border-yellow-600/30 bg-yellow-950/20 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-3 h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-500">Beta Status</h3>
              <p className="mt-1 text-sm text-yellow-200/70">
                This list is updated regularly as issues are identified and resolved. Last updated: May 15, 2023.
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">API Issues</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 mr-3">
                <Bug className="h-3 w-3 text-red-400" />
              </div>
              <h3 className="font-medium text-white">Intermittent 429 Errors</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 8, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Some users may experience intermittent 429 (Too Many Requests) errors even when below their rate limits.
              We're investigating this issue and working on a fix.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                In Progress
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 mr-3">
                <Bug className="h-3 w-3 text-red-400" />
              </div>
              <h3 className="font-medium text-white">Inconsistent Response Times</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 10, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Response times may vary significantly between requests, especially for complex scientific simulations.
              We're optimizing our infrastructure to provide more consistent performance.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                In Progress
              </span>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Model Issues</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 mr-3">
                <Bug className="h-3 w-3 text-red-400" />
              </div>
              <h3 className="font-medium text-white">Mathematical Derivation Errors</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 7, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              For very complex mathematical problems, the model may occasionally produce errors in derivations. We're
              improving the model's mathematical reasoning capabilities.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                In Progress
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 mr-3">
                <Bug className="h-3 w-3 text-red-400" />
              </div>
              <h3 className="font-medium text-white">Quantum Simulation Accuracy</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 9, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Quantum simulations with more than 10 qubits may have reduced accuracy. We're working on improving the
              model's quantum simulation capabilities for larger systems.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                In Progress
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/30 mr-3">
                <Bug className="h-3 w-3 text-green-400" />
              </div>
              <h3 className="font-medium text-white">LaTeX Formatting Issues</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 5, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Some complex LaTeX expressions may not render correctly in the API response. This issue has been fixed in
              the latest update.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-green-900/30 px-2 py-0.5 text-xs text-green-400">Fixed</span>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Documentation Issues</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-900/30 mr-3">
                <Bug className="h-3 w-3 text-red-400" />
              </div>
              <h3 className="font-medium text-white">Incomplete API Reference</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 11, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Some API endpoints are not fully documented. We're working on completing the API reference documentation.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                In Progress
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/30 mr-3">
                <Bug className="h-3 w-3 text-green-400" />
              </div>
              <h3 className="font-medium text-white">Code Example Errors</h3>
              <span className="ml-auto text-xs text-gray-400">Identified: May 6, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Some code examples in the documentation contained errors. These have been corrected in the latest update.
            </p>
            <div className="mt-2 pl-9">
              <span className="inline-block rounded bg-green-900/30 px-2 py-0.5 text-xs text-green-400">Fixed</span>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Reporting New Issues</h2>
        <p>
          If you encounter an issue that is not listed here, please report it through our beta feedback channel. Your
          reports help us identify and fix issues quickly.
        </p>

        <div className="mt-4">
          <Link
            href="/docs/beta/feedback"
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <span>Report an Issue</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Issue Resolution Process</h2>
          <p className="mt-2 text-gray-400">Here's how we handle reported issues:</p>
          <ol className="mt-4 space-y-2 text-gray-400 list-decimal pl-5">
            <li>Issues are reviewed and prioritized based on severity and impact</li>
            <li>High-priority issues are addressed immediately</li>
            <li>Updates are released regularly to fix identified issues</li>
            <li>Fixed issues are marked as resolved on this page</li>
            <li>All beta users are notified of significant fixes via email</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
