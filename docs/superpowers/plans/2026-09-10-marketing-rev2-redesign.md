# Marketing Site Rev 2 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Astro marketing site to the Approach A structure (7 sections + footer band) wearing the Rev 2 "quieter system" design language, with a reusable motion component that ships on poster placeholders and accepts real product recordings later.

**Architecture:** Astro 6 + Tailwind 4. Design tokens live in `src/styles/global.css` `@theme` and flow to components as Tailwind utilities, so re-skinning is mostly a token rewrite plus a hardcoded-hex sweep. Five new section components merge 10 existing ones; a `ProductLoop.astro` component wraps every video slot and renders a poster-only placeholder until real MP4/WebM clips exist.

**Tech Stack:** Astro 6, Tailwind 4, `@fontsource-variable/manrope`, `@fontsource/jetbrains-mono`, headless Chrome for placeholder posters.

**Spec:** `docs/superpowers/specs/2026-09-09-marketing-rev2-redesign-design.md`

**Project rule:** No em dashes anywhere (copy, comments, commits). Use spaced hyphens, colons, parentheses.

**Verification note:** This is a static presentational Astro site with no test framework. "Tests" here are `npm run build` passing plus targeted Node/grep content assertions on source and built output (frozen hero copy, ProductLoop output shape, no stray R1 hexes). We do not add a unit-test framework for markup.

---

## Task 1: Branch and clean baseline

**Files:**
- Modify: git working tree (several components have uncommitted edits)

- [ ] **Step 1: Inspect uncommitted work**

Run: `git -C "." status --short`
Expected: shows modified `CTAStrip.astro`, `Hero.astro`, `Marquee.astro`, `PricingTiers.astro`, `ProductShowcase.astro`, `Layout.astro`, `pricing-calculator.html`, `.gitignore`.

- [ ] **Step 2: Preserve the existing WIP on main so nothing is lost**

Run:
```bash
git add -A && git commit -m "chore: snapshot marketing WIP before Rev 2 redesign"
```
Expected: a commit on `main` capturing current edits.

- [ ] **Step 3: Create the feature branch**

Run:
```bash
git checkout -b feat/marketing-rev2
```
Expected: switched to `feat/marketing-rev2`.

- [ ] **Step 4: Verify a clean build baseline**

Run: `npm install && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit (no-op checkpoint marker not needed; proceed)**

---

## Task 2: Self-host Manrope + JetBrains Mono, retire Inter

**Files:**
- Modify: `package.json` (deps), `src/layouts/Layout.astro`

- [ ] **Step 1: Install the font packages**

Run:
```bash
npm install @fontsource-variable/manrope @fontsource/jetbrains-mono
```
Expected: both added to dependencies.

- [ ] **Step 2: Import fonts in Layout frontmatter and remove the Google Fonts link**

In `src/layouts/Layout.astro`, add to the top of the frontmatter (before the existing `import '../styles/global.css';`):
```astro
import '@fontsource-variable/manrope';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
```
Then delete these three lines from `<head>`:
```astro
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Build to confirm fonts bundle**

Run: `npm run build`
Expected: build succeeds; `dist/` contains bundled Manrope woff2 files (self-hosted, no external font request).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/layouts/Layout.astro
git commit -m "feat: self-host Manrope + JetBrains Mono, drop Inter"
```

---

## Task 3: Rewrite the design tokens to Rev 2

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace the `@theme` block**

Replace the entire `@theme { ... }` block in `src/styles/global.css` with:
```css
@theme {
  /* Surfaces (warm charcoal, three steps, never navy) */
  --color-base:          #131211;   /* Desk */
  --color-surface:       #232120;   /* Page: cards, sidebar, bars */
  --color-sunken:        #080807;   /* recessed wells, table containers */
  --color-hover:         #2C2A28;

  /* Text */
  --color-pri:           #F2F0EC;   /* Ink */
  --color-sec:           #B3AFA8;
  --color-ter:           #8A857E;   /* Meta: alias kept so existing text-ter usages resolve */
  --color-meta:          #8A857E;
  --color-slate:         #8A857E;   /* legacy eyebrow colour maps to Meta */

  /* Accent (unchanged) + breach */
  --color-accent:        #E91E8C;
  --color-accent-hover:  #C91576;
  --color-accent-dim:    rgba(233, 30, 140, 0.12);
  --color-accent-border: rgba(233, 30, 140, 0.25);
  --color-breach:        #F2685C;   /* breach / alert ONLY */

  /* Hairlines */
  --color-border:        #454138;
  --color-border-light:  #262421;

  /* Type */
  --font-family-sans:    'Manrope Variable', Manrope, system-ui, sans-serif;
  --font-family-display: 'Manrope Variable', Manrope, system-ui, sans-serif;
  --font-family-mono:    'JetBrains Mono', 'Courier New', monospace;

  /* Radii (Rev 2: tile 2 / card 3 / input 6 / pill 20) */
  --radius-tile:  2px;
  --radius-card:  3px;
  --radius-input: 6px;
  --radius-pill:  20px;
}
```

- [ ] **Step 2: Keep the existing keyframes/reduced-motion block as-is**

Leave everything below the `@theme` block (the Axie keyframes, `@media (prefers-reduced-motion)`, `fadeInUp`, `[data-animate]`) unchanged for now. Task 12 extends reduced-motion for video.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds. Site now renders warm charcoal + Manrope. Some components still show R1 hexes hardcoded inline (fixed in Task 11).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: rewrite design tokens to Rev 2 warm charcoal"
```

