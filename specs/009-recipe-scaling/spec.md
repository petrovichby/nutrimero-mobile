# Feature Specification: Recipe scaling, v1 (F30)

**Feature Branch**: `spec/009-recipe-scaling` (spec directory `specs/009-recipe-scaling/`)

**Created**: 2026-09-26

**Status**: **Gate 1 passed** on structure (the coordinator, 2026-09-26). The spec is aligned to the owner-walked
design, MA-32. Rulings are in *Clarifications*; open items are named in *Open items* and are not picked here.
Nothing is planned or built before the coordinator's word, and no engine code is written before the mobile pause
lifts.

**Input**: The owner's assignment to Home lane 2, 2026-09-26: "RECIPE SCALING, spec 009 (F30 v1), Home only.
Start now, design first." The ledger entry is F30 in `nutrimero-docs:mobile/FEATURES.md` at `9dc3ebf` (accepted
2026-09-24; percentage added and "start now, for Home only" on 2026-09-26). Constitution 1.2.0 governs.

**Sources, in authority order**:
- **MA-32, "Recipe scaling, v1"** (`nutrimero-design:mobile/AMENDMENTS.md`, design `main` at `fe262b49`), walked
  and ruled by the owner on 2026-09-26, with its frames (*Screen inventory*). Built by
  `mobile/home-baker/_gen/f30/gen_scaling.py`. Until it is ported, MA-32 is the binding design record for this
  spec, beside `docs/DESIGN.md`.
- The coordinator's gate-1 rulings of 2026-09-26, relaying the owner (*Clarifications*).
- `nutrimero-docs/mobile/FEATURES.md` F30 at `9dc3ebf`: the verdict, the discussion log, and the 2026-09-26
  decision log.
- Spec 004 (`spec/004-measures-conversion`, at `ff510ff`): the units system and region, "Amounts in recipes",
  the kitchen chart's measures (F23, MA-29), the "just this time" rule (FR-029), and unit, density and egg-grade
  data from the api (FR-005, FR-007a, FR-010). 004's display rounding (FR-013) stays the rule for **conversions**;
  scaled amounts round by MA-32 (FR-008 here).
- The api's recipe model (`nutrimero-api` spec 013, `data-model.md`): portions and portion size, component
  quantities where NULL means "not known" and 0 means "to taste", and units from FID's catalogue.

## Scope

