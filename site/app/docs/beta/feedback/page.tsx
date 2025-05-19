import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, AlertCircle, Lightbulb, Send } from "lucide-react"

export default function BetaFeedbackPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-sm text-gray-400">Beta Program</p>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">Providing Feedback</h1>
      </div>

      <div className="space-y-6 text-gray-300">
        <p className="text-lg">
          Your feedback is invaluable to us during this beta phase. It helps us identify issues, improve our models, and
          prioritize features that matter most to researchers and developers.
        </p>

        <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-6 border border-[#222222]">
          <h2 className="text-xl font-semibold text-white">How to Provide Feedback</h2>
          <p className="mt-2 text-gray-400">
            We offer multiple channels for you to share your experiences and suggestions:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#333333] p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="ml-3 font-medium text-white">In-App Feedback</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Use the feedback button in the API console to report issues or suggest improvements directly while using
                the platform.
              </p>
              <Button className="mt-4 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Open API Console
              </Button>
            </div>

            <div className="rounded-lg border border-[#333333] p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30">
                  <AlertCircle className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="ml-3 font-medium text-white">Issue Reports</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Report specific bugs, errors, or unexpected behaviors you encounter while using the Synaptiq API.
              </p>
              <Button className="mt-4 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Report an Issue
              </Button>
            </div>

            <div className="rounded-lg border border-[#333333] p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="ml-3 font-medium text-white">Feature Requests</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Suggest new features, improvements, or capabilities you'd like to see in future versions of Synaptiq.
              </p>
              <Button className="mt-4 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Suggest a Feature
              </Button>
            </div>

            <div className="rounded-lg border border-[#333333] p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30">
                  <ThumbsUp className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="ml-3 font-medium text-white">General Feedback</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Share your overall experience, impressions, and suggestions about the Synaptiq beta program.
              </p>
              <Button className="mt-4 w-full justify-center bg-[#333333] hover:bg-[#444444] text-white">
                Share Feedback
              </Button>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">Feedback Form</h2>
        <div className="rounded-lg border border-[#222222] p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="feedback-type" className="block text-sm font-medium text-white">
                Feedback Type
              </label>
              <select
                id="feedback-type"
                className="mt-1 block w-full rounded-md border border-[#333333] bg-[#151515] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              >
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Model Improvement</option>
                <option>Documentation Feedback</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="mt-1 block w-full rounded-md border border-[#333333] bg-[#151515] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                placeholder="Brief description of your feedback"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                className="mt-1 block w-full rounded-md border border-[#333333] bg-[#151515] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                placeholder="Please provide detailed information about your feedback, including steps to reproduce if reporting an issue"
              ></textarea>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-white">
                Model (if applicable)
              </label>
              <select
                id="model"
                className="mt-1 block w-full rounded-md border border-[#333333] bg-[#151515] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              >
                <option>Not applicable</option>
                <option>synaptiq-2-beta</option>
                <option>synaptiq-2-mini-beta</option>
                <option>synaptiq-2-quantum-beta</option>
                <option>synaptiq-2-math-beta</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border border-[#333333] bg-[#151515] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                placeholder="Your email if you'd like us to follow up"
              />
            </div>

            <div className="pt-4">
              <Button className="flex items-center bg-purple-600 hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-white">What Happens to Your Feedback</h2>
        <p>
          All feedback is reviewed by our team and prioritized based on impact and alignment with our roadmap. Here's
          what happens after you submit feedback:
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-[#222222] p-4">
            <h3 className="font-medium text-white">1. Review</h3>
            <p className="mt-1 text-sm text-gray-400">
              Our team reviews your feedback and categorizes it based on type and priority.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <h3 className="font-medium text-white">2. Prioritization</h3>
            <p className="mt-1 text-sm text-gray-400">
              We prioritize feedback based on impact, frequency, and alignment with our development roadmap.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <h3 className="font-medium text-white">3. Implementation</h3>
            <p className="mt-1 text-sm text-gray-400">
              High-priority items are added to our development sprint for implementation.
            </p>
          </div>

          <div className="rounded-lg border border-[#222222] p-4">
            <h3 className="font-medium text-white">4. Communication</h3>
            <p className="mt-1 text-sm text-gray-400">
              We'll keep you updated on the status of your feedback through our beta newsletter and changelog.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-purple-950/20 p-6 border border-purple-600/30">
          <h2 className="text-xl font-semibold text-white">Thank You!</h2>
          <p className="mt-2 text-gray-300">
            We greatly appreciate your participation in our beta program and the time you take to provide feedback. Your
            input directly shapes the future of Synaptiq and helps us build a better product for the scientific
            community.
          </p>
        </div>
      </div>
    </div>
  )
}
