import { Check, Loader2 } from "lucide-react"

import { cn } from "cn"

interface LoadingStagesProps {
  stages: readonly string[]
  activeIndex: number
}

function LoadingStages({ stages, activeIndex }: LoadingStagesProps) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 py-16">
      {stages.map((stage, index) => {
        const isDone = index < activeIndex
        const isActive = index === activeIndex

        return (
          <div
            key={stage}
            className={cn(
              "flex items-center gap-2.5 text-sm transition-colors",
              isDone && "text-muted-foreground",
              isActive && "text-foreground",
              !isDone && !isActive && "text-muted-foreground/50"
            )}
          >
            {isDone && <Check className="size-4 shrink-0 text-success" />}
            {isActive && (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            )}
            {!isDone && !isActive && (
              <span className="size-4 shrink-0 rounded-full border border-current" />
            )}
            <span>{stage}</span>
          </div>
        )
      })}
    </div>
  )
}

export { LoadingStages }
