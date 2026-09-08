import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
      <Badge variant="secondary" className="h-6 px-2.5 text-xs">
        <Sparkles data-icon="inline-start" className="size-3.5" />
        AI Content Intelligence
      </Badge>

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Does your video deliver what the click promised?
      </h1>

      <p className="text-balance text-base text-muted-foreground sm:text-lg">
        Promise AI compares your thumbnail, title, and transcript to detect
        expectation gaps, delayed payoffs, unsupported claims, and weak hooks.
      </p>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          render={<Link href="/analyze" />}
        >
          Analyze Your Video
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          See Example
        </Button>
      </div>
    </section>
  )
}

export { Hero }
