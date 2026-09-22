---
name: Nutrimero Mobile
status: draft 0.4.0 — pending ratification; binding for this repo once ratified
inherits: nutrimero-web/docs/DESIGN.md (color schemes, contrast rules) · nutrimero-design (concept authority)
colors-note: >
  Full light/dark token ramps are inherited verbatim from the web DESIGN.md frontmatter and the
  nutrimero-design registry — they are NOT duplicated here; packages/ui/tokens.ts is generated
  from that source. Only mobile-specific roles are declared below.
colors-mobile:
  # Per-app worlds (decided 2026-09-22): Home Baker runs the warm "Crust & Butter" palette;
  # Pro Baker retains the ecosystem navy/lime ("Lufthansa-like") world. The ecosystem brand
  # (lockups, app icons, web) remains lime/navy — this split is app-UI palette, not brand.
  home-structure: '#7a3520'    # Home Baker structure/heading (rust sepia); dark scheme derives warm browns (#201510 ramp)
  home-action: '#dfa621'       # Home Baker action (butter gold); text on it near-black #251a02 (same guard as lime)
  app-accent-home: '#dfa621'   # Home Baker chrome accent = butter gold
  app-accent-pro: '#1b1f58'    # Pro Baker chrome accent = primary (navy-forward); Pro keeps lime #b9bf05 as action
  illustration-canvas: '#f7f4ec'  # cream background of all recipe illustrations (scheme-fixed)
  floor-surface: '#0b0e32'     # navy-deep; Floor Mode runs dark regardless of OS scheme
  destructive: {light: '#8c2318', dark: '#a03325', on: '#ffffff'}  # oxblood family — swipe-remove, delete; never Material red
  tier-chip:
    light: {bg: '#eef0cf', ink: '#3a3d01', line: '#c9cd6a'}   # lime-tinted container, dark-olive ink
    dark: {bg: '#2c2f14', ink: '#d9de62', line: '#565a18'}
    on-lime: {bg: '#1d1e01', ink: '#b9bf05'}                  # tier chip sitting on a lime primary surface
  provenance-on-image: {bg: '#f8e9e4', ink: '#57180c', line: '#e4c4ba'}  # scheme-fixed like the cream plate it sits on
typography:
  fontFamily: Plus Jakarta Sans (expo-font, weights 400/500/600/700)
  headline-lg: {fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.01em}
  headline-md: {fontSize: 22, fontWeight: '600', lineHeight: 30}
  headline-sm: {fontSize: 18, fontWeight: '600', lineHeight: 26}
  body-lg: {fontSize: 17, fontWeight: '400', lineHeight: 26}
  body-md: {fontSize: 15, fontWeight: '400', lineHeight: 22}
  body-sm: {fontSize: 13, fontWeight: '400', lineHeight: 18}
  label-md: {fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 0.02em}
  label-sm: {fontSize: 11, fontWeight: '700', lineHeight: 14}
  data-mono: {fontSize: 15, fontWeight: '500', lineHeight: 20, fontVariant: tabular-nums}
  floor-mode-scale: 1.15  # multiplier applied to body/headline roles in Floor Mode
rounded: {sm: 2, DEFAULT: 4, md: 6, lg: 8, xl: 12, full: 9999}
spacing:
  unit: 4
  screen-margin: 16
  card-padding: 12
  section-gap: 24
  list-row-min-height: 48
touch-targets:
  minimum: 44          # pt/dp, both platforms, both apps
  floor-mode: 56       # bakery floor: flour-covered fingers, gloves, distance viewing
---

## Authority & scope

This document is the binding design authority for `nutrimero-mobile` (both apps), sitting under
the ecosystem chain: `nutrimero-design` (concept) → `nutrimero-web/docs/DESIGN.md` (web-binding,
source of the color system) → **this file** (mobile-binding). Where this file is silent, the web
DESIGN.md's rule applies if it translates to native; where it cannot translate (hover states,
z-index scale, CSS-specific guards), this file must speak. Amendments follow the constitution's
rule: version bump + note in the amendment log; never amended as a side effect of a feature.

All color roles, ramps, and **contrast rules inherit from the web DESIGN.md** — including the
lime guards (never white text on lime; `on-secondary` near-black olive; lime carries meaning only
when paired with text or a glyph), the fixed-surface/fixed-foreground pairing rule, and WCAG AA
(4.5:1 text, 3:1 boundaries). `packages/ui/tokens.ts` is generated from the token registry, never
hand-edited.

## Brand & personality per app

One design system, two temperaments — the same relationship the web system already has between
Professional and Hobby Mode:

