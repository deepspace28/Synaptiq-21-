"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInUp, StaggerChildren, StaggerItem } from "@/components/motion"

export function TechnologyHighlightsEnhanced() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <FadeInUp>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Advanced Scientific AI Capabilities
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Cutting-edge technology powering scientific discovery and innovation
              </p>
            </div>
          </div>
        </FadeInUp>
        <StaggerChildren className="mx-auto grid gap-8 py-12 md:grid-cols-2">
          {/* Quantum-Attention Neural Networks */}
          <StaggerItem>
            <motion.div whileHover={{ y: -5 }} className="h-full">
              <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm hover-glow h-full">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex items-center justify-center bg-foreground/5 p-8 md:w-1/3">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M32 16C32 18.2091 30.2091 20 28 20C25.7909 20 24 18.2091 24 16C24 13.7909 25.7909 12 28 12C30.2091 12 32 13.7909 32 16Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M48 32C48 34.2091 46.2091 36 44 36C41.7909 36 40 34.2091 40 32C40 29.7909 41.7909 28 44 28C46.2091 28 48 29.7909 48 32Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M32 48C32 50.2091 30.2091 52 28 52C25.7909 52 24 50.2091 24 48C24 45.7909 25.7909 44 28 44C30.2091 44 32 45.7909 32 48Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 32C16 34.2091 14.2091 36 12 36C9.79086 36 8 34.2091 8 32C8 29.7909 9.79086 28 12 28C14.2091 28 16 29.7909 16 32Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M28 20L12 28"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 4"
                        />
                        <path
                          d="M44 28L28 20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 4"
                        />
                        <path
                          d="M44 36L28 44"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 4"
                        />
                        <path
                          d="M28 44L12 36"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 4"
                        />
                        <circle cx="28" cy="16" r="2" fill="currentColor" />
                        <circle cx="44" cy="32" r="2" fill="currentColor" />
                        <circle cx="28" cy="48" r="2" fill="currentColor" />
                        <circle cx="12" cy="32" r="2" fill="currentColor" />
                        <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="2" />
                        <path d="M32 29V35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M29 32H35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-2 p-6 md:w-2/3">
                      <h3 className="text-xl font-bold">Quantum-Attention Neural Networks</h3>
                      <p className="text-muted-foreground">
                        Our proprietary QANN architecture combines quantum computing principles with attention
                        mechanisms to process complex scientific data with unprecedented accuracy and efficiency.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Quantum-inspired tensor networks
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Multi-head scientific attention
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Entanglement-based information processing
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          {/* Scientific Datasets & Symbolic Math Engines */}
          <StaggerItem>
            <motion.div whileHover={{ y: -5 }} className="h-full">
              <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm hover-glow h-full">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex items-center justify-center bg-foreground/5 p-8 md:w-1/3">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <rect x="8" y="12" width="48" height="40" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 20H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 28H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 36H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 44H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M46 36L50 44"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M54 36L50 44"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M44 40H56"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M42 32C42 33.1046 41.1046 34 40 34C38.8954 34 38 33.1046 38 32C38 30.8954 38.8954 30 40 30C41.1046 30 42 30.8954 42 32Z"
                          fill="currentColor"
                        />
                        <path
                          d="M50 32C50 33.1046 49.1046 34 48 34C46.8954 34 46 33.1046 46 32C46 30.8954 46.8954 30 48 30C49.1046 30 50 30.8954 50 32Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2 p-6 md:w-2/3">
                      <h3 className="text-xl font-bold">Scientific Datasets & Symbolic Math Engines</h3>
                      <p className="text-muted-foreground">
                        Trained on petabytes of peer-reviewed scientific literature and integrated with symbolic
                        mathematics engines for rigorous mathematical reasoning and derivation capabilities.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          10+ million scientific papers analyzed
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Symbolic integration with SymPy and Mathematica
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Automated theorem proving capabilities
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          {/* Quantum Simulation Frameworks */}
          <StaggerItem>
            <motion.div whileHover={{ y: -5 }} className="h-full">
              <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm hover-glow h-full">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex items-center justify-center bg-foreground/5 p-8 md:w-1/3">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path d="M32 8V56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 32H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <rect x="28" y="16" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="28" y="40" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="16" y="28" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="40" y="28" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 26L44 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 44L26 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 38L44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="space-y-2 p-6 md:w-2/3">
                      <h3 className="text-xl font-bold">Quantum Simulation Frameworks</h3>
                      <p className="text-muted-foreground">
                        Seamless integration with Qiskit and PennyLane enables high-fidelity quantum simulations,
                        allowing researchers to model complex quantum systems without specialized hardware.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Qiskit & PennyLane integration
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Quantum circuit optimization
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Error mitigation techniques
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          {/* AI Peer Review & Validation */}
          <StaggerItem>
            <motion.div whileHover={{ y: -5 }} className="h-full">
              <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm hover-glow h-full">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex items-center justify-center bg-foreground/5 p-8 md:w-1/3">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M24 32L28 36L40 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M32 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M48 32H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M32 48V44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 32H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M42.1421 21.8579L39.3137 24.6863"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M42.1421 42.1421L39.3137 39.3137"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21.8579 42.1421L24.6863 39.3137"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21.8579 21.8579L24.6863 24.6863"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2 p-6 md:w-2/3">
                      <h3 className="text-xl font-bold">AI Peer Review & Validation</h3>
                      <p className="text-muted-foreground">
                        Our AI-driven scientific integrity system continuously validates outputs against established
                        scientific knowledge, ensuring accuracy and reliability in all results and recommendations.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Automated consistency checking
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Citation verification system
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-foreground"></span>
                          Uncertainty quantification
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  )
}