---

## Task 4: ProductLoop component (poster-first, lazy, reduced-motion)

**Files:**
- Create: `src/components/ProductLoop.astro`
- Create: `scripts/assert-productloop.mjs`

- [ ] **Step 1: Write the component**

Create `src/components/ProductLoop.astro`:
```astro
---
// Reusable product video loop. Renders poster-only until real clips exist.
// Drop /public/media/<src>.mp4 + <src>.webm to activate; no markup change needed.
interface Props {
  src: string;        // basename in /public/media (no extension)
  poster: string;     // path under /public, e.g. /media/register.jpg
  label: string;      // accessible description
  hasClip?: boolean;  // set true once mp4+webm exist for this src
}
const { src, poster, label, hasClip = false } = Astro.props;
---
<figure class="product-loop rounded-[var(--radius-card)] overflow-hidden bg-sunken border border-border-light">
  {hasClip ? (
    <video
      class="w-full h-auto block"
      muted autoplay loop playsinline preload="none"
      poster={poster}
      aria-label={label}
      data-loop
    >
      <source src={`/media/${src}.webm`} type="video/webm" />
      <source src={`/media/${src}.mp4`} type="video/mp4" />
    </video>
  ) : (
    <img class="w-full h-auto block" src={poster} alt={label} loading="lazy" />
  )}
</figure>
```

- [ ] **Step 2: Write the assertion script**

Create `scripts/assert-productloop.mjs`:
```js
import { readFileSync } from 'node:fs';
const s = readFileSync(new URL('../src/components/ProductLoop.astro', import.meta.url), 'utf8');
const need = ['muted', 'autoplay', 'loop', 'playsinline', 'preload="none"', 'video/webm', 'video/mp4', 'aria-label'];
const missing = need.filter((t) => !s.includes(t));
if (missing.length) { console.error('ProductLoop missing:', missing); process.exit(1); }
console.log('ProductLoop OK');
```

- [ ] **Step 3: Run the assertion**

