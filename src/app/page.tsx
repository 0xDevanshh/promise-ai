import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AnalysisPreview } from "@/components/analysis-preview"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <AnalysisPreview />
      </main>
    </div>
  )
}
