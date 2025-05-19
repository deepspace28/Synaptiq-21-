import Link from "next/link"
import { ScientificLogo } from "@/components/scientific-logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0f0f0f] text-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <ScientificLogo className="h-6 w-6 text-white" />
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            &copy; {new Date().getFullYear()} Synaptiq Labs. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
            Privacy
          </Link>
          <Link href="/cookies" className="text-sm text-gray-400 hover:text-white">
            Cookies
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
