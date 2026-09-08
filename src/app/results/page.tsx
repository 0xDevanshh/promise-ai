"use client"

import * as React from "react"
import type { ReactNode } from "react"

import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { ScorePanel } from "@/components/results/score-panel"
import { PromiseBreakdown } from "@/components/results/promise-breakdown"
import { ExpectationGaps } from "@/components/results/expectation-gaps"
import { PromiseTimeline } from "@/components/results/promise-timeline"
import { HookAnalysis } from "@/components/results/hook-analysis"
import { RepairPanel } from "@/components/results/repair-panel"
import { MOCK_ANALYSIS } from "@/lib/mock-analysis"
import { AnalysisResultSchema, type AnalysisResult } from "@/lib/analysis-schema"
import { LAST_ANALYSIS_STORAGE_KEY } from "@/lib/analysis-storage"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = React.useState<AnalysisResult>(MOCK_ANALYSIS)
  const [isSample, setIsSample] = React.useState(true)

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(LAST_ANALYSIS_STORAGE_KEY)
      if (!stored) return
      const parsed = AnalysisResultSchema.parse(JSON.parse(stored))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only available after mount; reading it earlier would mismatch the server render
      setAnalysis(parsed)
      setIsSample(false)
    } catch {
      // fall back to sample data if nothing valid is stored
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Analysis for</p>
            {isSample && (
              <Badge variant="secondary" className="h-5 px-2 text-[0.6875rem]">
                Sample data
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {analysis.title}
          </h1>
        </div>

        <ScorePanel score={analysis.score} />

        <Section title="Summary">
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>
        </Section>

        <Section
          title="Promise Breakdown"
          description="What was promised across your title, thumbnail, and transcript — and whether it landed."
        >
          <PromiseBreakdown promises={analysis.promises} />
        </Section>

        <Section
          title="Expectation Gaps"
          description="Places where viewer expectations and video content diverge."
        >
          <ExpectationGaps gaps={analysis.expectationGaps} />
        </Section>

        <Section
          title="Promise Timeline"
          description="Where key moments land across the runtime."
        >
          <PromiseTimeline events={analysis.timeline} />
        </Section>

        <Section title="Hook Analysis">
          <HookAnalysis data={analysis.hookAnalysis} />
        </Section>

        <Section
          title="Repair My Video"
          description="AI-generated fixes based on the gaps found above."
        >
          <RepairPanel outputs={analysis.repairs} />
        </Section>
      </main>
    </div>
  )
}
