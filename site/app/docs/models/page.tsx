import { Button } from "@/components/ui/button"

export default function ModelsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Getting Started</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Models</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p>
          An overview of our models' capabilities and their associated pricing. Our Synaptiq models come in two
          variants: a standard and a specialized version.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="mb-4 inline-block rounded bg-black px-3 py-1 text-white">SYNAPTIQ 2</div>
              <h3 className="text-xl font-semibold text-white">Synaptiq 2</h3>
              <p className="mt-2 text-gray-400">
                Our flagship model that excels at scientific research tasks like data analysis, mathematical
                derivations, and literature review. Possesses deep domain knowledge in physics, mathematics, chemistry,
                and biology.
              </p>
              <Button className="mt-6 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Example Usage
              </Button>
              <div className="mt-6 border-t border-[#333333] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Input</span>
                  <span className="text-sm text-yellow-400">Coming soon</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Output</span>
                  <span className="text-sm text-yellow-400">Coming soon</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="mb-4 inline-block rounded bg-black px-3 py-1 text-white">SYNAPTIQ 2 MINI</div>
              <h3 className="text-xl font-semibold text-white">Synaptiq 2 Mini</h3>
              <p className="mt-2 text-gray-400">
                A lightweight model that thinks before responding. Fast, smart, and great for logic-based scientific
                tasks that do not require deep domain knowledge. The reasoning traces are accessible.
              </p>
              <Button className="mt-6 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Example Usage
              </Button>
              <div className="mt-6 border-t border-[#333333] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Input</span>
                  <span className="text-sm text-yellow-400">Coming soon</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Output</span>
                  <span className="text-sm text-yellow-400">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Specialized Models</h2>
          <p className="mt-2 text-gray-400">
            In addition to our general scientific models, we offer specialized models optimized for specific domains:
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
              <h3 className="font-medium text-white">synaptiq-2-quantum</h3>
              <p className="mt-1 text-sm text-gray-400">
                Optimized for quantum physics simulations and calculations, with enhanced visualization capabilities.
              </p>
              <div className="mt-2 text-sm text-blue-400">Available now</div>
            </div>
            <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
              <h3 className="font-medium text-white">synaptiq-2-math</h3>
              <p className="mt-1 text-sm text-gray-400">
                Specialized for mathematical derivations, proofs, and problem-solving with LaTeX support.
              </p>
              <div className="mt-2 text-sm text-blue-400">Available now</div>
            </div>
            <div className="rounded-lg border border-[#222222] p-4 hover:border-[#333333] transition-colors">
              <h3 className="font-medium text-white">synaptiq-2-research</h3>
              <p className="mt-1 text-sm text-gray-400">
                Designed for scientific literature analysis, research paper generation, and citation management.
              </p>
              <div className="mt-2 text-sm text-blue-400">Available now</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">Model Selection Guide</h2>
          <p className="mt-2 text-gray-400">
            Not sure which model to use? Here's a quick guide to help you choose the right model for your needs:
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-[#222222] p-4">
              <h3 className="font-medium text-white">General Scientific Tasks</h3>
              <p className="mt-1 text-sm text-gray-400">
                For most scientific tasks, including data analysis, literature review, and general scientific questions,
                use <span className="text-white">synaptiq-2</span>.
              </p>
            </div>
            <div className="rounded-lg border border-[#222222] p-4">
              <h3 className="font-medium text-white">Quick Responses</h3>
              <p className="mt-1 text-sm text-gray-400">
                For faster responses and simpler scientific tasks, use{" "}
                <span className="text-white">synaptiq-2-mini</span>.
              </p>
            </div>
            <div className="rounded-lg border border-[#222222] p-4">
              <h3 className="font-medium text-white">Specialized Tasks</h3>
              <p className="mt-1 text-sm text-gray-400">
                For domain-specific tasks, use the specialized models like{" "}
                <span className="text-white">synaptiq-2-quantum</span> or{" "}
                <span className="text-white">synaptiq-2-math</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