**In**:
- **Scaling a recipe three ways**, each giving one **scale factor** applied to every ingredient:
  - **Percent**: − and + in 5 % steps, a typed value, or quick chips (FR-004). Free.
  - **Yield**: a number of slices (the recipe's pieces), or a total **dough weight** (FR-002, FR-003). Free.
  - **What I have**: the one ingredient that is short, and how much of it the baker has (FR-006). Plus; its UI
    waits for the Plus boundary to be drawn.
- **Proportional scaling** of every ingredient amount, and of the per-step amounts where a recipe states them.
- **Rounding to what a baker can weigh or measure** (FR-008): MA-32's metric steps, and F23's kitchen measures in
  US units.
- **Scaled amounts shown with the original beneath** ("378 g · was 420 g"), and the scaled yield ("≈11").
- **A pure, shared scaling engine** with no UI and no device dependency, so that Pro's batch scaling (F17) can
  reuse it later.
- **How v1 is exercised before Home has recipes**: test fixtures and development-only dummy recipes, never
  shipped (FR-020 to FR-022).
- **The scaling UI**, built only from MA-32's frames. What is undrawn waits (*Screen inventory*).
- All seven UI languages, in the informal Home register.

**Out**, each named so it is not silently assumed:
- **Baking mode** (F37's second half). Ruled out of 009 (Q4). What MA-32 drew for it is handed on as a requirement
  (*Handed on*).
- **Scaling by tin** ("max 0.8× for your 24 cm tin"): waits for F09's cupboard with sizes (spec 013). MA-32 says
  the same.
- **Non-linear baking rules** (yeast, leavening and salt scaling sub-linearly, bake time and temperature
  guidance): these wait for Markus's validated rules tables. MA-32 draws their place (02h), and v1 shows nothing
  there (FR-012a).
- **Pro's professional batch scaling** (F17: batch multiples of a base batch). Pro is parked; it reuses the
  engine later.
- **A recipe view.** Home has no recipes yet: 003 (the catalog) waits for the api's mobile series, and 008 (own
  recipes and imports) is not built. The scaler mounts on the recipe detail (02) when it is built.
- **Saving a scaled copy** as a new recipe (with own recipes, 008). **Shopping-list quantities** (010) and **PDF
  export** (011) are consumers of the engine, specced there.
- **Pantry quantities.** The pantry stays presence-only (F30, MA-32). An amount the baker has is typed at scale
  time and never stored.
- **Expanding a sub-recipe** into its own ingredients. v1 scales a sub-recipe line as one amount.
- **Combined measures** ("1 cup + 2 tbsp"). One unit per amount in v1.
- **Scaling the nutrition panel.** It is per 100 g and per slice, and neither changes with the scale, because a
  slice keeps its size (FR-005). 02c draws it unchanged.
- Any tier enforcement decided on the device (constitution VII).

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Make it for six instead of twelve (Priority: P1)

A home baker opens a recipe that makes 12 slices and wants 6. They step the Yield down to 6, or open "Scale this
recipe" and choose Yield. Every amount halves and reads in measures they can weigh, with the original beneath it.
Or they want 1,000 g of dough, type it, and the recipe scales to it. The recipe itself is unchanged.

**Why this priority**: Outcome scaling is free and table stakes in F30's verdict, and the Yield stepper on the
recipe detail already does it by slices (MA-32).

**Independent Test**: Scale a fixture recipe with 12 portions to 6, and a fixture whose ingredients weigh 1,116 g
to 1,000 g of dough. Check the factors (0.5 and 1000/1116), that every exact amount is the original × the factor,
that every display follows FR-008, and that the stored recipe is byte-identical afterwards.

**Acceptance Scenarios**:

1. **Given** a recipe with 12 portions, **When** the baker sets 6, **Then** the factor is 0.5 and every amount is
   halved before rounding.
2. **Given** a recipe whose ingredients weigh 1,116 g in total, **When** the baker asks for 1,000 g of dough,
   **Then** the factor is 1000/1116 and the sheet says "That's ×0.9 of the recipe (89.6%). The original makes
   1,116 g." (02e).
3. **Given** a recipe with no portions stated, **When** the baker opens the sheet, **Then** "Slices" is not
   offered, and dough weight, percent and what I have still work.
4. **Given** a recipe with a line that has no weight (a volume with no verified density, "to taste", or an
   unknown amount), **When** the baker scales by dough weight, **Then** the behaviour is open (*Open items*, O-1).
5. **Given** any scale, **When** the baker taps **Back to original**, **Then** every amount and the yield return to
   the recipe as written.

---

### User Story 2 — Bake 90 % of it (Priority: P1)

The baker's tin is a little small, so they scale the whole recipe to 90 %. They can equally double it or halve it.

**Why this priority**: The owner added percent on 2026-09-26 and ruled it free on the walk. It needs nothing from
the recipe beyond its amounts, and it works on every recipe.

**Independent Test**: Scale a fixture to 90 % by the chip, by − from 95 %, and by typing 90. Check that all three
give the factor 0.9 and identical results, and that the preview shows the scaled yield and dough weight before
"Scale to 90%".

**Acceptance Scenarios**:

1. **Given** any recipe, **When** the baker taps the 90 % chip, **Then** the value reads "90%" with "×0.9" beneath
   it, the chip is marked as chosen, and the preview reads "Yield ≈11 slices (12) · Dough 1,004 g (1,116 g)" (02d).
2. **Given** 90 %, **When** the baker taps +, **Then** it reads 95 %; **When** they tap −, **Then** 85 %.
3. **Given** a typed value, **When** it is outside the allowed range (Q2, pending), **Then** the app refuses it in
   words and keeps the last valid scale. The refusal is undrawn and waits for its frame.
4. **Given** the preview, **When** the baker taps "Scale to 90%", **Then** the recipe shows scaled (02c). Nothing
   changes on the recipe before that tap.

---

### User Story 3 — I only have 100 g of chocolate (Priority: P2)

The recipe wants 120 g of dark chocolate and the baker has 100 g. They pick the short ingredient, type what they
have, and the recipe scales to use it: "The recipe needs 120 g, so you can bake ×0.83 of it (83%): about 10
slices." (02f).

**Why this priority**: The mode is valuable, but F30's verdict puts it in Plus, and its UI waits for the Plus
boundary to be drawn. The engine builds it now.

**Independent Test**: For a fixture that needs 120 g chocolate, give 100 g. Check that the factor is 100/120, that
the chocolate line never reads more than 100 g, and that the result sentence names the need, the factor, the
percent and the yield. Sweep available amounts and check that the limiting line never exceeds what was typed.

**Acceptance Scenarios**:

1. **Given** the recipe needs 120 g chocolate, **When** the baker picks it and types 100 g, **Then** the factor is
   5/6 and chocolate reads "100 g", never more.
2. **Given** the sheet, **When** the baker picks an ingredient, **Then** exactly one is chosen at a time ("Which
   ingredient is short?").
3. **Given** a line that is "to taste" or not known, **Then** it is not offered as the short ingredient.
4. **Given** the line is shown in ounces (a US baker), **When** the baker types ounces, **Then** the amount converts
   to the recipe's unit through 004's unit definitions. It never converts between weight and volume here.
5. **Given** the baker has **more** than the recipe needs, **Then** Q2 (pending) decides: scale up, or keep the
   recipe as written.

---

### User Story 4 — The amounts read the way I weigh and measure (Priority: P1, with stories 1–3)

A metric baker reads grams rounded to what a kitchen scale shows. A US baker reads cups, spoons and ounces, where a
small change may round to the same measure. Every scaled amount shows its original small beneath it.

**Why this priority**: Without it, scaling produces numbers nobody can weigh ("377.6 g", "0.37 cup").

**Independent Test**: Scale the MA-32 fixture (02's eight ingredients) by 0.9 in Metric and in US units. Check the
metric column against 02c exactly. Check the US column against F23's measures, scaled from the exact stored
amounts (FR-007a). 02g itself becomes a test only once design-mobile computes it from the stated US rule.

**Acceptance Scenarios**:

1. **Given** Metric and a scale of 0.9, **Then** 420 g reads "378 g · was 420 g", 11 g reads "10 g · was 11 g",
   and 25 g reads "23 g · was 25 g" (02c).
2. **Given** a scaled amount under 10 g, **Then** it reads to the half gram ("3.5 g"); above 1 kg, to 5 g
   ("1,255 g").
3. **Given** US units and a scale of 0.9, **Then** 3⅓ cups reads "3 cups · was 3⅓ cups", and ⅓ cup reads
   "⅓ cup · was ⅓ cup": the same measure is a correct result (02g).
4. **Given** US units and an ingredient with no kitchen measure, **Then** it reads by weight ("3¾ oz · was
   4¼ oz", 02g).
5. **Given** whole eggs, **Then** they read as whole eggs with their weight without shell beside them, the weight
   from the api's egg grades (Q3). The row is undrawn.
6. **Given** a present ingredient, **Then** its scaled amount never reads as "0".

---

### Edge Cases

- **"To taste" (quantity 0) and unknown quantities (NULL)** are never scaled. A 0 stays "to taste" and never
  becomes "0 g". How such a row reads on a scaled recipe is undrawn.
- **The yield after a percent, dough-weight or what-I-have scale** is rarely whole (12 × 0.9 = 10.8). It reads
  "≈11" and says what the original makes (FR-005). The portion size stays the same.
- **Temperatures and times are never scaled.** Whether the note says so is pending (FR-012).
- **A sub-recipe line** scales as one amount, like any other line.
- **Steps that state their own amounts** scale by the same factor, with the same rounding as the ingredient list.
- **Rounding direction**: amounts round to the nearest step, halves up (22.5 g reads "23 g", 02c). The short
  ingredient in "What I have" never rounds up past what the baker typed (FR-009).
- **Scaling twice** (50 % then back to 100 %) shows the recipe as written. Rounding is only ever applied to the
  display of an exact value, never fed back in.
- **Mixed units within one recipe** (grams and cups): each line keeps its own kind (mass, volume, pieces) and its
  own rounding.
- **An amount converted from a volume through a density, then scaled**: which rounding applies is open (O-3).
- **Clear my data** needs nothing new while no scale is stored (Q5, pending).

## Requirements *(mandatory)*

### Functional Requirements

**The factor**

- **FR-001**: Every mode MUST reduce to one **scale factor**: a positive number applied to every scalable amount.
  The engine keeps the factor exact (for example 5/6, not 0.8333) as far as the arithmetic allows, and never
  rounds it. Only its display rounds (O-5).
- **FR-002 — By slices**: factor = target slices ÷ the recipe's portions. It is offered only when the recipe states
  portions. The target is a whole number from 1 upwards. The Yield stepper on the recipe detail (02) sets it
  directly; the sheet's Yield tab offers it as "Slices" (02e).
- **FR-003 — By dough weight**: factor = the target ÷ the recipe's **total dough**, which is the sum of its
  ingredient weights ("The original makes 1,116 g", 02e). It is **not** the recipe's entered finished weight. The
  target is typed in grams in Metric; other systems are undrawn. A line with no weight is open (O-1).
- **FR-004 — By percent**: the value is a percent of the recipe, shown with its factor beneath ("90%", "×0.9").
  - − and + change it in **5 % steps**;
  - it can be typed;
  - chips at **50, 75, 90, 100, 125, 150 and 200 %** set it, and the chip matching the value reads as chosen.
  - Typing accepts the locale's decimal separator and a point, through 004's amount parser. Bounds: Q2, pending.
- **FR-005 — The yield**: a scaled recipe's portions MUST read as portions × factor, with the same portion size.
  A whole result reads as the number; otherwise "≈" and the nearest whole number ("≈11"), and the recipe says what
  the original makes ("The original makes 12."). The sheet's previews read the same way ("≈11 slices (12)").
- **FR-006 — What I have**: the baker picks **one** ingredient, the short one ("Which ingredient is short?"), and
  types how much they have ("How much do you have?"). Factor = available ÷ required.
  - The amount is typed in the unit the line is shown in, and converts to the recipe's unit through 004's unit
    definitions. It never crosses weight and volume.
  - A "to taste" or unknown line is not offered.
  - The result names the need, the factor, the percent and the yield: "The recipe needs 120 g, so you can bake
    ×0.83 of it (83%): about 10 slices." (02f).
  - Having more than the recipe needs: Q2, pending.
  - Tier: **Plus** (F30). The Plus boundary is not drawn, so this tab's UI waits (constitution VII: the client
    renders entitlement state and never decides it). The engine builds the mode now.
- **FR-006a — Preview, then apply**: each tab MUST show a preview (the scaled yield and dough weight, each with
  the original) that updates as the baker types, before the "Scale to …" button ("Scale to 90%", "Scale to 1,000 g
  of dough", "Scale to what I have"). The recipe changes only on that tap.

**Amounts**

- **FR-007**: Every scalable amount MUST be scaled as its exact quantity × factor. This covers the ingredient list
  and the per-step amounts. "To taste" (0) and unknown (NULL) lines pass through unchanged and are marked as not
  scaled.
- **FR-007a — From the exact, never from the display** (the coordinator, 2026-09-26): scaling MUST always start
  from the **exact stored amount**, never from a displayed or rounded value. The stored 120 g reads "4¼ oz" in US
  units (4.233 oz exact); × 0.9 is 108 g = 3.810 oz, which rounds to the eighth as "3¾ oz", not the 3⅞ that
  4¼ × 0.9 = 3.825 would give. Likewise honey, stored as 20 g and shown "1 tbsp": × 0.9 is 18 g, which through
  honey's density from the api (about 1.42 g/ml, an illustration, never a value the engine holds) is ≈12.7 ml
  ≈ 2.5 tsp, never 1 tbsp × 0.9.
- **FR-008 — Rounding a scaled amount (MA-32)**: each scaled amount MUST be rounded to what the baker can weigh or
  measure, in their units system (004):
  - **Metric**: to **0.5 g under 10 g**, to **1 g up to 1 kg**, and to **5 g above**. Halves round up.
  - **US**: to **F23's kitchen measures**, the steps of 004's kitchen chart (MA-29). A small change may round to
    the same measure ("⅓ cup · was ⅓ cup"), which is correct. O-4 names where the frames and 004's steps differ.
  - **No kitchen measure** for an ingredient: it reads by weight (in US units, ounces, 02g).
  - **Eggs**: whole eggs, with the weight without shell beside them (Q3). The engine does the rounding; the row's
    UI waits for its frame.
  - A number and its unit stay bound (U+00A0, MA-29).
  - A present amount never reads as 0.
  - This is a **named function in core**, beside 004's display rounding. 004 FR-013 stays the rule for
    conversions, and scaling does not change it.
  - Other amounts are open: metric volumes (millilitres) and imperial with the UK or Europe region are undrawn
    (O-6), and a converted amount is O-3.
- **FR-009 — Never more than the baker has**: in "What I have", the short ingredient's displayed amount MUST NOT
  exceed the amount typed. When nearest rounding would exceed it, that line rounds down.
- **FR-010 — Scaled, with the original**: every scaled amount MUST show the scaled value, with the original small
  beneath it ("378 g · was 420 g"), **never struck through**. The engine also carries the exact scaled value for
  its consumers. MA-32 draws no exact-value view, so v1 shows none. A screen reader speaks amounts as quantities,
  never glyphs (004 FR-021).
- **FR-011 — Units, densities and egg grades from the api**: conversions and egg weights MUST use 004's snapshot
  of the api's unit definitions, chosen densities and egg grades. The engine holds no unit constant, no density
  and no egg weight, and never borrows a density from a similar ingredient.
- **FR-012 — Honest about v1**: a scaled recipe MUST show the drawn sentence under the yield: "Amounts below are
  90% of the recipe, rounded to what you can weigh. The original makes 12." In US units it reads "…rounded to what
  you can measure…" (02g). Whether it also says that times and temperatures are unchanged is pending the owner's
  follow-up walk. The engine carries **no ingredient-class rule** (yeast, salt, leavening). Those wait for
  Markus's validated tables, which will be tested data, never LLM-derived.
- **FR-012a — The non-linear place, empty in v1**: MA-32 draws a place inside an ingredient's row for "Doesn't
  scale in a straight line · Why?" (02h). v1 MUST show **nothing** there. Its wording and what "Why?" opens are
  placeholders until Markus's rules exist, so no string for it enters the catalogs in v1.

**Behaviour**

- **FR-013 — The recipe is untouched**: scaling MUST never change the stored recipe. It is a view of it.
- **FR-014 — Back to original**: one action, **"Back to original"**, MUST return the recipe to as written.
- **FR-014a — The scaled state (02c)**: a scaled recipe's Yield card MUST read as scaled: gold-edged, with a
  "×0.9" badge, "90% of the recipe" and "Back to original", the yield stepper showing the scaled yield, the
  FR-012 sentence, and "Scale another way", which reopens the sheet. Unscaled, the card keeps 02's line, "Scale
  by percent, dough weight or what you have".
- **FR-015 — Not stored**: the scale lasts while the recipe view is open and is not stored. This is Q5's default,
  **pending** the owner's follow-up walk. It follows 004 FR-029: a temporary change that never writes a setting.
- **FR-016 — Instant and offline**: previews and results MUST update as the baker types, need no network, and
  make no api call.

**The engine**

- **FR-017**: The engine MUST be a pure, shared module with no UI, no storage and no device access.
  - **Input**: a recipe's portions, portion size and lines (quantity, unit, optional FID id, optional sub-recipe),
    plus a mode and its target.
  - **Output**: the factor, the recipe's total dough and its scaled value, the scaled yield, the short line if any,
    and for each line its exact scaled amount, its rounded display amount and unit, its original, and whether it
    was scaled.
  - It builds all three modes. Pro's F17 reuses it unchanged.
- **FR-018**: The engine's input MUST follow the platform's recipe model (api 013 / `.rex`): `portions`,
  `portion_size` + `portion_unit_id`, and components with `quantity` (NULL ≠ 0) and `unit_id` from FID's unit
  catalogue. It invents no field that recipe will not carry. Own and imported recipes (008) map onto the same
  input.
- **FR-019**: Number formatting, parsing, fractions and unit arithmetic MUST go through the core package's shared
  functions (004 FR-011, constitution IX). FR-008's rounding is added to core as a named function and announced
  (constitution III), as is anything else the engine needs that core lacks.

**Before recipes exist: how v1 is exercised**

- **FR-020 — Test fixtures**: the engine is tested against fixture recipes in the test suite. They are shaped like
  the api's recipe model. One reproduces MA-32's recipe (02: eight lines, 1,116 g, 12 slices), so the drawn values
  are tests. Others cover portions, grams, cups and spoons, eggs, "to taste", unknown, a sub-recipe line, step
  amounts, and each units system. Fixtures live beside the tests and are never imported by app code.
- **FR-021 — Development dummies, never shipped**: until 003 or 008 gives Home real recipes, the scaling UI runs
  in development builds only, on **dummy recipes**. This is the allowance already made for 003 (`FEATURES.md`,
  F38 constraints). The dummies:
  - are labelled as development data;
  - name ingredients by FID id, with invented plain amounts; their names come from the data as stored, never
    written into the dummy;
  - make no nutrition or allergen statement (constitution IV);
  - are not content. A release build contains no dummy recipe and no way to reach one, and a test checks the
    release bundle for their names.
- **FR-022 — The seam**: when a real recipe view lands (003 or 008), it passes its recipe to the same engine
  input, and the dummies are deleted. Nothing in the engine knows where a recipe came from.

**Language and accessibility**

- **FR-023**: Every user-facing string MUST be in the seven catalogs, in Home's informal register. Percents and
  factors use the locale's number format. A number and its unit never wrap apart (U+00A0; the owner's rule,
  2026-09-25). Fractional amounts are numbers and never pluralised (004 FR-015).
- **FR-024**: Every scaling control MUST meet DESIGN.md's target, contrast and label rules (constitution X), with
  the frames' labels ("5 percent less", "5 percent more", "Percent of the recipe", "Quick amounts", "Fewer
  slices", "More slices"). The factor and each changed amount are announced when they change, without reading the
  whole list again.

### Key Entities

- **Scalable recipe** (the engine's input): portions (optional), portion size and unit (optional), and ordered
  lines.
- **Line**: a quantity (a number; 0 = to taste; absent = not known), a unit from FID's unit catalogue, optionally
  an FID ingredient id (for densities and egg grades), and optionally a sub-recipe reference. Step amounts are
  lines tied to a step.
- **Total dough**: the sum of the lines' weights (FR-003). How lines with no weight count is O-1.
- **Scale request**: one mode (slices, dough weight, percent, what I have) and its target. For what I have, one
  line and the amount the baker has, with its unit.
- **Scale result**: the factor, the short line (what I have), the scaled yield, the total dough and its scaled
  value, and per line the exact scaled quantity, the rounded display (amount and unit), the original, and a
  scaled/unchanged flag.
- **Units context**: the baker's system and region (004), plus 004's unit definitions, chosen densities and egg
  grades. It is read-only to the engine.

## Screen inventory (MA-32, design `main` at `fe262b49`)

Built only from these frames. Each has a dark twin unless noted.

| frame | what it draws |
|---|---|
| `02-recipe-detail` (+ dark) | the Yield card unscaled, its stepper, and the line into the sheet |
| `02c-recipe-scaled` (+ dark) | the scaled card (FR-014a), the note (FR-012), and the scaled list with "was" beneath |
| `02d-scale-percent` (+ dark) | the sheet, "Scale this recipe": Percent, with −/+, chips and the preview |
| `02e-scale-yield` (+ dark) | Yield: Slices or Dough weight, the typed target, the factor and the original |
| `02f-scale-what-i-have` (+ dark) | What I have: the short ingredient, the amount, the result sentence |
| `02g-recipe-scaled-us` (**no dark twin**) | the scaled list in US measures, and the "measure" note |
| `02h-recipe-scaled-nonlinear` (+ dark) | the place for the non-linear note, which v1 leaves empty (FR-012a) |
| `02b-baking-mode-scaled` (+ dark) | baking mode, scaled: out of 009, handed on (*Handed on*) |

**Undrawn, so it waits for its frame** (reported to the coordinator for design-mobile):
- **The refusal** of an out-of-range scale (Q2).
- **The egg row**: whole eggs with their weight beside them (Q3).
- **The Plus boundary** on "What I have" (FR-006). The whole tab's UI waits for it.
- **02g's dark twin.**
- Also not drawn, noted for the same walk: a "to taste" or unknown row on a scaled recipe; the dough-weight target
  in US units; a yield that scales below one piece.

## Handed on

**To baking mode's own spec** (Q4 put it out of 009), from `02b-baking-mode-scaled` (+ dark):
- a gold **90%** in the top bar throughout;
- every amount in the steps scaled, with FR-008's rounding;
- the scale is changed on the recipe, never mid-bake.

## Clarifications

### Session 2026-09-26 (gate 1, the coordinator relaying the owner; MA-32 walk)

- **Q1 → A, with percent free.** Slices, dough weight and percent are free; the owner ruled percent free on the
  walk. "What I have" is Plus (F30). The engine builds all three modes. The Plus boundary on "What I have" is not
  drawn, so that UI waits.
- **FR-003 → by dough weight**: the target ÷ the recipe's total dough, the sum of its ingredient weights (02e). It
  is not an entered finished weight.
- **FR-004 →** 5 % steps with − and +, a typed value, and chips at 50/75/90/100/125/150/200 %.
- **FR-006 →** one ingredient, the short one, not "one or more".
- **FR-008 → MA-32's rounding**, not 004 FR-013. Metric: 0.5 g under 10 g, 1 g up to 1 kg, 5 g above. US: F23's
  kitchen measures; a small change may round to the same measure. No kitchen measure: by weight. It is a named
  function in core beside 004's; 004 FR-013 stays for conversions.
- **Scaled amounts →** the scaled value with the original small beneath, never struck through. The yield reads
  "≈11" when not whole, with what the original makes.
- **Q3 → whole eggs**, with the weight without shell beside them. The weight comes **only** from the api's egg
  grades (units and densities), never a constant. MA-32's "medium ≈51 g" is illustrative, not a value the engine
  holds. The engine does the rounding; the row's UI waits for its frame.
- **FR-012 →** the note is the drawn sentence. Whether it also says times and temperatures are unchanged is
  pending. The engine carries no ingredient-class rule.
- **FR-014 →** Reset is "Back to original".
- **Q4 → A.** Baking mode is out of 009; 02b is handed on (*Handed on*).
- **Stop 5 (02h) →** the place is drawn, and v1 shows nothing there.

### Pending the owner's follow-up walk (defaults kept, marked pending)

- **Q2 — Bounds, and having more than needed.** Default: the factor is allowed from **0.1× to 10×** (10 % to
  1,000 %), and anything outside is refused in words. In "What I have", having more than the recipe needs
  **scales up** to use it, within the same bound. Alternatives: only ever scale down; other bounds or none.
- **Q5 — Is the scale remembered?** Default: **not stored**; it resets when the recipe closes (FR-015).
  Alternative: remembered per recipe on the device, as Home data that Clear my data resets.
- **The note's second half**: whether FR-012's sentence also says times and temperatures are unchanged.

### Open items (named, not picked)

- **O-1 — A line with no weight in the total dough.** A volume with no verified density, a "to taste" line or an
  unknown amount has no weight to sum (FR-003). Whole eggs have one only through an egg grade. Whether dough weight
  is then refused, sums what it can and says so, or something else, is not picked.
- **O-2 — Which egg grade.** The weight beside whole eggs comes from the api's egg grades. Which grade applies when
  a recipe line does not name one, and whether the weight shown is the scaled exact weight or the rounded whole
  eggs' weight, is not picked.
- **O-3 — A converted amount, then scaled.** If an amount was converted from a volume to a weight through a
  density and is then scaled, whether MA-32's rounding or 004 FR-013 applies is not picked.
- **O-4 — US steps.** `gen_scaling.py` lists its US steps as cups ¼ ⅓ ½ ⅔ ¾, ⅛ tsp and ½ tbsp. 004 FR-013 has cups
  to ⅛ and ⅓, spoons to ¼, and ounces to the eighth. The frames' values are typed into the generator, not
  computed. **Settled** once scaling starts from the exact stored amount (FR-007a): chocolate's "3¾ oz" (120 g ×
  0.9) and honey's "2½ tsp" (20 g × 0.9 = 18 g ≈ 12.7 ml ≈ 2.5 tsp, which fits spoons to ¼). **Open, only the
  step-down:** whether an amount of about 0.85 tbsp reads "¾ tbsp" or steps down to "2½ tsp". It is not picked;
  tests follow the ruling.
- **O-5 — Display precision of the factor and percent.** 02e reads "×0.9 … (89.6%)" for 1000/1116; 02f reads
  "×0.83 … (83%)" for 5/6. Both precisions are drawn, and no rule is picked.
- **O-6 — Units the frames do not draw.** Metric volumes (millilitres), and imperial with the UK or Europe region
  (ounces, fluid ounces, pints, no cups). Their scaled rounding is not picked.
- **O-7 — − and + from a value between steps.** From 89.6 %, whether − and + move to 85 % and 90 % or by 5
  points is not drawn.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every fixture and every mode, each scaled exact amount equals the original × the factor, to
  within a millionth of the amount.
- **SC-002**: The MA-32 fixture scaled to 90 % in Metric reproduces 02c's eight amounts and "≈11" exactly, and
  1,000 g of dough and 100 g of chocolate reproduce 02e's and 02f's factors, percents and yields. The same check
  for 02g's US column waits until design-mobile computes 02g from the stated US rule; today its values are typed.
- **SC-002a — Scaled from the exact, not from the display**: the stored 120 g (displayed "4¼ oz") scaled by 0.9
  reads "3¾ oz" in US units, never "3⅞ oz" (FR-007a). For every fixture, a scaled display equals the rounding of
  the exact stored amount × the factor, and never the rounding of a displayed amount × the factor.
- **SC-003**: Every displayed amount differs from its exact value by no more than one rounding step (FR-008), and
  **no present ingredient ever reads as 0**.
- **SC-004**: In "What I have", **the short ingredient's displayed amount never exceeds** what the baker typed,
  across every fixture and a sweep of amounts.
- **SC-005**: The stored recipe is unchanged after any scaling, checked byte for byte, and "Back to original"
  shows it exactly as written.
- **SC-006**: A preview and a scaled list update as the baker types, with no perceptible delay (under 0.1 s) for
  recipes up to 100 lines, fully offline.
- **SC-007**: A release build contains no dummy recipe (FR-021), checked by test.
- **SC-008**: Every string appears in all seven catalogs (parity test), and no number is separated from its unit
  by a line break.

## Assumptions

- **MA-32 is the design authority** for this spec until it is ported to `docs/DESIGN.md`. Where a frame's value
  and a rule disagree, the discrepancy is an open item (O-4, O-5), not a silent choice.
- **004 is the units source.** Unit definitions, chosen densities, egg grades and the kitchen chart's measures
  (MA-29, in core via #56) come from 004 as it lands. FR-008's scaled rounding is new and lives beside 004's in
  core.
- **The recipe model** is api 013's (portions, NULL ≠ 0 quantities, FID units). Own and imported recipes (008) map
  onto it. The total dough is computed from the lines, and the entered finished weight is not used.
- **A sub-recipe line** is scaled as one amount. Expanding it is a later need.
- **Step amounts** exist in the model (`recipe_step_components.quantity`) and scale like the ingredient list, for
  baking mode's later use.
- **The engine's home** is a shared package that both apps can import: the plan decides where. Constitution XI
  applies if it would be a new top-level package, and core changes are announced (III).
- **No entitlement is decided on the device** (VII).
