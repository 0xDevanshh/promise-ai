import { NextResponse, type NextRequest } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { z } from "zod"

import {
  AnalysisResultSchema,
  GeminiAnalysisSchema,
  REPAIR_LABELS,
  type AnalysisResult,
} from "@/lib/analysis-schema"

export const runtime = "nodejs"

const MAX_THUMBNAIL_BYTES = 8 * 1024 * 1024
const ACCEPTED_THUMBNAIL_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
])

const RESPONSE_JSON_SCHEMA = z.toJSONSchema(GeminiAnalysisSchema)

function buildPrompt(title: string, transcript: string) {
  return `You are Promise AI, a system that audits whether a video's title and thumbnail create expectations that the transcript actually delivers on.

You will be given:
- The video title.
- The video thumbnail image (if provided).
- The video transcript (plain text, or timestamped SRT/VTT).

Your job:
1. Identify every promise or expectation created by the title and thumbnail (claims, outcomes, numbers, transformations, "how to" hooks, etc).
2. For each promise, search the transcript for evidence and classify it as:
   - "delivered": clearly shown/proven in the transcript.
   - "partial": mentioned or attempted but not fully proven.
   - "delayed": delivered, but much later than a viewer would expect (a delayed payoff).
   - "missing": never delivered or supported anywhere in the transcript.
3. Flag unsupported claims (numbers or outcomes stated but never backed by evidence in the transcript) as expectation gaps.
4. Flag weak hooks (slow, vague, or unclear openings that don't address the main promise quickly) in the hook analysis.
5. Identify expectation gaps: specific mismatches between what was implied and what was delivered, each with a risk level of "high", "medium", or "low". High risk = a core promise from the title/thumbnail is unsupported or contradicted. Medium = a real but secondary mismatch (e.g. a delayed payoff). Low = a minor inconsistency.
6. Build a timeline of the key moments that relate to promises being set up or paid off.
7. Determine when (if ever) the transcript first addresses the main promise of the video, for the hook analysis.
8. Propose repairs: a better opening line, a better title, and a fix for the thumbnail, each grounded in what the transcript actually supports.

Timestamp rules (critical):
- Only use a timestamp (format mm:ss) if the transcript actually contains timing information (e.g. SRT/VTT cues, or explicit time markers) that supports it.
- If the transcript has no timestamps, or you cannot tie a specific claim to a specific time, set that timestamp field to null instead of guessing. Never invent a timestamp.
- Do not include a timeline event unless you have a real timestamp for it.

Score the overall "Promise Delivery Score" from 0-100, where 100 means every promise made by the title/thumbnail was fully and quickly delivered in the transcript, and 0 means the video is entirely misleading.

Video title:
"""
${title}
"""

Transcript:
"""
${transcript}
"""

Respond with JSON only, matching the provided response schema exactly.`
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 }
    )
  }

  const title = formData.get("title")
  const transcript = formData.get("transcript")
  const thumbnail = formData.get("thumbnail")

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Video title is required." },
      { status: 400 }
    )
  }

  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return NextResponse.json(
      { error: "Transcript is required." },
      { status: 400 }
    )
  }

  const parts: Array<
    { text: string } | { inlineData: { data: string; mimeType: string } }
  > = [{ text: buildPrompt(title, transcript) }]

  if (thumbnail instanceof File) {
    if (!ACCEPTED_THUMBNAIL_TYPES.has(thumbnail.type)) {
      return NextResponse.json(
        { error: "Thumbnail must be a JPG, PNG, or WebP image." },
        { status: 400 }
      )
    }
    if (thumbnail.size > MAX_THUMBNAIL_BYTES) {
      return NextResponse.json(
        { error: "Thumbnail must be smaller than 8MB." },
        { status: 400 }
      )
    }

    const bytes = Buffer.from(await thumbnail.arrayBuffer())
    parts.push({
      inlineData: {
        data: bytes.toString("base64"),
        mimeType: thumbnail.type,
      },
    })
  }

  const ai = new GoogleGenAI({ apiKey })

  let responseText: string | undefined
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseJsonSchema: RESPONSE_JSON_SCHEMA,
      },
    })
    responseText = response.text
  } catch (error) {
    console.error("Gemini request failed:", error)
    return NextResponse.json(
      { error: "The analysis request failed. Please try again." },
      { status: 502 }
    )
  }

  if (!responseText) {
    return NextResponse.json(
      { error: "Gemini returned an empty response." },
      { status: 502 }
    )
  }

  let candidate: unknown
  try {
    candidate = JSON.parse(responseText)
  } catch {
    return NextResponse.json(
      { error: "Gemini returned a response that was not valid JSON." },
      { status: 502 }
    )
  }

  const parsed = GeminiAnalysisSchema.safeParse(candidate)
  if (!parsed.success) {
    console.error(
      "Gemini output failed schema validation:",
      z.treeifyError(parsed.error)
    )
    return NextResponse.json(
      { error: "Gemini output did not match the expected format." },
      { status: 502 }
    )
  }

  const result: AnalysisResult = AnalysisResultSchema.parse({
    ...parsed.data,
    title,
    repairs: parsed.data.repairs.map((repair) => ({
      ...repair,
      label: REPAIR_LABELS[repair.key],
    })),
  })

  return NextResponse.json(result)
}
