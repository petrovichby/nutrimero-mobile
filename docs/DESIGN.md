---
name: Nutrimero Mobile
status: 0.5.2 — binding. Ratified by the owner at 0.2.0 (2026-09-21) from the Home Baker v1 comp set; 0.3.0, 0.4.0 and 0.5.0 are amendments made at the owner's direction.
inherits: nutrimero-web/docs/DESIGN.md (color schemes, contrast rules) · nutrimero-design (concept authority)
colors-note: >
  Pro Baker inherits the web ramps verbatim (web DESIGN.md frontmatter / nutrimero-design
  registry). Home Baker declares its own ramp below in colors-home (the D-1 deviation in
  nutrimero-design:mobile/home-baker/DEVIATIONS.md); semantic roles it does not warm are named
  as inherited. There are two rusts: structure #7a3520 (fills, borders, frames) and heading
  #6d2f1b (text). packages/ui tokens are generated from this frontmatter.
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
  tier-chip:                   # per app (MA-1); on-action = the chip on the app's primary action fill
    pro:  {light: {bg: '#eef0cf', ink: '#3a3d01', line: '#c9cd6a'}, dark: {bg: '#2c2f14', ink: '#d9de62', line: '#565a18'}, on-action: {bg: '#1d1e01', ink: '#b9bf05'}}
    home: {light: {bg: '#f6ecd0', ink: '#4a3405', line: '#d9c27a'}, dark: {bg: '#3e3110', ink: '#e9cb6b', line: '#6e5a1c'}, on-action: {bg: '#251a02', ink: '#dfa621'}}
  provenance-on-image:         # the on-image stamp (MA-3); scheme-fixed like the cream plate it sits on
    home: {bg: 'rgba(251,247,238,0.6)', ink: 'rgba(122,53,32,0.92)', line: 'rgba(122,53,32,0.8)'}
    pro: {bg: 'rgba(251,247,238,0.6)', ink: '#1b1f58', line: '#1b1f58'}
