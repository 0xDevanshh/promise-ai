import { CheckCircle2, CircleDashed, Clock, XCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { AnalysisResult, PromiseStatus } from "@/lib/analysis-schema"

const STATUS_META: Record<
  PromiseStatus,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  delivered: { icon: CheckCircle2, label: "Delivered", className: "text-success" },
  partial: { icon: CircleDashed, label: "Partial", className: "text-muted-foreground" },
  delayed: { icon: Clock, label: "Delayed", className: "text-muted-foreground" },
  missing: { icon: XCircle, label: "Missing", className: "text-destructive" },
}

interface PromiseMapProps {
  analysis: AnalysisResult
}

function PromiseMap({ analysis }: PromiseMapProps) {
  return (
    <Card className="ring-1 ring-border">
      <CardHeader>
        <CardDescription>Promise Delivery Score</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-3xl font-semibold">
          <span className="font-mono">{analysis.score}</span>
          <span className="font-mono text-lg text-muted-foreground">
            / 100
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Progress value={analysis.score} />
      </CardContent>

      <Separator />

      <CardContent className="flex flex-col gap-4 pt-(--card-spacing)">
        <p className="text-sm font-medium text-foreground">Promise map</p>

        <ul className="flex flex-col gap-4">
          {analysis.promises.map((promise) => {
            const meta = STATUS_META[promise.status]
            const Icon = meta.icon
            return (
              <li key={promise.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className={`size-4 shrink-0 ${meta.className}`} />
                    <span className="truncate text-sm text-foreground">
                      {promise.label}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-xs ${meta.className}`}
                  >
                    {meta.label}
                    {promise.timestamp ? ` at ${promise.timestamp}` : ""}
                  </span>
                </div>
                <p className="pl-6 text-xs text-muted-foreground">
                  {promise.evidence}
                </p>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export { PromiseMap }
