---
name: iphone-product-design
description: This skill should be used when the user asks for a page to look/feel like an Apple product page (iPhone/MacBook/AirPods marketing site) — "iPhone tanıtım sitesi gibi", "Apple tarzı", "apple.com/iphone gibi", "product showcase site", huge scroll-driven typography, pinned/scrubbed reveals, alternating full-bleed light/dark sections. Captures Apple's actual design tokens and interaction patterns as a reusable reference, translated for non-Apple subjects (a person, a product, a project).
version: 1.0.0
---

Apple's product pages (apple.com/iphone-*, /macbook-*, /airpods-*) are a specific, well-documented design grammar — not just "big text on black." Treat the subject of the page (a phone, a person, a project) as **the product being unveiled**. Use this skill as a reference when translating that grammar to a different subject; do not copy Apple's logo, trademarks, or brand name.

## Core principle: restraint, not decoration

Apple's pages are almost monochrome. **One accent color for the whole site** (their blue), never a rainbow of accents per section. Color is a rare event — most of the page is black, white, and one gray. If every section has its own accent hue, it stops reading as Apple and starts reading as generic "colorful SaaS." Resist the urge to reuse leftover accent colors from a previous design pass.

## Design tokens (real values from Apple's own site — legitimate to reuse verbatim, they are just CSS colors, not trademarks)

- `#000000` — pure black hero/closing sections (not `#0a0a0a` or off-black; Apple genuinely uses true black for these)
- `#1d1d1f` — "Apple near-black": body text on light sections, and the light-section background is *not* pure white
- `#f5f5f7` — "Apple light gray": the signature light-section background, instantly recognizable, used instead of `#ffffff`
- `#86868b` — secondary/muted gray text, used everywhere for subheads and captions
- `#0071e3` — Apple blue, the *one* accent: primary CTA fill, links, on light backgrounds
- `#2997ff` — the same accent shifted brighter for dark backgrounds (accent hue does invert-adjust between light/dark sections, but stays the same hue family)

## Typography

- System font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif` — or **Inter** as a metrically-close open substitute if a webfont is wanted. Do not reach for a display/geometric/quirky face (Unbounded, Poppins, etc.) — the whole point is a *neutral, huge* typeface, not a characterful one.
- One family, weight does the work: 600–800 for headlines, 400 for body, 500–600 for CTAs/labels.
- Headlines are enormous and **tight**: `font-size: clamp(3rem, 8vw, 7rem)`, `letter-spacing: -0.03em to -0.045em`, `line-height: 1.05`. The tight negative tracking at huge sizes is a large part of what makes it read as "Apple."
- Body/subhead text is comfortable, not tight: `line-height: 1.4–1.6`, normal tracking, `#86868b` on dark or light.
- Minimal use of eyebrow/kicker labels — Apple mostly just goes straight from a huge headline into a gray subhead line, without a small-caps category tag above it. If a kicker is used, keep it short, sentence case or subtle caps, never loud.

## Layout patterns

**Hero**: giant centered (or large-left) headline naming the subject, one calm gray subhead sentence below it, two CTAs — one solid pill in the accent color, one plain text link with a `>` chevron (`Learn more >`) — then a large, high-quality photo/render filling most of the remaining viewport. Text sits *above* the image, not overlaid on top of it fighting for contrast (Apple rarely puts headline text directly over a busy photo — image gets its own space below the text).

**Full-bleed alternating sections**: stack `100vh`-plus sections, each with its own solid background — alternate pure black, `#f5f5f7`, pure black, `#f5f5f7`... Content is centered (both axes) within each section. This alternation *is* the site's primary rhythm; do not use gradients or texture as a substitute for a real solid-color section change.

**Spec/number callout**: a huge number/word with a tiny caption directly under it, no card chrome, no border, no icon — just scale contrast. E.g. `48MP` enormous, `Main camera` tiny gray beneath. Use this for stats instead of bordered stat cards.

**Pinned scroll-scrub reveal** (the signature interaction): a section is pinned (`position: sticky` or `ScrollTrigger.create({pin: true})`) while the user scrolls through it, and a visual — a 3D render, a photo sequence, a particle formation — scrubs forward tied directly to scroll progress (not time-based). This is the one place elaborate motion belongs; everywhere else motion is a simple fade/scale-in on scroll-into-view. Apple's chip-page particle-cloud-condensing-into-an-object effect is a real precedent for using a particle system here specifically, not as ambient hero decoration.

**Sticky nav with adaptive contrast**: a slim, translucent, blurred nav bar fixed at the top. Its text/logo color flips between white and near-black depending on whether the section currently under the nav is dark or light — implemented by tagging each section with a data attribute and swapping the nav's text color class via IntersectionObserver as sections cross the nav's boundary. This adaptive-contrast nav is one of Apple's most copied, most recognizable details.

**Closing CTA**: final section returns to pure black, one more restrained headline, one or two CTAs, then a dense small-type footer.

## Motion principles

- Default motion is a simple opacity+y fade-in on scroll-into-view, one-shot, ~0.6–0.9s, `power2.out`-style easing. Not everything needs a bespoke animation.
- Reserve elaborate/scrubbed motion for exactly one or two signature moments per page (the pin-scrub reveal above). Doing it everywhere cheapens it and reads as try-hard rather than confident.
- No particle backgrounds as ambient hero wallpaper — if a particle system is used, it should be a specific, purposeful, pinned reveal tied to scroll progress, not a looping decoration.
- Respect `prefers-reduced-motion`: pinned/scrubbed sections degrade to a static end-state image, fades degrade to instant appearance.

## Quick checklist

- [ ] One accent color total, not one per section
- [ ] `#f5f5f7` / `#1d1d1f` / `#000000` / `#86868b` — not arbitrary grays
- [ ] Headlines: huge, tight negative letter-spacing, single neutral typeface
- [ ] Sections alternate solid black/light, not gradients
- [ ] Stats are scale-contrast (huge number/tiny caption), not bordered cards
- [ ] Nav adapts light/dark per section in view
- [ ] At most 1–2 pinned/scrubbed scroll moments; everything else is a simple fade-in
- [ ] No Apple logo, wordmark, or "iPhone" product name used on the output page
