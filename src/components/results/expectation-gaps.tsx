import { AlertTriangle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { ExpectationGap, RiskLevel } from "@/lib/analysis-schema"

const RISK_META: Record<RiskLevel, { label: string; className: string }> = {
  high: { label: "High Risk", className: "bg-destructive/10 text-destructive" },
  medium: { label: "Medium Risk", className: "bg-secondary text-secondary-foreground" },
  low: { label: "Low Risk", className: "bg-secondary text-secondary-foreground" },
}

interface ExpectationGapsProps {
  gaps: ExpectationGap[]
}

function ExpectationGaps({ gaps }: ExpectationGapsProps) {
  return (
    <div className="flex flex-col gap-3">
      {gaps.map((gap, index) => {
        const meta = RISK_META[gap.risk]
        return (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-border bg-panel p-4"
          >
            <AlertTriangle
              className={`mt-0.5 size-4 shrink-0 ${
                gap.risk === "high" ? "text-destructive" : "text-muted-foreground"
              }`}
            />
            <div className="flex flex-col gap-1.5">
              <Badge className={`h-5 w-fit px-2 text-xs ${meta.className}`}>
                {meta.label}
              </Badge>
              <p className="text-sm text-foreground">{gap.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ExpectationGaps }
