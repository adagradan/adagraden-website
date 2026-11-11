# Project Rules — NGO Website Design System

These rules are the source of truth for every session. Every page, section and component must respect them. Read this file in full before making design or code changes.

---

## 0. Stack and working rules

- **Stack:** Next.js 16 (App Router, `app/`), React 19, TypeScript, Tailwind CSS v4.
- This Next.js version has breaking changes. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices (see `AGENTS.md`).
- Don't introduce a new framework or major dependency without a stated justification.
- Don't rewrite working application logic unnecessarily.
- Design tokens live in one place (`app/globals.css` via Tailwind v4 `@theme`). Never hard-code colours, font sizes or spacing that bypass the tokens.
- Build reusable components first, then compose pages from them. No one-off page-specific restyles of shared components.

**Implementation order for new work:**
1. Inspect the project structure, stack, routes, components and styles.
2. Identify available organisational content and media assets.
3. Establish/confirm shared design tokens and component architecture.
4. Implement the global layout (header, footer).
5. Implement reusable sections.
6. Apply the design system across all pages.
7. Test responsive layouts and functionality.

---

## 1. Objective

A premium, modern, visually consistent website for a nonprofit (NGO), using the Carenest website screenshot as the primary visual reference. Extract its design philosophy — don't copy it pixel-for-pixel.

The site must communicate **compassion, trust, transparency, professionalism, community impact and hope**, and feel like an established international nonprofit. Every page must feel like part of one carefully designed product. Avoid anything that looks like a generic template or AI-generated site.

## 2. Design philosophy

- Minimalism without emptiness.
- Emotional storytelling through authentic photography.
- Clear visual hierarchy, strong typography.
- Generous whitespace, balanced compositions.
- Strong contrast between content sections.
- Consistent spacing, alignment and component proportions.
- Sophisticated layouts, not generic templates.
- Meaningful storytelling over decoration.
- Conversion-focused without aggressive marketing.

---

## 3. Design tokens

### Colour

| Token | Value | Use |
|---|---|---|
| accent | `#F5D65E` | Primary buttons, small highlights, active indicators, badges, selected accents only |
| text | `#111111` | Primary text |
| text-muted | `#777777` | Secondary text |
| bg | `#FFFFFF` | Main background |
| bg-alt | `#F7F7F5` | Alternate section background |
| border | `#E5E5E5` | Borders, dividers |
| dark | `#080808` | Dark sections, footer |
| on-dark | `#FFFFFF` | Text on dark sections |

- Don't overuse yellow.
- No new colours without a clear design justification.
- Text on `#F5D65E` must be `#111111` (white fails contrast). Check `#777777` meets AA where used for body text; darken if needed for small text.

### Typography

Font: **Manrope** (primary), Inter (fallback). Load via `next/font`.

| Role | Desktop size |
|---|---|
| Hero heading | 56–76px |
| Page heading | 44–60px |
| Section heading | 32–42px |
| Card heading | 19–24px |
| Body | 15–17px |
| Supporting / meta | 12–14px |

- Consistent weights, comfortable line heights, controlled heading widths (max-width on headings).
- No oversized text in ordinary content sections.
- Scale headings down at tablet/mobile.

### Spacing

4px base scale:

| Value | Use |
|---|---|
| 4px | Micro |
| 8px | Compact |
| 16px | Standard |
| 24px | Component |
| 32px | Content |
| 48px | Section internal |
| 64–96px | Section separation |
| 100–140px | Major desktop section spacing |

- Max content width ≈ **1200–1320px**, centred.
- Consistent horizontal page gutters on every page.

### Borders and surfaces

- Subtle 1px borders; understated shadows.
- Card radius 8–16px; pill-shaped buttons where appropriate.
- No heavy shadows, excessive glassmorphism, unnecessary gradients or over-decorated cards.

---

## 4. Header and navigation (global)

- Contents: logo, primary nav links, contact info where appropriate, prominent Donate/Support CTA.
- White background, dark type, minimal height, clean horizontal alignment, subtle bottom border if needed, generous nav spacing.
- Clear active-page indicator (not colour alone).
- Mobile: clean, accessible mobile menu (keyboard operable, focus managed, `aria-expanded`).
- Identical behaviour on every page.

## 5. Homepage section order

1. **Hero** — full-width, authentic photography, large headline, short description, primary CTA (Donate Now), optional secondary CTA (Explore Our Programs), overlay for contrast. Purpose must be clear within seconds.
2. **Social proof / impact** — large numbers + short labels (people reached, communities, children educated, health interventions, volunteers). **Verified figures only.**
3. **Mission / introduction** — editorial photo, concise text, clear CTA.
4. **Programs** — consistent program cards: image, title, short description, Learn More link.
5. **How we create impact** — numbered process (four steps, as in the reference): large number, title, short text, consistent alignment.
6. **Stories / testimonials** — real photos, credible consented quotes.
7. **Latest news** — consistent editorial cards.
8. **Donation CTA** — visually distinctive section.
9. **Footer** — dark: logo + description, quick links, program links, contact info, social links, newsletter (if applicable), copyright.

