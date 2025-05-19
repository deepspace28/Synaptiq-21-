import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GuidePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Getting Started</p>
        <h1 className="mt-2 text-4xl font-bold text-white">The Researcher's Guide to Synaptiq</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          This guide will help you get started with the Synaptiq API for scientific research and applications.
        </p>

        <h2 className="text-2xl font-semibold text-white">1. Create an API Key</h2>
        <p>
          To use the Synaptiq API, you'll need to create an API key. This key authenticates your requests and tracks
          your usage.
        </p>
        <Button className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
          Create an API key
        </Button>

        <h2 className="mt-8 text-2xl font-semibold text-white">2. Choose a Model</h2>
        <p>
          Synaptiq offers several models optimized for different scientific tasks. The main models available through the
          API are:
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-[#333333] p-4">
            <h3 className="font-medium text-white">synaptiq-2</h3>
            <p className="mt-1 text-sm text-gray-400">
              Our most advanced model for general scientific tasks, with strong capabilities in physics, mathematics,
              and chemistry.
            </p>
          </div>
          <div className="rounded-lg border border-[#333333] p-4">
            <h3 className="font-medium text-white">synaptiq-2-quantum</h3>
            <p className="mt-1 text-sm text-gray-400">
              Specialized for quantum physics simulations and calculations, with enhanced visualization capabilities.
            </p>
          </div>
          <div className="rounded-lg border border-[#333333] p-4">
            <h3 className="font-medium text-white">synaptiq-2-math</h3>
            <p className="mt-1 text-sm text-gray-400">
              Optimized for mathematical derivations, proofs, and problem-solving with LaTeX support.
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">3. Make Your First API Call</h2>
        <p>
          You can interact with the Synaptiq API using the OpenAI SDK or direct REST API calls. Here's an example using
          the Python SDK:
        </p>

        <div className="mt-4 rounded-lg bg-[#1a1a1a] p-6">
          <pre className="text-sm text-gray-300">
            <code>
              {`from openai import OpenAI

client = OpenAI(
    api_key=SYNAPTIQ_API_KEY,
    base_url="https://api.synaptiq.contact/v1",
)

completion = client.chat.completions.create(
    model="synaptiq-2",
    messages=[
        {"role": "user", "content": "Explain the double-slit experiment in quantum mechanics"}
    ]
)

print(completion.choices[0].message.content)
`}
            </code>
          </pre>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">4. Understand Response Formats</h2>
        <p>
          Synaptiq can return responses in various formats, including plain text, LaTeX for mathematical expressions,
          and structured data for visualizations.
        </p>

        <h3 className="mt-4 text-xl font-medium text-white">LaTeX for Mathematical Expressions</h3>
        <p className="text-sm text-gray-400">
          Request LaTeX formatting for mathematical expressions by specifying it in your prompt:
        </p>

        <div className="mt-2 rounded-lg bg-[#1a1a1a] p-4">
          <pre className="text-sm text-gray-300">
            <code>{`"Derive the Schrödinger equation and format all mathematics using LaTeX"`}</code>
          </pre>
        </div>

        <h3 className="mt-4 text-xl font-medium text-white">Structured Data for Visualizations</h3>
        <p className="text-sm text-gray-400">
          Request structured data for visualizations by specifying the format in your prompt:
        </p>

        <div className="mt-2 rounded-lg bg-[#1a1a1a] p-4">
          <pre className="text-sm text-gray-300">
            <code>
              {`"Simulate a quantum harmonic oscillator and provide the data in JSON format for visualization"`}
            </code>
          </pre>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">5. Explore Advanced Features</h2>
        <p>Synaptiq offers several advanced features for scientific research:</p>

        <ul className="ml-6 mt-4 list-disc space-y-2">
          <li>
            <span className="font-medium text-white">Quantum Simulations:</span> Run complex quantum physics simulations
            with visualization support
          </li>
          <li>
            <span className="font-medium text-white">Mathematical Derivations:</span> Generate step-by-step mathematical
            proofs and derivations
          </li>
          <li>
            <span className="font-medium text-white">Literature Analysis:</span> Extract insights from scientific papers
            and research
          </li>
          <li>
            <span className="font-medium text-white">Data Visualization:</span> Create publication-ready visualizations
            of scientific data
          </li>
        </ul>

        <div className="mt-8 rounded-lg bg-[#1a1a1a] p-6">
          <h3 className="text-xl font-medium text-white">Next Steps</h3>
          <p className="mt-2 text-gray-400">
            Now that you understand the basics, explore our detailed guides for specific use cases:
          </p>
          <div className="mt-4 space-y-2">
            <Link href="/docs/quantum" className="block text-blue-400 hover:underline">
              Quantum Physics Simulations →
            </Link>
            <Link href="/docs/math" className="block text-blue-400 hover:underline">
              Mathematical Derivations →
            </Link>
            <Link href="/docs/research" className="block text-blue-400 hover:underline">
              Research Paper Analysis →
            </Link>
            <Link href="/docs/visualization" className="block text-blue-400 hover:underline">
              Scientific Data Visualization →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
