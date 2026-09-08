export const LOADING_STAGES = [
  "Reading thumbnail",
  "Extracting viewer promises",
  "Mapping transcript evidence",
  "Finding expectation gaps",
  "Building Promise Map",
] as const

export const SAMPLE_TITLE = "I Built an AI SaaS and Made $10K in 30 Days"

export const SAMPLE_TRANSCRIPT = `00:00:05.000 --> 00:00:12.000
So today I'm going to show you exactly how I built an AI SaaS from scratch.

00:00:42.000 --> 00:00:50.000
Here's the finished product running in production, fully deployed.

00:06:32.000 --> 00:06:40.000
After the first week I had made about $1,000 from early customers.

00:14:10.000 --> 00:14:18.000
Growth slowed down a bit after that, but I kept iterating on the product.

00:19:45.000 --> 00:19:55.000
I want to eventually hit $10K a month, and I'll share updates on that goal.`

export type PromiseStatus = "delivered" | "partial" | "delayed" | "missing"

export interface PromiseResult {
  label: string
  source: string
  status: PromiseStatus
  timestamp: string | null
  evidence: string
}

export interface MockAnalysis {
  score: number
  title: string
  promises: PromiseResult[]
}

export const MOCK_ANALYSIS: MockAnalysis = {
  score: 68,
  title: SAMPLE_TITLE,
  promises: [
    {
      label: "Built an AI SaaS",
      source: "Title",
      status: "delivered",
      timestamp: "00:42",
      evidence: "Finished product shown running in production.",
    },
    {
      label: "Made $1,000",
      source: "Thumbnail",
      status: "delayed",
      timestamp: "06:32",
      evidence: "Revenue payoff doesn't land until more than halfway through the video.",
    },
    {
      label: "Step-by-step build process",
      source: "Transcript",
      status: "partial",
      timestamp: "01:18",
      evidence: "Build is summarized quickly, key steps are skipped over.",
    },
    {
      label: "$10K Revenue",
      source: "Thumbnail",
      status: "missing",
      timestamp: null,
      evidence: "Framed as a future goal, never shown as delivered in the video.",
    },
  ],
}

export function getScoreClassification(score: number) {
  if (score >= 85) return "Strong Delivery"
  if (score >= 70) return "Mostly Delivered"
  if (score >= 50) return "Needs Work"
  return "Broken Promise"
}

export type RiskLevel = "high" | "medium" | "low"

export interface ExpectationGap {
  risk: RiskLevel
  description: string
}

export const EXPECTATION_GAPS: ExpectationGap[] = [
  {
    risk: "high",
    description:
      'Thumbnail implies "$10K revenue", but the transcript contains no evidence supporting the claim.',
  },
  {
    risk: "medium",
    description: "The main revenue payoff does not appear until 06:32.",
  },
  {
    risk: "low",
    description:
      "Title promises a full build, but several implementation steps are only briefly mentioned.",
  },
]

export interface TimelineEvent {
  timestamp: string
  label: string
}

export const PROMISE_TIMELINE: TimelineEvent[] = [
  { timestamp: "00:00", label: "Hook gap" },
  { timestamp: "01:18", label: "Build begins" },
  { timestamp: "03:42", label: "Product shown" },
  { timestamp: "06:32", label: "Revenue revealed" },
]

export interface HookAnalysis {
  hookScore: number
  mainPromiseAddressed: string
  viewerRisk: RiskLevel
  suggestion: string
}

export const HOOK_ANALYSIS: HookAnalysis = {
  hookScore: 61,
  mainPromiseAddressed: "00:47",
  viewerRisk: "medium",
  suggestion:
    "Open with the $10K outcome in the first 3 seconds instead of background story. Viewers are deciding whether to stay before the hook lands at 00:47.",
}

export interface RepairOutput {
  key: string
  label: string
  content: string
}

export const REPAIR_OUTPUTS: RepairOutput[] = [
  {
    key: "opening",
    label: "Better Opening",
    content:
      "\"I turned this into $10K in a month — here's the exact build, and the one mistake that almost killed it.\"",
  },
  {
    key: "title",
    label: "Better Title",
    content: "I Built an AI SaaS to $10K (Full Build + Numbers)",
  },
  {
    key: "thumbnail",
    label: "Thumbnail Fix",
    content:
      "Replace \"$10K Revenue\" text with \"$1K Week 1\" to match what the video actually proves, or add a follow-up video that delivers on the $10K claim.",
  },
]
