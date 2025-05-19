import Link from "next/link"
import {
  ArrowRight,
  BrainCircuit,
  Database,
  FlaskRoundIcon as Flask,
  Microscope,
  Rocket,
  Sigma,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TechnologyHighlightsEnhanced } from "@/components/technology-highlights-enhanced"
import { AboutSynaptiqEnhanced } from "@/components/about-synaptiq-enhanced"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSynaptiqEnhanced />

        {/* Replace InteractiveDemoSection with VideoDemoSection */}

        <TechnologyHighlightsEnhanced />
        <FeatureSection />
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <Badge className="px-4 py-1 text-sm" variant="secondary">
              Scientific Validation
            </Badge>
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">Rigorous Scientific Validation</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our models undergo extensive validation by leading researchers in physics, mathematics, and computer
              science.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peer Review</CardTitle>
                <Microscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">All algorithms peer-reviewed by experts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Sigma className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">Mathematical accuracy on benchmark tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Publications</CardTitle>
                <Flask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24+</div>
                <p className="text-xs text-muted-foreground">Research papers published in top journals</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <Badge className="px-4 py-1 text-sm" variant="secondary">
              Use Cases
            </Badge>
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">
              Powering Scientific Breakthroughs
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              See how researchers and institutions are using Synaptiq to accelerate their work.
            </p>
          </div>
          <Tabs defaultValue="research" className="mx-auto max-w-4xl mt-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="industry">Industry</TabsTrigger>
            </TabsList>
            <TabsContent value="research" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accelerating Research</CardTitle>
                  <CardDescription>How Synaptiq helps researchers explore complex scientific problems.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <div className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Quantum Physics Simulations</h4>
                        <p className="text-sm text-muted-foreground">
                          Run complex quantum simulations with unprecedented accuracy.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Data Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Process and analyze large scientific datasets efficiently.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm italic">
                      "Synaptiq has reduced our research cycle time by 60%, allowing us to explore more complex
                      hypotheses than ever before."
                    </p>
                    <p className="mt-2 text-sm font-medium">— Dr. Elena Patel, Quantum Physics Department, MIT</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/case-studies">
                      View Research Case Studies <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="education" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enhancing Education</CardTitle>
                  <CardDescription>How Synaptiq is transforming scientific education at universities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Interactive Learning</h4>
                        <p className="text-sm text-muted-foreground">
                          Create interactive simulations for complex scientific concepts.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Personalized Curriculum</h4>
                        <p className="text-sm text-muted-foreground">
                          Adapt learning materials to individual student needs and progress.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm italic">
                      "Our students' comprehension of advanced physics concepts has improved dramatically since
                      implementing Synaptiq in our curriculum."
                    </p>
                    <p className="mt-2 text-sm font-medium">— Prof. James Chen, California Institute of Technology</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/education">
                      Explore Education Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="industry" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Applications</CardTitle>
                  <CardDescription>How companies are leveraging Synaptiq for innovation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Rocket className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">R&D Acceleration</h4>
                        <p className="text-sm text-muted-foreground">
                          Reduce time-to-market for new scientific products and solutions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Flask className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Material Science</h4>
                        <p className="text-sm text-muted-foreground">
                          Discover and test new materials with advanced simulations.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm italic">
                      "Synaptiq has become an essential tool in our R&D department, helping us develop next-generation
                      materials faster than ever."
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      — Sarah Johnson, Chief Scientific Officer, QuantumMaterials Inc.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/industry">
                      Discover Industry Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
