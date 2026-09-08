import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getScoreClassification } from "@/lib/mock-analysis"

interface ScorePanelProps {
  score: number
}

const RADIUS = 70
const STROKE = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ScorePanel({ score }: ScorePanelProps) {
  const classification = getScoreClassification(score)
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <Card className="ring-1 ring-border">
      <CardContent className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-center sm:gap-10">
        <div className="relative flex size-40 shrink-0 items-center justify-center">
          <svg
            viewBox="0 0 160 160"
            className="size-40 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-muted"
            />
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="stroke-foreground transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-4xl font-semibold tabular-nums">
              {score}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              / 100
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground">
            Promise Delivery Score
          </p>
          <Badge variant="secondary" className="h-6 px-2.5 text-sm">
            {classification}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export { ScorePanel }
