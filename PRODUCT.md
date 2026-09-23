# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Note: React Native + Expo, shipping natively to iOS and Android with **one shared design
language** (per `docs/DESIGN.md`) — not per-OS reskinning. Phone-first for Home Baker,
tablet-first for Pro Baker.

## Stack

Decided (ideation doc §6): React Native + Expo, TypeScript, generated OpenAPI client shared
with `nutrimero-web`. Design comps/mockups are produced as static HTML artifacts under
`nutrimero-design:mobile/home-baker/` (the approved corpus) before RN implementation.

## Users

- **Home Baker (B2C):** home baking enthusiasts in DACH first, Lithuania as pilot market,
  then PL/CEE. Baking at home — often mid-bake with floury hands, phone on the counter.
  Job: bake professional-grade recipes with confidence; know exact nutrition/allergens per
  slice; figure out what to bake with what's already in the pantry; shop for what's missing.
- **Pro Baker (B2B):** small professional bakeries (owner-baker + small team), bakery-floor
  use, tablet-first, offline-first. Not the subject of this design pass.

## Product Purpose

Paid mobile companions to nutrimero.org (freeware food-knowledge platform, ~6,000-ingredient
professional food database, curated by professional bakery consultant Markus). Home Baker
sells capabilities and convenience — exclusive recipe drops, pantry-based recipe builder,
shopping lists with EU retail price estimates and online cart handoff, baking calculators,
timers, offline access — never withheld data. Success: activation (first recipe baked /
pantry filled), D30 retention, free→Plus conversion.

## Positioning

"The baking app made by the people who equip real bakeries." FID data depth (verified
nutrition + allergen declarations per recipe, exact per-slice) and Markus's professional
curation are the claims recipe-blog apps cannot copy. Honesty is a product feature:
AI imagery is illustration-style only and always labeled; real photos are the earned
premium signal.

## Operating Context

- Kitchen use: flour-covered hands, one-handed, phone propped on the counter, possibly no
  signal in the pantry. Baking mode = one step per screen, huge quantities, named timers.
- Weekly 30-second pantry update, not inventory management.
- Shopping happens per chain (Lidl, Rewe, Edeka; LT pilot: Maxima/Barbora, Rimi, Iki) with
  estimated basket totals; cart handoff is deep-link based (T1/T2).
- UI languages en, de, hu, lt, be, pl, uk (Constitution IX 1.1.0). Every screen is tested at 1.3×
  text against five stress witnesses: de, hu, pl, be, uk (DESIGN.md 0.5.0). Label languages are a
  separate list: the five EU ones (en, de, hu, lt, pl), proven by the api.

## Capabilities and Constraints

- Tiers (decided): Free · Plus €14.99/yr (€1.99/mo) — content & convenience: exclusive drops
  ~10/mo, full offline, advanced calculators, unlimited deterministic builder · Premium
  €34.99/yr (€4.49/mo) — everything live & transactional: retail prices, cart handoff, LLM
  recipe generation (50/mo fair-use), price alerts · Founders' Lifetime €120 × 100 units,
  numbered badges, live counter, server-side cap. Upgrade pitch: "Plus gives you the
  recipes; Premium does your shopping."
- Recipe builder is hybrid: deterministic pantry matching (free) + metered LLM generation
  (Premium, always labeled "AI-generated").
- Allergen/nutrition statements come only from FID data joins, never LLM output
  (constitution IV; liability item §11.1).
- Dietary/allergen profile is device-local (GDPR Art. 9 decision: design (b)) unless a spec
  introduces consented sync.
- API types generated from `contract/openapi.json`; entitlements decided server-side; no
  secrets in the bundle.
- No user-facing hardcoded strings (catalogs for all seven UI languages).
- Undecided: final app names (trademark checks pending), icon family execution. The api's
  recipes (013) are company-scoped; a published catalog the Home Baker app can read is not yet
  in the contract (the api catalog series, consumed by 003-recipes-home).

## Brand Commitments