colors-home:
  # Home Baker "Crust & Butter" (DEVIATIONS.md D-1 — against the global lime/navy palette).
  # Scheme-independent roles first; then light and dark. Pro Baker never reads this block.
  fixed:
    action: '#dfa621'              # --lime        butter gold: primary fills, printer's rule, loader dots
    on-action: '#251a02'           # --on-lime     text/glyphs on action (the lime guard, kept)
    structure: '#7a3520'           # --navy        rust: splash band, secondary outline, selected chip, founder badge
    on-structure: '#ffffff'        #               text on structure (founder badge, selected chip)
    illustration-canvas: '#f7f4ec' # --canvas      cream plate, scheme-fixed
    plate-frame: 'rgba(122,53,32,0.30)'   # .plate::after  printed-plate hairline, 5pt inset, square
    cover-frame: 'rgba(122,53,32,0.50)'   # splash .cover-plate double rule (border + 4pt offset outline)
    provenance-stamp: {bg: 'rgba(251,247,238,0.60)', ink: 'rgba(122,53,32,0.92)', line: 'rgba(122,53,32,0.80)'}  # on-image stamp, scheme-fixed
    cover:                         # the splash is scheme-fixed: these never follow the OS scheme
      band: '#7a3520'
      band-ink: '#f7f4ec'
      band-wordmark: 'rgba(247,244,236,0.85)'
      band-fleuron: 'rgba(247,244,236,0.55)'
      field: '#f7f4ec'
      caption: '#6f6150'
      tagline: '#6d2f1b'
      home-indicator: '#362a1f'
    tier-on-action: {bg: '#251a02', ink: '#dfa621'}   # .btn-primary .chip-plus
  light:
    surface: '#fbf7ee'
    surface-1: '#f4ebd9'
    surface-2: '#ecdfc6'
    ink: '#362a1f'
    ink-2: '#6f6150'
    ink-3: '#7b6b52'
    heading: '#6d2f1b'             # the second rust — text only; structure #7a3520 is for fills and frames
    outline: '#e3d7bd'
    outline-strong: '#b8a888'
    chip-bg: '#f4ebd9'
    chip-selected-bg: '#7a3520'
    chip-selected-ink: '#ffffff'
    structure-soft: '#f3e4d3'      # --navy-soft      AI card field, photo slot
    structure-soft-ink: '#6d2f1b'  # --navy-soft-ink
    action-soft: '#f6ecd0'         # --lime-soft      active tab pill, per-slice band, timer chip
    tier: {bg: '#f6ecd0', ink: '#4a3405', line: '#d9c27a'}              # --tier-bg / --tier-ink / --tier-line
    allergen: {bg: '#ffd7d6', ink: '#6f2725', line: '#ffaaa8', glyph: '#6f2725'}   # --allergen-bg / --allergen-ink / --allergen-line; D-10: tertiary-fixed · on-tertiary-fixed-variant · tertiary-fixed-dim
    destructive: '#8c2318'
    on-destructive: '#ffffff'
    focus-ring: '#1d62ed'          # --focus; D-9: the web's, verbatim — never a brand colour
    status-positive: {bg: '#d6f5dd', ink: '#0c5223', line: '#1e7d38'}   # C2/C3 (MA-21): "cheapest", full-match chip — web success, verbatim
    note-assurance: {bg: '#f4ebd9', ink: '#362a1f', line: '#e3d7bd', glyph: '#6d2f1b'}   # C4 (MA-21): privacy card
    count-neutral: {bg: '#ecdfc6', ink: '#6d2f1b', line: '#b8a888'}     # C1 (MA-21): founders counter (surface-2 / heading / outline-strong)
    scrim: 'rgba(109,47,27,0.10)'
    shadow: {offsetY: 6, blur: 18, color: 'rgba(109,47,27,0.14)'}   # floating elements only
    secondary-button: {line: '#7a3520', ink: '#6d2f1b'}
  dark:
    surface: '#201510'
    surface-1: '#2b1d14'
    surface-2: '#382619'
    ink: '#f2ebe1'
    ink-2: '#cdbda9'
    ink-3: '#a4917b'
    heading: '#f2ebe1'
    outline: '#4a3826'
    outline-strong: '#8a7358'
    chip-bg: '#2b1d14'
    chip-selected-bg: '#f2ebe1'
    chip-selected-ink: '#6d2f1b'
    structure-soft: '#382619'
    structure-soft-ink: '#ecd7bd'
    action-soft: '#3e3110'
    tier: {bg: '#3e3110', ink: '#e9cb6b', line: '#6e5a1c'}
    allergen: {bg: '#6f2725', ink: '#ffd7d6', line: '#ffaaa8', glyph: '#ffaaa8'}   # D-10: tertiary-container · on-tertiary-container · tertiary · tertiary-fixed-dim
    destructive: '#a03325'
    on-destructive: '#ffffff'
    focus-ring: '#8ab1ff'
    status-positive: {bg: '#1d5c31', ink: '#c9f2d3', line: '#86d99a'}
    note-assurance: {bg: '#2b1d14', ink: '#f2ebe1', line: '#4a3826', glyph: '#f2ebe1'}
    count-neutral: {bg: '#382619', ink: '#f2ebe1', line: '#8a7358'}
    scrim: 'rgba(0,0,0,0.35)'
    shadow: {offsetY: 6, blur: 18, color: 'rgba(0,0,0,0.45)'}       # MA-8
    secondary-button: {line: '#8a7358', ink: '#f2ebe1'}
typography:
  fontFamily:                  # the theme switches the family with the UI locale's script (G-1)
    latin: Plus Jakarta Sans (expo-font, weights 400/500/600/700) — en, de, hu, lt, pl
    cyrillic: Onest (expo-font, weights 400/500/600/700/800) — be, uk
  display: Pacifico 400 (brand moments only; Latin + Cyrillic)
  stamp:                       # the provenance-stamp role only (MA-11, G-2)
    latin: Stardos Stencil 700
    cyrillic: Yeseva One 400
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

