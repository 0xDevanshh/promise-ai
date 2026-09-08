"use client"

import * as React from "react"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThumbnailDropzone } from "@/components/analyze/thumbnail-dropzone"
import { LoadingStages } from "@/components/analyze/loading-stages"
import { PromiseMap } from "@/components/analyze/promise-map"
import {
  LOADING_STAGES,
  MOCK_ANALYSIS,
  SAMPLE_TITLE,
  SAMPLE_TRANSCRIPT,
  type MockAnalysis,
} from "@/lib/mock-analysis"

type Stage = "form" | "loading" | "results"

const STAGE_DURATION_MS = 550

export default function AnalyzePage() {
  const [stage, setStage] = React.useState<Stage>("form")
  const [stageIndex, setStageIndex] = React.useState(0)
  const [title, setTitle] = React.useState("")
  const [transcript, setTranscript] = React.useState("")
  const [thumbnail, setThumbnail] = React.useState<string | null>(null)
  const [analysis, setAnalysis] = React.useState<MockAnalysis | null>(null)

  const canAnalyze = title.trim().length > 0 && transcript.trim().length > 0

  const timeoutIds = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => {
    const ids = timeoutIds.current
    return () => {
      ids.forEach(clearTimeout)
    }
  }, [])

  function handleTrySample() {
    setTitle(SAMPLE_TITLE)
    setTranscript(SAMPLE_TRANSCRIPT)
  }

  function handleAnalyze() {
    if (!canAnalyze) return

    setStage("loading")
    setStageIndex(0)

    LOADING_STAGES.forEach((_, index) => {
      timeoutIds.current.push(
        setTimeout(() => {
          setStageIndex(index)
        }, index * STAGE_DURATION_MS)
      )
    })

    timeoutIds.current.push(
      setTimeout(() => {
        setAnalysis({ ...MOCK_ANALYSIS, title })
        setStage("results")
      }, LOADING_STAGES.length * STAGE_DURATION_MS)
    )
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
          </div>
        )}
      </main>
    </div>
  )
}
