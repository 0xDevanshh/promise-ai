import { CheckCircle2, CircleDashed, XCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const PROMISES = [
  {
    label: "Built an AI SaaS",
    status: "Delivered",
    timestamp: "00:42",
    icon: CheckCircle2,
    className: "text-success",
  },
  {
    label: "Made $1,000",
    status: "Partial",
    timestamp: "06:32",
    icon: CircleDashed,
    className: "text-muted-foreground",
  },
  {
    label: "$10K Revenue",
    status: "Missing",
    timestamp: null,
    icon: XCircle,
    className: "text-destructive",
  },
] as const

function AnalysisPreview() {
  return (
    <section id="analysis" className="mx-auto w-full max-w-2xl px-4 pb-24 sm:px-6">
      <Card className="ring-1 ring-border">
        <CardHeader>
          <CardDescription>Promise Delivery Score</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-3xl font-semibold">
            <span className="font-mono">68</span>
            <span className="font-mono text-lg text-muted-foreground">
              / 100
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Progress value={68} />
        </CardContent>

        <Separator />

        <CardContent className="flex flex-col gap-4 pt-(--card-spacing)">
          <p className="text-sm font-medium text-foreground">
            Example promises
          </p>

          <ul className="flex flex-col gap-3">
            {PROMISES.map((promise) => {
              const Icon = promise.icon
              return (
                <li
                  key={promise.label}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className={`size-4 shrink-0 ${promise.className}`} />
                    <span className="truncate text-sm text-foreground">
                      {promise.label}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-xs ${promise.className}`}
                  >
                    {promise.status}
                    {promise.timestamp ? ` at ${promise.timestamp}` : ""}
                  </span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

export { AnalysisPreview }