- **Nutrimero Home Baker** — the Hobby Mode spirit as a whole app: warm, domestic, focused.
  Generous whitespace, illustration-forward, and (approved 2026-09-22) the warm **Crust &
  Butter** palette: rust-sepia structure `#7a3520`, butter-gold action `#dfa621`
  (`app-accent-home`), warm cream surfaces; the dark scheme derives warm chocolate browns,
  never neutral gray or navy. Bread is about warmth. It should feel like a well-organized
  kitchen shelf, not an instrument panel. Semantic roles are NOT warmed: allergen oxblood,
  destructive, and the cream illustration canvas stay as specified.
- **Nutrimero Pro Baker** — the Professional temperament: utility-first, data-dense where the
  work is (costing, orders), navy-anchored chrome (`app-accent-pro`). The instrument-panel feel
  is a feature; bakers trust tools that look like tools.

The two apps share every component in `packages/ui`; the temperament difference is carried by
the app-accent role, spacing presets, and content (illustrations vs. data), never by forked
components.

## Layout & touch

- **4pt rhythm.** All spacing is multiples of the 4pt unit; screen edge margin 16pt.
- **Touch targets:** 44pt minimum everywhere (WCAG 2.5.8 / both platform HIGs), 56pt in Floor
  Mode. Icon-only buttons always reach the minimum via padding, never by scaling the glyph.
- **Thumb-first:** primary actions live in the bottom half of the screen — tab bar, floating
  primary action, sticky bottom CTA on paywall/detail screens. Nothing critical hides behind
  the top corners on phones.
- **Safe areas** are respected via insets on every screen; no hardcoded status-bar offsets.
- **Phones are the Home Baker's first-class device; the 13" tablet is the Pro Baker's.** Pro
  screens are designed tablet-first (split view: production list | recipe detail) and degrade
  gracefully to phone; Home Baker is phone-first and simply relaxes into tablet width with a
  capped content column (~600pt), never stretched full-bleed text.

## Navigation

- Bottom tab bar, maximum five items, labels always visible (icon-only tabs are prohibited).
  - Home Baker: **Recipes · Builder · Shopping · Pantry · More**
  - Pro Baker (phone): **Production · Recipes · Costing · Orders · More**
  - Pro Baker (tablet): left navigation rail + split view, mirroring the web shell's sidebar
    semantics (`aria-current` equivalent: `accessibilityState.selected`).
- Modal flows (builder wizard, paywall, onboarding) present as full-screen sheets with an
  explicit close affordance top-left and never trap the user (hardware back always works).

## Floor Mode (Pro Baker)

The bakery-floor recipe view is its own display mode, entered per-recipe:

- **Always dark** (`floor-surface` navy-deep chrome) regardless of OS scheme — consistent
  legibility under harsh mixed lighting; foregrounds use `primary-fixed` per the inherited
  fixed-pairing rule.
- Type scale × 1.15, touch targets 56pt, one step per screen, step position always visible
  ("3 / 9"), horizontal swipe or large next/back buttons to move — both, never gesture-only.
- Screen wake-lock while a recipe is active; timers keep running and notify if backgrounded.
- Quantities render in `data-mono` with tabular figures at the largest size on screen — the
  number *is* the interface on the floor.
- Works fully offline (constitution VIII); an unsynced-changes indicator is the only network
  UI permitted in this mode.

## Elevation & depth

Tonal layers over shadows, as on web. Native translation: surface-container tints for grouping;
shadows (`elevation`/`shadowOpacity ≤ 0.15`) only on genuinely floating elements — sheets,
menus, toasts. No stacked z-index scale is defined yet; the first feature needing layered
stacking beyond the navigation/sheet defaults amends this document first (same growth rule as
the web z-index table).

## Components

Shared in `packages/ui`; every component ships with its accessibility props, not after them.

- **Recipe card:** illustration (4:3, `illustration-canvas` background) + title + meta row
  (time, difficulty, allergen glyphs) + **provenance badge — mandatory, never omitted**
  (constitution V): `Illustration (AI)` / `Photo — baked by Markus` / `Community photo`.
  Exclusive recipes carry a lock/tier chip; locked content shows a real preview, never a blurred
  tease (no dark patterns).
