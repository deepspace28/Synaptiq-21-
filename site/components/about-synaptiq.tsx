import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutSynaptiq() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-y border-border/20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Synaptiq</h2>
          <p className="max-w-[85%] text-xl leading-normal text-muted-foreground md:text-2xl">
            Synaptiq is pioneering AI-driven scientific breakthroughs. Our specialized models deliver unmatched accuracy
            in quantum simulations, physics computations, and advanced mathematics—empowering researchers and
            institutions globally.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/about">
              Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