- Colours: the ecosystem brand (logo, app icons, web) is Acid Lime `#b9bf05` + Deep Navy
  `#1b1f58`, and Pro Baker's UI keeps that world. **Home Baker's UI runs the warm "Crust &
  Butter" palette** — rust `#7a3520` structure, butter gold `#dfa621` action — a recorded
  deviation (D-1). Allergen flags use the inherited oxblood tertiary family in both apps; cream
  `#f7f4ec` is the illustration canvas. The action colour never carries white text and never
  carries meaning alone. Binding values: `docs/DESIGN.md` (0.5.0).
- Type: Plus Jakarta Sans for UI text in Latin-script locales, Onest in Cyrillic ones (be, uk);
  Pacifico for brand moments only; the provenance stamp in Stardos Stencil (Latin) / Yeseva One
  (Cyrillic). The brand is written `nutrimero`, lowercase, in every string. Numbers users compare
  are tabular figures, medium weight.
- Home Baker temperament: warm, domestic, focused — "a well-organized kitchen shelf, not an
  instrument panel and not a lifestyle magazine." Illustration-forward, generous whitespace,
  soft-technical shape (4–8pt radii, 12pt max).
- Imagery policy (decided, ideation §3.3): AI imagery is illustration-style only — monochrome
  ink engraving on the cream canvas, generated at 4:3 (DESIGN.md *Imagery*; the earlier warm flat
  style is superseded) — never photorealistic, always labeled with a visible provenance badge
  ("Illustration (AI)" / "Photo — baked by Markus" / "Community photo"). The badge is a
  brand-defining credibility feature, not a disclaimer.
- No dark patterns: locked content shows real previews (never blurred teases), paywalls have
  a decline path of equal visual weight, plain-language renewal terms, Kündigungsbutton
  spirit in-app.
- Icon family concept: inverted pair — Home Baker lime field / navy loaf mark; Pro Baker
  navy field / lime mark.

## Evidence on Hand

- Recipe illustration reference set: `nutrimero-design:mobile/_explorations/illustration/variant2/`
  (monochrome ink engraving, canonical per DESIGN.md). The earlier flat-illustration seed
  (`…/illustration/chatgpt-illustration.png`, `docs/prompts/asset-prompts.md` §3) is superseded.
- App icon drafts: `nutrimero-design:mobile/_explorations/icon/chatgpt-icon-home.png`, `chatgpt-icon-pro.png`.
- Competitor design comps for comparison: `nutrimero-design:mobile/_explorations/claude-design/`,
  `nutrimero-design:mobile/_explorations/stitch/`.
- ~62 normalized web screens in `nutrimero-design` (family-resemblance reference; desktop
  oriented — layouts are not reusable, tokens are).
- Real content facts usable in mockups: tier prices above, chain names, launch categories
  (breads, rolls, cakes, cookies, laminated, tarts, quick breads, desserts, seasonal),
  ~10 recipe drops/month cadence. No real recipe corpus yet — recipe names/gram amounts in
  comps are authored demonstration content, plausible and bake-realistic.

## Product Principles

1. Honesty as brand: provenance always visible, prices labeled "estimated", AI always
   labeled — over-comply (EU AI Act Art. 50) rather than fine-print.
2. Paid = capabilities and convenience, never data lock-up; the freeware promise stays
   intact.
3. Design for the kitchen scene: thumb-first, big targets, works offline, survives flour.
4. Data depth over content volume: 250 verified Nutrimero recipes outweigh 5,000 blog
   recipes; the UI must make that depth visible (per-slice nutrition, allergen chips,
   baker's percentages).
5. Accessibility is a gate, not polish (European Accessibility Act; WCAG AA contrast;
   44pt targets).

## Accessibility & Inclusion

European Accessibility Act is the legal floor. WCAG AA contrast (4.5:1 text, 3:1
boundaries) in both schemes; 44pt touch targets; labels on every interactive element;
color never carries meaning alone (allergens especially); Dynamic Type supported to 1.3×.
Target: "genuinely usable one-handed, in a hot kitchen, by someone wearing glasses dusted
with flour."