- **Provenance & tier badges:** text + glyph, color never alone.
  *Provenance:* rendered as a **rubber-stamp impression** (vintage voice). On an
  illustration (featured banner, detail hero, splash cover): stencil face **Stardos Stencil**
  700, all-caps tracked "AI ILLUSTRATION" (de: "KI-ILLUSTRATION"), single unrounded 1px
  border, tilted −5°, corporate navy ink (`#1b1f58`, text and border alike) on a faint
  translucent cream backdrop — text-only, scheme-fixed, placed at the image corner (away
  from any control).
  Stardos Stencil is Latin-only; Cyrillic-script locales will need a stencil fallback for
  the stamp face (open item). In index rows: a quiet hairline stamp (transparent field,
  `outline-strong` border, `ink-2` uppercase text) beside the allergen glyphs, with glyph
  ("Illustration (AI)" + sparkle / "Photo" + camera). Every AI illustration is stamped, the
  splash cover included.
  *Tier:* one treatment everywhere — label-sm on the `tier-chip` lime-tinted container;
  locked content adds a lock glyph to the same chip, never a different chip. On a lime
  primary surface use the `tier-chip.on-lime` variant (olive field, lime ink). Founder badge
  renders the number on navy ("Founder #37 of 100") with the medal glyph.
- **Quantity stepper:** the workhorse of scaling — 44pt +/− targets, direct text entry on tap,
  `data-mono` value, unit label from the FID unit catalog, never a bare number.
- **Timers:** persistent chip while running (any screen), `accessibilityLiveRegion`/VoiceOver
  announcements at completion; multiple named timers listed in a sheet.
- **Allergen flags:** inherited rule verbatim — `tertiary` + glyph + accessible label naming
  the allergen; color never alone. Allergen data renders only from FID joins (constitution IV);
  there is no UI path for free-text allergen display.