Pro Baker's color roles and ramps inherit from the web DESIGN.md verbatim; Home Baker declares
its own ramp (`colors-home`, MA-10/MA-18), and every semantic role it does not warm is named there
as inherited (allergen, destructive, focus ring, illustration canvas). **Contrast rules inherit
from the web DESIGN.md for both apps** — including the action-colour guard (never white text on
the action colour: lime's `#1d1e01` olive in Pro, gold's `#251a02` in Home; the action colour
carries meaning only when paired with text or a glyph), the fixed-surface/fixed-foreground
pairing rule, and WCAG AA (4.5:1 text, 3:1 boundaries). `packages/ui` tokens are generated from
this document's frontmatter, never hand-edited.

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

**Register of address is per app, in every UI language** (MA-20). **Home Baker addresses the
baker informally**: de *du*, hu *te*, lt *tu*, pl *ty*, be *ты*, uk *ти*. **Pro Baker addresses the
bakery formally**: de *Sie*, hu *Ön*, lt *Jūs*, pl the formal construction the translator chooses
(*Pan/Pani/Państwo* or an impersonal form), be *Вы*, uk *Ви*. English has no pronoun distinction,
so the register is carried by wording. Home stays warm and plain and may use contractions; **Pro
English is formal: no contractions, no casual idiom** ("cannot be recorded", not "can't be
recorded"). One app never mixes registers. The catalog review for each locale checks it.

**User-facing text says *device*, never *phone*, in every language** (MA-26; owner, 2026-09-24):
de *Gerät*, not *Telefon* or *Handy*; hu *eszköz*; lt *įrenginys*; pl *urządzenie*; be *прылада*;
uk *пристрій*. The apps are planned for tablets, and possibly as iOS apps running on macOS.
Internal names (classes, frame labels) are not user-facing. Both apps; a catalog test enforces it.

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
  - Pro Baker: **Labels · Recipes · Costing · Orders · More** (MA-23). There is no Production tab
    until a production-plan entity is specced (owner ruling). Destinations not yet in the app show
    an honest "not in the app yet" state. On tablet the rail is **light**, mirroring the web
    sidebar (`aria-current` equivalent: `accessibilityState.selected`), and carries the square
    mark; lime marks the active item. Navy chrome is not used, because the navy logo can never sit
    on navy.
- **More** (Home Baker, MA-24) holds Language, Clear my data on this device, and the app and
  version line — nothing else in 001.
- Modal flows (builder wizard, paywall, onboarding) present as full-screen sheets with an
  explicit close affordance top-left and never trap the user (hardware back always works).
- **More → Language** (MA-22). The seven UI languages are listed in their own names (English,
  Deutsch, Magyar, Lietuvių, Беларуская, Polski, Українська), each with its name in the current UI
  language beneath and tagged with its own language for assistive tech. The current language is
  marked. The device's language carries a "Your device’s language" tag, and until a language is
  picked the app follows the device (MA-26). Endonyms in another script set in that script's face (G-1:
  Cyrillic in Onest), never in a platform default. Corpus: `08-language.html`,
  `08-language-dark.html`.

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
shadows only on genuinely floating elements — sheets, menus, toasts, the detail hero's float
buttons. Light: `0 6px 18px` at `rgba(109,47,27,0.14)` (rust-tinted, ≤ 0.15). **Dark: `0 6px
18px` at `rgba(0,0,0,0.45)`** — on chocolate surfaces a 0.15 black shadow does not read. Shadows
go black in dark, rust-tinted in light (Home Baker; MA-8). No stacked z-index scale is defined yet; the first feature needing layered
stacking beyond the navigation/sheet defaults amends this document first (same growth rule as
the web z-index table).

## Components

Shared in `packages/ui`; every component ships with its accessibility props, not after them.

