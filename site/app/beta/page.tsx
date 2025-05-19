"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScientificLogo } from "@/components/scientific-logo"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BetaSignupPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [institution, setInstitution] = useState("")
  const [role, setRole] = useState("")
  const [researchArea, setResearchArea] = useState("")
  const [interests, setInterests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      window.scrollTo(0, 0)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container max-w-4xl py-12">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-lg shadow-lg p-8 text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle className="text-primary h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Request Submitted</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Thank you for your interest in Synaptiq! We'll review your request and be in touch soon.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ScientificLogo className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold">Join the Synaptiq Beta</h1>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Synaptiq is currently in private beta. Fill out the form below to request access and be among the first to
              experience our advanced scientific AI platform.
            </p>

            <div className="bg-card border rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane.smith@university.edu"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-base">
                      Institution/Organization
                    </Label>
                    <Input
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="University of Science"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-base">
                      Role
                    </Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger id="role" className="h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="industry">Industry Professional</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="researchArea" className="text-base">
                    Primary Research Area
                  </Label>
                  <Select value={researchArea} onValueChange={setResearchArea} required>
                    <SelectTrigger id="researchArea" className="h-12">
                      <SelectValue placeholder="Select your research area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quantum">Quantum Physics</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="computerScience">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-base">
                    How do you plan to use Synaptiq?
                  </Label>
                  <Textarea
                    id="interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Please describe your research interests and how you plan to use Synaptiq..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Beta Access"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