## 6. Inner pages

Same visual language, layout suited to purpose. Reusable page structures.

**Standard inner-page hero:** eyebrow label or breadcrumb, page title, concise intro, image where appropriate. Don't give every page the same oversized hero.

- **About Us:** introduction, mission & vision, core values, history & milestones, leadership & team, partners & supporters, impact.
- **Programs:** overview, categories, links to detail pages, objectives & target communities, activities, outcomes, photos, related stories.
- **Program detail:** hero, overview, problem addressed, objectives, implementation approach, target beneficiaries, impact & outcomes, related projects, support/donate CTA.
- **Blog / news:** featured article, category navigation, article grid, date, author, article detail page (readability first), related articles, share functionality.
- **Donate:** what donations support, preset amounts, custom amount, one-time/recurring (where supported), secure payment flow, transparent info, confirmation and success states. **Never imply a payment integration exists unless it is actually implemented** — label placeholders clearly.
- **Contact:** contact info, form, office address, email & phone, social links, map where useful. Forms need validation, error, loading and success states.
- **FAQ:** clean accordion, clear questions, readable answers, consistent dividers.

## 7. Shared components (build once, reuse everywhere)

Header · Footer · Button · Breadcrumbs · PageHero · SectionHeading · ProgramCard · BlogCard · TestimonialCard · ImpactStat · TeamProfile · ImageTextSection · CTASection · FAQAccordion · Form fields · NewsletterSection

- Variants are allowed; typography, spacing, colour, borders and behaviour stay consistent.
- Never create slightly different versions of the same component on different pages.

## 8. Photography and media

- Use: authentic community photos, children & families where relevant, real program activities, volunteers & staff, education/healthcare settings, community development. Natural, warm, documentary feel.
- Avoid: generic corporate stock, unrelated business imagery, artificial-looking photos, inconsistent treatments, random proportions.
- Consistent aspect ratios per component type.
- Use `next/image` with responsive sizes; meaningful alt text.
- Respect beneficiary dignity, privacy and consent — especially children.

## 9. Responsive design

Design for large desktop, desktop, tablet and mobile. Don't just compress desktop.

On mobile: stack columns sensibly, reduce heading sizes, keep body text readable, touch-friendly controls (≥44px targets), no horizontal overflow, reposition hero content intelligently, easy forms, accessible nav, adequate section spacing.

Check every page individually at mobile, tablet and desktop widths.

## 10. Interaction and animation

- Restrained: subtle hovers, smooth button transitions, gentle image reveals, lightweight scroll-triggered transitions, accordions, subtle nav transitions, clear form feedback.
- Never interfere with reading, accessibility or performance.
- Respect `prefers-reduced-motion`.
- No excessive parallax or distracting motion.

## 11. Accessibility (WCAG 2.2 AA)

Sufficient contrast · semantic HTML · keyboard navigation · visible focus states · labelled, accessible forms · descriptive link text (no bare "click here") · correct heading hierarchy (one `h1` per page) · screen-reader-friendly interactive elements · accessible nav and accordions · never convey meaning by colour alone.

## 12. Performance and SEO

- Fast loads, optimised images, minimal client JS (prefer Server Components; `"use client"` only where needed), sensible caching.
- Unique title + description per page (Next.js Metadata API), canonical URLs, Open Graph metadata.
- `app/sitemap.ts`, `app/robots.ts`.
- Structured data (e.g. `NGO` / `Organization`, `Article`) where appropriate.
- Never trade performance for visual effects.

## 13. Content integrity — NEVER INVENT

Do not fabricate: achievements, beneficiary statistics, testimonials, leadership profiles, partnerships, contact information, financial or donation claims.

- Use existing verified organisational content.
- Where content is missing, use **clearly identifiable placeholders** (e.g. `[PLACEHOLDER: verified number of children educated]`) for the organisation to complete.
- Tone: concise, human, compassionate, professional. No repetitive marketing language or exaggerated claims.

## 14. Quality-control checklist (every page, before calling it done)

1. Follows the global colour system?
2. Correct typography?
3. Consistent section widths and spacing?
4. Built from reusable components?
5. Clear visual hierarchy?
6. Relevant, consistently presented images?
7. Works properly on mobile?
8. Buttons and interactive elements functional?
9. Accessible?
10. Feels like part of the same NGO website?

Rendering correctly is not enough — a page must meet both functional and visual quality standards.

---

## Final standard

Premium and internationally credible. Memorable without noise. Emotionally engaging without manipulation. Minimalist without looking unfinished. Consistent without every page looking identical.

**The design system is the source of truth.**
