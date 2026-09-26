# Feature Specification: Recipe scaling, v1 (F30)

**Feature Branch**: `spec/009-recipe-scaling` (spec directory `specs/009-recipe-scaling/`)

**Created**: 2026-09-26

**Status**: Draft, at **gate 1**. Nothing is planned or built before the coordinator's word.

**Input**: The owner's assignment to Home lane 2, 2026-09-26: "RECIPE SCALING, spec 009 (F30 v1), Home only.
Start now, design first." The ledger entry is F30 in `nutrimero-docs:mobile/FEATURES.md` at `9dc3ebf` (accepted
2026-09-24; percentage added and "start now, for Home only" on 2026-09-26). Constitution 1.2.0 governs.

**Sources, in authority order**:
- `nutrimero-docs/mobile/FEATURES.md` F30 at `9dc3ebf`: the verdict, the discussion log, and the 2026-09-26
  decision log.
- The owner's assignment of 2026-09-26: the v1 modes, the rounding rule, the shared engine, and the design-first
  order.
- `docs/DESIGN.md` (binding), and design-mobile's scaling frames once the owner has walked them. **No approved
  scaling frame exists today.** The concept recipe detail (`nutrimero-design:mobile/home-baker/02-recipe-detail`,
  `14-in-recipe`) draws a yield stepper ("Yield 12 slices … gram amounts below update as you scale"). It is prior
  art for design-mobile, not an authority for this spec.
- Spec 004 (`spec/004-measures-conversion`, at `ff510ff`): the units system, the region, "Amounts in recipes",
  display rounding (FR-013), the kitchen chart's formats (MA-29), the "just this time" rule (FR-029), and unit
  and density data from the api (FR-010, FR-005).
- The api's recipe model (`nutrimero-api` spec 013, `data-model.md`): portions and portion size, an **entered**
  finished weight, and component quantities where NULL means "not known" and 0 means "to taste".

## Scope

**In**:
- **Scaling a recipe by three means**, each giving one **scale factor** applied to every ingredient:
  - **by outcome**: a target number of servings or pieces, or a target finished weight;
  - **by percentage or factor**: for example 90 % or 0.9 of the recipe, or 2×;
  - **by available amount**: "I have 250 g butter"; the factor is the one that uses no more than the baker has.
- **Proportional scaling** of every ingredient amount, and of the per-step amounts where a recipe states them.
- **Rounding to measurable amounts** in the baker's units system and their "Amounts in recipes" preference (004),
  with the exact value always available.
- **A pure, shared scaling engine** with no UI and no device dependency, so that Pro's batch scaling (F17) can
  reuse it later.
- **How v1 is exercised before Home has recipes**: test fixtures and development-only dummy recipes, never
  shipped (FR-020 to FR-022).
- **The scaling UI**, built only from design-mobile's owner-walked frames. The Screen inventory below is that
  lane's input.
- All seven UI languages, in the informal Home register.

**Out**, each named so it is not silently assumed:
- **Kitchenware-bounded scaling** ("max 0.8× for your 24 cm tin"): waits for F09's cupboard with sizes (spec 013).
- **Non-linear baking rules** (yeast, leavening and salt scaling sub-linearly, bake time and temperature
  guidance): these wait for Markus's validated rules tables. v1 is proportional only, and says so (FR-012).
- **Pro's professional batch scaling** (F17: batch multiples of a base batch). Pro is parked; it reuses the
  engine later.
- **A recipe view.** Home has no recipes yet: 003 (the catalog) waits for the api's mobile series, and 008 (own
  recipes and imports) is not built. Scaling mounts on whichever recipe view comes first.
- **Saving a scaled copy** as a new recipe (with own recipes, 008). **Shopping-list quantities** (010) and **PDF
  export** (011) are consumers of the engine, specced there.