- **Recipe card:** illustration (4:3 in the card and list-row plate, `illustration-canvas`
  background) + title + meta row (time, difficulty, allergen glyphs) + **provenance badge —
  mandatory, never omitted** (constitution V): `Illustration (AI)` / `Photo — baked by Markus` /
  `Community photo`. This includes result lists (the Builder's rows carry the in-row stamp) and
  empty-state engravings (framed as a plate and stamped).
  Exclusive recipes carry a lock/tier chip; locked content shows a real preview, never a blurred
  tease (no dark patterns).
- **Provenance & tier badges:** text + glyph, color never alone.
  *Provenance:* rendered as a **rubber-stamp impression** (vintage voice). On an
  illustration (featured banner, detail hero, splash cover): the `provenance-stamp` role —
  **Stardos Stencil 700** in Latin-script locales, **Yeseva One 400** in Cyrillic-script
  locales (be, uk; G-2) — capitals by role, tracked ("AI illustration" → AI ILLUSTRATION; de
  KI-ILLUSTRATION), single unrounded 1px border, tilted **+5°** (clockwise), **rust structure
  ink** in Home Baker — text `rgba(122,53,32,0.92)`, border `rgba(122,53,32,0.8)` — on a faint
  translucent cream backdrop `rgba(251,247,238,0.6)` (Pro Baker's stamp keeps navy ink) —
  text-only, scheme-fixed, placed at the image corner (away from any control). **A catalog
  test checks each locale's stamp string against its stamp face's character map**, so no
  translation can silently fall back. In index rows: a quiet hairline stamp (transparent field,
  `outline-strong` border, `ink-2` text in capitals by the `provenance-chip` role) beside the
  allergen glyphs, with glyph
  ("Illustration (AI)" + sparkle / "Photo" + camera). Every AI illustration is stamped, the
  splash cover included.
  *Tier:* one treatment everywhere — label-sm on the app's `tier-chip` container (gold-tinted
  in Home Baker, lime-tinted in Pro Baker); locked content adds a lock glyph to the same chip,
  never a different chip. On the primary action surface use the app's `on-action` variant.
  Founder badge renders the number on the app's structure colour (rust in Home Baker, navy in
  Pro Baker) ("Founder #37 of 100") with the medal glyph.
- **Quantity stepper:** the workhorse of scaling — 44pt +/− targets, direct text entry on tap,
  `data-mono` value, unit label from the FID unit catalog, never a bare number.
- **Timers:** persistent chip while running (any screen), `accessibilityLiveRegion`/VoiceOver
  announcements at completion; multiple named timers listed in a sheet.
- **Allergen flags:** inherited rule verbatim — `tertiary` + glyph + accessible label naming
  the allergen; color never alone. Values, the same in both apps: light — bg `tertiary-fixed`
  `#ffd7d6`, ink `on-tertiary-fixed-variant` `#6f2725`, line `tertiary-fixed-dim` `#ffaaa8`;
  dark — bg `tertiary-container` `#6f2725`, ink `on-tertiary-container` `#ffd7d6`, line
  `tertiary` `#ffaaa8`, glyphs `tertiary-fixed-dim` `#ffaaa8` (8.0:1 ink on bg in both schemes;
  D-10, owner walk 2026-09-23). Allergen colour means allergen: no other element borrows it. Allergen data renders only from FID joins (constitution IV);
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
- **Buttons:** primary = the app's action fill with its near-black text (Home Baker: gold
  `#dfa621` / `#251a02`; Pro Baker: lime `#b9bf05` / `#1d1e01`); secondary = the app's
  structure outline (rust / navy), and in dark the `outline-strong` edge with `ink` text; destructive = the `destructive` role pair (oxblood
  family, both schemes — e.g. the swipe-remove action) with confirmation step or undo. One
  primary action per screen.
- **Clear my data** (Home Baker, MA-24) confirms in a bottom sheet that names what is deleted
  (dietary profile, choice of units, pantry staples), says the user starts again from the first
  question and that it cannot be undone, and that the app language stays. **Cancel and the
  destructive action are the same size.** Corpus: `09-more-clear-data.html`.
