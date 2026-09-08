import { z } from "zod"

export const PromiseStatusSchema = z.enum([
  "delivered",
  "partial",
  "delayed",
  "missing",
])

export const RiskLevelSchema = z.enum(["high", "medium", "low"])

export const PromiseSourceSchema = z.enum(["Title", "Thumbnail", "Transcript"])

export const PromiseResultSchema = z.object({
  label: z.string(),
  source: PromiseSourceSchema,
  status: PromiseStatusSchema,
  timestamp: z
    .string()
    .nullable()
    .describe(
      "Timestamp (mm:ss) from the transcript where this promise is delivered, delayed, or partially addressed. Null if the transcript has no timestamps or the promise is missing."
    ),
  evidence: z.string(),
})

export const ExpectationGapSchema = z.object({
  risk: RiskLevelSchema,
  description: z.string(),
})

export const TimelineEventSchema = z.object({
  timestamp: z
    .string()
    .describe(
      "A real timestamp (mm:ss) taken directly from the transcript. Only include an event if a timestamp for it actually exists."
    ),
  label: z.string(),
})

export const HookAnalysisSchema = z.object({
  hookScore: z.number().min(0).max(100),
  mainPromiseAddressed: z
    .string()
    .nullable()
    .describe(
      "Timestamp (mm:ss) where the main promise is first addressed. Null if the transcript has no timestamps or it is never addressed."
    ),
  viewerRisk: RiskLevelSchema,
  suggestion: z.string(),
})

export const RepairKeySchema = z.enum(["opening", "title", "thumbnail"])

export const RepairOutputSchema = z.object({
  key: RepairKeySchema,
  content: z.string(),
})

export const GeminiAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  promises: z.array(PromiseResultSchema),
  expectationGaps: z.array(ExpectationGapSchema),
  timeline: z.array(TimelineEventSchema),
  hookAnalysis: HookAnalysisSchema,
  repairs: z.array(RepairOutputSchema).length(3),
})

export const REPAIR_LABELS: Record<z.infer<typeof RepairKeySchema>, string> = {
  opening: "Better Opening",
  title: "Better Title",
  thumbnail: "Thumbnail Fix",
}

export const AnalysisResultSchema = GeminiAnalysisSchema.extend({
  title: z.string(),
  repairs: z.array(
    RepairOutputSchema.extend({
      label: z.string(),
    })
  ),
})

export type PromiseStatus = z.infer<typeof PromiseStatusSchema>
export type RiskLevel = z.infer<typeof RiskLevelSchema>
export type PromiseResult = z.infer<typeof PromiseResultSchema>
export type ExpectationGap = z.infer<typeof ExpectationGapSchema>
export type TimelineEvent = z.infer<typeof TimelineEventSchema>
export type HookAnalysis = z.infer<typeof HookAnalysisSchema>
export type RepairOutput = z.infer<
  typeof AnalysisResultSchema
>["repairs"][number]
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>

export function getScoreClassification(score: number) {
  if (score >= 85) return "Strong Delivery"
  if (score >= 70) return "Mostly Delivered"
  if (score >= 50) return "Needs Work"
  return "Broken Promise"
}
