# Axis-Scale Landing Site Rebuild — Design Spec

**Date:** 2026-06-06
**Status:** Approved — implementation in progress

## Context

The current `axis-scale-landing` site sells a **$950 kit** and relies on competitor comparisons (Vanta, Drata, $50K consultant framing). Two strategic problems:

1. **It's a platform, not a kit.** The product is a full SaaS. The landing page undersells it.
2. **Single CTA funnel.** Replace with two co-equal doors: *Start self-serve* (platform) and *Work with Eleanor* (premium escalation).

The Trust Crisis pain card references "Delve" faking SOC 2 reports — a competitor call-out that must be deleted and replaced.

**Narrative arc (Approach B):** bold founder-problem → pain cards → Eleanor reveal ("so I built this") → platform capabilities → two-door pricing → early access form → closer.

---

## Non-Negotiable Constraints

1. Zero comparisons, zero competitor names anywhere (including meta tags, alt text, marquee)
2. Every claim must be true — no invented stats, testimonials, or customer counts
3. Eleanor's identity is all placeholders — never fabricate credentials, bio, or photo
4. Do not deploy without Eleanor's explicit go-ahead

---

## Design Decisions

| Decision | Choice |
|----------|--------|
| Narrative arc | Approach B (Problem → Expert reveal) |
| Marquee | New component, CSS-only animation |
| Early access form | Dedicated section, inline, near footer |
| Form fields | Name + Email + Company + Message |
| Form delivery | Formspree AJAX (`[FORMSPREE_ID]` placeholder) |
| Pricing layout | Side-by-side equal cards (two co-equal doors) |
| Eleanor reveal | Centered: circular photo → name → credentials → bio → LinkedIn (no pull quote) |

---

## Component Map

| Component | Action | Notes |
|-----------|--------|-------|
| `Layout.astro` | modify | New title/meta; add Instrument Serif + JetBrains Mono fonts |
| `global.css` | modify | Add display + mono font family tokens |
| `Nav.astro` | modify | Why / How it works / Pricing links + Log in + Start free |
| `Marquee.astro` | **new** | CSS-only ticker, positive value terms |
| `Hero.astro` | rewrite | Problem headline + Eleanor credential line + two-door CTAs |
| `PainSection.astro` | modify | Replace Trust Crisis → The Unbounded Unknown; add `id="why"` |
| `EleanorReveal.astro` | **new** | Centered bio layout; all content is placeholders; `id="about"` |
| `WhatIsInside.astro` | rewrite | 80/20 framing; `id="how-it-works"` |
| `PricingTiers.astro` | rewrite | Two equal doors; `id="pricing"` |
| `EarlyAccess.astro` | **new** | Inline form → Formspree AJAX; `id="early-access"` |
| `CTAStrip.astro` | rewrite | Positive close + two-door CTAs |
| `Footer.astro` | modify | Add Privacy/Terms/Contact placeholder links |
| `index.astro` | modify | Add Marquee + EleanorReveal + EarlyAccess to tree |

---

## Placeholders (fill before launch)

`[ELEANOR_FULL_NAME]` · `[ELEANOR_FIRST_NAME]` · `[ELEANOR_CREDENTIALS]` · `[ELEANOR_BIO]` · `[ELEANOR_PHOTO]` · `[ELEANOR_LINKEDIN]` · `[SIGNUP_URL]` · `[BOOKING_URL]` · `[SELF_SERVE_PRICE]` · `[SELF_SERVE_TIERS]` · `[ESCALATION_PRICE]` · `[FORMSPREE_ID]` · `[PRIVACY_URL]` · `[TERMS_URL]`

---

## Verification

1. `npm run dev` — all sections render, no broken links
2. Grep built output for prohibited strings: Vanta, Drata, Delve, "$50K", "skip the"
3. Test Formspree submission → confirm email to eleanoryehudai@gmail.com
4. Test mobile at 380px — CTAs, pricing cards, Eleanor section
5. `npm run build` — clean build
6. `npm run preview` — local review before any push to main
