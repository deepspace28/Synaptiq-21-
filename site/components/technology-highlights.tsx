import { Atom, Database, Code, CheckCircle } from "lucide-react"

export function TechnologyHighlights() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
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
        <div className="mx-auto grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Quantum-Attention Neural Networks */}
          <div className="flex flex-col items-start space-y-4">
            <div className="rounded-full bg-foreground/5 p-4">
              <Atom className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Quantum-Attention Neural Networks</h3>
              <p className="text-muted-foreground">
                Our proprietary QANN architecture combines quantum computing principles with attention mechanisms to
                process complex scientific data with unprecedented accuracy and efficiency.
              </p>
            </div>
          </div>

          {/* Scientific Datasets & Symbolic Math Engines */}
          <div className="flex flex-col items-start space-y-4">
            <div className="rounded-full bg-foreground/5 p-4">
              <Database className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Scientific Datasets & Symbolic Math Engines</h3>
              <p className="text-muted-foreground">
                Trained on petabytes of peer-reviewed scientific literature and integrated with symbolic mathematics
                engines for rigorous mathematical reasoning and derivation capabilities.
              </p>
            </div>
          </div>

          {/* Quantum Simulation Frameworks */}
          <div className="flex flex-col items-start space-y-4">
            <div className="rounded-full bg-foreground/5 p-4">
              <Code className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Quantum Simulation Frameworks</h3>
              <p className="text-muted-foreground">
                Seamless integration with Qiskit and PennyLane enables high-fidelity quantum simulations, allowing
                researchers to model complex quantum systems without specialized hardware.
              </p>
            </div>
          </div>

          {/* AI Peer Review & Validation */}
          <div className="flex flex-col items-start space-y-4">
            <div className="rounded-full bg-foreground/5 p-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">AI Peer Review & Validation</h3>
              <p className="text-muted-foreground">
                Our AI-driven scientific integrity system continuously validates outputs against established scientific
                knowledge, ensuring accuracy and reliability in all results and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
