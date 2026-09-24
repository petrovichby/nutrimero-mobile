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

## R3 — The chosen density comes from the api (gate-1 Q1, Q2 as corrected)

- **Decision**: the app applies **no** admissibility or choice rule. The api defines the density
  choice (the 5 % band, the fixed rule, resolved picks, the multi-source admission of AI-derived
  rows) once for every reader, in its upcoming `change/002`; the snapshot copies the api's
  **chosen density** per ingredient, form and state with the sources it records, and copies FID's
  raw rows too, for the provenance view. Where the api has no chosen density, the app shows no
  volume conversion (FR-005).
- **What the lane still computes — offline, for the evidence, never in the app**: a survey script
  over the local api (or the seed files) that lists, for the curated set, every AI-derived row
  and every group of admissible rows more than 5 % apart. That list is the input to
  `density-evidence.md` (R4) and to the api's overlays. Wheat flour (52.8 / 58 / 65) and sugar
  (84.5 / 85 / 95) are already on it.
- **Superseded** (first plan, before the correction): an app-side `resolveVolume`, a
  `RULED_PICKS` manifest and a `SOURCE_ORDER` — withdrawn; the api is the single definition.

## R4 — Multi-source proof and `density-evidence.md` (gate-1 Q1)

- **Decision**: `specs/004-measures-conversion/density-evidence.md` is the authority, one
  Markdown table in a fixed column shape that a test parses:

  | FID id | Ingredient | Form · state | FID row | FID g/ml | Source 1 (URL · locus · value) | Source 2 (…) | Source n | Verdict |

  Verdicts: `confirmed` (≥ 2 independent published sources within 5 % of the FID value),
  `unconfirmed` (fewer than two found), `disputed` (a source outside 5 %). A test asserts that
  every AI-derived row in the curated set has exactly one evidence line and that `confirmed` lines
  carry ≥ 2 sources each within 5 %. The file **feeds the api's overlays**; the app admits
  nothing itself — it shows the api's choice.
- **Independence**: two sources are independent when neither republishes the other. USDA-derived
  compilations (FID's own "USDA FDC via iForge") count as USDA once; a national food-composition
  table (Fineli, Health Canada CNF, FAO/INFOODS, McCance & Widdowson, Frida/DTU, BLS) counts once
  each. FID's own *non-AI* rows for the same ingredient are published sources and may confirm an
  AI row (recorded with their FID row id as the locus).
- **Where sources are looked for**, in order: FID's non-AI rows for the same ingredient; the
  national food-composition tables above (household-measure weights); USDA FoodData Central
  (SR Legacy "portion" weights); established baking references with published weight tables
  (e.g. King Arthur's ingredient weight chart) — each with URL and locus.
- **When**: now, in parallel with the api's change (the coordinator's sequencing) — over the
  **draft** set (R5), so the evidence is ready when the owner confirms the set. Inconsistencies
  are listed with every row's source and value (FR-005a), flour first.
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

## R6 — Units come from the api (corrected Q3)

- **Decision**: the app holds **no unit constants**. The api defines the units (`change/002`):
  the standard cup 250 ml (Markus M1), the US cup 236.59 ml for American recipes, tsp 5 ml and
  tbsp 15 ml (Markus M34), and the rest of FID's unit set. The snapshot copies those definitions;
  core's conversion functions take a factor from the snapshot instead of a constant.
- **Existing constant**: `packages/core/src/units/convert.ts` holds `GRAMS_PER_OUNCE =
  28.349523125` (001). It moves onto the api's ounce definition in 004 — the api's current FID
  unit table says 28.35, so the two differ in the fourth decimal; `change/002` decides which is the
  platform's ounce, and 001's units card follows it.
- **Temperature** (°C ↔ °F) is a formula, not a unit definition; it stays in core.
- **No setting**: both cups are always shown, labelled (FR-009). UK and Australian measures are
  not in the platform's definitions today (an AU tablespoon of 20 ml would contradict M34's
  15 ml); they enter only if the api defines them.
- **Superseded**: the first plan's `MEASURING_STANDARDS` table (US customary 14.79 / 4.93 ml
  spoons, UK, AU) — withdrawn.

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

## R10 — No device setting

- **Decision**: 004 stores nothing (FR-022). The first plan's `nutrimero.home.measureStandard` key
  is withdrawn with the setting (R6).

## R11 — Screens and navigation

- **Decision**: no screen is built before design-mobile's F23 concept is approved and ported
  (DESIGN.md); screens go through `impeccable`. The router side is ready either way: pushed routes
  `app/measures/index.tsx` (table + search) and `app/measures/[fidId].tsx` (ingredient +
  converter) on the root Stack; the entry point (a More row, a tab, or both) follows the concept.
- **Converter state** is screen-local (amount, from, to, form/state); nothing persists.

## R12 — The onboarding card (FR-023)

- **Decision**: `units-step.tsx`'s `FLOUR_CUP_G = 120` becomes the api's chosen wheat-flour
  density in a US cup once the api has settled flour; until then it stays, with a comment naming
  FR-023. The butter **stick** (113 g) is a unit (4 US oz): it stays only if the api's unit
  definitions include it — asked of the api lane; otherwise the row is re-expressed with
  design-mobile. design-mobile is told when either number changes.

## R13 — Contract and api asks

- **`change/002`** (units + chosen density): 004's snapshot and build wait for its merge and the
  contract sync that follows; the snapshot script then reads its fields.
- **Open, to the api lane**: whether the butter *stick* is a platform unit (R12); and whether
  Markus's 2026-09-03 piece-weight table was part of the delivery M34 disclosed as AI-generated —
  if so, every piece weight is AI-derived and falls under Q1's multi-source rule, although its
  source string does not say so.

- `reserved.volumeToMass` / `reserved.pieceWeight`: **confirmed stable by the api lane
  (2026-09-24)** — schema unchanged since 2026-09-04. The snapshot keeps FID's full-precision
  decimal strings and parses them only at use; an absent row means "not known", never 0; `losses`
  and `dryMatterPercent` are not read.
- FID's unit table defines the cup as 240 ml → **to the api lane** (gate-1 Q3).
- Later, not 004: a guest-read policy for `/fid/ingredients?q=` (full search).

## R14 — Size and performance

- **Estimate**: ~200 ingredients × (≈10–20 names + ≈3 volume rows + ≈5 piece rows + search keys)
  ≈ 150–250 KB of generated source before minification — acceptable in the JS bundle. Measured
  in phase 2; above 500 KB the plan revisits (a JSON asset loaded at first use).
- Search over ~200 × ~20 keys is trivially fast in memory; no index structure needed.

## R15 — Testing

- **Vitest (node)**: the snapshot's chosen densities and unit definitions equal the api's at the
  recorded commit (generated, never edited), evidence-file parsing and its coverage of the set's
  AI-derived rows, conversion with snapshot factors (no constants — a test fails on a numeric unit
  literal in the units module), `formatMeasure` (glyph snapping,
  locale formats, no plural on fractions), round trips over the whole set (SC-004), search top-3
  for every name of every ingredient (SC-005), every cup/spoon string carries its standard
  (SC-002), and a static no-network test for the measures package (FR-019).
- **Device**: quickstart walkthrough, VoiceOver/TalkBack, Hermes `normalize` check, both
  platforms (Android still owed from 001).
- No component-test harness (as 001, R11 there).

## R16 — Dependencies

- **Decision**: none new. Conversion is arithmetic; the snapshot is data; search is string code.
  If the concept adds something (e.g. a haptic on flip), it is an ADR 0001 row first (XI).
