# Research: Measures table & ingredient-aware conversion (004)

Every item resolves a question the plan's Technical Context raised. Data facts are from the FID
seeds at nutrimero-api `4a4356b` (= `contract/SOURCE`), surveyed 2026-09-24.

## R1 — Where the feature lives

- **Decision**: a new feature package, `packages/features/measures` (logic, the generated
  snapshot, the curated manifest, screens). Pure unit arithmetic — standards, fraction rounding,
  formatting — extends `packages/core/src/units` (Constitution IX: units go through shared
  formatters). The app adds thin routes only.
- **Rationale**: III. F30 (scaling), F04 (shopping list), F24 (PDF) and Pro's F17 all need
  ingredient-aware conversion; a package is the seam they consume. `packages/features/*` is the
  existing shape, not a new top-level package (XI).
- **Alternatives**: extending `feature-diet-profile` (rejected — different concern; the staples
  snapshot is a diet-profile fact, densities are not); putting densities in `core` (rejected —
  core stays FID-agnostic and Node-loadable without a 200-ingredient data file).

## R2 — Extending the snapshot pipeline

- **Decision**: `scripts/fid-snapshot.mts` stays the single entry, with its guards unchanged
  (LOCAL api only, `--api-commit` must equal `contract/SOURCE`'s commit, formatter as the last
  step). It gains a second output,
  `packages/features/measures/src/measures-snapshot.generated.ts`, written in the same run as the
  staples file, so both carry the same api commit. The guards move into a small shared module
  the two writers call.
- **What it reads, per curated ingredient**: `GET /fid/ingredients/{fidId}` → `names`,
  `physicalForms`, `preparationStates`, `reserved.volumeToMass`, `reserved.pieceWeight` (every
  row, with `source`, `method`, `confidence`, `referenceVolumeMl`, `referenceMassG`,
  `massGMean/Min/Max`); and once per FID language: `GET /fid/physical-forms`,
  `/fid/preparation-states`, `/fid/piece-size-classes` with `language` → localized vocabulary
  names; `GET /fid/languages`.
- **What it writes**: FID's rows verbatim (decimals kept as the api's strings), names per UI
  locale (the `FID_LANGUAGE` map from 001; `be` → none yet), vocabulary names, and precomputed
  search keys (R9). **No selection happens in the script** — the snapshot is a faithful copy of
  FID; admissibility and choice are app logic (R3), so they are testable and visible.
- **Every listed id must resolve**, or the script fails (FR-017). A hand edit of the generated
  file is a suppression-class violation (XII), as for the staples file.
- **Alternatives**: a second script (rejected — two runs could be taken at different commits);
  selecting densities in the script (rejected — the rule would hide in a build step instead of
  living in tested code next to the manifest).

## R3 — Admissibility and the choice of one density (gate-1 Q1, Q2)

- **Decision**: a pure function `resolveVolume(ingredient, formId, stateId, manifest)` returns
  one of:
  - `{ kind: "value", gramsPerMl, row, confirmations }` — the chosen row, and for a proven
    AI-derived row the published sources that confirm it;
  - `{ kind: "inconsistent", rows }` — admissible rows disagree by more than 5 % and no ruled
    pick exists (FR-005a): **no volume conversion**;
  - `{ kind: "none" }` — no admissible row (FR-007).
- **Steps**:
  1. **Density per row** = `referenceMassG / referenceVolumeMl` (a 5 ml spoon row and a 100 ml row
     both become g/ml; the spoon rows are therefore density evidence like any other).
  2. **Classify each row's source** against a closed list (R4). AI-derived: sources starting
     "OpenAI" or containing "AI-assisted". A row whose source is on neither list fails the build —
     a new source can never slip in unclassified.
  3. **Admissible** = not AI-derived, or AI-derived with a *confirmed* verdict in
     `density-evidence.md` (FR-004a).
  4. **A ruled pick** in the manifest (FR-005a) wins outright; it must name one of the
     ingredient's own FID rows (test).
  5. **Band**: if `max / min ≤ 1.05` over the admissible densities → the fixed rule; else
     `inconsistent`.
  6. **Fixed rule**: highest confidence (`HIGH` > `MEDIUM` > `LOW`), then method (`MEASURED` >
     `LITERATURE` > `CALCULATED` > `ESTIMATE`), then **source order** (gate-2 item 3), then FID
     row id (a total order, so the result is deterministic).
- **Piece weights**: every row is from one source (Markus's 2026-09-03 table, `ESTIMATE`/
  `MEDIUM`, not AI-labelled) and there is one row per size class, so no choice arises; they are
  admissible and shown with their confidence.
- **The inconsistency report**: `pnpm measures:report` (a script over the generated snapshot and
  the manifest) prints every inconsistent ingredient with each row's source and value — the list
  brought to the owner. Wheat flour (52.8 / 58 / 65) and sugar (84.5 / 85 / 95) are already known
  to be on it.

