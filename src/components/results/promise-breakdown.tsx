import { CheckCircle2, CircleDashed, Clock, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { PromiseResult, PromiseStatus } from "@/lib/analysis-schema"

const STATUS_META: Record<
  PromiseStatus,
  {
    icon: typeof CheckCircle2
    label: string
    badgeClassName: string
  }
> = {
  delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    badgeClassName: "bg-success/10 text-success",
  },
  partial: {
    icon: CircleDashed,
    label: "Partial",
    badgeClassName: "bg-secondary text-secondary-foreground",
  },
  delayed: {
    icon: Clock,
    label: "Delayed",
    badgeClassName: "bg-secondary text-secondary-foreground",
  },
  missing: {
    icon: XCircle,
    label: "Missing",
    badgeClassName: "bg-destructive/10 text-destructive",
  },
}

interface PromiseBreakdownProps {
  promises: PromiseResult[]
}

function PromiseBreakdown({ promises }: PromiseBreakdownProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {promises.map((promise) => {
        const meta = STATUS_META[promise.status]
        const Icon = meta.icon

        return (
          <Card key={promise.label} className="ring-1 ring-border">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {promise.label}
                </p>
                <Badge className={`h-6 shrink-0 px-2 text-xs ${meta.badgeClassName}`}>
                  <Icon data-icon="inline-start" className="size-3.5" />
                  {meta.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Source: {promise.source}</span>
                {promise.timestamp && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{promise.timestamp}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {promise.evidence}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { PromiseBreakdown }