- **Retry appears only after a real failure or a timeout** (MA-24), never as a resting state. A
  connect-once state with nothing to retry has no action (`01-recipes-connect-once.html`).
- **Unbuilt tabs** (MA-24) show an engraving, one sentence, and one quiet action back to Recipes
  (`03-builder-soon`, `04-pantry-soon`, `05-shopping-soon`, each with a dark twin).
- **Pro Baker's Label desk** (MA-23; corpus `mobile/pro-baker/`, 29 frames):
  - **Readiness and cell states** are text + glyph: Ready (success), N Incomplete (error),
    **Not Issuable Yet** and **Not Yet Possible** (neutral, dashed — a gap the bakery *cannot*
    fix, e.g. P-02 Additives, is never error colour and never a path to a fix).
  - **The rendered label is printed matter**: white in both schemes, emphasis only where the api
    marks it, each nutrition value tappable for its source figure and rounding rule.
  - **The match verdict is the server's**, with its check time; a comparison with the current
    preview marks no differences.
  - **The plan screen** gives "Plans on nutrimero.org" and "Not Now" equal weight, with nothing
    purchased in-app.
  - **Sign-in:** "Sign in with your nutrimero.org account" (email and password, a link-out for
    accounts and recovery). The provider row is reserved for Google and Apple (a pair) and HÁLÓS,
    and stays collapsed until they ship; provider buttons use each provider's official assets.
  - **Label languages:** the selector offers the five EU label languages the api proves (en, de,
    hu, lt, pl), independent of the UI language.
- **Status, count and note roles are named, never borrowed** (MA-21). `status-positive` (the
  web `success` family, verbatim) marks a good status — the cheapest basket, a full pantry match.
  `note-assurance` (surface-1, outline edge, ink text, heading glyph) carries a quiet reassurance
  panel. `count-neutral` (surface-2, heading ink, outline-strong edge) shows a plain count, such as
  the founders seats left. **Tier stays one treatment, used only for tiers; allergen colour means
  allergen.** Values in `colors-home`.
- **Focus ring:** `focus-ring` inherited from the web verbatim — `#1d62ed` light, `#8ab1ff`
  dark — in both apps, independent of the brand ramp so keyboard focus is **never confusable
  with a brand state** (D-9). Home Baker: 4.9:1 on surface, 4.4:1 on surface-1; 8.3:1 on dark
  surface.
- **Prices** are formatted by locale, never by hand: en `€6.40` (symbol first, no space), de
  `6,40 €`, lt `6,40 €`; prices take `data-mono` tabular figures (MA-16).

## Typography rules

- Plus Jakarta Sans for all body, UI and control text in **Latin-script locales (en, de, hu,
  lt, pl)**; **Onest** (expo-font, weights 400/500/600/700/800) for all of it in
  **Cyrillic-script locales (be, uk)** (G-1). The theme switches the family with the locale; no
  component chooses a face. No platform-default fallbacks in shipped UI. *Build-time item:*
  React Native has no per-glyph fallback between custom fonts, so Cyrillic data inside a
  Latin-script UI must be verified — rendered through a text component that selects Onest when
  the string contains Cyrillic, or recorded as a known limitation; never left to chance.
- **Stamp face: Stardos Stencil 700** (Latin) / **Yeseva One 400** (Cyrillic, be/uk; G-2) —
  the on-image provenance stamp ONLY (the `provenance-stamp` role). The splash wordmark's weight
  800 is the only use of 800, and it belongs to the `splash-wordmark` role.