- **Offline indicator:** quiet `label-md` banner on `surface-container-high` ("Offline — showing
  saved data"), never a blocking modal. Actions that require network disable with a reason, they
  don't error after tapping.
- **Paywall:** plain-language price including renewal terms, restore-purchases link, and a
  no-thanks path of equal visual weight to the CTA. Cancellation guidance is one tap from the
  subscription management screen (constitution V; DACH Kündigungsbutton spirit applies in-app).
- **Empty/error states:** illustrated in the recipe-illustration style (style-seed palette),
  one sentence of guidance, one action. Empty pantry and empty cupboard states are onboarding
  moments, not dead ends.
- **Buttons:** primary = `secondary` lime fill with `on-secondary` near-black text (inherited
  lime rule); secondary = navy outline; destructive = the `destructive` role pair (oxblood
  family, both schemes — e.g. the swipe-remove action) with confirmation step or undo. One
  primary action per screen.

## Typography rules

- Plus Jakarta Sans for all body, UI, and control text (expo-font); no platform-default font
  fallbacks in shipped UI.
- **Display face (brand moments only): Pacifico** (Google Fonts, 400) — splash title, screen
  mastheads (Recipes/Builder/Pantry/Shopping), paywall headline. Never in body, rows, buttons,
  chips, or any Operate control. Chosen for the 1950s–60s cookbook voice (period-true brush
  lettering revival) and for charset coverage: Latin, Latin-Ext, Cyrillic, Cyrillic-Ext,
  Vietnamese — covers en/de/lt and future Cyrillic-script locales. Masthead metrics 31/46;
  splash 56/86.
- **Dynamic Type / font scaling is supported, not fought:** `allowFontScaling` stays on, layouts
  are tested at 1.3×; only `data-mono` in Floor Mode may cap scaling (it is already enlarged).
- Numbers that users compare (weights, prices, percentages) always use `data-mono` with tabular
  figures; body text never carries aligned numeric columns.

## Imagery

- Recipe illustrations: **monochrome ink-engraving style** (chosen 2026-09-21 from the
  Home Baker comp set) — sepia/ink line work with visible hatching on the cream
  `illustration-canvas`, 4:3, centered subject, generous negative space, no text baked into
  images (text belongs to the UI layer, where it localizes). Canonical reference set:
  `nutrimero-mobile/__artifacts__/raw/illustration/variant2/` (generation is seed-conditioned
  on that set; prompt templates in the comp set's `assets/GENERATION-PROMPTS.md`).
  Illustration plates stay cream in **both** schemes — in dark mode the cream plate is the
  intended contrast anchor, never re-tinted. Known trade-off, accepted: monochrome does not
  differentiate flavors visually (e.g. chocolate crumb); the title carries flavor.
  The earlier warm-color flat-illustration seed (`docs/prompts/asset-prompts.md` §3) is
  superseded for recipe imagery; its palette language lives on in UI accents only.
- **Never photorealistic AI imagery, anywhere** (ideation doc §3.3). Real photos are labeled
  and celebrated, not mixed in silently.
- Icons: two owned families, per web ADR-0008 (no library icons for domain symbols).
  **UI chrome glyphs:** filled style, 24pt grid — tab set as built in the comp set: open book
  (Recipes), tiered cake (Builder), basket (Shopping), double-door cupboard (Pantry), dots
  (More); labels always visible.
  **Diet & allergen glyphs:** the owned stroke set shared with `nutrimero-web`
  (`nutrimero-design/004 Recipe Screens`) — 2px stroke, round caps: wheat (gluten), droplet
  (lactose/milk), egg, nut, leaf (vegan), sprout (vegetarian). **Strike grammar:** the
  diagonal strike path (`M4 20 20 4`) means "-free"/suitability; without the strike the glyph
  means "contains". Never mix the two meanings on one surface without the text naming it.

## Vintage voice (1950s–60s cookbook — Home Baker)

The Home Baker app reads as a mid-century cookbook (user-pinned direction, 2026-09-22).
Light touch by rule — the vintage voice never alters layout, chips, buttons, touch targets,
or any Operate ergonomics:

- **Printed-plate frames:** every illustration (index thumbs, banner, detail hero) carries an
  inner hairline frame (navy at 28%, 5px inset, **square corners** — printed rules are never
  rounded); ceremonial plates (splash cover) use a square double rule (border + offset
  outline).
- **Fleuron divider** (rule–diamond–rule) marks ceremonial moments only (splash, paywall
  headline) — never list sections.
- **Plate captions** in tracked small caps ("Plate I · Rustic sourdough") where an engraving
  is presented as a plate.
- **Splash = the cover** (Split-Band composition): navy masthead band (~34% of frame) with
  reversed lockup, cream field with the captioned plate, one 2px lime printer's rule, foot
  colophon + indeterminate loading dots (lime is rationed to the dots — the only moving
  element). The cover is **scheme-fixed**: identical in light and dark OS schemes; status
  bar light-content.

## Motion

- Purposeful and short: 150–250ms, standard easing; screen transitions use platform defaults.
- Respect `useReducedMotion` — layout changes and celebratory moments (recipe completed,
  founder purchase) swap animation for an immediate state change.
- No looping or attention-seeking animation in reading contexts (recipes, lists).

## Accessibility (gate, not polish — constitution X)

- Every interactive element: `accessibilityRole`, label, and state; icon-only buttons never ship
  without labels. Screens are audited with VoiceOver + TalkBack before a feature is "done".
- Contrast per the inherited rules; Floor Mode's dark-on-navy pairs come from the fixed ramps.
- Color never carries meaning alone (allergens, status, tiers — always text or glyph).
- Focus/keyboard: full support for external keyboards on tablet Pro (bakery office use).
- European Accessibility Act is the legal floor; the target is "genuinely usable one-handed, in
  a hot kitchen, by someone wearing glasses dusted with flour."

---

## Amendment log

- 0.4.0 (2026-09-22) — Home Baker warm palette, approved by Aliaksandr from the side-by-side
  experiment: "Crust & Butter" (rust `#7a3520` structure, butter-gold `#dfa621` action, warm
  cream surfaces, warm-brown dark ramp) replaces navy/lime for the Home Baker app UI; the
  navy/lime world is pinned to Pro Baker; ecosystem brand tokens unchanged. Printed ink
  (plate frames, stamps) re-inked rust; allergen/destructive/illustration-canvas roles
  untouched; gold action keeps the near-black-text guard.

- 0.3.0 (2026-09-22) — vintage voice, amended at Aliaksandr's direction from the splash +
  vintage pass (reviewed, ship): 1950s–60s cookbook direction recorded; display face Pacifico
  admitted for brand moments only (charset requirement: European Latin + Cyrillic; replaces
  the initially-tried Yellowtail, which ships no Cyrillic); printed-plate frames, fleuron,
  plate captions; splash cover spec (Split-Band, scheme-fixed, lime rationed to the loader);
  provenance badges recast as rubber stamps (uppercase tracked, ink border, square corners),
  stamped on every AI illustration including the splash cover.
- 0.2.0 (2026-09-21) — ratified from the Home Baker v1 comp set
  (`__artifacts__/raw/layout/impeccable/`), amended at Aliaksandr's direction: recipe imagery
  style replaced with the monochrome ink-engraving set (variant2) with cream plates
  scheme-fixed; new mobile color roles `destructive` (oxblood family, light+dark),
  `tier-chip` (incl. `on-lime` variant) and `provenance-on-image`; provenance/tier badge
  placement and one-chip-treatment rule; icon section split into UI chrome glyphs (filled,
  incl. the built tab set) and the owned diet/allergen stroke set shared with the web, with
  the strike ("-free") grammar; destructive button role bound to the new pair.
- 0.1.0 (2026-09-21) — initial draft, pre-UI: token inheritance, per-app temperaments, Floor
  Mode, provenance badges, core component rules. Pending ratification by Aliaksandr; expected
  to be amended heavily once the first real screens exist.
