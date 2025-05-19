import Link from "next/link"

export default function LimitsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Getting Started</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Consumption and Rate Limits</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p>
          Each <span className="bg-[#222222] px-1.5 py-0.5 rounded text-white">synaptiq</span> model has different rate
          limits. To check your team's rate limits, you can visit{" "}
          <Link href="/console" className="text-purple-400 hover:underline">
            Synaptiq Console Models Page
          </Link>
          .
        </p>

        <h2 className="mt-8 text-2xl font-semibold text-white">Basic unit to calculate consumption — Tokens</h2>
        <p>
          Token is the base unit of prompt size for model inference and pricing purposes. It is consisted of one or more
          character(s)/symbol(s).
        </p>

        <p>
          When a Synaptiq model handles your request, an input prompt will be decomposed into a list of tokens through a
          tokenizer. The model will then make inference based on the prompt tokens, and generate completion tokens.
          After the inference is completed, the completion tokens will be aggregated into a completion response sent
          back to you.
        </p>

        <p>
          You can use{" "}
          <Link href="/tokenizer" className="text-purple-400 hover:underline">
            Tokenizer
          </Link>{" "}
          on Synaptiq Console to visualize tokens and count total token counts for a given text prompt.
        </p>

        <div className="mt-4 rounded-lg border border-[#222222] overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6tTpf0Or2rWSYKepSulSoyGierqnRF.png"
            alt="Tokenizer interface"
            className="w-full h-auto"
            width={800}
            height={400}
          />
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Rate Limits</h2>
        <p>
          Rate limits are enforced to ensure fair usage of the API and to prevent abuse. Rate limits are applied at the
          team level, not at the individual user level.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-[#222222] rounded-lg overflow-hidden">
            <thead className="bg-[#151515]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Model</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">RPM (Requests per Minute)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">TPM (Tokens per Minute)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] bg-[#0f0f0f]">
              <tr>
                <td className="px-4 py-3 text-sm text-white">synaptiq-2</td>
                <td className="px-4 py-3 text-sm text-white">60</td>
                <td className="px-4 py-3 text-sm text-white">100,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-white">synaptiq-2-mini</td>
                <td className="px-4 py-3 text-sm text-white">120</td>
                <td className="px-4 py-3 text-sm text-white">150,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-white">synaptiq-2-quantum</td>
                <td className="px-4 py-3 text-sm text-white">30</td>
                <td className="px-4 py-3 text-sm text-white">80,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-white">synaptiq-2-math</td>
                <td className="px-4 py-3 text-sm text-white">40</td>
                <td className="px-4 py-3 text-sm text-white">90,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h3 className="text-lg font-medium text-white">Need higher rate limits?</h3>
          <p className="mt-2">
            If you need higher rate limits for your application, please{" "}
            <Link href="/contact" className="text-purple-400 hover:underline">
              contact our sales team
            </Link>{" "}
            to discuss enterprise options.
          </p>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Handling Rate Limits</h2>
        <p>
          When you exceed your rate limits, the API will return a 429 Too Many Requests error. Your application should
          be designed to handle these errors gracefully, typically by implementing exponential backoff retry logic.
        </p>

        <div className="mt-4 rounded-lg bg-[#151515] p-6">
          <pre className="text-sm text-gray-300">
            <code>
              {`{
  "error": {
    "message": "Rate limit exceeded: 60 requests per minute. Please try again later.",
    "type": "rate_limit_error",
    "param": null,
    "code": "rate_limit_exceeded"
  }
}`}
            </code>
          </pre>
        </div>

        <h3 className="mt-6 text-xl font-medium text-white">Recommended Retry Strategy</h3>
        <p>Here's a recommended approach for handling rate limits:</p>

        <div className="mt-4 rounded-lg bg-[#151515] p-6">
          <pre className="text-sm text-gray-300">
            <code>
              {`import time
import random
from openai import OpenAI
from openai.error import RateLimitError

client = OpenAI(
    api_key=SYNAPTIQ_API_KEY,
    base_url="https://api.synaptiq.contact/v1",
)

def make_request_with_retry(max_retries=5):
    retries = 0
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="synaptiq-2",
                messages=[
                    {"role": "user", "content": "Explain quantum entanglement"}
                ]
            )
            return response
        except RateLimitError as e:
            retries += 1
            if retries >= max_retries:
                raise e
            
            # Exponential backoff with jitter
            sleep_time = (2 ** retries) + random.random()
            print(f"Rate limit exceeded. Retrying in {sleep_time:.2f} seconds...")
            time.sleep(sleep_time)
`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
