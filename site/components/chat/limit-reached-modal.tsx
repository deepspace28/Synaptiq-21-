"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScientificLogo } from "@/components/scientific-logo"
import { X } from "lucide-react"
import Link from "next/link"
import { LoginModal } from "./login-modal"

interface LimitReachedModalProps {
  isGuest: boolean
  onClose: () => void
}

export function LimitReachedModal({ isGuest, onClose }: LimitReachedModalProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ScientificLogo className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Beta Access Required</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <p className="text-gray-300 mb-6">
            {isGuest
              ? "Enjoying Synaptiq? Request beta access to continue exploring advanced scientific insights."
              : "You've reached your query limit. Upgrade to our Premium subscription for unlimited access to Synaptiq's advanced capabilities."}
          </p>

          <div className="flex flex-col gap-3">
            {isGuest ? (
              <>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/beta-access">Request Beta Access</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLoginModal(true)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Already have an account? Log in
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/pricing">Upgrade to Premium</Link>
                </Button>
                <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Continue with limited access
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </AnimatePresence>
  )
}
