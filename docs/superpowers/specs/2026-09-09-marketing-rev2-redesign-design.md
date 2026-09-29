# Marketing Site Rev 2 Redesign (Sub-project 2)

Date: 2026-09-09
Repo: `axis-scale-landing` (Astro 6 + Tailwind 4)
Status: Design approved in brainstorm; awaiting spec review before writing-plans.

> No em dashes anywhere (project rule). Spaced hyphens, colons, parentheses only.

## Program context

Part 2 of the two-part Rev 2 rollout. Part 1 (`risk-register-saas/docs/superpowers/specs/2026-09-09-rev2-app-retheme-design.md`) re-themes the product app and defines the shared Rev 2 tokens. This spec reuses those exact token values.

Dependency: the 5 product screen-recordings in Section 4 are recorded from the **re-themed** app, so they land after SP1 ships. Everything else here (structure, tokens, copy, coded animation, the `ProductLoop` component with poster placeholders) is built in parallel and does not wait.

## Goals

1. **Fewer, fuller sections.** Cut the current ~17-section, dense, repetitive page to 7 sections plus a footer band, each earning its scroll. (Approach A: Problem -> Solution -> Proof.)
2. **Meaningful motion.** Add short, scattered videos that show the problems Axis solves, Jazz-style. Hybrid: 5 real muted screen-recording loops + 1 coded animation.
3. Apply the Rev 2 "quieter system" look (warm charcoal, single pink, tile motif, Manrope).

## Non-goals

- No change to the hero statement copy (frozen verbatim, see below).
- No new marketing claims or fabricated proof (honesty positioning, post-Delve).
- Not a CMS/blog build. Privacy/terms pages stay as-is (re-skinned only).

## Frozen hero copy (do not alter a word)

> Not working on SOC 2 yet?
> That's fine. The prospects in your pipeline will surely wait.
> They won't. SOC 2 takes months and the question always arrives mid-deal. Start now: 30 minutes to scope, a real audit date on the calendar, a clear roadmap. When they ask, you have an answer instead of an apology.

Only the layout and the surrounding motion change around this text.

## Current state (verified)