- **Display face: Pacifico** (Google Fonts, 400) — **the splash title and every page title**, the
  H1 of every Home Baker screen, present and future: tab mastheads, More, Language, the onboarding
  steps, the recipe detail's title, the paywall headline (MA-25; owner, 2026-09-24). Titles may
  wrap to two lines. **Steps are not page titles:** baking mode's H1 is the current *step*, an
  Operate instruction, and stays in the UI face, as does any step-by-step instruction heading.
  Never in body, rows, buttons, chips, or any Operate control. Chosen for the 1950s–60s cookbook voice (period-true brush
  lettering revival) and for charset coverage: Latin, Latin-Ext, Cyrillic, Cyrillic-Ext,
  Vietnamese — covers all seven UI locales, be and uk included (verified). Masthead metrics
  31/46; splash 56/86.
- **Casing lives in the localized strings; CSS never cases authored text — except these named
  roles, which set every string they carry in capitals in every locale:**
  1. `provenance-stamp` — the on-image rubber stamp ("AI illustration" / "KI-Illustration");
  2. `provenance-chip` — the in-row provenance stamp ("Illustration (AI)");
  3. `splash-wordmark` — the typeset brand word on the splash band. Its string is the
     lowercase brand `nutrimero` and it may carry **no other string**;
  4. `splash-caption` and `splash-tagline` — the cover's plate caption and tagline (owner walk
     2026-09-23: "casing should not be from string, but leave styled").

  No other element may borrow these roles. Data (recipe and ingredient names) is never re-cased.
  **The brand is `nutrimero`, lowercase, in every string.**
