import { Clock, Check, ArrowRight } from "lucide-react"

export default function BetaRoadmapPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-sm text-gray-400">Beta Program</p>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">Beta Roadmap</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          Our beta roadmap outlines the features, improvements, and fixes we're working on for the Synaptiq API. This
          roadmap is updated regularly based on user feedback and our development progress.
        </p>

        <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Current Beta Phase: 1.0 Beta</h2>
          <p className="mt-2 text-gray-400">
            We're currently in the first phase of our beta program, focusing on core functionality and gathering initial
            feedback from our beta users.
          </p>
          <div className="mt-4 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
            <span className="text-sm text-green-400">Active</span>
            <span className="mx-2 text-gray-500">•</span>
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-400">Started May 1, 2023</span>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Recently Completed</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4 bg-green-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/30 mr-3">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <h3 className="font-medium text-white">Core API Functionality</h3>
              <span className="ml-auto text-xs text-gray-400">May 5, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Released the core API functionality including chat completions and basic scientific simulations.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4 bg-green-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/30 mr-3">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <h3 className="font-medium text-white">Quantum Physics Simulations</h3>
              <span className="ml-auto text-xs text-gray-400">May 10, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Added support for quantum physics simulations including quantum circuits and entanglement visualization.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4 bg-green-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/30 mr-3">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <h3 className="font-medium text-white">Mathematical Derivations</h3>
              <span className="ml-auto text-xs text-gray-400">May 12, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Added support for step-by-step mathematical derivations with LaTeX formatting.
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">In Progress</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4 bg-blue-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900/30 mr-3">
                <Clock className="h-3 w-3 text-blue-400" />
              </div>
              <h3 className="font-medium text-white">Research Paper Analysis</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: May 20, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Adding support for analyzing scientific papers, extracting key insights, and summarizing findings.
            </p>
            <div className="mt-2 w-full bg-[#222222] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4 bg-blue-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900/30 mr-3">
                <Clock className="h-3 w-3 text-blue-400" />
              </div>
              <h3 className="font-medium text-white">Advanced Data Visualization</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: May 25, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Adding support for generating publication-ready visualizations of scientific data and results.
            </p>
            <div className="mt-2 w-full bg-[#222222] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>

          <div className="rounded-lg border border-[#222222] p-4 bg-blue-950/10">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900/30 mr-3">
                <Clock className="h-3 w-3 text-blue-400" />
              </div>
              <h3 className="font-medium text-white">Increased Rate Limits</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: May 30, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Increasing API rate limits for all beta users to support more intensive research workloads.
            </p>
            <div className="mt-2 w-full bg-[#222222] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Coming Soon</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 mr-3">
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </div>
              <h3 className="font-medium text-white">Custom Model Fine-tuning</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: June 10, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Adding support for fine-tuning models on custom scientific datasets for specialized research domains.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 mr-3">
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </div>
              <h3 className="font-medium text-white">Batch Processing</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: June 15, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Adding support for batch processing of large-scale scientific simulations and analyses.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 mr-3">
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </div>
              <h3 className="font-medium text-white">Extended Context Length</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: June 20, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Increasing the maximum context length from 16,000 to 32,000 tokens for all models.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 mr-3">
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </div>
              <h3 className="font-medium text-white">Knowledge Update</h3>
              <span className="ml-auto text-xs text-gray-400">Expected: June 25, 2023</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 pl-9">
              Updating model knowledge to include scientific papers published up to May 2023.
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Beta Program Timeline</h2>
        <div className="relative mt-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#333333]"></div>

          <div className="relative pl-12 pb-8">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-900/30 border-4 border-[#0f0f0f]">
              <Check className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="font-medium text-white">Beta Phase 1: Core Functionality</h3>
            <p className="mt-1 text-sm text-gray-400">May 1 - May 31, 2023</p>
            <p className="mt-2 text-sm text-gray-400">
              Initial release of core API functionality, quantum simulations, and mathematical derivations. Focus on
              gathering feedback and improving stability.
            </p>
          </div>

          <div className="relative pl-12 pb-8">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/30 border-4 border-[#0f0f0f]">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="font-medium text-white">Beta Phase 2: Advanced Features</h3>
            <p className="mt-1 text-sm text-gray-400">June 1 - June 30, 2023</p>
            <p className="mt-2 text-sm text-gray-400">
              Adding advanced features including research paper analysis, data visualization, custom fine-tuning, and
              batch processing. Increasing rate limits and context length.
            </p>
          </div>

          <div className="relative pl-12 pb-8">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 border-4 border-[#0f0f0f]">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="font-medium text-white">Beta Phase 3: Optimization</h3>
            <p className="mt-1 text-sm text-gray-400">July 1 - July 31, 2023</p>
            <p className="mt-2 text-sm text-gray-400">
              Optimizing performance, improving accuracy, and addressing feedback from beta users. Preparing for general
              availability release.
            </p>
          </div>

          <div className="relative pl-12">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/30 border-4 border-[#0f0f0f]">
              <ArrowRight className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="font-medium text-white">General Availability</h3>
            <p className="mt-1 text-sm text-gray-400">August 1, 2023</p>
            <p className="mt-2 text-sm text-gray-400">
              Full public release of Synaptiq API with all features, optimized performance, and stable API.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Feedback-Driven Development</h2>
          <p className="mt-2 text-gray-400">
            Our roadmap is dynamic and evolves based on your feedback. If you have suggestions for features or
            improvements you'd like to see, please share them through our feedback channels.
          </p>
          <div className="mt-4">
            <a href="/docs/beta/feedback" className="inline-flex items-center text-purple-400 hover:text-purple-300">
              <span>Submit Feedback</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
