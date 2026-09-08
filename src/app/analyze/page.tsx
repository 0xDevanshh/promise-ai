"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ThumbnailDropzone,
  type ThumbnailValue,
} from "@/components/analyze/thumbnail-dropzone"
import { LoadingStages } from "@/components/analyze/loading-stages"
import { PromiseMap } from "@/components/analyze/promise-map"
import { LOADING_STAGES, SAMPLE_TITLE, SAMPLE_TRANSCRIPT } from "@/lib/mock-analysis"
import { AnalysisResultSchema, type AnalysisResult } from "@/lib/analysis-schema"
import { LAST_ANALYSIS_STORAGE_KEY } from "@/lib/analysis-storage"

type Stage = "form" | "loading" | "results"

const STAGE_INTERVAL_MS = 1400

export default function AnalyzePage() {
  const router = useRouter()

  const [stage, setStage] = React.useState<Stage>("form")
  const [stageIndex, setStageIndex] = React.useState(0)
  const [title, setTitle] = React.useState("")
  const [transcript, setTranscript] = React.useState("")
  const [thumbnail, setThumbnail] = React.useState<ThumbnailValue | null>(null)
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const canAnalyze = title.trim().length > 0 && transcript.trim().length > 0

  const intervalId = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [])

  function handleTrySample() {
    setTitle(SAMPLE_TITLE)
    setTranscript(SAMPLE_TRANSCRIPT)
  }

  async function handleAnalyze() {
    if (!canAnalyze) return

    setError(null)
    setStage("loading")
    setStageIndex(0)

    intervalId.current = setInterval(() => {
      setStageIndex((current) =>
        current < LOADING_STAGES.length - 1 ? current + 1 : current
      )
    }, STAGE_INTERVAL_MS)

    try {
      const formData = new FormData()
      formData.set("title", title)
      formData.set("transcript", transcript)
      if (thumbnail) {
        formData.set("thumbnail", thumbnail.file)
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const json: unknown = await response.json()

      if (!response.ok) {
        const message =
          typeof json === "object" && json !== null && "error" in json
            ? String((json as { error: unknown }).error)
            : "Analysis failed. Please try again."
        throw new Error(message)
      }

      const result = AnalysisResultSchema.parse(json)
      setAnalysis(result)
      try {
        sessionStorage.setItem(LAST_ANALYSIS_STORAGE_KEY, JSON.stringify(result))
      } catch {
        // sessionStorage unavailable; the results page will fall back to sample data
      }
      setStage("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
      setStage("form")
    } finally {
      if (intervalId.current) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
    }
  }

  function handleReset() {
    setStage("form")
    setAnalysis(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6">
        {stage === "form" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Analyze your video
              </h1>
              <p className="text-sm text-muted-foreground">
                Add your title, thumbnail, and transcript to generate a
                Promise Map.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Video Title
              </label>
              <Input
                id="title"
                placeholder="e.g. I Built an AI SaaS in 30 Days"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Thumbnail</label>
              <ThumbnailDropzone value={thumbnail} onChange={setThumbnail} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="transcript" className="text-sm font-medium">
                Transcript
              </label>
              <Textarea
                id="transcript"
                placeholder="Paste your transcript, SRT, or VTT here..."
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                className="min-h-56 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports plain transcript, SRT, and VTT formats.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleTrySample}
              >
                Try Sample
              </Button>
              <Button
                type="button"
                className="w-full sm:ml-auto sm:w-auto"
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                Analyze Promise
              </Button>
            </div>
          </div>
        )}

        {stage === "loading" && (
          <LoadingStages stages={LOADING_STAGES} activeIndex={stageIndex} />
        )}

        {stage === "results" && analysis && (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {analysis.title || "Your Promise Map"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here&apos;s what your video promised, and what it delivered.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                New analysis
              </Button>
            </div>

            <PromiseMap analysis={analysis} />

            <Button
              className="self-start"
              onClick={() => router.push("/results")}
            >
              View full report
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