- **Home Baker writes sentence case everywhere** — headings, buttons, labels, tabs, chips ("Start
  baking mode", "Bake tonight", "Gluten-free"). A recorded deviation from the global Title Case
  rule (DEVIATIONS.md D-7). Brand and product names keep their own casing (`nutrimero`,
  "Founders’ Lifetime"). Pro Baker follows the global rule.
- **Dynamic Type / font scaling is supported, not fought:** `allowFontScaling` stays on; only
  `data-mono` in Floor Mode may cap scaling (it is already enlarged). UI languages are **en, de,
  hu, lt, be, pl, uk**. Layouts are tested at 1.3× text in every one, and five are **named
  stress witnesses** every screen is checked against before it is done: **de** (long
  compounds), **hu** (long agglutinative words), **pl** (length and stacked diacritics), **be**
  and **uk** (Cyrillic, set in Onest). A screen that clips meaning in any witness is not done.
- Numbers that users compare (weights, prices, percentages) always use `data-mono` with tabular
  figures; body text never carries aligned numeric columns.

## Imagery

- Recipe illustrations: **monochrome ink-engraving style** (chosen 2026-09-21 from the
  Home Baker comp set) — sepia/ink line work with visible hatching on the cream
  `illustration-canvas`, **generated** at 4:3 and cropped to the slot it fills — the recipe card
  and list-row plates show it at 4:3; heroes and banners (detail hero, drop card) crop it to their
  own frame (`object-fit: cover`), centred subject preserved — generous negative space, no text baked into
  images (text belongs to the UI layer, where it localizes). Canonical reference set:
  `nutrimero-design/mobile/_explorations/illustration/variant2/` (generation is seed-conditioned
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
  inner hairline frame (the app's structure ink — **rust `#7a3520` at 30%** in Home Baker, navy
  at 28% in Pro Baker — 5px inset, **square corners** — printed rules are never
  rounded); ceremonial plates (splash cover) use a square double rule (border + offset
  outline).
- **Fleuron divider** (rule–diamond–rule) marks ceremonial moments only (splash, paywall
  headline) — never list sections.
- **Plate captions** in tracked small caps ("Plate I · Rustic sourdough") where an engraving
  is presented as a plate.
- **Splash = the cover** (Split-Band composition, owner-approved 2026-09-23): a **rust structure
  band** (~34% of frame) carrying the typeset word `nutrimero` in capitals by the
  `splash-wordmark` role above the Pacifico title; the cream field carries the captioned plate
  (rust double frame; **nothing navy on the cover**), one 2px printer's rule in the app's action
  colour (gold in Home Baker), the indeterminate loading dots in the same colour (the only moving
  element), and at the foot the **real logo artwork, unrecoloured, 100pt wide**, on the cream
  field as the publisher's imprint. There is no reversed lockup: the logo is never recoloured
  (web *Brand Mark*). The cover is **scheme-fixed** in fact, not only in intent: every ink on the
  cream field (caption, tagline, home indicator) is pinned to its light value, never a scheme
  variable; status bar light-content. The native static splash is the cream field.

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

- 0.5.2 (2026-09-24) — ported from `nutrimero-design:mobile/AMENDMENTS.md` at design `32a4a1aa`
  by the Home lane: MA-23 Pro Baker's Label desk as approved (tabs Labels · Recipes · Costing ·
  Orders · More, light rail, readiness states, printed-matter label, server match verdict, plan
  screen, sign-in, label languages); MA-24 the Home shell (More, Clear my data sheet with
  same-size actions, retry only after a real failure, unbuilt tabs); MA-25 Pacifico sets every
  page title, steps excepted; MA-26 "device", never "phone" — including MA-22's Language tag.
- 0.5.1 (2026-09-23) — ported from `nutrimero-design:mobile/AMENDMENTS.md` at design `4cf875b6`
  (C1 at `a7e02fd2`), by the Home lane: MA-18's `colors-home` re-pasted whole — the C1–C4 roles
  are ruled, so `status-positive`, `note-assurance` and `count-neutral` join both schemes
  (MA-21); MA-20 register of address per app; MA-21 named status/count/note roles, never
  borrowed; MA-22 the Language picker under *Navigation*. Tokens regenerated.
- 0.5.0 (2026-09-23) — ported from `nutrimero-design:mobile/AMENDMENTS.md` (design repo main,
  proof commit `263ecc31`; G-1/G-2 at `fb999ed6`), by the Home lane: MA-1 per-app tier chip
  (gold in Home, `on-action`); MA-2 rust stamp, +5°; MA-3 `provenance-on-image` carries the
  stamp; MA-4 rust plate frame at 30%; MA-5 the approved splash (rust band, typeset `nutrimero`,
  real logo unrecoloured, nothing navy); MA-6 buttons and founder badge in the app's colours;
  MA-7 ratification status stated; MA-8 the dark shadow the corpus draws; MA-9 4:3 scoped to the
  recipe card; MA-10/MA-18 Home Baker's full ramp declared as `colors-home` (two rusts); MA-11
  stamp face under Typography; MA-12 functional focus ring (D-9); MA-13 inherited oxblood
  allergen family (D-10); MA-14 casing as four named roles, brand lowercase `nutrimero`; MA-15
  sentence case as Home's voice (D-7); MA-16 one price format; MA-17 provenance on builder rows
  and empty-state engravings; MA-19 seven UI languages with five 1.3× stress witnesses; G-1 Onest
  for Cyrillic UI text; G-2 Yeseva One for the Cyrillic stamp. **Not ported:** the C1–C4
  semantic roles (pending the owner). MA-14 follows the owner's walk (caption and tagline are
  roles), which widens the coordinator's two-role ruling — flagged in DEVIATIONS.md D-8.
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
  (`nutrimero-design:mobile/home-baker/`), amended at Aliaksandr's direction: recipe imagery
  style replaced with the monochrome ink-engraving set (variant2) with cream plates
  scheme-fixed; new mobile color roles `destructive` (oxblood family, light+dark),
  `tier-chip` (incl. `on-lime` variant) and `provenance-on-image`; provenance/tier badge
  placement and one-chip-treatment rule; icon section split into UI chrome glyphs (filled,
  incl. the built tab set) and the owned diet/allergen stroke set shared with the web, with
  the strike ("-free") grammar; destructive button role bound to the new pair.
- 0.1.0 (2026-09-21) — initial draft, pre-UI: token inheritance, per-app temperaments, Floor
  Mode, provenance badges, core component rules. Pending ratification by Aliaksandr; expected
  to be amended heavily once the first real screens exist.
