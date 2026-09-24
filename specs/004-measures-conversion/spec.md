# Feature Specification: Measures table & ingredient-aware conversion

**Feature Branch**: `spec/004-measures-conversion` (spec directory `specs/004-measures-conversion/`)

**Created**: 2026-09-24

**Status**: Gate 1 PASSED 2026-09-24 (owner and coordinator), **corrected the same day** — mobile follows the
platform's agreements (see *Correction* below). The build waits for the api's units/density change.

**Input**: Coordinator assignment "004 — F23 measures and conversion": the ledger entry F23
(`nutrimero-docs` `f7756e1`, `mobile/FEATURES.md`, accepted 2026-09-24, **free tier**). A
measures table over a reasonable bakery product set, search for the ones not shown, and easy
conversion across metric, imperial, volume, grams, spoons and pieces. Constitution 1.2.0 governs.

**Sources, in authority order**: `nutrimero-docs/mobile/FEATURES.md` F23 (verdict and discussion
log) · `nutrimero-docs/mobile/IDEATION.md` (decided items settled) · the F23 concept screens
design-mobile is drawing in parallel (`nutrimero-design:mobile/home-baker/`, → AMENDMENTS →
`docs/DESIGN.md`) · `docs/DESIGN.md` (binding) · FID reference data as served by the contract
(`contract/openapi.json`, `contract/SOURCE` = nutrimero-api `4a4356b`).

## Gate 1 record

- **Q1 → the owner's rule: multi-source proof.** A row whose FID source is AI-derived
  ("OpenAI category estimate", "AI-assisted") reaches a screen **only when at least two
  independent published sources confirm its value within 5 %**, each source recorded (URL,
  locus, value). A confirmed row is then used like any other, with its sources cited;
  unconfirmed or disputed rows are not shown. The verification is scoped to 004's curated set,
  not all 449 rows, and its evidence is committed as `density-evidence.md` (ingredient, FID
  value, sources, verdict) — FR-004, FR-004a.
- **Q2 → agreement band 5 %.** Admissible rows for the same ingredient, form and state that agree
  within 5 % take the fixed rule (confidence, then method, then source), source shown on tap.
  **Beyond 5 % is an INCONSISTENCY**: listed with every row's source and value and brought for
  investigation — never picked silently. Until the owner rules a sourced pick, that ingredient
  shows **no volume conversion**. Resolved picks live in the snapshot manifest (the
  `staples.ts` curated-names pattern, each tested against FID), moving to the api later. Wheat
  flour `389D858` comes first: Health Canada 52.8, FAO 58, Fineli 65 (Fineli's is the
  semi-coarse flour) — all the same form and state — FR-005, FR-005a.
- **Q3 → (A)** *(superseded by the Correction below)*: US customary — cup 236.59 ml, tbsp 14.79 ml, tsp 4.93 ml; metric cup 250 ml and
  tbsp 15 ml; both labelled. UK and AU behind a setting, as the F23 log says. FID's 240 ml cup is
  the US nutrition-label cup; that inconsistency goes to the api lane — FR-010.
- **The onboarding card's "1 cup flour = 120 g"** is an unsourced number from the comp. It takes
  the resolved flour value once ruled; design-mobile is told when the number changes — FR-023.

### Correction, 2026-09-24 (coordinator, on the owner's rule that mobile follows the platform's agreements)

- **Q3 is replaced.** Spoons are **5 ml and 15 ml** (Markus M34, ruled in the api). The standard
  cup is **250 ml** (Markus M1), with a **US cup of 236.59 ml** for American recipes, both
  labelled. The api defines these units (an upcoming `change/002`); **004 reads them from the
  snapshot and holds no unit constants of its own.** The earlier "tbsp 14.79 / tsp 4.93" is
  withdrawn.
- **Q1 and Q2 stand as ruled, relocated.** The density choice rule and the resolved picks live
  **in the api**, defined once for every reader. The lane's `density-evidence.md` (ingredient,
  FID rows, at least two published sources, verdict) **feeds the api's overlays**. 004 reads the
  **chosen density** from the snapshot instead of applying its own rule.
