import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <span>Powered by Advanced AI</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Scientific Research, Accelerated</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Synaptiq combines cutting-edge AI with rigorous scientific validation to provide researchers with powerful
              tools for discovery.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <path
                    d="M12 3L4 7V17L12 21L20 17V7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 7L12 11L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9L16 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="3" r="1" fill="currentColor" />
                  <circle cx="4" cy="7" r="1" fill="currentColor" />
                  <circle cx="20" cy="7" r="1" fill="currentColor" />
                  <circle cx="12" cy="21" r="1" fill="currentColor" />
                </svg>
              </div>
              <CardTitle className="mt-2">Scientific LLM</CardTitle>
              <CardDescription>Specialized language model trained on scientific literature.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our LLM understands complex scientific concepts, can generate hypotheses, and assist with literature
                reviews.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 4C16 8 16 16 12 20" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 4C8 8 8 16 12 20" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
              </div>
              <CardTitle className="mt-2">Quantum Simulations</CardTitle>
              <CardDescription>Run complex quantum simulations with unprecedented accuracy.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Simulate quantum systems, test theories, and explore quantum phenomena with our advanced simulation
                tools.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 16V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <CardTitle className="mt-2">Scientific Validation</CardTitle>
              <CardDescription>Rigorous validation by leading researchers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All our models and algorithms undergo extensive peer review and validation by experts in physics and
                mathematics.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 7L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 11L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 15L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 15L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <CardTitle className="mt-2">API Access</CardTitle>
              <CardDescription>Integrate with your existing research workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our comprehensive API allows seamless integration with Python, MATLAB, R, and other research
                environments.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M3 20L21 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 4L21 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <CardTitle className="mt-2">Mathematical Modeling</CardTitle>
              <CardDescription>Advanced mathematical modeling and analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Solve complex mathematical problems, verify proofs, and explore mathematical concepts with our
                specialized tools.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <path d="M6.5 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17.5 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6.5 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17.5 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <CardTitle className="mt-2">Research Database</CardTitle>
              <CardDescription>Access to a vast database of scientific knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our platform is trained on millions of scientific papers, textbooks, and research data to provide
                comprehensive insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
