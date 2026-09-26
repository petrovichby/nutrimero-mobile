# Feature Specification: Recipe scaling, v1 (F30)

**Feature Branch**: `spec/009-recipe-scaling` (spec directory `specs/009-recipe-scaling/`)

**Created**: 2026-09-26

**Status**: **Gate 1 passed** (the coordinator, 2026-09-26), then **parked** (the coordinator, 2026-09-26): the
owner decides later which lane builds it, and when. No plan and no tasks exist. The spec is aligned to the
owner-walked design, MA-32, including its walk amendment of 2026-09-26, which rules every item the gate left
pending or open. One point stays open (O-1). Rulings are in *Clarifications*.

**Input**: The owner's assignment to Home lane 2, 2026-09-26: "RECIPE SCALING, spec 009 (F30 v1), Home only.
Start now, design first." The ledger entry is F30 in `nutrimero-docs:mobile/FEATURES.md` at `9dc3ebf` (accepted
2026-09-24; percentage added and "start now, for Home only" on 2026-09-26). Constitution 1.2.0 governs.

**Sources, in authority order**:
- **MA-32, "Recipe scaling, v1"**, with its "Amendment 2026-09-26" walk section (`nutrimero-design:mobile/
  AMENDMENTS.md`, design `main` at `6dcd2da2`), walked and ruled by the owner on 2026-09-26, and its frames
  (*Screen inventory*). They are built by `mobile/home-baker/_gen/f30/gen_scaling.py`, `gen_scaling_details.py`
  and `us_rounding.py`. Until it is ported, MA-32 is the binding design record for this spec, beside
  `docs/DESIGN.md`. Where a frame's text and a stated rule disagree, **the rule wins** and the tests follow the
  rule (the coordinator, 2026-09-26).
- The coordinator's rulings of 2026-09-26, relaying the owner (*Clarifications*).
- `nutrimero-docs/mobile/FEATURES.md` F30 at `9dc3ebf`: the verdict, the discussion log, and the 2026-09-26
  decision log.
- Spec 004 (`spec/004-measures-conversion`, at `ff510ff`): the units system and region, the kitchen chart's
  measures (F23, MA-29), the "just this time" rule (FR-029), and unit, density and egg-grade data from the api
  (FR-005, FR-007a, FR-010). 004's display rounding (FR-013) stays the rule for **conversions**. Scaled amounts
  round by MA-32 (FR-008 here), whose US steps are 004 FR-013's.
- The api's recipe model (`nutrimero-api` spec 013, `data-model.md`): portions and portion size, component
  quantities where NULL means "not known" and 0 means "to taste", and units from FID's catalogue.

## Scope