- **Pantry quantities.** The pantry stays presence-based (F30's design decision). An available amount is typed at
  scale time and never stored.
- **Expanding a sub-recipe** into its own ingredients. v1 scales a sub-recipe line as one amount.
- **Combined measures** ("1 cup + 2 tbsp"). One unit per amount in v1.
- **Baking mode** (F37's second half). The ledger's delivery order put it next to 009; see Q4.
- Any tier enforcement decided on the device (constitution VII); see Q1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Make it for six instead of twelve (Priority: P1)

A home baker opens a recipe that makes 12 slices, wants 6, and sets the yield to 6. Every amount halves and
reads in measures they can weigh or spoon: "210 g", not "209.5 g"; "¼ tsp", not "0.23 tsp". The recipe itself is
unchanged.

**Why this priority**: This is the outcome mode that F30's verdict made free and table stakes. Scaling to
servings is the most common reason to scale.

**Independent Test**: Scale a fixture recipe with 12 portions to 6. Check that every scaled exact amount is half
the original. Check that every displayed amount is the exact one rounded by FR-008's steps, in the baker's units
system. Check that the stored recipe is byte-identical afterwards.

**Acceptance Scenarios**:

1. **Given** a recipe with 12 portions, **When** the baker sets 6, **Then** the factor is 0.5 and every amount is
   halved before rounding.
2. **Given** a recipe with an entered finished weight of 1,000 g, **When** the baker asks for 750 g, **Then** the
   factor is 0.75.
3. **Given** a recipe with no finished weight entered, **When** the baker scales, **Then** "by finished weight" is
   not offered. The weight is never derived from the ingredient sum (the api records it as entered, not derived).
4. **Given** a recipe with no portions stated, **When** the baker scales, **Then** "by servings" is not offered,
   and percentage and available amount still work.
5. **Given** any scale, **When** the baker resets it, **Then** every amount returns to the recipe as written.

---

### User Story 2 — Bake 90 % of it (Priority: P1)

The baker's tin is a little small, so they scale the whole recipe to 90 %, or to 0.9. They can equally double it
(200 %, 2×) or halve it.

**Why this priority**: The owner added percentage on 2026-09-26. It is the simplest mode, it needs nothing from
the recipe beyond its amounts, and it works on every recipe.

**Independent Test**: Scale a fixture by 90 % and by 0.9. Check that both give the same factor and identical
results. Check that 200 % and 2× also match.

**Acceptance Scenarios**:

1. **Given** any recipe, **When** the baker enters 90 %, **Then** the factor is 0.9, and the result is the same
   as for a factor of 0.9.
2. **Given** a factor outside the allowed range (Q2), **When** the baker enters it, **Then** the app refuses it
   in words and keeps the last valid scale.
3. **Given** a scale is set, **When** the baker switches between percentage and factor, **Then** the scale is
   kept and shown in the other form ("90 %" ↔ "0.9×"), in the locale's number format.

---

### User Story 3 — I only have 250 g of butter (Priority: P2)

The recipe wants 300 g of butter and the baker has 250 g. They say so, and the recipe scales to use at most what
they have, naming butter as the limit. With more than one short ingredient, the scarcest one decides.

**Why this priority**: The mode is valuable, but F30's verdict puts it in Plus (Q1), and it builds on the same
factor as stories 1 and 2.

**Independent Test**: For a fixture that needs 300 g butter and 3 eggs, give 250 g butter. Check that the factor
is 250/300 and butter is named as the limit. Then also give 2 eggs. Check that the smaller of 250/300 and 2/3
decides and that its ingredient is named. In every case, check that no displayed amount of a limited ingredient
exceeds what the baker entered.

**Acceptance Scenarios**:

1. **Given** the recipe needs 300 g butter, **When** the baker enters 250 g, **Then** the factor is 5/6, and
   butter reads "250 g", never more.
2. **Given** limits on several ingredients, **When** the scale is computed, **Then** the factor is the smallest of
   their ratios, and the limiting ingredient is named.
3. **Given** the baker enters the amount in another unit of the same kind (ounces for a recipe in grams),
   **When** the scale is computed, **Then** it converts through 004's unit definitions.
4. **Given** the baker enters a volume for an ingredient the recipe gives by weight (or the reverse), **When** a
   chosen density exists for it (004), **Then** it converts. **Otherwise** the app asks for the amount in the
   recipe's kind of unit and never guesses a density.
5. **Given** the baker has more than the recipe needs, **When** the scale is computed, **Then** see Q2: scaling
   up, or keeping the recipe as written.
6. **Given** an ingredient whose amount is "to taste" or not known, **When** the baker tries to set a limit on it,
   **Then** it is not offered as a limit.

---

### User Story 4 — The amounts read the way I measure (Priority: P1, with stories 1–3)

A metric baker reads grams and millilitres. A US baker reads cups, spoons and ounces. A UK imperial baker reads
ounces, fluid ounces and pints, with no cups. Every scaled amount is shown in the baker's system at a precision
they can measure, and the exact value is always one tap away.

**Why this priority**: Without this, scaling produces numbers nobody can weigh ("0.37 cup"). The owner's rule is
"rounding to measurable amounts in the user's units system".

**Independent Test**: Scale one fixture by 0.9 under each system (Metric, Imperial with the US region, and
Imperial with the UK or Europe region). Check each amount against FR-008's steps, and check that the exact value
travels with it.

**Acceptance Scenarios**:

1. **Given** a metric baker and 1 cup of milk scaled by 0.9, **Then** it reads "225 ml" (millilitres to 1 ml).
2. **Given** a US baker and 1 cup of flour scaled by 0.9, **Then** it reads "⅞ cup", with the exact 0.9 available.
3. **Given** a US baker and 1 tbsp scaled by 0.1, **Then** it reads "¼ tsp" (exact 0.3 tsp). An amount below the
   smallest fraction of its unit (under ¼ tbsp) steps down to the next smaller unit of the same system.
4. **Given** "Exact, by weight" is chosen and a chosen density exists, **Then** a volume amount reads in grams.
   **Without** a density, it stays a volume in the baker's system.
5. **Given** a recipe written in another system, **Then** 004's "just this time" rule applies: the view may show
   the recipe's own system, names the baker's default, returns in one tap, and never writes the Units setting.
6. **Given** a present ingredient whose scaled amount is tiny, **Then** it never reads as "0". It shows finer (one
   decimal under 10 g) or exactly.

---

### Edge Cases

- **"To taste" (quantity 0) and unknown quantities (NULL)** are shown unchanged and never scaled. A 0 stays "to
  taste" and never becomes "0 g".
- **Discrete pieces** (eggs, and anything counted in pieces): 1.8 eggs is not measurable as written; see Q3.
- **Portions after a percentage or an available-amount scale** are fractional (8 × 0.9 = 7.2). The yield reads
  with one decimal, or as "about 7", as design-mobile draws it. The portion size stays the same (FR-005).
- **Temperatures and times are never scaled.** v1 says in words that they are unchanged (FR-012).
- **A sub-recipe line** scales as one amount, like any other line.
- **Steps that state their own amounts** scale by the same factor, and are rounded with the same rules as the
  ingredient list.
- **Rounding direction**: amounts round to the nearest step, except that a limiting ingredient in the
  available-amount mode never rounds up past what the baker has (FR-009).
- **Scaling twice** (0.5 then 2) returns the recipe as written. Factors compose, and rounding is only ever applied
  to the display of an exact value, never fed back in.
- **Very small or very large factors**: see Q2.
- **Mixed units within one recipe** (grams and cups): each line keeps its own kind (mass, volume, pieces) unless
  "Exact, by weight" and a chosen density turn a volume into grams.
- **Clear my data** needs nothing new: no scale is stored (FR-015).

## Requirements *(mandatory)*

### Functional Requirements

**The factor**

- **FR-001**: Every mode MUST reduce to one **scale factor**: a positive number applied to every scalable amount.
  The engine keeps the factor exact (for example 5/6, not 0.8333) as far as the arithmetic allows. It never rounds
  the factor itself.
- **FR-002 — By servings**: factor = target portions ÷ the recipe's portions. It is offered only when the recipe
  states portions. The target is a whole number from 1 upwards.
- **FR-003 — By finished weight**: factor = target weight ÷ the recipe's **entered** finished weight. It is offered
  only when that weight is entered, and the weight is never derived. The target may be typed in any mass unit of
  the baker's system.
- **FR-004 — By percentage or factor**: "90 %" and "0.9" are the same scale. Both forms accept the locale's decimal
  separator and a point, through 004's amount parser. Bounds: see Q2 [NEEDS CLARIFICATION: Q2].
- **FR-005 — The yield**: a scaled recipe's portions MUST read as portions × factor, with the same portion size.
  "Makes 12 slices" at 0.5 makes 6 slices of the same size, never 12 smaller ones.
- **FR-006 — By available amount**: the baker names one or more ingredients and the amount they have of each.
  Factor = the smallest of available ÷ required, and the result names the limiting ingredient.
  - The available amount converts to the recipe's unit through 004's unit definitions.
  - It converts across mass and volume only with 004's chosen density; with no density, the app asks for an
    amount in the recipe's kind of unit.
  - A "to taste" or unknown line cannot be a limit.
  - When every ratio is above 1: see Q2.
  - Tier: see Q1 [NEEDS CLARIFICATION: Q1].

**Amounts**

- **FR-007**: Every scalable amount MUST be scaled as its exact quantity × factor. This covers the ingredient list
  and the per-step amounts. "To taste" (0) and unknown (NULL) lines pass through unchanged and are marked as not
  scaled.
- **FR-008 — Measurable amounts**: each scaled amount MUST be shown in the baker's units system and "Amounts in
  recipes" preference (004 FR-028, MA-29), rounded with 004's display rules and never with rules of its own:
  - grams: to 1 g below 100 g, and to 5 g from 100 g (004 FR-013). Below 10 g, one decimal (the kitchen chart's
    `gramsFine`, MA-29), so a scaled 3.4 g of yeast is not shown as 3 g;
  - millilitres: to 1 ml;
  - cups: to ⅛ and ⅓; spoons: to ¼. Spoons are 5 and 15 ml in every system;
  - ounces: to the eighth; fluid ounces and pints: to two decimals;
  - **pieces**: see Q3 [NEEDS CLARIFICATION: Q3].
  - Below the smallest fraction of its unit, an amount steps down the same system's ladder (cup → tbsp → tsp;
    pound → ounce). Units never combine, and a scaled amount never steps up to a larger unit it did not start
    in, except that ounces from 16 upwards read as pounds and ounces (the kitchen chart's format).
  - A present amount never reads as 0. What the smallest step cannot show is shown exactly.
- **FR-009 — Never more than the baker has**: in the available-amount mode, the limiting ingredient's displayed
  amount MUST NOT exceed the amount entered. When nearest rounding would exceed it, that line rounds down.
- **FR-010 — The exact value**: every rounded amount MUST carry its exact scaled value, and the UI offers it (004
  FR-013). A screen reader speaks amounts as quantities, never glyphs (004 FR-021).
- **FR-011 — Units and densities from the api**: conversions MUST use 004's snapshot of the api's unit definitions
  and chosen densities. The engine holds no unit constant and no density, and never borrows a density from a
  similar ingredient.
- **FR-012 — Honest about v1**: a scaled recipe MUST say in words, once per recipe view, that amounts are scaled in
  proportion and that times and temperatures are unchanged. The engine carries no ingredient-class rule (yeast,
  salt, leavening). Those wait for Markus's validated tables, which will be tested data, never LLM-derived.

**Behaviour**

- **FR-013 — The recipe is untouched**: scaling MUST never change the stored recipe. It is a view of it.
- **FR-014 — Reset**: one action MUST return to the recipe as written.
- **FR-015 — Not stored**: the scale lasts while the recipe view is open and is not stored (Q5 records the
  alternative). This follows 004 FR-029: a per-recipe, temporary change that never writes a setting.
- **FR-016 — Instant and offline**: results MUST update as the baker types, need no network, and make no api call.

**The engine**

- **FR-017**: The engine MUST be a pure, shared module with no UI, no storage and no device access.
  - **Input**: a recipe's portions, portion size, finished weight, and lines (quantity, unit, optional FID id,
    optional sub-recipe), plus a mode and its target.
  - **Output**: the factor, the limiting line if any, and for each line its exact amount, its measurable display
    amount and unit, and whether it was scaled.
  - Pro's F17 reuses it unchanged.
- **FR-018**: The engine's input MUST follow the platform's recipe model (api 013 / `.rex`): `portions`,
  `portion_size` + `portion_unit_id`, `finished_weight`, and components with `quantity` (NULL ≠ 0) and `unit_id`
  from FID's unit catalogue. It invents no field that recipe will not carry. Own and imported recipes (008) map
  onto the same input.
- **FR-019**: Number formatting, parsing, fractions and unit arithmetic MUST go through the core package's shared
  functions (004 FR-011, constitution IX). Any function the engine needs that core lacks is added to core and
  announced (constitution III).

**Before recipes exist: how v1 is exercised**

- **FR-020 — Test fixtures**: the engine is tested against fixture recipes in the test suite. They are shaped like
  the api's recipe model and cover every case above: portions, a finished weight, grams, cups and spoons,
  pieces, "to taste", unknown, a sub-recipe line, step amounts, and each units system. Fixtures live beside the
  tests and are never imported by app code.
- **FR-021 — Development dummies, never shipped**: until 003 or 008 gives Home real recipes, the scaling UI (once
  its frames are approved) runs in development builds only, on **dummy recipes**. This is the allowance already
  made for 003 (`FEATURES.md`, F38 constraints). The dummies:
  - are labelled as development data;
  - name ingredients by FID id, with invented plain amounts;
  - make no nutrition or allergen statement (constitution IV);
  - are not content. A release build contains no dummy recipe and no way to reach one, and a test checks the
    release bundle for their names.
- **FR-022 — The seam**: when a real recipe view lands (003 or 008), it passes its recipe to the same engine
  input, and the dummies are deleted. Nothing in the engine knows where a recipe came from.

**Language and accessibility**

- **FR-023**: Every user-facing string MUST be in the seven catalogs, in Home's informal register. Percentages
  and factors use the locale's number format. A number and its unit never wrap apart (U+00A0; the owner's rule,
  2026-09-25). Fractional amounts are numbers and never pluralised (004 FR-015).
