import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScientificLogo } from "@/components/scientific-logo"

export function AboutSynaptiqEnhanced() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-8 text-center">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-foreground/5"></div>
              <ScientificLogo className="relative h-16 w-16 text-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Synaptiq</h2>
            <p className="mx-auto max-w-[85%] text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Synaptiq is pioneering AI-driven scientific breakthroughs. Our specialized models deliver unmatched
              accuracy in quantum simulations, physics computations, and advanced mathematics—empowering researchers and
              institutions globally.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="mt-4 px-8 py-6 text-lg h-auto border border-foreground/10 bg-background hover:bg-foreground/5"
          >
            <Link href="/about" className="flex items-center">
              Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