**In**:
- **Scaling a recipe three ways**, each giving one **scale factor** applied to every ingredient:
  - **Percent**: − and + snapping to 5 % steps, a typed value, or quick chips, from 10 % to 1,000 % (FR-004).
    Free.
  - **Yield**: a number of slices (the recipe's pieces), or a total **dough weight** (FR-002, FR-003). Free.
  - **What I have**: the one ingredient that is short, and how much of it the baker has (FR-006). Plus; its UI
    waits for the Plus boundary to be drawn.
- **Proportional scaling** of every ingredient amount, and of the per-step amounts where a recipe states them,
  always from the exact stored amount (FR-007a).
- **Rounding to what a baker can weigh or measure** (FR-008) in Metric, US and UK imperial, with eggs in kitchen
  quarters.
- **Scaled amounts shown with the original beneath** ("378 g · was 420 g"), and the scaled yield ("≈11", "<1").
- **The last scale, offered again**: stored per recipe on the device as Home data (FR-015).
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
- **Combined measures** ("1 cup + 2 tbsp"). One unit per amount in v1. A dough-weight target and total in US and
  UK units read in pounds and ounces (FR-003), which is a weight, not an ingredient amount.
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
to 1,000 g of dough. Check the factors (0.5 and 1000/1116), that every exact amount is the stored amount × the
factor, that every display follows FR-008, and that the stored recipe is byte-identical afterwards.

**Acceptance Scenarios**:

1. **Given** a recipe with 12 portions, **When** the baker sets 6, **Then** the factor is 0.5 and every amount is
   halved before rounding.
2. **Given** a recipe whose ingredients weigh 1,116 g in total, **When** the baker asks for 1,000 g of dough,
   **Then** the factor is 1000/1116 and the sheet says "That's ×0.896 of the recipe (89.6%). The original makes
   1,116 g." (02e).
3. **Given** a recipe with a line that has no weight (for example flaky salt "to taste"), **When** the baker
   scales by dough weight, **Then** the total counts only what has a weight and says what isn't counted: "Counted:
   1,116 g. Not counted: flaky salt for the top (to taste), which stays as written." (02e-scale-yield-not-counted).
4. **Given** US units, **When** the baker scales by dough weight, **Then** the target is typed as pounds and
   ounces, each in its own field ("2 lb", "3 oz"), and the original reads "2 lb 7⅜ oz" (02e-scale-yield-us).
5. **Given** a recipe with no portions stated, **When** the baker opens the sheet, **Then** "Slices" is not
   offered, and dough weight, percent and what I have still work.
6. **Given** any scale, **When** the baker taps **Back to original**, **Then** every amount and the yield return to
   the recipe as written.

---

### User Story 2 — Bake 90 % of it (Priority: P1)

The baker's tin is a little small, so they scale the whole recipe to 90 %. They can equally double it or halve it.

**Why this priority**: The owner added percent on 2026-09-26 and ruled it free on the walk. It needs nothing from
the recipe beyond its amounts, and it works on every recipe.

**Independent Test**: Scale a fixture to 90 % by the chip, by − from 95 %, and by typing 90. Check that all three
give the factor 0.9 and identical results, that the preview shows the scaled yield and dough weight before "Scale
to 90%", and that 1,500 % is refused.

**Acceptance Scenarios**:

1. **Given** any recipe, **When** the baker taps the 90 % chip, **Then** the value reads "90%" with "×0.9" beneath
   it, the chip is marked as chosen, and the preview reads "Yield ≈11 slices (12) · Dough 1,004 g (1,116 g)" (02d).
2. **Given** 90 %, **When** the baker taps +, **Then** it reads 95 %; **When** they tap −, **Then** 85 %.
3. **Given** 89.6 % (set by a dough weight), **When** the baker taps − or +, **Then** it snaps to 85 % or 90 %
   (02d-scale-percent-between).
4. **Given** a typed 1,500 %, **Then** the value stays, one sentence says why ("1,500% is more than a recipe scales
   to here. Pick 10% to 1,000%, or bake it in batches."), and "Scale to 1,500%" is off (02d-scale-percent-refused).
5. **Given** the preview, **When** the baker taps "Scale to 90%", **Then** the recipe shows scaled (02c). Nothing
   changes on the recipe before that tap.

---

### User Story 3 — I only have 100 g of chocolate (Priority: P2)

The recipe wants 120 g of dark chocolate and the baker has 100 g. They pick the short ingredient, type what they
have, and the recipe scales to use it: "The recipe needs 120 g, so you can bake ×0.833 of it (83.3%): about 10
slices." (02f).

**Why this priority**: The mode is valuable, but F30's verdict puts it in Plus, and its UI waits for the Plus
boundary to be drawn. The engine builds it now.

**Independent Test**: For a fixture that needs 120 g chocolate, give 100 g. Check that the factor is 100/120, that
the chocolate line never reads more than 100 g, and that the result sentence names the need, the factor, the
percent and the yield. Give 200 g and check the "more than enough" answer and its ×1.667 alternative. Sweep
available amounts and check that the short line never exceeds what was typed.

**Acceptance Scenarios**:

1. **Given** the recipe needs 120 g chocolate, **When** the baker picks it and types 100 g, **Then** the factor is
   5/6 and chocolate reads "100 g", never more.
2. **Given** the sheet, **When** the baker picks an ingredient, **Then** exactly one is chosen at a time ("Which
   ingredient is short?").
3. **Given** a line that is "to taste", "as needed" or not known, **Then** it is not offered as the short
   ingredient.
4. **Given** the line is shown in ounces (a US baker), **When** the baker types ounces, **Then** the amount converts
   to the recipe's unit through 004's unit definitions. It never converts between weight and volume here.
5. **Given** the baker has 200 g, more than the 120 g needed, **Then** the sheet says "You have more than enough:
   the recipe needs 120 g of your 200 g.", keeps the recipe as the main answer ("Keep the recipe as it is"), and
   offers "Scale up to use all 200 g (×1.667)" as a second button (02f-scale-what-i-have-more).

---

### User Story 4 — The amounts read the way I weigh and measure (Priority: P1, with stories 1–3)

A metric baker reads grams rounded to what a kitchen scale shows, and millilitres to 1 ml. A US baker reads cups,
spoons and ounces. A UK baker reads ounces, fluid ounces and teaspoons, with no cups. Eggs may be fractional, in
kitchen quarters. Every scaled amount shows its original small beneath it.

**Why this priority**: Without it, scaling produces numbers nobody can weigh ("377.6 g", "0.37 cup").

**Independent Test**: Scale the MA-32 fixture (02's eight ingredients) by 0.9 in Metric, US and UK imperial, and
the Butterzopf fixture (02i) in Metric and US. Check every amount against FR-008's rules, scaled from the exact
stored amounts (FR-007a). 02c, 02g and 02m are computed from those rules, so they are tests too; 02i's egg lines
are still being computed, so eggs are tested against the rule, not the frame text.

**Acceptance Scenarios**:

1. **Given** Metric and a scale of 0.9, **Then** 420 g reads "378 g · was 420 g", 11 g reads "10 g · was 11 g",
   and 25 g reads "23 g · was 25 g" (02c); 250 ml of milk reads "225 ml · was 250 ml" (02i).
2. **Given** a scaled amount under 10 g, **Then** it reads to the half gram ("3.5 g"); above 1 kg, to 5 g
   ("1,255 g").
3. **Given** US units and a scale of 0.9, **Then** flour reads "3 cups · was 3⅜ cups", and cocoa, 22.5 g, below
   ¼ cup, steps down: "3½ tbsp · was ¼ cup" (02g).
4. **Given** US units and an amount below 1 tbsp, **Then** it reads in teaspoons ("2½ tsp"), never "¾ tbsp".
5. **Given** US units and an ingredient with no volume measure, **Then** it reads by weight in ounces ("3¾ oz ·
   was 4¼ oz", 02g).
6. **Given** UK imperial, **Then** weights read in ounces to the eighth, fluid ounces to the quarter, small amounts
   in 5 ml teaspoons, and there are no cups ("13⅜ oz", "11 fl oz", "2½ tsp", 02m).
7. **Given** 2 eggs scaled by 0.9 in the EU, **Then** the row reads "1¾ eggs · was 2", with "exactly 1.8 · or weigh
   92 g beaten" beneath, the weight from the api's medium grade. In the US it reads "1¾ large eggs" and the beaten
   weight in ounces (02i, 02i-us).
8. **Given** a "to taste" or "as needed" line, **Then** it keeps its words, with "not scaled" beneath (02i).
9. **Given** a present ingredient, **Then** its scaled amount never reads as "0".

---

### User Story 5 — Last time I made 90 % (Priority: P2)

A baker who always halves a recipe opens it again. It opens as written, with "Last time: 90% · Scale to 90%
again" (02l). One tap scales it; ignoring it leaves the recipe as written.

**Why this priority**: The owner flipped Q5 on the walk: the last scale is remembered and offered, not applied.

**Independent Test**: Scale a dummy recipe to 90 %, close it, and reopen it. Check that it opens as written with the
offer, that the offer's tap scales to 90 %, and that Clear my data removes the stored scale so the offer is gone.

**Acceptance Scenarios**:

1. **Given** a recipe last scaled to 90 %, **When** it opens, **Then** it shows as written, with "Last time: 90% ·
   Scale to 90% again".
2. **Given** the offer, **When** the baker taps it, **Then** the recipe scales to 90 % (02c).
3. **Given** a stored last scale, **When** the baker runs Clear my data, **Then** the stored scale is gone and the
   recipe opens with no offer.

---

### Edge Cases

- **"To taste" (quantity 0), "as needed", and unknown quantities (NULL)** are never scaled. They keep their words,
  with "not scaled" beneath, and never become "0 g".
- **The yield after a percent, dough-weight or what-I-have scale** is rarely whole (12 × 0.9 = 10.8). It reads
  "≈11" and says what the original makes (FR-005). The portion size stays the same.
- **A yield below one piece** reads "<1", and the note gives the dough weight: "10% makes less than one slice:
  about 100 g of dough." (02j). The frame's "a single small bun" has no data source yet (O-1).
- **Temperatures and times are never scaled**, and the note says so ("Times and temperatures stay as written.").
- **A sub-recipe line** scales as one amount, like any other line.
- **Steps that state their own amounts** scale by the same factor, with the same rounding as the ingredient list.
- **Rounding direction**: amounts round to the nearest step, halves up (22.5 g reads "23 g", 02c). The short
  ingredient in "What I have" never rounds up past what the baker typed (FR-009).
- **Scaling twice** (50 % then back to 100 %) shows the recipe as written. Rounding is only ever applied to the
  display of an exact value, never fed back in (FR-007a).
- **Mixed units within one recipe** (grams and cups): each line keeps its own kind (mass, volume, pieces) and its
  own rounding.
- **An amount converted from a volume through a density, then scaled**, takes MA-32's rounding (FR-008).
- **A region with no egg grades** (004: BY, UA, or no region reported): eggs still scale in quarters, and no
  beaten weight is shown, because the weight comes only from an egg grade (FR-011).
- **Clear my data** removes every stored last scale (FR-015).

## Requirements *(mandatory)*

### Functional Requirements

**The factor**

- **FR-001**: Every mode MUST reduce to one **scale factor**: a positive number applied to every scalable amount.
  The engine keeps the factor exact (for example 5/6, not 0.8333) as far as the arithmetic allows, and never
  rounds it. Only its display rounds (FR-004a).
- **FR-001a — Limits**: the factor MUST be from **0.1 to 10** (10 % to 1,000 %). A target outside the range, in
  any mode, is refused: the value stays, one sentence says why, and the "Scale to …" button is off
  (02d-scale-percent-refused).
- **FR-002 — By slices**: factor = target slices ÷ the recipe's portions. It is offered only when the recipe states
  portions. The target is a whole number from 1 upwards. The Yield stepper on the recipe detail (02) sets it
  directly; the sheet's Yield tab offers it as "Slices" (02e).
- **FR-003 — By dough weight**: factor = the target ÷ the recipe's **total dough**, the sum of the weights of its
  lines that have one ("The original makes 1,116 g", 02e). It is **not** the recipe's entered finished weight.
  - A line has a weight when its amount is a mass, a volume with a chosen density (004), or pieces with an egg
    grade or a verified piece weight (004 FR-007a).
  - A line without a weight ("to taste", "as needed", unknown, a volume with no density, pieces with no weight) is
    **not counted**, the sheet says what isn't counted, and that line stays as written
    (02e-scale-yield-not-counted).
  - The target is typed in grams in Metric, and in pounds and ounces, each in its own field, in US and UK
    imperial (02e-scale-yield-us). The original total reads the same way ("2 lb 7⅜ oz").
- **FR-004 — By percent**: the value is a percent of the recipe, shown with its factor beneath ("90%", "×0.9").
  - − and + move by **5 % steps**, and from a value between steps they **snap** to the neighbouring step (89.6 %
    → 85 % or 90 %);
  - the value can be typed; the readout is underlined as a field;
  - chips at **50, 75, 90, 100, 125, 150 and 200 %** set it, and the chip matching the value reads as chosen;
  - the Percent tab previews the yield and the dough weight (02d-scale-percent-between).
  - Typing accepts the locale's decimal separator and a point, through 004's amount parser.
- **FR-004a — Precision**: the factor MUST read to **three decimals** and the percent to **one**, both trimmed:
  "×0.9 · 90%", "×0.896 (89.6%)", "×0.833 (83.3%)".
- **FR-005 — The yield**: a scaled recipe's portions MUST read as portions × factor, with the same portion size.
  A whole result reads as the number; otherwise "≈" and the nearest whole number ("≈11"); below one piece, "<1"
  with the piece named in the singular (02j). The recipe says what the original makes ("The original makes 12.").
  The sheet's previews read the same way ("≈11 slices (12)").
- **FR-006 — What I have**: the baker picks **one** ingredient, the short one ("Which ingredient is short?"), and
  types how much they have ("How much do you have?"). Factor = available ÷ required.
  - The amount is typed in the unit the line is shown in, and converts to the recipe's unit through 004's unit
    definitions. It never crosses weight and volume.
  - A "to taste", "as needed" or unknown line is not offered.
  - Short: the result names the need, the factor, the percent and the yield: "The recipe needs 120 g, so you can
    bake ×0.833 of it (83.3%): about 10 slices." (02f).
  - **More than needed**: the sheet says "You have more than enough: the recipe needs 120 g of your 200 g.", keeps
    the recipe as the main answer ("Keep the recipe as it is"), and offers "Scale up to use all 200 g (×1.667)"
    as a second button (02f-scale-what-i-have-more). The scale-up obeys FR-001a.
  - Tier: **Plus** (F30). The Plus boundary is not drawn, so this tab's UI waits (constitution VII: the client
    renders entitlement state and never decides it). The engine builds the mode now.
- **FR-006a — Preview, then apply**: each tab MUST show a preview (the scaled yield and dough weight, each with
  the original) that updates as the baker types, before the "Scale to …" button ("Scale to 90%", "Scale to 1,000 g
  of dough", "Scale to what I have"). The recipe changes only on that tap.

**Amounts**

- **FR-007**: Every scalable amount MUST be scaled as its exact quantity × factor. This covers the ingredient list
  and the per-step amounts. "To taste" (0), "as needed" and unknown (NULL) lines pass through unchanged and are
  marked as not scaled.
- **FR-007a — From the exact, never from the display** (the coordinator, 2026-09-26): scaling MUST always start
  from the **exact stored amount**, never from a displayed or rounded value. The stored 120 g reads "4¼ oz" in US
  units (4.233 oz exact); × 0.9 is 108 g = 3.810 oz, which rounds to the eighth as "3¾ oz", not the 3⅞ that
  4¼ × 0.9 = 3.825 would give. Likewise honey, stored as 20 g: × 0.9 is 18 g, which through honey's density from
  the api is ≈12.7 ml ≈ 2½ tsp, never 1 tbsp × 0.9.
- **FR-008 — Rounding a scaled amount (MA-32)**: each scaled amount MUST be rounded to what the baker can weigh or
  measure, in their units system and region (004). Halves round up.
  - **Metric**: grams to **0.5 g under 10 g**, to **1 g up to 1 kg**, and to **5 g above**; millilitres to
    **1 ml**.
  - **US**: 004 FR-013's steps: cups to ⅛ and ⅓, spoons to ¼, ounces to ⅛. An amount reads in **cups from ¼
    cup**, in **tablespoons from 1 tbsp**, and otherwise in **teaspoons**; there is never a "¾ tbsp". An
    ingredient with **no volume measure** reads by weight in ounces. The unit follows the scaled amount, so
    "¼ cup" scaled by 0.9 reads "3½ tbsp" (02g, computed by `us_rounding.py`).
  - **UK imperial**: ounces to ⅛, fluid ounces to ¼, 5 ml teaspoons, and **no cups** (02m).
  - **Eggs**: in **kitchen quarters** ("1¾ eggs"; US "1¾ large eggs"), with "exactly 1.8 · or weigh 92 g beaten"
    beneath (US: the beaten weight in ounces). The grade follows the region when the recipe names none: **medium
    in the EU and UK, large in the US**. The weight comes only from the api's egg grades (FR-011); the frames'
    51 g and 50 g are illustrative. With no grade, the row shows no weight.
  - **An amount converted from a volume through a density, then scaled**, takes these rules, not 004 FR-013.
  - A number and its unit stay bound (U+00A0, MA-29). A present amount never reads as 0.
  - This is a **named function in core**, beside 004's display rounding. 004 FR-013 stays the rule for
    conversions, and scaling does not change it.
- **FR-009 — Never more than the baker has**: in "What I have", the short ingredient's displayed amount MUST NOT
  exceed the amount typed. When nearest rounding would exceed it, that line rounds down.
- **FR-010 — Scaled, with the original**: every scaled amount MUST show the scaled value, with the original small
  beneath it ("378 g · was 420 g"), **never struck through**. The original reads in the same units system. The
  engine also carries the exact scaled value for its consumers. MA-32 draws no exact-value view beyond the egg
  row's "exactly 1.8", so v1 shows none elsewhere. A screen reader speaks amounts as quantities, never glyphs (004
  FR-021).
- **FR-010a — Lines that are not scaled**: a "to taste", "as needed" or unknown line MUST keep its words, with
  "not scaled" beneath (02i).
- **FR-011 — Units, densities and egg grades from the api**: conversions and egg weights MUST use 004's snapshot
  of the api's unit definitions, chosen densities and egg grades. The engine holds no unit constant, no density
  and no egg weight, and never borrows a density from a similar ingredient.
- **FR-012 — Honest about v1**: a scaled recipe MUST show the drawn note under the yield: "Amounts below are 90% of
  the recipe, rounded to what you can weigh. The original makes 12. Times and temperatures stay as written." It
  reads "…what you can measure…" in US units (02g) and "…what you can weigh and measure…" in UK imperial (02m).
  Below one piece it reads "10% makes less than one slice: about 100 g of dough. The original makes 8. Times and
  temperatures stay as written." (02j, without the open part, O-1). The engine carries **no ingredient-class
  rule** (yeast, salt, leavening). Those wait for Markus's validated tables, which will be tested data, never
  LLM-derived.
- **FR-012a — The non-linear place, empty in v1**: MA-32 draws a place inside an ingredient's row for "Doesn't
  scale in a straight line · Why?" (02h). v1 MUST show **nothing** there. Its wording and what "Why?" opens are
  placeholders until Markus's rules exist, so no string for it enters the catalogs in v1.

**Behaviour**

- **FR-013 — The recipe is untouched**: scaling MUST never change the stored recipe. It is a view of it.
- **FR-014 — Back to original**: one action, **"Back to original"**, MUST return the recipe to as written.
- **FR-014a — The scaled state (02c)**: a scaled recipe's Yield card MUST read as scaled: gold-edged, with a
  "×0.9" badge, "90% of the recipe" and "Back to original", the yield stepper showing the scaled yield, the
  FR-012 note, and "Scale another way", which reopens the sheet. Unscaled, the card keeps 02's line, "Scale by
  percent, dough weight or what you have".
- **FR-015 — The last scale, offered** (Q5, flipped on the walk): the last scale applied to a recipe MUST be kept
  per recipe on the device, as **Home data** that **Clear my data resets**. The recipe always opens **as written**;
  when a last scale is kept, the card offers it: "Last time: 90% · Scale to 90% again" (02l). The factor is what is
  kept; nothing about the mode or the baker's typed amount is. Nothing is sent anywhere (constitution VI).
- **FR-016 — Instant and offline**: previews and results MUST update as the baker types, need no network, and
  make no api call.

**The engine**

- **FR-017**: The engine MUST be a pure, shared module with no UI, no storage and no device access.
  - **Input**: a recipe's portions, portion size and lines (quantity, unit, optional FID id, optional sub-recipe,
    optional egg grade), a mode and its target, and the units context.
  - **Output**: the factor or a refusal, the recipe's total dough (counted and not-counted lines) and its scaled
    value, the scaled yield, the short line if any, the "more than enough" case, and for each line its exact
    scaled amount, its rounded display amount and unit, its original, and whether it was scaled.
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
  the api's recipe model. Two reproduce MA-32's recipes: the chocolate sourdough (02: eight lines, 1,116 g, 12
  slices) and the Butterzopf (02i: eggs, milk by volume, "to taste" and "as needed" lines, 8 slices), so the
  computed frames are tests. Others cover portions, grams, millilitres, cups and spoons, a line that isn't counted,
  unknown, a sub-recipe line, step amounts, and each units system. Fixtures live beside the tests and are never
  imported by app code.
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
  2026-09-25). Fractional amounts are numbers and never pluralised (004 FR-015); whole pieces follow the locale's
  plural rules.
- **FR-024**: Every scaling control MUST meet DESIGN.md's target, contrast and label rules (constitution X), with
  the frames' labels ("5 percent less", "5 percent more", "Percent of the recipe", "Quick amounts", "Fewer
  slices", "More slices", "Pounds", "Ounces"). The factor and each changed amount are announced when they change,
  without reading the whole list again. The refusal is announced as an alert.

### Key Entities

- **Scalable recipe** (the engine's input): an id, portions (optional), portion size and unit (optional), and
  ordered lines.
- **Line**: a quantity (a number; 0 = to taste; absent = not known), a unit from FID's unit catalogue, optionally
  an FID ingredient id (for densities), optionally an egg grade, and optionally a sub-recipe reference. Step
  amounts are lines tied to a step.
- **Total dough**: the sum of the weights of the lines that have one, and the list of lines that are not counted
  (FR-003).
- **Scale request**: one mode (slices, dough weight, percent, what I have) and its target. For what I have, one
  line and the amount the baker has, with its unit.
- **Scale result**: the factor or a refusal, the short line or the "more than enough" case (what I have), the
  scaled yield, the total dough and its scaled value, and per line the exact scaled quantity, the rounded display
  (amount and unit), the original, and a scaled/unchanged flag.
- **Units context**: the baker's system and region (004), plus 004's unit definitions, chosen densities and egg
  grades. It is read-only to the engine.
- **Last scale** (device, Home data): per recipe id, the factor last applied. Reset by Clear my data.

## Screen inventory (MA-32, design `main` at `6dcd2da2`)

Built only from these frames. "(+ dark)" marks a dark twin.

| frame | what it draws |
|---|---|
| `02-recipe-detail` (+ dark) | the Yield card unscaled, its stepper, and the line into the sheet |
| `02l-recipe-scale-offer` (+ dark) | the recipe as written, with "Last time: 90% · Scale to 90% again" (FR-015) |
| `02c-recipe-scaled` (+ dark) | the scaled card (FR-014a), the note (FR-012), and the scaled list with "was" beneath |
| `02d-scale-percent` (+ dark) | the sheet, "Scale this recipe": Percent, with −/+, chips and the preview |
| `02d-scale-percent-between` (+ dark) | a value between steps (89.6 %), the snap, and the preview |
| `02d-scale-percent-refused` (+ dark) | 1,500 %: the value stays, the sentence, Scale off (FR-001a) |
| `02e-scale-yield` (+ dark) | Yield: Slices or Dough weight, the typed target, the factor and the original |
| `02e-scale-yield-not-counted` (+ dark) | dough weight with a line that isn't counted (FR-003) |
| `02e-scale-yield-us` (+ dark) | the dough target in pounds and ounces, two fields |
| `02f-scale-what-i-have` (+ dark) | What I have: the short ingredient, the amount, the result sentence |
| `02f-scale-what-i-have-more` (+ dark) | more than enough: keep the recipe, or scale up (FR-006) |
| `02g-recipe-scaled-us` (+ dark) | the scaled list in US measures, computed, and the "measure" note |
| `02i-recipe-scaled-eggs` (+ dark) | eggs in quarters with the beaten weight; "to taste" and "as needed", not scaled |
| `02i-recipe-scaled-eggs-us` | the same in US measures, large eggs |
| `02j-recipe-scaled-below-one` (+ dark) | "<1 slice" and the note with the dough weight |
| `02m-recipe-scaled-uk` | the scaled list in UK imperial |
| `02h-recipe-scaled-nonlinear` (+ dark) | the place for the non-linear note, which v1 leaves empty (FR-012a) |
| `02b-baking-mode-scaled` (+ dark) | baking mode, scaled: out of 009, handed on (*Handed on*) |

**Undrawn, so it waits for its frame**: **the Plus boundary** on "What I have" (FR-006). The whole tab's UI waits
for it.

**Frame text the rules override** (the tests follow the rule): 02i's egg lines are still being computed by
design-mobile; 02j's ingredient list repeats the 90 % list under its ×0.1 badge (its yield, badge and note are
the frame's subject).

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
- **FR-008 → MA-32's rounding**, not 004 FR-013, as a named function in core beside 004's; 004 FR-013 stays for
  conversions.
- **Scaled amounts →** the scaled value with the original small beneath, never struck through.
- **FR-012 →** the note is the drawn sentence. The engine carries no ingredient-class rule.
- **FR-014 →** Reset is "Back to original".
- **Q4 → A.** Baking mode is out of 009; 02b is handed on (*Handed on*).
- **Stop 5 (02h) →** the place is drawn, and v1 shows nothing there.
- **FR-007a →** scaling always starts from the exact stored amount, never from a displayed or rounded value.

### Session 2026-09-26 (the owner's follow-up walk; MA-32 "Amendment 2026-09-26", design `6dcd2da2`)

- **Q2 →** 10 %–1,000 %. Out of range is refused: the value stays, one sentence says why, Scale is off
  (02d-scale-percent-refused). More than needed in "What I have" keeps the recipe, with a second button "Scale up
  to use all …" (02f-scale-what-i-have-more).
- **O-7 →** − and + snap to the 5 % steps; the percent is typeable; the Percent tab previews yield and dough
  (02d-scale-percent-between).
- **O-5 →** the factor to three decimals and the percent to one, both trimmed ("×0.896 (89.6%)").
- **Q3 / O-2, superseded →** eggs may stay fractional, in quarters ("1¾ eggs"), with "exactly 1.8 · or weigh 92 g
  beaten" beneath (US "1¾ large eggs … oz beaten"). The grade follows the region when the recipe names none:
  EU/UK medium, US large. The weights come only from the api's egg grades. The earlier ruling, whole eggs, is
  withdrawn.
- **"To taste" / "as needed" →** its words, with "not scaled" beneath.
- **Below one piece →** "<1", and the note gives the dough weight (02j). "A single small bun" stays open (O-1).
- **O-1 →** dough weight counts what has a weight and says what isn't counted; that line stays as written
  (02e-scale-yield-not-counted). The US target is pounds and ounces, two fields (02e-scale-yield-us).
- **O-3 →** converted-then-scaled amounts take MA-32's rounding.
- **O-4 →** US = 004 FR-013's steps, stepping down from cups below ¼ cup and to teaspoons below 1 tbsp; never
  "¾ tbsp"; no volume measure → ounces. 02g is computed (`_gen/f30/us_rounding.py`), so SC-002 checks 02g too.
- **O-6 →** UK imperial (oz ⅛, fl oz ¼, 5 ml tsp, no cups), and millilitres to 1 ml (02m-recipe-scaled-uk).
- **FR-012 →** the note adds "Times and temperatures stay as written."
- **Q5, flipped →** the recipe opens as written with "Last time: 90% · Scale to 90% again" (02l). The last scale
  is stored per recipe on the device as Home data; Clear my data resets it.

### Open items (named, not picked)

- **O-1 — The size of a below-one yield.** 02j's note ends "a single small bun". Nothing in the recipe model or
  the api gives that phrase, so v1 shows the dough weight only, until design-mobile answers where it comes from.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every fixture and every mode, each scaled exact amount equals the stored amount × the factor, to
  within a millionth of the amount.
- **SC-002**: The chocolate-sourdough fixture scaled to 90 % reproduces **02c** (Metric), **02g** (US) and **02m**
  (UK imperial) amount for amount, with "≈11"; 1,000 g of dough, 2 lb 3 oz of dough, 100 g and 200 g of chocolate
  reproduce 02e's, 02e-us's, 02f's and 02f-more's factors, percents and yields. The Butterzopf fixture reproduces
  02i's non-egg lines in Metric and US; its eggs are checked against FR-008's egg rule.
- **SC-002a — Scaled from the exact, not from the display**: the stored 120 g (displayed "4¼ oz") scaled by 0.9
  reads "3¾ oz" in US units, never "3⅞ oz" (FR-007a). For every fixture, a scaled display equals the rounding of
  the exact stored amount × the factor, and never the rounding of a displayed amount × the factor.
- **SC-003**: Every displayed amount differs from its exact value by no more than one rounding step (FR-008), there
  is never a "¾ tbsp", and **no present ingredient ever reads as 0**.
- **SC-004**: In "What I have", **the short ingredient's displayed amount never exceeds** what the baker typed,
  across every fixture and a sweep of amounts.
- **SC-005**: The stored recipe is unchanged after any scaling, checked byte for byte, and "Back to original"
  shows it exactly as written.
- **SC-006**: A preview and a scaled list update as the baker types, with no perceptible delay (under 0.1 s) for
  recipes up to 100 lines, fully offline.
- **SC-007**: A release build contains no dummy recipe (FR-021), checked by test.
- **SC-008**: Every string appears in all seven catalogs (parity test), and no number is separated from its unit
  by a line break.
- **SC-009**: Every factor outside 0.1–10 is refused in every mode, including the "Scale up" alternative, and every
  factor inside is accepted.
- **SC-010 — The last scale resets**: after Clear my data, no last scale is stored for any recipe and no recipe
  shows the "Last time" offer; before it, a recipe scaled to 90 % reopens as written with the offer.

## Assumptions

- **MA-32 is the design authority** for this spec until it is ported to `docs/DESIGN.md`. Where a frame's text and
  a stated rule disagree, the rule wins.
- **004 is the units source.** Unit definitions, chosen densities, egg grades and the kitchen chart's measures
  (MA-29, in core via #56) come from 004 as it lands. Where egg grades are not yet in the api, eggs scale in
  quarters with no beaten weight. FR-008's scaled rounding is new and lives beside 004's in core.
- **The recipe model** is api 013's (portions, NULL ≠ 0 quantities, FID units). Own and imported recipes (008) map
  onto it. The total dough is computed from the lines, and the entered finished weight is not used. "As needed"
  is read as a quantity that is not a number, like "to taste"; how the api marks it is the recipe view's mapping.
- **A sub-recipe line** is scaled as one amount. Expanding it is a later need.
- **Step amounts** exist in the model (`recipe_step_components.quantity`) and scale like the ingredient list, for
  baking mode's later use.
- **The engine's home** is a shared package that both apps can import; the plan, when 009 is unparked, decides
  where. Constitution XI applies if it would be a new top-level package, and core changes are announced (III).
- **No entitlement is decided on the device** (VII).
