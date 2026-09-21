# Implementation notes — Home Baker comps (impeccable set)

Design intent that static HTML cannot carry; binds the React Native implementation.

## Touch & accessibility (RN translation)

- **Category chips** are 44pt tall. Any control that visually shrinks below 44pt in future
  variants gets `hitSlop` to restore the 44pt target — never scale the glyph.
- **Allergen glyphs** (index rows): each glyph ships `accessibilityLabel` naming the allergen
  ("Gluten (wheat)", "Milk", …) — in HTML comps this is the `title` + visually-hidden text.
  Rows use `accessibilityRole="button"` with a combined label
  ("Butterzopf, 3 hours, medium, contains gluten, milk, egg, AI illustration").
  The detail screen carries the full glyph+text chips; index rows carry glyph+label.
- **Tab bar**: `accessibilityState={{selected}}` on the active tab; labels always visible.
- **Timer** (baking mode): `accessibilityLiveRegion` / VoiceOver announcement at completion;
  the running timer persists as a chip on every screen (and as an iOS Live Activity /
  Android ongoing notification — the cross-screen form of the chip).
- Provenance badges map to the API's `media.origin` field (`ai_illustration | real_photo`);
  there is no UI path that renders an image without one.

## Motion (one authored moment per screen; 150–250 ms, ease-out; Reduce Motion ⇒ instant)

- **01 Recipes:** masthead behaves as a large title collapsing to an inline bar on scroll
  (200 ms). Category chip selection crossfades fill/ink (150 ms). Row press: surface tint
  + 0.98 scale (150 ms).
- **02 Recipe detail:** the signature moment — yield stepper tap re-rolls every gram amount
  in place (tabular figures keep columns still; values crossfade 180 ms, stagger 20 ms down
  the list). Nutrition section expands/collapses 200 ms.
- **02b Baking mode:** step change slides horizontally 220 ms (swipe or buttons — both,
  never gesture-only); progress segment fills with the same easing; timer chip pulses once
  (not looping) when a timer starts. Screen holds a wake-lock while active.
- **03 Builder:** the authored moment — when the pantry changes, result rows re-rank with a
  single 200 ms settle (no per-row springs); match chips crossfade their count. AI card:
  plain press tint, no shimmer/sparkle animation (AI is labeled, not hyped). A11y: the match
  chip carries the full sentence ("9 of 11 ingredients in your pantry, missing butter and
  vanilla sugar"); substitution hints are readable rows, not tooltips.
- **03 empty state:** static illustration; standard button press. Announced as one heading +
  one action.
- **04 Pantry:** **swipe-to-remove is an accelerator only** — every row also exposes Remove
  via long-press context menu, and an Edit mode is reachable from the header (DESIGN.md:
  "both, never gesture-only"). Removal collapses the row in 150 ms, announces via
  accessibility, and offers platform-native undo (snackbar / toast). Quick-add chips animate
  a 150 ms move into their category group.
- **05 Shopping:** check-off = 150 ms strikethrough fade + haptic tick; basket totals
  re-count in place (tabular figures keep the column still). Checked items are excluded from
  the estimate and the change is announced. Segmented control announces the active grouping.
- **06 Paywall:** no timed animation, no urgency motion — the founders counter changes only
  when a real purchase lands. Plan selection is an instant border/tint swap. VoiceOver reads
  the full renewal terms and the counter value.
- **07 Onboarding:** step transitions slide 220 ms (Reduce Motion ⇒ cut); selection cards
  and staple chips announce checked state; the units conversion card updates its rows to
  match the selected system.

## Scheme rules proven in the comps

- Illustration plates stay cream `#f7f4ec` in both schemes (DESIGN.md: illustration-canvas
  is scheme-fixed).
- Dark surfaces are navy-deep (`#10122a` family), not neutral gray; shadows go black in dark,
  navy-tinted in light.
- Lime never carries white text; tier chips sit on the lime-tinted container
  (`--tier-bg`) with dark-olive ink, one treatment for included and locked (lock glyph added
  when locked).

## Diet & allergen glyphs (canonical source: nutrimero-design / nutrimero-web)

Per web ADR-0008, diet/allergen glyphs are owned domain SVGs, not library icons. The mobile
comps use the same drawings as the web recipe screens (`nutrimero-design/004 Recipe Screens`),
stroke-based (2px, round caps). **Grammar: the diagonal strike path (`M4 20 20 4`) means
"-free"; without the strike the glyph means "contains".** Comps currently use the no-strike
variants (allergen presence). For dietary-profile / suitability UI (onboarding, builder
filters), use the canonical web symbols verbatim:

- `i-gluten` (gluten-free, with strike), `i-lactose` (lactose-free, with strike)
- `i-vegan`: `<path d="M20 4c1 8-2 13-6 15s-8 1-9-1 0-6 4-9 8-4 11-5z"/><path d="M5 20c3-5 7-9 12-12"/>`
- `i-vegt` (vegetarian): `<path d="M12 21v-8"/><path d="M12 13c0-4 3-6 8-6 0 4-3 6-8 6z"/><path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5z"/>`

## Illustrations

Raster illustrations in the approved seed style are generated externally
(see `assets/GENERATION-PROMPTS.md`); comps auto-swap from the flat SVG placeholders when
the PNGs land in `assets/`. The `onerror` PNG→SVG fallback is a **comp-only mechanism** —
the RN implementation never ships a 404-driven fallback; asset sourcing is resolved at
build/content-pipeline time, and `media.origin` covers provenance, not sourcing.
