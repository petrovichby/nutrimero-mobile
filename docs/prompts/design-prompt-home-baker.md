# Design prompt — Nutrimero Home Baker (v1 screens)

Self-contained brief for a Claude design session (claude.ai, Figma Make, or an
`impeccable`-skill session). Paste everything between the rules below. Source of truth if
conflicts arise: `docs/DESIGN.md` and `.specify/memory/constitution.md` in this repo.

---

Design the mobile UI for **Nutrimero Home Baker**, an iOS/Android app (React Native) for home
baking enthusiasts. It is the paid companion to nutrimero.org, a freeware food-knowledge
platform backed by a professional food-ingredient database (~6,000 ingredients, verified
nutrition and allergen data) and curated by a professional bakery consultant.

## Product in one paragraph

Home bakers get professional-grade baking recipes with exact per-slice nutrition and allergen
data, a pantry-based recipe builder ("what can I bake with what I have?"), smart shopping
lists with local price estimates, baking calculators and timers. Free tier + two
subscriptions (Plus: exclusive recipe drops, offline, advanced calculators; Premium: retail
prices, online cart handoff, AI recipe generation).

## Personality

Warm, domestic, focused — a well-organized kitchen shelf, **not** an instrument panel and
**not** a lifestyle magazine. Honest and precise: this is the baking app made by people who
equip real bakeries. Illustration-forward, generous whitespace, quietly confident. No
decorative clutter, no stock-photo food porn, no dark patterns.

## Visual system (fixed — do not reinterpret)

- **Palette:** Deep Navy `#1b1f58` (structure, text accents), Acid Lime `#b9bf05` (primary
  actions, brand accent), Oxblood `#2f0100` (allergen/warning accents), warm slate neutrals,
  cream `#f7f4ec` (illustration canvas). Light + dark schemes required.
- **Critical color rules:** lime NEVER carries white text — text on lime is near-black olive
  `#1d1e01`. Lime never carries meaning alone — always paired with text or a glyph. All text
  ≥ 4.5:1 contrast, boundaries ≥ 3:1.
- **Type:** Plus Jakarta Sans only. Scale: headlines 28/22/18 semi-bold–bold, body 17/15/13,
  labels 12/11. Weights, prices, gram amounts always in tabular figures, medium weight —
  numbers users compare must align.
- **Shape:** soft-technical — small radii (4–8pt; 12pt max on cards). Not bubbly.
- **Spacing:** 4pt rhythm, 16pt screen margins, minimum 44pt touch targets, primary actions
  in the bottom half of the screen (thumb-first).
- **Depth:** tonal surface tints over shadows; shadows only on sheets/menus.
- **Imagery:** recipe images are warm editorial flat illustrations on the cream canvas
  (4:3, centered subject, subtle grain, terracotta/honey tones with navy line accents and a
  single lime detail) — never photorealistic. Use illustration-style placeholders.

## Navigation

Bottom tab bar, labels always visible: **Recipes · Builder · Shopping · Pantry · More**.

## Screens to design (priority order)

1. **Recipes (home tab):** this-month's exclusive drop featured on top (with a tasteful
   "Plus" chip), category row (breads, cakes, cookies, laminated, tarts, seasonal…), recipe
   card grid/list. Every recipe card = illustration + title + time/difficulty + allergen
   glyphs + **provenance badge** ("Illustration (AI)" or "Photo — baked by Markus") — the
   badge is mandatory, it's a brand-defining honesty feature, design it to feel like
   credibility, not a disclaimer.
2. **Recipe detail:** illustration header, title + meta, serving/tin-size scaler (stepper,
   44pt targets, live-recalculating gram amounts in tabular figures), ingredient list with
   "in your pantry ✓ / missing" states, collapsible per-100g nutrition + allergen section
   (allergen chips: oxblood + glyph + name, never color alone), then step-by-step **baking
   mode**: one step per screen, huge readable quantities, inline named timers that persist
   as a chip across the app.
3. **Builder (the wow feature):** user's pantry summary on top → ranked recipe results with
   "match" indicator (e.g. "9 of 11 ingredients — missing: butter, vanilla") and substitution
   hints; a clearly-marked premium "Generate a new recipe with AI" entry point with its
   "AI-generated — always labeled" promise visible. Show the empty state too (empty pantry =
   friendly onboarding moment, illustrated, one action).
4. **Pantry:** fast add (search + category browse + staples quick-picks), owned items grouped
   by category, swipe to remove. Design for the 30-second weekly update, not inventory
   management.
5. **Shopping list:** items grouped by recipe or aisle, estimated basket total per store
   chain (e.g. Lidl €6.40 · Rimi €7.10 — clearly labeled "estimated"), "Shop this list
   online" handoff button (Premium), check-off interaction.
6. **Paywall:** three options — Plus €14.99/yr, Premium €34.99/yr, and a Founders' Lifetime
   €120 card with live counter ("23 of 100 left") and numbered-badge preview. Plain-language
   renewal terms, restore purchases, and a decline path of equal visual weight. Honest,
   warm, zero pressure tactics.
7. **Onboarding (3–4 screens):** units (metric/imperial), dietary & allergen profile (with a
   visible "stays on your device" privacy note), pantry seeding ("check what's on your
   baking shelf" — staples checklist).

## Deliverables

Phone-first at 390×744 safe area; light scheme for all screens, dark scheme for screens 1–2.
High-fidelity mockups. Show real-feeling content (real recipe names, gram amounts, EU prices
in €) — no lorem ipsum, no "Recipe Name" placeholders. Locales are en/de/lt — design screen 1
once with German strings to prove the layout survives long words (e.g.
"Schokoladen-Sauerteigbrot").

## Hard constraints (non-negotiable)

- Provenance badge on every recipe image.
- Allergen info always glyph + text, never color alone.
- 44pt minimum touch targets; labels on all tab items.
- Locked/premium content shows a real preview with a clear chip — never blurred teases.
- No photorealistic food imagery anywhere.
- Accessible contrast per the color rules above, both schemes.

---

## Notes for the operator (not part of the paste)

- If running in this repo with the `impeccable` skill: invoke the skill first, give it this
  brief, and point it at `docs/DESIGN.md` + `nutrimero-design/` for deeper token authority.
- Screen 1 + 2 are the style-setting pair — iterate those to approval before letting the
  rest be generated, then demand consistency with the approved pair.
- Compare results against the ~62 normalized web screens in `nutrimero-design` for family
  resemblance (same brand, different temperament — mobile is the warm one).