- One page `src/pages/index.astro` composed of 15 section components in `<main>` (Nav ... Footer). Tailwind theme tokens in `src/styles/global.css` `@theme` (navy + Inter + pink, mirrors the app's R1 tokens). An "Axie" mascot animation system already exists in `global.css`.
- Components present: Nav, Hero, Marquee, WhySection, TwoAnswers, BeforeAfterSection, WhatIsInside, ProductShowcase, EnforcementWatch, NewsletterSignup, PlatformProblem, PricingTiers, EarlyAccess, CTAStrip, Footer (in use); PainSection, EleanorReveal, Testimonial, CookieConsent (present, some unused). Several components have uncommitted working-tree edits: reconcile before starting.

## New information architecture (Approach A)

New `index.astro` `<main>` order. Marker legend: (R) real recording, (C) coded animation.

1. **Hero** - frozen copy + two CTAs (Start free / See it work) + badges (SOC 2, ISO 27001, EU AI Act) + a muted 6-8s dashboard loop (R). Component: `Hero.astro` (kept, copy untouched, add `ProductLoop`).
2. **Trust bar** - slim credibility band: "Auditor-built" + compliance marks + one proof line. Gentle marks marquee, no video. Component: `Marquee.astro` (repurposed).
3. **The problem** (C) - stated once: the SOC 2 question always lands mid-deal, then the two answers ("We don't have it yet" vs "Already in progress, audit booked"). Coded animation: a deal timeline that freezes when the questionnaire drops. New component `ProblemSection.astro` (merges `PainSection` + `TwoAnswers`).
4. **The platform** (centerpiece, R x5) - 4 to 5 capability blocks, alternating left/right, each a real recording: Risk Register, 7-step assessment / deep-dive, Workplan, Echo (questionnaires). New component `PlatformSection.astro` (merges `WhySection` + `WhatIsInside` + `ProductShowcase` + the Echo content), rendering `ProductLoop` per capability.
5. **Why we're different** - honesty position (scoped not guessed, no fabricated evidence) vs bloated platforms and vs traditional consultants; clean before/after tiles, no pink borders. New component `DifferenceSection.astro` (merges `BeforeAfterSection` + `PlatformProblem`).
6. **Pricing** - 4 lanes / founding rates, recommended tier in the single pink, calculator CTA ("no sign-up", links `public/pricing-calculator.html`), 3rd-party audit + pen-test costs stated honestly ($10-15k). Component: `PricingTiers.astro` (kept, absorbs the calculator CTA + 3rd-party callout).
7. **Founder + final CTA** - auditor-built / Eleanor credibility, final push, early-access + contact form. New component `ClosingSection.astro` (merges `EleanorReveal` + `EarlyAccess` + `CTAStrip`).

**Footer band** - `EnforcementWatch` (slim strip) + `NewsletterSignup` (email capture, keep the shipped Phase 1 behavior) + `Footer`.

### Component fate summary
- **Keep:** `Nav`, `Hero`, `Marquee` (repurposed), `PricingTiers`, `EnforcementWatch` (slimmed), `NewsletterSignup`, `Footer`, `CookieConsent`.
- **New:** `ProductLoop.astro`, `ProblemSection.astro`, `PlatformSection.astro`, `DifferenceSection.astro`, `ClosingSection.astro`.
- **Absorbed then deleted:** `PainSection`, `TwoAnswers`, `WhySection`, `WhatIsInside`, `ProductShowcase`, `BeforeAfterSection`, `PlatformProblem`, `EarlyAccess`, `CTAStrip`, `EleanorReveal`. (`Testimonial` optional: fold into Trust bar or Difference if real quotes exist, else leave unused.)

Net: 15 main components -> 7 sections + footer band.

## Design tokens (Rev 2, mirrors SP1)

Rewrite `src/styles/global.css` `@theme` to the Rev 2 values (identical hexes to SP1):
- Surfaces: Desk `#131211`, Page `#232120`, Sunken `#080807`, Hover `#2C2A28`; hairlines `#454138` / `#262421`.
- Text: Ink `#F2F0EC`, Secondary `#B3AFA8`, Meta `#8A857E`.
- Accent: pink `#E91E8C` (unchanged) + hover `#C91576`; breach coral `#F2685C` (breach/alert only).
- Type: **Manrope only** (self-hosted woff2, 400/600/700/800) + JetBrains Mono for codes. Remove Inter. No Heebo (English-only marketing site). Full PDF display scale is appropriate here (Display 46/800, Heading 30/700, Subhead 18/600, Body 15 on 1.6 / 400, Eyebrow 10/700 +1.2).
- Radii: tile 2, card/panel 3, input 6, pill 20.
- Motif: retire pink left-borders; one pink per screen; depth = one surface step + shadow.
- Keep the existing Axie mascot animations, but audit that pink usage still obeys "one pink per screen" per section.

## Motion plan (build-ready)

### `ProductLoop.astro` (reusable)
Props: `src` (basename, resolves to `/media/<src>.mp4` + `.webm`), `poster` (`/media/<src>.jpg`), `label` (aria/caption), `align` ("left" | "right"). Renders:
```
<video muted autoplay loop playsinline preload="none" poster={poster} aria-label={label}>
  <source src=`/media/${src}.webm` type="video/webm" />
  <source src=`/media/${src}.mp4` type="video/mp4" />
</video>
```
- **Lazy-load:** an IntersectionObserver (small inline script or one shared module) sets `preload`/calls `.load()`/`.play()` only when the element is near the viewport; pause when off-screen.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, do not autoplay; show the poster still. (Extend the existing reduced-motion block in `global.css`.)
- **Placeholder mode:** until real clips exist, `ProductLoop` renders the poster only (no `<source>`), so the site ships before SP1 finishes. Swapping in a clip = adding the media files; no markup change.

### Assets
| Asset | Type | Source (from re-themed app) | Length | Section |
|---|---|---|---|---|
| `hero` | R | Dashboard stat panel settling in | 6-8s | 1 |
| `register` | R | Risk register scoping | 8-10s | 4 |
| `assessment` | R | 7-step deep-dive wizard | 8-10s | 4 |
| `workplan` | R | Audit date + tasks on calendar | 8-10s | 4 |
| `echo` | R | Questionnaire auto-answered | 8-10s | 4 |
| problem timeline | C | CSS/SVG deal-freeze, no video file | loop | 3 |

### Delivery spec (every recording)
- Dual format MP4 (H.264) + WebM (VP9). Capture at 2x, display 600-900px wide. Target under ~1.5 MB each.
- Files in `public/media/`. Poster (first frame) as `.jpg` (or `.webp`).
- Encode (reference command per clip):
  - MP4: `ffmpeg -i raw.mov -vf "scale=1600:-2,fps=30" -an -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart <name>.mp4`
  - WebM: `ffmpeg -i raw.mov -vf "scale=1600:-2,fps=30" -an -c:v libvpx-vp9 -crf 34 -b:v 0 <name>.webm`
  - Poster: `ffmpeg -ss 0 -i <name>.mp4 -vframes 1 <name>.jpg`

### Production workflow (solo)
1. Seed the re-themed app with clean demo data (Acme Inc). 2. Screen-record the panel (QuickTime or Screen Studio). 3. Trim to a seamless 6-10s loop. 4. Run the three ffmpeg commands. 5. Drop into `public/media/`, reference by basename.

## Copy

- Hero: frozen (above).
- All other sections: reuse the site's existing strong copy where it maps, condensed to remove the 3x repetition of "start early / avoid deal delays". Voice: plain, second person, mildly opinionated, no hype, no exclamation points, no fabricated stats or logos. No em dashes.

## Testing / verification

- `npm run build` (astro build) passes; no unused-import or broken-link errors.
- Visual pass on the 7 sections at mobile / tablet / desktop widths.
- Lighthouse: performance not regressed by video (posters paint first, clips lazy-load, `preload="none"`).
- `prefers-reduced-motion`: all loops show static posters, no autoplay.
- Placeholder mode verified: site builds and looks complete with posters only (before SP1 clips exist).
- Hero copy string asserted present verbatim (guard against accidental edits).

## Risks / open decisions

1. **Recordings gated on SP1.** Launch either holds for real clips or ships with posters first. (Program decision: build now, launch complete after SP1 + recordings. Revisit if SP1 slips.)
2. **Uncommitted working-tree edits** on several components: reconcile / commit before restructuring so nothing is lost.
3. **Testimonial section:** include only if real, attributable quotes exist; otherwise omit (no fabrication).
4. Platform section is 4 vs 5 capabilities depending on whether Echo gets its own block or joins the four; default is the four listed plus Echo = 5 loops. Confirm during build if performance budget is tight.
