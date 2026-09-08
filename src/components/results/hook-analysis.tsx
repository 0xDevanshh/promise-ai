import { Lightbulb } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { HookAnalysis as HookAnalysisData, RiskLevel } from "@/lib/analysis-schema"

const RISK_LABEL: Record<RiskLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

interface HookAnalysisProps {
  data: HookAnalysisData
}

function HookAnalysis({ data }: HookAnalysisProps) {
  return (
    <Card className="ring-1 ring-border">
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">Hook Score</p>
            <p className="font-mono text-2xl font-semibold">
              {data.hookScore}
              <span className="text-base font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              Main Promise Addressed
            </p>
            <p className="font-mono text-2xl font-semibold">
              {data.mainPromiseAddressed}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">Viewer Risk</p>
            <Badge variant="secondary" className="h-6 w-fit px-2.5 text-sm">
              {RISK_LABEL[data.viewerRisk]}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3 rounded-lg bg-panel p-4">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              AI suggestion
            </p>
            <p className="text-sm text-muted-foreground">{data.suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { HookAnalysis }
