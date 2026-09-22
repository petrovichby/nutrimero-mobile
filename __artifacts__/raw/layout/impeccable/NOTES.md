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
- **00 Splash:** static cover; the only motion is the three loading dots filling in sequence
  (400 ms cadence, lime — the one moving element). Exit = 250 ms crossfade into the Recipes
  tab; Reduce Motion ⇒ instant cut. The splash is Expo's static splash plus this brief
  composed moment; it never blocks longer than load requires and is not a timed ad.
  **Scheme-fixed:** the cover is a physical object — navy band and cream field render
  identically in light and dark OS schemes (like the cream illustration plates); status bar
  is light-content always. **Loader semantics:** the dots are an indeterminate loader — RN
  `accessibilityRole="progressbar"` with no value, `accessibilityState={{busy: true}}`,
  announced once as "Loading"; the HTML comp's `role="progressbar"` without `aria-valuenow`
  is the equivalent indeterminate form.

## Vintage kit (1950s–60s cookbook, added 2026-09-22)

- Display face **Pacifico** (Google Fonts, 400) for brand moments ONLY: splash title,
  screen mastheads (Recipes/Builder/Pantry/Shopping), paywall headline. Never in body, rows,
  buttons, chips, or any Operate control. RN: load via expo-font next to Plus Jakarta Sans.
  Chosen over Yellowtail for charset coverage (user requirement): Pacifico ships Latin,
  Latin-Ext, Cyrillic, Cyrillic-Ext, Vietnamese — covers en/de/lt today and Cyrillic-script
  markets later; it is also a period-true revival of 1950s American brush lettering.
- `.plate` / hero illustrations carry a printed-plate inner hairline frame (navy at 28%,
  5px inset). The splash cover plate uses the stronger double rule (border + offset outline).
- `.fleuron` printer's divider (rule–diamond–rule) marks ceremonial moments (splash, paywall)
  — not list sections.
- **On-image provenance = a rubber-stamp impression:** Stardos Stencil 700, all-caps
  "AI ILLUSTRATION" (localized), single unrounded 1px border, rotate(5°), structure-colored
  ink (rust #7a3520 since the warm retheme — text and border) on faint cream.
  Text-only (user direction); the row chips keep their glyph. Stardos Stencil ships
  Latin-only — pick a Cyrillic-capable stencil fallback before shipping Cyrillic locales.
- Layout, chips, buttons, targets, and all Operate ergonomics are untouched by the vintage
  pass (user decision: light touch).

## Scheme rules proven in the comps

- Illustration plates stay cream `#f7f4ec` in both schemes (DESIGN.md: illustration-canvas
  is scheme-fixed).
- Home Baker (approved 2026-09-22): warm "Crust & Butter" palette — rust structure #7a3520,
  butter-gold action #dfa621; dark surfaces are warm chocolate browns (#201510 family), never
  neutral gray or navy; shadows go black in dark, rust-tinted in light. Pro Baker keeps
  navy/lime.
- The action color never carries white text (gold inherits lime's guard: near-black #251a02);
  tier chips sit on the gold-tinted container (`--tier-bg`) with dark-honey ink, one
  treatment for included and locked (lock glyph added when locked).

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