Run: `node scripts/assert-productloop.mjs`
Expected: prints `ProductLoop OK`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductLoop.astro scripts/assert-productloop.mjs
git commit -m "feat: add ProductLoop component (poster-first, lazy, a11y)"
```

---

## Task 5: Placeholder posters and /media directory

**Files:**
- Create: `public/media/.gitkeep`
- Create: `scripts/make-posters.mjs`
- Create: `public/media/{hero,register,assessment,workplan,echo}.jpg` (generated)

- [ ] **Step 1: Write a poster generator (warm charcoal placeholder frames)**

Create `scripts/make-posters.mjs`:
```js
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const dir = new URL('../public/media/', import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
const frames = {
  hero: 'Dashboard', register: 'Risk Register', assessment: '7-step Assessment',
  workplan: 'Workplan', echo: 'Echo',
};
for (const [name, label] of Object.entries(frames)) {
  const html = `<!doctype html><meta charset=utf8><style>
    html,body{margin:0;width:1200px;height:750px}
    body{background:#131211;display:flex;align-items:center;justify-content:center;
    font-family:system-ui;color:#8A857E}
    .p{border:1px solid #262421;border-radius:3px;background:#080807;width:88%;height:82%;
    display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:700}
    .p b{color:#E91E8C;margin-left:10px}</style>
    <div class=p>${label}<b>&#9632;</b></div>`;
  const tmp = `${dir}${name}.html`;
  writeFileSync(tmp, html);
  execSync(`"${CHROME}" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,750 --default-background-color=131211ff --screenshot="${dir}${name}.jpg" "file://${tmp}"`);
}
console.log('posters generated');
```

- [ ] **Step 2: Generate the posters**

Run: `node scripts/make-posters.mjs`
Expected: prints `posters generated`; five `.jpg` files exist in `public/media/`.

Run: `ls public/media/*.jpg | wc -l`
Expected: `5`.

- [ ] **Step 3: Commit**

```bash
git add public/media/*.jpg scripts/make-posters.mjs
git commit -m "feat: add placeholder posters for product loops"
```

---

## Task 6: Hero - keep frozen copy, swap visual to ProductLoop, Rev 2 tokens

**Files:**
- Modify: `src/components/Hero.astro`
- Create: `scripts/assert-hero-copy.mjs`

- [ ] **Step 1: Write the frozen-copy guard first**

Create `scripts/assert-hero-copy.mjs`:
```js
import { readFileSync } from 'node:fs';
const s = readFileSync(new URL('../src/components/Hero.astro', import.meta.url), 'utf8');
const lines = [
  'Not working on SOC 2 yet?',
  "That's fine. The prospects in your pipeline will surely wait.",
  'They won’t. SOC 2 takes months and the question always arrives mid-deal. Start now: 30 minutes to scope, a real audit date on the calendar, a clear roadmap. When they ask, you have an answer instead of an apology.',
];
// Accept either straight or curly apostrophe in "That's"
const norm = s.replace(/’/g, "'");
const missing = lines.filter((l) => !norm.includes(l.replace(/’/g, "'")));
if (missing.length) { console.error('Hero copy changed / missing:', missing); process.exit(1); }
console.log('Hero copy OK');
```

- [ ] **Step 2: Run the guard against current Hero (must pass before edits)**

Run: `node scripts/assert-hero-copy.mjs`
Expected: `Hero copy OK` (copy already present).

- [ ] **Step 3: Edit Hero.astro**

In `src/components/Hero.astro`:
- Do NOT change any of the three copy blocks (eyebrow line, `<h1>` two lines, the `<p>`).
- Replace `border-[#1A2030]` on the `<section>` with `border-border-light`.
- Replace the entire right-column block (the `<div class="relative hidden md:flex ...">` Axie SVG and floating chips) with:
```astro
      <!-- Right: product loop -->
      <div class="relative hidden md:block">
        <ProductLoop src="hero" poster="/media/hero.jpg" label="Axis-Scale dashboard: assessments, over-the-line count, aggregate residual" />
      </div>
```
- Add the import to the frontmatter:
```astro
import ProductLoop from './ProductLoop.astro';
```
- In the badges row, the check marks currently use `text-accent`; keep them (pink is allowed as the one accent). Replace the `text-[#2A3347]` dot separators with `text-border`.

- [ ] **Step 4: Run guard + build**

Run: `node scripts/assert-hero-copy.mjs && npm run build`
Expected: `Hero copy OK` then a successful build.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro scripts/assert-hero-copy.mjs
git commit -m "feat: hero on Rev 2 tokens + product loop (copy frozen)"
```

---

## Task 7: Trust bar (repurpose Marquee)

**Files:**
- Modify: `src/components/Marquee.astro`

- [ ] **Step 1: Reshape into a slim credibility band**

Rewrite `src/components/Marquee.astro` as a single slim band: left label "Auditor-built", then the compliance marks (SOC 2, ISO 27001, EU AI Act) as neutral mono chips, and one proof line. Use tokens only:
```astro
---
const marks = ['SOC 2', 'ISO 27001', 'EU AI Act'];
---
<section class="px-6 md:px-16 py-6 bg-base border-b border-border-light">
  <div class="max-w-[1120px] mx-auto flex flex-wrap items-center gap-x-8 gap-y-3">
    <span class="text-[11px] font-bold tracking-[1.2px] uppercase text-meta">Auditor-built</span>
    <div class="flex flex-wrap items-center gap-3">
      {marks.map((m) => (
        <span class="px-3 py-1.5 rounded-[var(--radius-pill)] border border-border text-[12px] font-mono text-sec">{m}</span>
      ))}
    </div>
    <span class="text-[13px] text-meta">Scoped, not guessed. No fabricated evidence.</span>
  </div>
</section>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Marquee.astro
git commit -m "feat: trust bar (repurpose Marquee) on Rev 2"
```

---

## Task 8: ProblemSection with coded animation (merge PainSection + TwoAnswers)

**Files:**
- Create: `src/components/ProblemSection.astro`

- [ ] **Step 1: Build the section**

Create `src/components/ProblemSection.astro`. Carry the strongest existing copy from `PainSection.astro` and `TwoAnswers.astro` verbatim (open both, reuse their headline + the two-answers contrast). State the pain once. Include a coded CSS animation: a horizontal "deal timeline" of steps that advances, then freezes with a coral marker when the "security questionnaire" step lands. Structure:
```astro
---
// Copy pulled verbatim from PainSection.astro + TwoAnswers.astro.
const steps = ['Intro call', 'Demo', 'Pricing', 'Security review', 'Close'];
---
<section class="px-6 md:px-16 py-24 bg-base border-b border-border-light" data-animate>
  <div class="max-w-[1120px] mx-auto">
    <h2 class="font-display font-[800] text-[30px] md:text-[38px] tracking-[-1px] text-pri max-w-[700px] mb-6">
      The SOC 2 question always arrives mid-deal.
    </h2>
    <p class="text-sec text-[18px] leading-[1.6] max-w-[620px] mb-12">
      <!-- reuse the sharpest sentence from PainSection.astro here, verbatim -->
    </p>

    <!-- Coded deal-freeze timeline -->
    <div class="deal-timeline flex items-center gap-2 mb-14" aria-hidden="true">
      {steps.map((s, i) => (
        <div class="flex items-center gap-2">
          <span class={`dt-step text-[12px] font-mono px-3 py-2 rounded-[var(--radius-card)] border ${i === 3 ? 'dt-freeze border-[var(--color-breach)] text-[var(--color-breach)]' : 'border-border text-meta'}`}>{s}</span>
          {i < steps.length - 1 && <span class="dt-line w-8 h-px bg-border"></span>}
        </div>
      ))}
    </div>

    <!-- Two answers contrast (verbatim from TwoAnswers.astro) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="p-6 rounded-[var(--radius-card)] bg-surface border border-border-light">
        <div class="text-[11px] font-bold uppercase tracking-[1.2px] text-meta mb-2">Without Axis</div>
        <p class="text-sec text-[16px]">"We don't have it yet."</p>
      </div>
      <div class="p-6 rounded-[var(--radius-card)] bg-surface border border-border-light">
        <div class="text-[11px] font-bold uppercase tracking-[1.2px] text-meta mb-2">With Axis</div>
        <p class="text-pri text-[16px]">"Already in progress. Audit booked."</p>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes dtFreeze { 0%,60%{opacity:.5} 72%{opacity:1;transform:scale(1.04)} 100%{opacity:1;transform:none} }
  .dt-freeze { animation: dtFreeze 3.2s ease-in-out infinite; transform-origin:center; }
  @media (prefers-reduced-motion: reduce) { .dt-freeze { animation: none; } }
</style>
```

- [ ] **Step 2: Fill the two verbatim copy spots**

Open `src/components/PainSection.astro` and `src/components/TwoAnswers.astro`; copy the sharpest pain sentence into the `<p>` and confirm the two-answer strings match the product voice. Do not invent new claims.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProblemSection.astro
git commit -m "feat: ProblemSection with coded deal-freeze animation"
```

---

## Task 9: PlatformSection (merge Why + WhatIsInside + ProductShowcase + Echo)

**Files:**
- Create: `src/components/PlatformSection.astro`

- [ ] **Step 1: Build the centerpiece**

Create `src/components/PlatformSection.astro`: an intro headline, then capability blocks alternating left/right, each pairing a short benefit with a `ProductLoop`. Pull benefit copy from `WhySection.astro`, `WhatIsInside.astro`, `ProductShowcase.astro` (Echo block from the Echo content in `ProductShowcase.astro`). Five loops: register, assessment, workplan, echo, plus reuse of hero framing if desired (default 4 capability loops + Echo = uses register/assessment/workplan/echo).
```astro
---
import ProductLoop from './ProductLoop.astro';
const caps = [
  { src: 'register',   title: 'Risk Register',      body: 'Scope, not guess. Every risk with inherent, controls, and residual.' },
  { src: 'assessment', title: '7-step assessment',   body: 'A guided deep-dive that turns questions into a scored posture.' },
  { src: 'workplan',   title: 'Workplan',            body: 'A real audit date on the calendar, with the tasks to hit it.' },
  { src: 'echo',       title: 'Echo',                body: 'Security questionnaires answered for you, grounded in your evidence.' },
];
---
<section class="px-6 md:px-16 py-24 bg-base border-b border-border-light">
  <div class="max-w-[1120px] mx-auto">
    <div class="text-[11px] font-bold tracking-[1.2px] uppercase text-meta mb-4">The platform</div>
    <h2 class="font-display font-[800] text-[30px] md:text-[40px] tracking-[-1px] text-pri max-w-[720px] mb-16">
      One tool, from first scope to audit day.
    </h2>
    <div class="flex flex-col gap-20">
      {caps.map((c, i) => (
        <div class={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`} data-animate>
          <div>
            <h3 class="font-display font-[700] text-[24px] text-pri mb-3">{c.title}</h3>
            <p class="text-sec text-[17px] leading-[1.6] max-w-[440px]">{c.body}</p>
          </div>
          <ProductLoop src={c.src} poster={`/media/${c.src}.jpg`} label={`${c.title} in Axis-Scale`} />
        </div>
      ))}
    </div>
  </div>
</section>
```
Refine each `body` string against the real copy in the merged components; keep the product voice, no new claims.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succeeds; four poster placeholders render.

- [ ] **Step 3: Commit**

```bash
git add src/components/PlatformSection.astro
git commit -m "feat: PlatformSection centerpiece with product loops"
```

---

## Task 10: DifferenceSection + ClosingSection + footer band

**Files:**
- Create: `src/components/DifferenceSection.astro`, `src/components/ClosingSection.astro`
- Modify: `src/components/EnforcementWatch.astro` (slim)

- [ ] **Step 1: DifferenceSection (merge BeforeAfterSection + PlatformProblem)**

Create `src/components/DifferenceSection.astro` presenting the honesty position (scoped not guessed, no fabricated evidence) as clean before/after tiles, no pink left-borders. Pull the comparison rows verbatim from `BeforeAfterSection.astro` and the "platforms are bloated" argument from `PlatformProblem.astro`. Use `bg-surface`, `border-border-light`, `rounded-[var(--radius-card)]`. One pink only (a single accent on the "with Axis" column heading).

- [ ] **Step 2: ClosingSection (merge EleanorReveal + EarlyAccess + CTAStrip)**

Create `src/components/ClosingSection.astro` with: a short founder/auditor-built credibility line (from `EleanorReveal.astro`), the early-access form (port the form markup and action from `EarlyAccess.astro` verbatim, id `early-access`), and the final CTA (from `CTAStrip.astro`). Keep the form's existing submit behavior and field names unchanged.

- [ ] **Step 3: Slim EnforcementWatch**

Edit `src/components/EnforcementWatch.astro` to a single slim strip (headline + one line + the existing subscribe link), remove any full-height padding, use `bg-surface` and `border-border-light`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/DifferenceSection.astro src/components/ClosingSection.astro src/components/EnforcementWatch.astro
git commit -m "feat: Difference + Closing sections, slim EnforcementWatch"
```

---

## Task 11: Rewrite index.astro to the 7-section order + delete absorbed components

**Files:**
- Modify: `src/pages/index.astro`
- Delete: `PainSection`, `TwoAnswers`, `WhySection`, `WhatIsInside`, `ProductShowcase`, `BeforeAfterSection`, `PlatformProblem`, `EarlyAccess`, `CTAStrip`, `EleanorReveal` (`.astro` files)

- [ ] **Step 1: Rewrite index.astro**

Replace `src/pages/index.astro` with:
```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Marquee from '../components/Marquee.astro';
import ProblemSection from '../components/ProblemSection.astro';
import PlatformSection from '../components/PlatformSection.astro';
import DifferenceSection from '../components/DifferenceSection.astro';
import PricingTiers from '../components/PricingTiers.astro';
import ClosingSection from '../components/ClosingSection.astro';
import EnforcementWatch from '../components/EnforcementWatch.astro';
import NewsletterSignup from '../components/NewsletterSignup.astro';
import Footer from '../components/Footer.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <Marquee />
    <ProblemSection />
    <PlatformSection />
    <DifferenceSection />
    <PricingTiers />
    <ClosingSection />
  </main>
  <EnforcementWatch />
  <NewsletterSignup />
  <Footer />
</Layout>
```

- [ ] **Step 2: Delete the absorbed components**

Run:
```bash
git rm src/components/PainSection.astro src/components/TwoAnswers.astro src/components/WhySection.astro src/components/WhatIsInside.astro src/components/ProductShowcase.astro src/components/BeforeAfterSection.astro src/components/PlatformProblem.astro src/components/EarlyAccess.astro src/components/CTAStrip.astro src/components/EleanorReveal.astro
```
(If `Testimonial.astro` remains unused and unreferenced, leave it in place.)

- [ ] **Step 3: Build and confirm no missing-import errors**

Run: `npm run build`
Expected: succeeds with zero unresolved imports.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: new 7-section index, remove absorbed components"
```

---

## Task 12: Reduced-motion for video + hardcoded-hex sweep

**Files:**
- Modify: `src/styles/global.css`, plus any component with R1 hexes

- [ ] **Step 1: Extend reduced-motion to pause loops**

Append to `src/styles/global.css`:
```css
@media (prefers-reduced-motion: reduce) {
  video[data-loop] { animation: none; }
}
```
(The `<video>` uses `autoplay`; also add a tiny script in `Layout.astro` before `</body>` to honor the preference at runtime.)

In `src/layouts/Layout.astro`, add before `</body>`:
```astro
  <script>
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('video[data-loop]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
    }
  </script>
```

- [ ] **Step 2: Sweep remaining R1 hexes and rounded-full pills**

Run: `grep -rInE '#0D1117|#161B27|#1E2538|#232D42|#2A3347|#1A2030|#E6EDF3|#8B949E|#6E7681' src/`
Expected initially: a list of inline hardcoded colours. Replace each with the matching token utility (`bg-base`, `bg-surface`, `border-border`, `text-pri`, `text-sec`, `text-meta`). Then re-run until it returns nothing.

Run: `grep -rIn 'rounded-full' src/`
Expected: replace each `rounded-full` with `rounded-[var(--radius-pill)]` (Rev 2 pills are 20px, not fully round).

- [ ] **Step 3: Verify sweep is clean**

Run: `grep -rInE '#0D1117|#161B27|#1E2538|#232D42|#2A3347|#1A2030|#E6EDF3|#8B949E|#6E7681|rounded-full' src/ ; echo "exit:$?"`
Expected: no matches (grep exit 1), i.e. no output before `exit:1`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro src/components
git commit -m "feat: reduced-motion for loops + Rev 2 hex/pill sweep"
```

---

## Task 13: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Frozen hero copy still intact**

Run: `node scripts/assert-hero-copy.mjs`
Expected: `Hero copy OK`.

- [ ] **Step 2: ProductLoop shape intact**

Run: `node scripts/assert-productloop.mjs`
Expected: `ProductLoop OK`.

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: succeeds, no warnings about unresolved imports or missing assets.

- [ ] **Step 4: Manual visual check (record result)**

Run: `npm run preview` and open the local URL. Confirm at mobile (375px), tablet (768px), desktop (1280px): 7 sections in order, warm charcoal, one pink per section, posters render in Hero + Platform, no pink left-borders, no navy remnants.

- [ ] **Step 5: Commit any fixes and finish the branch**

Follow superpowers:finishing-a-development-branch to open a PR for `feat/marketing-rev2`. Do NOT merge or deploy (Eleanor-only per project rules). Note in the PR that real product recordings are pending SP1 (app re-theme) and that each `ProductLoop` flips to video by adding `/public/media/<src>.{mp4,webm}` and setting `hasClip`.

---

## Self-Review

- **Spec coverage:** Approach A 7 sections (Tasks 6-11), Rev 2 tokens (Task 3), Manrope-only (Task 2), hero frozen (Task 6 guard), ProductLoop with poster/lazy/reduced-motion (Tasks 4, 12), coded problem animation (Task 8), footer band (Tasks 10-11), component fate (Task 11), perf via posters + preload=none (Tasks 4-5), verification (Task 13). Recordings gated on SP1 are explicitly deferred (Task 13 Step 5). Covered.
- **Placeholder scan:** The two copy spots in Tasks 8 and 9 instruct pulling verbatim strings from named existing components rather than inventing copy; this is deliberate (avoids fabricated marketing claims) and points at exact source files, not a vague TODO.
- **Type consistency:** `ProductLoop` props (`src`, `poster`, `label`, `hasClip`) are used consistently in Tasks 6, 9. Token names match the `@theme` block in Task 3.
