# Promise AI

Does your video deliver what the click promised?

Promise AI compares a video's title, thumbnail, and transcript to detect expectation gaps, delayed payoffs, unsupported claims, and weak hooks — then scores how well the video delivers on what it promised.

## How it works

1. **Analyze** ([`/analyze`](src/app/analyze/page.tsx)) — submit a video title, thumbnail image, and transcript (plain text, SRT, or VTT).
2. The transcript, title, and thumbnail are sent to Gemini via [`/api/analyze`](src/app/api/analyze/route.ts), which is prompted to detect:
   - delivered / partial / delayed / missing promises
   - unsupported claims
   - weak hooks
   - expectation gaps (with risk levels)
   - when the main promise is actually addressed
3. Gemini's JSON output is validated against a [Zod schema](src/lib/analysis-schema.ts) before it's trusted or rendered — malformed or invalid output is rejected with an error rather than shown to the user.
4. **Results** ([`/results`](src/app/results/page.tsx)) — a full breakdown: Promise Delivery Score, promise-by-promise evidence, expectation gaps, a promise timeline, hook analysis, and AI-generated repair suggestions (better opening, better title, thumbnail fix).

If a transcript has no timestamps, the model is instructed to never invent them — timestamped fields are simply left empty rather than guessed.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (`base-nova` style) on top of [Base UI](https://base-ui.com) primitives — not Radix
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark/system theming
- [lucide-react](https://lucide.dev) icons, Geist Sans/Mono via `next/font/google`
- [react-dropzone](https://react-dropzone.js.org) for thumbnail upload
- [`@google/genai`](https://github.com/googleapis/js-genai) for the Gemini API
- [Zod](https://zod.dev) for validating Gemini's structured output

## Getting started

Install dependencies and set your Gemini API key:

```bash
npm install
```

Create `.env.local` in the project root:

```bash
GEMINI_API_KEY=your-gemini-api-key
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try `/analyze`, click **Try Sample** to populate a sample title/transcript, then **Analyze Promise**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    analyze/page.tsx       # Analysis form + loading + inline result
    results/page.tsx       # Full Promise Map dashboard
    api/analyze/route.ts   # Gemini request + Zod validation
  components/
    analyze/               # Thumbnail dropzone, loading stages, promise map
    results/                # Score panel, breakdown, gaps, timeline, hook analysis, repairs
    ui/                     # shadcn/Base UI primitives
  lib/
    analysis-schema.ts      # Zod schemas + types shared by the API and UI
    mock-analysis.ts        # Sample data used by "Try Sample" and as a Results fallback
```

## Notes

- `GEMINI_API_KEY` is only ever read server-side in the API route — it is never exposed to the client.
- `.env` / `.env.local` are gitignored; never commit real API keys.
