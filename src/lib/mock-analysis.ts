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

export type PromiseStatus = "delivered" | "partial" | "missing"

export interface PromiseResult {
  label: string
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
      status: "delivered",
      timestamp: "00:42",
      evidence: "Finished product shown running in production.",
    },
    {
      label: "Made $1,000",
      status: "partial",
      timestamp: "06:32",
      evidence: "Revenue mentioned, but no proof of payment shown on screen.",
    },
    {
      label: "$10K Revenue",
      status: "missing",
      timestamp: null,
      evidence: "Framed as a future goal, never shown as delivered in the video.",
    },
  ],
}
