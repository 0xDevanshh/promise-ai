import type { TimelineEvent } from "@/lib/mock-analysis"

interface PromiseTimelineProps {
  events: TimelineEvent[]
}

function PromiseTimeline({ events }: PromiseTimelineProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-start px-2 py-4">
        {events.map((event, index) => (
          <div key={event.timestamp} className="flex items-start">
            <div className="flex w-28 flex-col items-center gap-2 text-center sm:w-36">
              <span className="size-2.5 rounded-full bg-foreground" />
              <span className="font-mono text-xs text-foreground">
                {event.timestamp}
              </span>
              <span className="text-xs text-muted-foreground">
                {event.label}
              </span>
            </div>
            {index < events.length - 1 && (
              <div className="mt-[5px] h-px w-10 shrink-0 bg-border sm:w-16" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { PromiseTimeline }
