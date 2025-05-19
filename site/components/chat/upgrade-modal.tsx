"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScientificLogo } from "@/components/scientific-logo"
import { X, Check } from "lucide-react"
import Link from "next/link"

interface UpgradeModalProps {
  onClose: () => void
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border rounded-lg shadow-lg max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScientificLogo className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Upgrade to Premium</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">
          You've reached your query limit. Upgrade to Premium for unlimited access to Synaptiq's advanced scientific
          capabilities.
        </p>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Premium Plan</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited scientific queries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Advanced mathematical derivations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Interactive visualizations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href="/pricing">Upgrade Now</Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Continue with Limited Access
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
