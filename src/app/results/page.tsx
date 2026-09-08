import type { ReactNode } from "react"

import { Navbar } from "@/components/navbar"
import { ScorePanel } from "@/components/results/score-panel"
import { PromiseBreakdown } from "@/components/results/promise-breakdown"
import { ExpectationGaps } from "@/components/results/expectation-gaps"
import { PromiseTimeline } from "@/components/results/promise-timeline"
import { HookAnalysis } from "@/components/results/hook-analysis"
import { RepairPanel } from "@/components/results/repair-panel"
import {
  EXPECTATION_GAPS,
  HOOK_ANALYSIS,
  MOCK_ANALYSIS,
  PROMISE_TIMELINE,
  REPAIR_OUTPUTS,
} from "@/lib/mock-analysis"

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
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            Analysis for
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {MOCK_ANALYSIS.title}
          </h1>
        </div>

        <ScorePanel score={MOCK_ANALYSIS.score} />

        <Section
          title="Promise Breakdown"
          description="What was promised across your title, thumbnail, and transcript — and whether it landed."
        >
          <PromiseBreakdown promises={MOCK_ANALYSIS.promises} />
        </Section>

        <Section
          title="Expectation Gaps"
          description="Places where viewer expectations and video content diverge."
        >
          <ExpectationGaps gaps={EXPECTATION_GAPS} />
        </Section>

        <Section
          title="Promise Timeline"
          description="Where key moments land across the runtime."
        >
          <PromiseTimeline events={PROMISE_TIMELINE} />
        </Section>

        <Section title="Hook Analysis">
          <HookAnalysis data={HOOK_ANALYSIS} />
        </Section>

        <Section
          title="Repair My Video"
          description="AI-generated fixes based on the gaps found above."
        >
          <RepairPanel outputs={REPAIR_OUTPUTS} />
        </Section>
      </main>
    </div>
  )
}
