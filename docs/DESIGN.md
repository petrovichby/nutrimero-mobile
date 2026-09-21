---
name: Nutrimero Mobile
status: draft 0.1.0 — pending ratification; binding for this repo once ratified
inherits: nutrimero-web/docs/DESIGN.md (color schemes, contrast rules) · nutrimero-design (concept authority)
colors-note: >
  Full light/dark token ramps are inherited verbatim from the web DESIGN.md frontmatter and the
  nutrimero-design registry — they are NOT duplicated here; packages/ui/tokens.ts is generated
  from that source. Only mobile-specific roles are declared below.
colors-mobile:
  app-accent-home: '#b9bf05'   # Home Baker chrome accent = secondary (lime-forward)
  app-accent-pro: '#1b1f58'    # Pro Baker chrome accent = primary (navy-forward)
  illustration-canvas: '#f7f4ec'  # cream background of all recipe illustrations (style seed)
  floor-surface: '#0b0e32'     # navy-deep; Floor Mode runs dark regardless of OS scheme
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
  Generous whitespace, illustration-forward, lime as the joyful accent (`app-accent-home`).
  It should feel like a well-organized kitchen shelf, not an instrument panel.
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
- **Provenance & tier badges:** label-sm on `secondary-container`/`surface-container-high`
  chips; text + glyph, color never alone. Founder badge renders the number ("Founder #37").
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
  lime rule); secondary = navy outline; destructive = `error` with confirmation step. One
  primary action per screen.

## Typography rules

- Plus Jakarta Sans everywhere (expo-font); no platform-default font fallbacks in shipped UI.
- **Dynamic Type / font scaling is supported, not fought:** `allowFontScaling` stays on, layouts
  are tested at 1.3×; only `data-mono` in Floor Mode may cap scaling (it is already enlarged).
- Numbers that users compare (weights, prices, percentages) always use `data-mono` with tabular
  figures; body text never carries aligned numeric columns.

## Imagery

- Recipe illustrations: the approved style seed (see `docs/prompts/asset-prompts.md`) is the canonical
  reference — cream `illustration-canvas` background, 4:3, centered subject, no text baked into
  images (text belongs to the UI layer, where it localizes).
- **Never photorealistic AI imagery, anywhere** (ideation doc §3.3). Real photos are labeled
  and celebrated, not mixed in silently.
- Icons: single glyph family derived from the app-icon loaf glyph language; filled style at
  small sizes, 24pt default grid, exported from `nutrimero-design`.

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

- 0.1.0 (2026-09-21) — initial draft, pre-UI: token inheritance, per-app temperaments, Floor
  Mode, provenance badges, core component rules. Pending ratification by Aliaksandr; expected
  to be amended heavily once the first real screens exist.