- **FR-024**: Every scaling control MUST meet DESIGN.md's target, contrast and label rules (constitution X). The
  factor and each changed amount are announced when they change, without reading the whole list again.

### Key Entities

- **Scalable recipe** (the engine's input): portions (optional), portion size and unit (optional), finished
  weight (optional, entered), and ordered lines.
- **Line**: a quantity (a number; 0 = to taste; absent = not known), a unit from FID's unit catalogue, optionally
  an FID ingredient id (for densities), and optionally a sub-recipe reference. Step amounts are lines tied to a
  step.
- **Scale request**: one mode (servings, finished weight, factor/percentage, available amounts) and its target.
  For available amounts, a list of (line, amount, unit).
- **Scale result**: the factor, the limiting line (available mode), the scaled yield, and per line the exact
  scaled quantity, the measurable display (amount, unit, rounding step), and a scaled/unchanged flag.
- **Units context**: the baker's system, region and "Amounts in recipes" preference (004), plus 004's unit
  definitions and chosen densities. It is read-only to the engine.

## Screen inventory (input for the design-mobile lane)

design-mobile draws these with impeccable for an owner walk. Nothing is built before the walk.

1. **The scaler on a recipe**: the current scale, and the way into the modes. The concept recipe detail's yield
   stepper is prior art.
2. **Mode: by servings / by finished weight**: a target, and which of the two the recipe allows.
3. **Mode: percentage or factor**: entry, quick picks (for example ½, 90 %, 2×) if the design wants them, and the
   out-of-range refusal in words.
4. **Mode: available amount**: choosing the ingredient(s), entering "what I have", the named limit, and the
   "which unit?" ask when no density exists.
5. **The scaled ingredient list**: the rounded amounts, the exact value on request, and "to taste" and unknown
   lines marked as unchanged.
6. **The v1 honesty note** (FR-012), and **Reset**.
7. **Pieces** (eggs), as Q3 rules.
8. **The Plus boundary** for the available-amount mode, if Q1 keeps it in Plus.

## Clarifications

### Questions carried to gate 1

**Q1 — Which modes are free in v1, and what does Home do before entitlements exist?**
F30's verdict (2026-09-24): outcome scaling is free; the available-amount mode is Plus. The percentage mode
(2026-09-26) has no tier yet. Constitution VII says the client renders entitlement state and never decides it,
and the api's entitlements service has not reached the mobile series.
Default **(A)**:
- servings, finished weight and percentage are free;
- the available-amount mode is Plus, and its **UI waits for the entitlements service**;
- the engine builds and tests all three now.

Alternatives:
- (B) All three free in v1, and the tier boundary comes with entitlements. This is simpler, but it moves a
  verdict.
- (C) Percentage is also Plus.

**Q2 — Bounds on the factor, and scaling up in the available-amount mode.**
Default **(A)**:
- the factor is allowed from **0.1× to 10×** (10 % to 1,000 %), and anything outside is refused in words.
  Proportional math far from 1× is exactly where the missing non-linear rules matter most;
- in the available-amount mode, having **more** than the recipe needs **scales up** to use it, within the same
  bound, and says so ("uses all 400 g of your butter: 1.33×").

Alternatives:
- (B) Available amount only ever scales **down**. With more than enough, the recipe stays as written.
- (C) Other bounds (for example 0.25× to 4×), or none.

**Q3 — Discrete pieces (eggs).**
Scaling 2 eggs by 0.9 gives 1.8 eggs. 004 FR-007a allows no egg weight until the api defines grades, so a weight
alternative is not available yet.
Default **(A)**: round pieces to the **nearest half** (a half egg can be beaten and halved), never to zero, and
show the exact value ("2 eggs · exact 1.8"). Once verified egg weights exist, also offer the weight.
Alternatives:
- (B) Nearest **whole** piece, never zero, with the exact value shown.
- (C) Whole pieces, plus a suggestion to adjust the scale so the pieces come out whole ("1.0× uses 2 whole eggs").

**Q4 — Baking mode.** The ledger's delivery order lists "F30 outcome mode, F37 baking mode" together as 009.
Default **(A)**: baking mode is **out** of 009. It needs a recipe view with steps, which Home does not have, and it
gets its own spec when 003 or 008 lands.
Alternative:
- (B) Keep it in 009 as a later phase, specified now.

**Q5 — Is the scale remembered?**
Default **(A)**: not stored; it resets when the recipe closes (FR-015), like 004's "just this time".
Alternative:
- (B) Remembered per recipe on the device, as Home data that Clear my data resets. This is more convenient for a
  baker who always halves, but it is one more stored preference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every fixture and every mode, each scaled exact amount equals the original × the factor, to
  within a millionth of the amount.
- **SC-002**: Every displayed amount differs from its exact value by no more than one rounding step of its unit
  (FR-008), and **no present ingredient ever reads as 0**.
- **SC-003**: In the available-amount mode, **no limited ingredient's displayed amount exceeds** what the baker
  entered, across every fixture and a sweep of available amounts.
- **SC-004**: Scaling by f and then by 1/f displays the recipe exactly as written, for every f in Q2's range on
  the fixture set.
- **SC-005**: The stored recipe is unchanged after any scaling, checked byte for byte.
- **SC-006**: A scale updates the whole list as the baker types, with no perceptible delay (under 0.1 s) for
  recipes up to 100 lines, fully offline.
- **SC-007**: A release build contains no dummy recipe (FR-021), checked by test.
- **SC-008**: Every string appears in all seven catalogs (parity test), and no number is separated from its unit
  by a line break.

## Assumptions

- **004 is the units and rounding source.** Where 004's display rounding, the kitchen chart's formats (MA-29,
  `gramsFine`, ounces to the eighth, in core via #56) or its unit data are not yet on main, the engine waits for
  them or uses exactly what lands. It adds no rounding rule of its own.
- **The recipe model** is api 013's (portions, an entered finished weight, NULL ≠ 0 quantities, FID units). Own
  and imported recipes (008) map onto it.
- **A sub-recipe line** is scaled as one amount. Expanding it is a later need.
- **Step amounts** exist in the model (`recipe_step_components.quantity`) and scale like the ingredient list.
- **The engine's home** is a shared package that both apps can import: the plan decides where. Constitution XI
  applies if it would be a new top-level package, and core changes are announced (III).
- **No entitlement is decided on the device** (VII); Q1 decides what v1 shows.
- **The concept recipe detail's yield stepper** is not an approved frame; design-mobile decides whether to keep it.