- **Sequencing.** 004's build takes its snapshot **after that api change lands**. Until then:
  the spec update and the evidence research.

- **Scope widened (coordinator, 2026-09-24, on the api lane's finding).** "USDA FDC via iForge" is a
  source string inside Markus's M30 file — the delivery M34 disclosed as AI-generated — and the api never
  read USDA. **Every** volume row therefore counts as an AI-delivered claim until it is verified against its
  named published record, or confirmed by two independent published sources within 5 %; the evidence covers
  the row the app would show for every ingredient in the set. **Piece weights** (Markus's M28 table, method
  undisclosed) fall under the same rule, and no screen shows a piece weight before it is verified (FR-007a).

The Q1–Q3 lines above are kept as the record of what was first ruled; where they differ, this
correction governs.

## Gate 1 — the data survey

The questions were all about **which numbers the app is allowed to show**. The data survey behind
them (FID seeds at `4a4356b`, identical on api main):

- FID holds **1,594 volume-to-mass rows over 1,388 ingredients** and **2,010 piece-weight rows
  over 402 ingredients**. Every row carries a source, a method (`MEASURED`, `LITERATURE`,
  `CALCULATED`, `ESTIMATE`) and a confidence (`HIGH`, `MEDIUM`, `LOW`).
- **449 volume rows are sourced "OpenAI category estimate"** (method `CALCULATED`, confidence
  mostly `LOW`), and the spoon-sized rows for staples (5 ml and 15 ml) are sourced "markus
  2026-09-05 (AI-assisted, coordinator-reconciled)", `ESTIMATE`/`LOW`. "From FID only" alone
  therefore does not keep LLM-derived numbers off the screen — Q1. Excluding those rows leaves
  **474 of the 1,388 ingredients with no volume data at all** (how many of them are bakery
  ingredients is measured when the set is proposed, FR-018). Piece weights are all from one
  source, Markus's 2026-09-03 table (`ESTIMATE`, `MEDIUM`), none AI-labelled.
- **FID holds several densities for the same ingredient, form and state, and they disagree.**
  Wheat flour, powder, raw: 52.8 g (Health Canada CNF, MEDIUM), 58 g (FAO/INFOODS, HIGH,
  calculated) and 65 g (Fineli, HIGH) per 100 ml — a 23 % spread, i.e. a US cup of flour reads
  125 g, 137 g or 154 g depending on the row. Sugar: 84.5, 85 and 95 g per 100 ml (a 12 % spread, so sugar is an inconsistency under the
  Q2 ruling too) — Q2.
- **FID's own unit table defines the cup as 240 ml** (the US nutrition-labelling cup) and the
  tablespoon as 15 ml; the F23 log says "US 237 ml". The two cannot both be the app's US cup —
  Q3.
- No sifted-versus-spooned-versus-packed distinction exists in the data today: flour carries one
  form (powder) and one state (raw). The ledger's "sifted vs packed flour" is a capability of
  FID's model, not of its current data; this spec shows variants **only where FID holds them**
  (FR-006) and never invents one.

The rulings above answer Q1–Q3.

## Scope

**In**: a Measures destination in Home Baker; the measures table (each ingredient's everyday
measures — cup, tablespoon, teaspoon, piece — in grams, and back); a converter between any two
units an ingredient supports (mass ↔ mass, volume ↔ volume, volume ↔ mass, pieces ↔ mass) plus
the ingredient-free conversions (grams ↔ ounces, millilitres ↔ cups/spoons/fluid ounces, °C ↔
°F); on-device search over the shipped ingredient set, by any name FID stores in any language;
the units the api defines, labelled — the standard cup (250 ml) and the US cup (236.59 ml),
teaspoon 5 ml, tablespoon 15 ml; the provenance of every ingredient-specific number; the curated bakery set (~150–200
ingredients) shipped as part of the app; all seven UI locales.

**Out** (named so nothing is silently assumed): search over all of FID (waits for an api
guest-read policy — the search itself exists, `q` on `/fid/ingredients`, but only for a signed-in
caller); runtime refresh of the ingredient set (it updates with the app); scaling a recipe (F30);
tin and pan sizes (F07/F30); converting inside a recipe view (no recipe view exists yet — 003);
DDT and oven calibration (F34); timers (005); user-entered densities or custom ingredients; gas
marks; any unit or density rule defined in the app (the api defines both); a UK or Australian
cup/spoon setting unless the api defines those units; nutrition or allergen display of any kind in this feature; any account, sync or api call.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — "How much is a cup of flour?" (Priority: P1)

A home baker has a recipe that says "1 cup flour, ½ cup sugar, 2 tbsp honey" and a kitchen scale.
They open Measures, find flour in the list, and read what a cup, a tablespoon and a teaspoon of
it weigh; they do the same for sugar and honey without typing a number.

**Why this priority**: This is the question the feature exists for, and the table answers it with
zero input. Generic converters get it wrong because they use one density for everything; the
ingredient-aware answer is the "crown jewels" differentiator the ledger accepted F23 for.

**Independent Test**: With no network, open Measures, pick wheat flour, and check that the cup,
tablespoon and teaspoon rows show grams from the api's chosen flour density in the standard and US cups
(FR-009), each labelled — or, until the api has settled flour, that flour shows no volume
conversion and says why.

**Acceptance Scenarios**:

1. **Given** the app is installed and offline, **When** the baker opens Measures, **Then** the
   bakery set is listed and every ingredient in it shows its everyday measures without a network.
2. **Given** flour is selected and the cup standard is US, **When** the baker reads the cup row,
   **Then** it shows the grams for one US cup and names the standard ("US cup (236.59 ml)") — a cup is never shown without its standard.
3. **Given** an ingredient FID gives no volume data for, **When** the baker opens it, **Then** the
   volume rows say that no volume measure is known for it — no number is estimated or borrowed
   from a similar ingredient.
4. **Given** an ingredient with piece weights (egg), **When** the baker opens it, **Then** each
   size FID holds (extra small … extra large) shows its weight, and the size names come from FID.

---

### User Story 2 — Convert any amount, both ways (Priority: P1)

The baker types an amount in one unit and reads it in another: "250 g butter in cups", "3 eggs in
grams", "175 °C in °F", "2 cups milk in millilitres". The result updates as they type and can be
flipped.

**Why this priority**: The table covers the everyday measures; real recipes carry arbitrary
amounts, and a German baker reading an American recipe needs the reverse direction just as often.

**Independent Test**: Enter 250 g for butter, choose US cups, and check the result against the
ruled density; flip, and check the result reads back 250 g (within display rounding).

**Acceptance Scenarios**:

1. **Given** butter is selected, **When** the baker enters 250 g and chooses cups, **Then** the
   result is shown in cups to a practical fraction (e.g. "1 ⅛ cups") and, beside it, the exact
   decimal for those who want it.
2. **Given** the converter shows a result, **When** the baker flips the direction, **Then** the
   previous result becomes the input and the original amount is the result, within the display
   rounding stated in FR-013.
3. **Given** no ingredient is selected, **When** the baker converts between two volume units, two
   mass units or two temperatures, **Then** it works (these need no density).
4. **Given** no ingredient is selected, **When** the baker asks for grams from a volume, **Then**
   the app asks for the ingredient instead of guessing ("which ingredient? — a cup of flour and a
   cup of honey weigh very differently").
5. **Given** the baker's units preference from onboarding is imperial, **When** the converter
   opens, **Then** its default target is the imperial side; metric users default to grams and
   millilitres.

---

### User Story 3 — Find the ingredient that isn't in view (Priority: P2)

The baker looks for "Mandelmehl", "almond flour" or "migdolų miltai"; the app finds it in the
shipped set by any of its stored names, in any language, and says honestly when it is not in the
set yet.

**Why this priority**: 150–200 ingredients do not fit on a screen; search makes the set usable.
It stays within the shipped set in v1 (the full-FID search needs an api policy that doesn't exist).

**Independent Test**: Offline, search "Mehl" in an English UI and see the wheat flour entry (a
German name matches); search for an ingredient outside the set and see the honest "not in the
app yet" state.

**Acceptance Scenarios**:

1. **Given** any UI language, **When** the baker types two or more characters, **Then** results
   match every name FID stores for an ingredient, in every language, case-insensitively and
   ignoring diacritics, and are shown in the UI language (English where FID has no name in that
   language yet, as in 001 FR-017).
2. **Given** a term matches nothing in the set, **When** results would be empty, **Then** the app
   says the ingredient is not in the app yet — never "not found in the world" — and offers no
   estimate.
3. **Given** search is used, **When** the baker types, **Then** nothing leaves the device.

---

### User Story 4 — Trust the number (Priority: P2)

A careful baker wants to know why a cup of flour is "137 g" here and "120 g" on the onboarding
card and "125 g" on a packet. Each ingredient-specific number can be opened to show where it
comes from (the source database named by FID), how it was obtained (measured, literature,
calculated, estimate) and how confident it is.

**Why this priority**: Honest provenance (Constitution V's spirit) is what separates this from a
static table; it also makes the density rule (Q2) visible instead of hiding it.

**Independent Test**: Open the provenance of flour's cup row and check it names the FID source,
method and confidence of the row the rule chose.

**Acceptance Scenarios**:

1. **Given** an ingredient-specific number, **When** the baker opens its provenance, **Then** the
   source, method and confidence FID records for it are shown, in plain words.
2. **Given** a number whose FID confidence is low, **When** it is shown, **Then** it is marked
   approximate in words, not by colour alone.
3. **Given** a row confirmed by multi-source proof (FR-004a), **When** its provenance opens,
   **Then** the confirming published sources are cited alongside FID's.

---

### User Story 5 — Two cups, never confused (Priority: P3)

A baker reads a German recipe ("1 Tasse", 250 ml) and an American one ("1 cup", 236.59 ml). Both
cups appear, each named, so the baker knows which one they are reading and never mixes them.

**Why this priority**: The two cups differ by 5–6 %; unlabelled, the difference is silently wrong
in a scone or a cake. The platform defines both (M1 and the US cup); the app only has to name them.

**Independent Test**: Open flour's measures and check both cup rows are present and labelled
with their name and millilitres, and that spoons read 5 ml and 15 ml.

**Acceptance Scenarios**:

1. **Given** any ingredient with volume data, **When** its measures show, **Then** the standard
   cup and the US cup both appear, each labelled with its name and millilitres from the api's unit
   definitions.
2. **Given** spoons, **When** they show, **Then** they read 5 ml and 15 ml, labelled.

---

### Edge Cases

- **Several FID rows for one ingredient, form and state** — the api's chosen density decides; the
  app never chooses (FR-004, FR-005). Where the api has none yet, no volume conversion.
- **Variants** — where FID holds more than one form or state with its own data (e.g. whole vs
  chopped, liquid vs viscous), the ingredient offers them by FID's names; where it holds one, no
  variant picker appears.
- **Egg in a volume unit** — FID holds a volume row for liquid whole egg; pieces and volume are
  shown as separate measures, never mixed ("1 cup of eggs" is the liquid).
- **Zero, negative, empty, very large input** — empty shows no result; zero shows zero; negative
  input is refused; very large values keep full precision and never switch to scientific
  notation.
- **Decimal separator** — input accepts the separator of the UI locale (`,` in de/hu/lt/be/pl/uk)
  and `.`; output uses the locale's number format.
- **Fractions and plurals** — a fractional amount is formatted as a number, never pluralised
  (ruling 2026-09-24): unit labels next to a fraction use their unit symbols ("1 ⅛ cup", "¾ tsp")
  or the plural-free form the catalogs define; `count` is used only for whole pieces ("3 eggs").
- **Ingredient without a name in the UI language** — shown in English (001 FR-017 fallback);
  it stays searchable by all its names.
- **Temperature** — °C ↔ °F only; oven temperatures are rounded to 5 degrees for display.
- **An ingredient drops out of FID or changes in a later snapshot** — the app shows what its own
  shipped set holds; snapshot regeneration is reviewed (the diff is part of the PR).
- **Only AI-derived rows, none proven** — the ingredient shows no volume conversion (FR-004a); its
  piece weights, if any, still show.

## Requirements *(mandatory)*

### Functional Requirements

**The measures table and converter**

- **FR-001**: The app MUST offer a Measures destination in Home Baker, reachable from the tab
  shell; its placement follows design-mobile's F23 concept (DESIGN.md port) and is not decided by
  this spec.
- **FR-002**: For each ingredient in the shipped set, Measures MUST show its everyday measures —
  cup, tablespoon, teaspoon (in the active standard(s)) and each FID piece size — in grams, and
  each only where FID data supports it.
- **FR-003**: The converter MUST convert between any two units an ingredient supports: mass ↔
  mass, volume ↔ volume, volume ↔ mass (by density), pieces ↔ mass (by piece weight), in both
  directions; and, with no ingredient, mass ↔ mass, volume ↔ volume and °C ↔ °F.
- **FR-004**: Every ingredient-specific number (density, piece weight) MUST come from the FID
  snapshot shipped in the app — never from LLM output at runtime, a hand-typed table, a similar
  ingredient, or a heuristic. The **density shown is the api's chosen density** for that
  ingredient, form and state (FR-005); the app applies no choice rule of its own.
- **FR-004a**: The lane MUST produce `specs/004-measures-conversion/density-evidence.md` for the
  curated set (gate-1 Q1, widened): per ingredient, its FID rows (id, value, source, method, confidence),
  each checked against its named published record or, failing that, against at least two independent
  published sources (URL, locus, value) — every row, since every row is an AI-delivered claim — and a
  verdict (confirmed within 5 %, unconfirmed, disputed). The file **feeds the api's overlays**;
  the api decides what is admissible. The provenance view (FR-016) shows the sources the api
  records for the chosen value.
- **FR-005**: The app MUST show a volume ↔ mass conversion only where the snapshot carries the
  api's chosen density; where the api has none — rows disagreeing beyond 5 % without a resolved
  pick, or AI-derived rows not proven (gate-1 Q1, Q2) — the ingredient shows **no volume
  conversion**, in words that say it is not settled yet.
- **FR-005a**: The lane MUST bring every inconsistency it finds in the curated set (admissible
  rows more than 5 % apart) to the api lane and the owner with every row's source and value, as
  part of the evidence (FR-004a) — never picking silently. Wheat flour `389D858` first (Health
  Canada 52.8, FAO 58, Fineli 65 g/100 ml — Fineli's is the semi-coarse flour); sugar `4BEC221`
  next (84.5 / 85 / 95).
- **FR-006**: Forms and preparation states MUST be offered only where FID holds separate data for
  them, named with FID's names; the app MUST NOT invent a variant (e.g. "sifted") FID has no data
  for.
- **FR-007**: A volume ↔ mass or piece ↔ mass conversion MUST NOT be offered for an ingredient the
  snapshot gives no chosen density or piece weight for; the app says the measure is not known.
- **FR-007a**: A piece weight MUST NOT be shown unless it is verified against its named published record or
  confirmed by two independent published sources within 5 % (`density-evidence.md` §D). Egg sizes follow the
  classes the user buys by: FID's current classes are US/Canadian minimums, which name EU eggs one grade too
  large, so eggs show no size-classed weight until the platform defines EU-graded values.

**Units**

- **FR-008**: Every cup and spoon value MUST be labelled with its unit's name wherever it appears
  ("cup (250 ml)", "US cup (236.59 ml)", "tsp", "tbsp").
- **FR-009**: Measures MUST show both cups the api defines — the standard cup and the US cup —
  side by side, and spoons of 5 ml and 15 ml. There is no cup/spoon setting in 004.
- **FR-010**: Unit definitions (millilitres per cup and spoon, grams per ounce, and any other unit
  factor) MUST be read from the snapshot of the api's unit definitions; the app holds **no unit
  constants of its own**. The values ruled today: standard cup 250 ml (M1), US cup 236.59 ml, tsp
  5 ml and tbsp 15 ml (M34).
- **FR-011**: Arithmetic and formatting (applying a factor, rounding, fractions, °C ↔ °F, which is
  a formula, not a unit definition) MUST go through the shared functions in the core package
  (Constitution IX: never inline); core's existing `GRAMS_PER_OUNCE` constant is brought onto the
  api's ounce definition in this feature.

**Search**

- **FR-012**: Search MUST run over the shipped set only, on the device, matching every name FID
  stores for an ingredient in every language — case-insensitively, ignoring diacritics, from two
  characters — and MUST show results in the UI language (English fallback). A term matching
  nothing shows an honest "not in the app yet" state. No search term leaves the device or is
  stored.

**Display**

- **FR-013**: Results MUST be shown to practical precision: grams to 1 g below 100 g and 5 g from
  100 g (unless the user asks for the exact value); cups and spoons to the nearest ⅛ (cups) or ¼
  (spoons) as a fraction glyph with the exact decimal available; millilitres to 1 ml; °F/°C to 5
  degrees for oven temperatures. Round-tripping a value MUST return the original within this
  rounding.
- **FR-014**: Numbers MUST use the locale's number formatting; input MUST accept the locale's
  decimal separator and `.`.
- **FR-015**: Fractional amounts MUST be formatted as numbers and never pluralised (ruling
  2026-09-24); plural forms are used only for whole `count`s.
- **FR-016**: Each ingredient-specific number MUST expose its provenance — FID source, method,
  confidence — in plain words; a low-confidence number MUST be marked approximate in words.

**Data**

- **FR-017**: The shipped set MUST be produced by the existing FID snapshot script, extended —
  run only against a LOCAL api at `contract/SOURCE`'s commit, never production; the generated file
  carries the api commit; a hand edit is a suppression-class violation (Constitution XII). The
  set's ingredient list is curated (FR-018) and every listed ingredient MUST resolve, or the build
  fails.
- **FR-018**: The set MUST be ~150–200 bakery ingredients, proposed by the lane from FID (bakery
  food types with at least one admissible volume or piece row) and confirmed by the owner, as the
  13 staples were; the 13 staples are in it.
- **FR-019**: The feature MUST work fully offline and make no api call (Constitution VIII); the
  set updates only with the app.

**Language, accessibility, privacy**

- **FR-020**: Every user-facing string MUST be in the seven catalogs (IX), in Home's informal
  register; unit names and standard labels included. Ingredient, form, state and piece-size names
  are FID data, shown as stored (MA-14).
- **FR-021**: Amounts MUST be announced by screen readers as spoken quantities ("one and one
  eighth US cups", not "1 ⅛"), and every control meets DESIGN.md's target and contrast rules (X).
- **FR-022**: Measures MUST hold no personal data and store nothing on the device.
- **FR-023**: The onboarding units card (001) MUST show the api's chosen wheat-flour density in
  the labelled US cup in place of the comp's unsourced "120 g"; until the api has settled flour,
  the card keeps its current value, and design-mobile is told when it changes. Its butter "stick"
  (113 g) is a unit of its own: it stays only if the api's unit definitions include it (open
  question to the api lane via the coordinator); otherwise the card's row is re-expressed in a
  unit the api defines, with design-mobile.

### Key Entities

- **Measures ingredient**: an FID ingredient in the shipped set — its FID id, its names per
  language, its forms and states that carry data, its admissible density rows and piece-weight
  rows, each with source, method and confidence.
- **Density**: grams per millilitre for one ingredient, form and state, with its FID provenance.
- **Piece weight**: mean grams (and range where FID has it) for one ingredient, form, state and
  piece-size class (extra small … extra large), with provenance.
- **Unit definition**: the api's definition of a unit — its name and factor to millilitres or
  grams (standard cup, US cup, tsp, tbsp, ounce, …), read from the snapshot (FR-010).
- **Chosen density**: the api's one density per ingredient, form and state, with the sources it
  records; absent where the api has not settled one (FR-005).

## Contract check (Constitution II)

- **Consumed now (by the snapshot script, not the app)**: `GET /api/v1/fid/ingredients/{fidId}`
  — `names`, `physicalForms`, `preparationStates`, and **`reserved.volumeToMass`** /
  **`reserved.pieceWeight`** (source, method, confidence on each row); `GET
  /api/v1/fid/physical-forms`, `/preparation-states`, `/piece-size-classes` for localized names;
  `GET /api/v1/fid/languages`. All present in `contract/openapi.json` at `4a4356b`.
- **Confirmed stable by the api lane (2026-09-24)**: `reserved.volumeToMass`, `pieceWeight`,
  `waterContent`, `losses`, `dryMatterPercent`; numbers as full-precision strings; density = mass
  over volume to 6 places; empty is not zero; `losses` (0 rows) and `dryMatterPercent` (always
  null) are not derived from.
- **Coming (api `change/002`, the snapshot waits for it)**: the platform's unit definitions (cups,
  spoons) and the chosen density with its rule and resolved picks. The contract sync and the
  snapshot follow its merge; the spec names its fields once the change is published.
- **Not consumed, deliberately**: `GET /api/v1/fid/ingredients?q=` — the search exists but
  requires a bearer token; the app has no session (001 Q1). Full-FID search is api work first (a
  guest-read policy), then a later mobile feature.
- **Runtime api calls: none.**

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A baker gets the grams for "1 cup of <ingredient>" in at most 3 taps from Measures
  and no typing, for every ingredient in the set that has volume data.
- **SC-002**: 100 % of cup and spoon values on screen carry their standard's label (checked by
  test over every screen state).
- **SC-003**: 100 % of ingredient-specific numbers trace to an admissible FID row (checked by
  test: every shipped density and piece weight equals a row in the generated snapshot, and the
  snapshot equals the api's rows at the recorded commit).
- **SC-004**: Round trips (A → B → A) return the original amount within FR-013's rounding for
  every unit pair and every ingredient in the set (checked by test).
- **SC-005**: Search returns the intended ingredient in the top 3 results for its name in any of
  the FID languages it has names in, for every ingredient in the set (checked by test).
- **SC-006**: Measures is fully usable with no network, from first launch.
- **SC-007**: The set covers ≥ 90 % of the ingredients in the launch recipe set (003's corpus,
  once known) that are measured by volume or piece in their source recipes.

## Dependencies

- **api `change/002`**: unit definitions and the chosen density (rule + resolved picks), then a
  contract sync. 004's snapshot and build wait for it.
- **Owner**: confirmation of the ~150–200 ingredient list (FR-018); resolved picks are ruled into
  the api (FR-005a), wheat flour first.
- **Multi-source evidence** (FR-004a): the lane's web research, committed as
  `density-evidence.md`, feeding the api's overlays.
- **api lane** (via the coordinator): FID's unit table defines the cup as 240 ml, the US
  nutrition-label cup — superseded by `change/002`'s definitions.
- **design-mobile's F23 concept screens** → AMENDMENTS → DESIGN.md port; UI work through
  impeccable; no screen is built before the concept is approved.
- **api lane**: later, a guest-read policy for full search (out of scope here).
- **Markus**: none required by 004 directly; open question below on the piece-weight delivery.
- **No new native dependency is expected** (the snapshot is data; conversion is arithmetic). Any
  that surfaces in the plan is an ADR 0001 row first (XI).

## Assumptions

- The Measures destination is free for everyone (F23 verdict); no entitlement check.
- The onboarding units card is covered by FR-023 (gate 1 ruling).
- FID names in lt, pl, be and uk arrive with api `feat/021`; until then those locales show English
  ingredient names (001 FR-017's fallback) while the UI itself is translated.
- Snapshot size stays small enough to ship in the bundle (~200 ingredients × a few rows);
  the plan measures it.
- Volume ↔ mass for liquids uses FID's liquid rows like any other; the app does not assume water
  density for any ingredient.