## R4 — Multi-source proof and `density-evidence.md` (gate-1 Q1)

- **Decision**: `specs/004-measures-conversion/density-evidence.md` is the authority, one
  Markdown table in a fixed column shape that a test parses:

  | FID id | Ingredient | Form · state | FID row | FID g/ml | Source 1 (URL · locus · value) | Source 2 (…) | Source n | Verdict |

  Verdicts: `confirmed` (≥ 2 independent published sources within 5 % of the FID value),
  `unconfirmed` (fewer than two found), `disputed` (a source outside 5 %). A test asserts that
  every AI-derived row in the curated set has exactly one evidence line, that `confirmed` lines
  carry ≥ 2 sources each within 5 %, and that the app admits exactly the confirmed rows.
- **Independence**: two sources are independent when neither republishes the other. USDA-derived
  compilations (FID's own "USDA FDC via iForge") count as USDA once; a national food-composition
  table (Fineli, Health Canada CNF, FAO/INFOODS, McCance & Widdowson, Frida/DTU, BLS) counts once
  each. FID's own *non-AI* rows for the same ingredient are published sources and may confirm an
  AI row (recorded with their FID row id as the locus).
- **Where sources are looked for**, in order: FID's non-AI rows for the same ingredient; the
  national food-composition tables above (household-measure weights); USDA FoodData Central
  (SR Legacy "portion" weights); established baking references with published weight tables
  (e.g. King Arthur's ingredient weight chart) — each with URL and locus.
- **When**: after the owner confirms the curated set (R5) — the evidence covers the AI-derived rows
  of that set only (gate-1 scope). The work is research by the lane (web), reviewed by the owner
  in the evidence PR.
- **Alternatives**: a TypeScript manifest with a generated Markdown view (rejected — the owner
  asked for the Markdown file as the committed evidence; one authority, parsed by the test).

## R5 — Proposing the curated set (~150–200)

- **Decision**: the lane drafts the list from the local api at `4a4356b`: every ingredient in the
  bakery food types (flours and meals, grains and flakes, starches, sugars and syrups, fats and
  oils, dairy, eggs, leaveners and yeasts, cocoa and chocolate, nuts, seeds, dried fruit, fresh
  baking fruit, spices and extracts, gelling agents) that has at least one volume or piece row;
  then trims by what a home baker measures by cup, spoon or piece. The 13 staples are in it. The
  draft goes to the owner as a table (id, English name, forms/states, rows, AI-only?,
  inconsistent?) in the snapshot PR; the owner confirms (FR-018), as the staples were confirmed.
- **Why the flags matter**: the draft shows, before confirmation, which candidates would show no
  volume conversion (AI-only and unproven, or inconsistent), so the owner confirms knowing the
  cost.

## R6 — Measuring standards

- **Decision** (gate-1 Q3), exact definitions in `packages/core/src/units/standards.ts`:

  | Standard | cup | tbsp | tsp | fl oz |
  |---|---|---|---|---|
  | US customary | 236.5882365 ml (8 US fl oz) | 14.78676478 ml (½ fl oz) | 4.928921594 ml (⅓ tbsp) | 29.5735295625 ml |
  | metric | 250 ml | 15 ml | 5 ml | — |
  | UK | 284.130625 ml (½ imperial pint) | 15 ml | 5 ml | 28.4130625 ml |
  | Australian | 250 ml | 20 ml | 5 ml | — |

  Displayed values round these (236.6 ml, 14.8 ml, 4.9 ml); arithmetic uses the exact ones.
- **Default display** (FR-009): US and metric side by side. **Setting**: US + metric (default),
  UK, Australian — one choice, persisted.
- **FID's 240 ml cup** is not used; its unit table stays FID's (nutrition-label cup). The
  discrepancy goes to the api lane via the coordinator (gate-1 Q3).

## R7 — Fractions, rounding, and plurals

- **Decision**: `formatMeasure` in core:
  - cups snap to the nearest of {⅛, ¼, ⅓, ⅜, ½, ⅝, ⅔, ¾, ⅞} (thirds included — US recipes use
    them); spoons to {¼, ½, ¾}; the exact decimal is always available beside it;
  - grams: 1 g below 100 g, 5 g from 100 g; millilitres: 1 ml; oven °C/°F: 5 degrees;
  - the locale's number format for every decimal (`Intl.NumberFormat`, polyfilled on Hermes);
  - **no plural form ever takes a fractional amount** (ruling 2026-09-24): measure labels use
    their unit symbol ("1 ⅛ US cup", "¾ tsp"); `count` plurals appear only for whole pieces
    ("3 eggs").
- **Glyphs**: every fraction glyph (⅛–⅞, ⅓, ⅔), ⁄ and ° is present in Plus Jakarta Sans and Onest
  at every weight (checked with `scripts/font-cmap.ts`); the font-coverage test gains them.
- **Round trip** (SC-004): the test converts every ingredient × unit pair A → B → A and asserts
  the result equals the input within the displayed rounding of A.

## R8 — Spoken amounts (FR-021)

- **Decision**: screen readers get a **label–value** form: "US cup: 1.125", "Weizenmehl, US
  cup: 137 grams" — the number in the locale's decimal format, never the fraction glyph, and never
  a plural agreeing with a decimal (lt, pl, uk and be decline differently after decimals; the
  polyfill diverges there, which is why the whole-number rule exists).
- **Gate-2 item 4**: this interprets FR-021's example ("one and one eighth US cups") as "spoken,
  not the glyph"; spelling fractions in words in seven languages would need a fraction lexicon
  per locale.

## R9 — On-device search

- **Decision**: the snapshot ships, per ingredient, a precomputed list of **folded search keys**
  (lower-case, NFD with combining marks removed, plus a small map for letters that do not
  decompose: ł→l, ø→o, đ→d, ß→ss, æ→ae; Cyrillic ё→е, й kept) built in Node at generation time.
  At run time only the query is folded, with the same function (in `core`, shared by script and
  app). Matching: word-prefix beats substring; a name in the UI language beats another language;
  then alphabetical. Two characters minimum (as the api's `q`).
- **Hermes check**: `String.prototype.normalize` is used for the query; it is verified on device
  in phase 4 (both platforms). If absent, the fold falls back to the explicit map extended to the
  diacritics of the seven UI locales' keyboards.
- **Privacy**: search runs in memory; the term is neither stored nor sent (FR-012).

## R10 — The standard setting

- **Decision**: a Home key, `nutrimero.home.measureStandard` (`"usMetric" | "uk" | "au"`), in
  `HOME_KEYS`, so Home's wiper and Clear my data reset it (spec assumption); the byte-budget test
  covers it. The Clear my data sheet's list does not change (it names what matters; the setting
  is a display preference — owner may rule otherwise at gate 2).

## R11 — Screens and navigation

- **Decision**: no screen is built before design-mobile's F23 concept is approved and ported
  (DESIGN.md); screens go through `impeccable`. The router side is ready either way: pushed routes
  `app/measures/index.tsx` (table + search) and `app/measures/[fidId].tsx` (ingredient +
  converter) on the root Stack; the entry point (a More row, a tab, or both) follows the concept.
- **Converter state** is screen-local (amount, from, to, form/state); nothing but the standard
  setting persists.

## R12 — The onboarding card (FR-023)

- **Decision**: `units-step.tsx`'s `FLOUR_CUP_G = 120` becomes the measures package's resolved
  wheat-flour value in a US cup once flour's pick is ruled; until then it stays, with a comment
  naming FR-023. The butter stick (113 g) is ½ US cup of butter **by definition of the stick**
  (4 oz = 113.4 g), not a density, and stays. design-mobile is told when the flour number changes.

## R13 — Contract and api asks

- `reserved.volumeToMass` / `reserved.pieceWeight`: the api's spec 002 described `reserved` as
  empty and forward-looking; the snapshot will depend on its shape → **api confirms it stable**
  (or renames) before implementation starts (gate-2 item 2).
- FID's unit table defines the cup as 240 ml → **to the api lane** (gate-1 Q3).
- Later, not 004: a guest-read policy for `/fid/ingredients?q=` (full search).

## R14 — Size and performance

- **Estimate**: ~200 ingredients × (≈10–20 names + ≈3 volume rows + ≈5 piece rows + search keys)
  ≈ 150–250 KB of generated source before minification — acceptable in the JS bundle. Measured
  in phase 2; above 500 KB the plan revisits (a JSON asset loaded at first use).
- Search over ~200 × ~20 keys is trivially fast in memory; no index structure needed.

## R15 — Testing

- **Vitest (node)**: admissibility and `resolveVolume` matrix (none / value / inconsistent /
  pick), the closed source list, evidence-file parsing and its coverage of the set's AI-derived
  rows, manifest picks name real FID rows, standards arithmetic, `formatMeasure` (glyph snapping,
  locale formats, no plural on fractions), round trips over the whole set (SC-004), search top-3
  for every name of every ingredient (SC-005), every cup/spoon string carries its standard
  (SC-002), and a static no-network test for the measures package (FR-019).
- **Device**: quickstart walkthrough, VoiceOver/TalkBack, Hermes `normalize` check, both
  platforms (Android still owed from 001).
- No component-test harness (as 001, R11 there).

## R16 — Dependencies

- **Decision**: none new. Conversion is arithmetic; the snapshot is data; search is string code.
  If the concept adds something (e.g. a haptic on flip), it is an ADR 0001 row first (XI).
