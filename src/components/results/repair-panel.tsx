"use client"

import * as React from "react"
import { Check, Copy, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { RepairOutput } from "@/lib/mock-analysis"

interface RepairPanelProps {
  outputs: RepairOutput[]
}

function RepairPanel({ outputs }: RepairPanelProps) {
  const [revealed, setRevealed] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  async function handleCopy(key: string, content: string) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1500)
    } catch {
      // clipboard access denied; ignore silently
    }
  }

  if (!revealed) {
    return (
      <Card className="ring-1 ring-border">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Generate a better opening, title, and thumbnail fix based on this
            analysis.
          </p>
          <Button onClick={() => setRevealed(true)}>
            <Wand2 data-icon="inline-start" />
            Repair My Video
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {outputs.map((output) => {
        const isCopied = copiedKey === output.key
        return (
          <Card key={output.key} className="ring-1 ring-border">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {output.label}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(output.key, output.content)}
                >
                  {isCopied ? (
                    <Check data-icon="inline-start" />
                  ) : (
                    <Copy data-icon="inline-start" />
                  )}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {output.content}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { RepairPanel }
