---
version: 1
slug: "artifacts-raw-layout-impeccable"
primary_target: "__artifacts__/raw/layout/impeccable"
related_targets: []
---

# Surface brief — Home Baker v1 design comps (`__artifacts__/raw/layout/impeccable`)

Scope: high-fidelity phone comps (static HTML, 390×744 safe area) for Nutrimero Home Baker v1
screens per `docs/prompts/design-prompt-home-baker.md`. Mode: **Operate**. Style-setting pair
first (Recipes home + Recipe detail: light, dark, screen 1 also in German), remaining five
screens after the pair is approved. Output naming mirrors sibling comp sets
(`claude-design/`, `stitch/`).

Audience/job: home baking enthusiast deciding what to bake and executing it — kitchen scene,
one-handed, possibly floury hands.

Constraints (pinned): visual world fixed by `docs/DESIGN.md` — do not reinterpret. Provenance
badge on every recipe image; allergens always glyph + text (oxblood), never color alone;
44pt targets; labeled 5-tab bar (Recipes · Builder · Shopping · Pantry · More); no
photorealistic imagery; locked content shows real previews with a chip, never blurred;
German strings must survive ("Schokoladen-Sauerteigbrot"); prices labeled "estimated";
authored recipe content must be bake-realistic (no lorem ipsum). Approved illustration style
seed: `__artifacts__/raw/illustration/chatgpt-illustration.png`.

Unresolved: final app name (working title), real recipe corpus (comp content is authored
demonstration data).

## Direction contract

THESIS: The recipes tab is a cookbook index — every row one complete, comparable fact
(illustration, title, time, difficulty, allergens, provenance); it refuses the category's
hero-carousel-plus-card-masonry magazine default.

OWN-WORLD: Cream `#f7f4ec` illustration plates in soft-technical 8pt frames on warm-white
ground; navy `#1b1f58` structure; lime `#b9bf05` only on actions/selection, always with
olive `#1d1e01` text; oxblood allergen chips; Plus Jakarta Sans, tabular figures on every
number.

STORY: A baker opens the tab, sees this month's drop, scans the index band by band, and
picks tonight's bake knowing effort and allergens before tapping.

FIRST VIEWPORT: Masthead "Recipes"; September-drop banner (illustration right, Plus chip,
provenance badge); category chips; ≥3 index rows; labeled 5-tab bar. Signature interaction:
the recipe-detail serving scaler live-recalculating tabular gram amounts; motion 150–250ms
ease-out, one authored moment per screen.

FORM: Cookbook Index, rank 4/7 of the grounded list, seed 2f9a91fd; raises: strict
horizontal banding + text-named states (cyclorama, declined), full-commitment banner
illustration with low-anchored caption (vertical feed, declined).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Decisions log

- 2026-09-21 — Finish review round 1 (disposition: fix). All mechanical fixes applied
  (locked-row provenance badge, 44pt category chips, unified tier chip on lime container,
  sr-only allergen labels + RN annotations in NOTES.md, motion spec in NOTES.md).
- 2026-09-21 — Illustrations: user directs external raster generation in the approved seed
  style (prompts in `assets/GENERATION-PROMPTS.md`); flat SVGs stand as interim placeholders
  with automatic PNG swap (`onerror` fallback). This is a handoff, not a downgrade of the
  seed's authority.
- 2026-09-21 — Illustrations delivered: user generated two sets and directed use of the
  variant2 monochrome ink-engraving set (assets/variant2/image0–4 → wired as ill-*.png,
  provenance embedded). The unchosen full-color seed-style set remains at assets/image1–4.png.
  Note: DESIGN.md's imagery section still describes the warm color style — if the engraving
  rendition becomes canonical, that section needs a user-ratified amendment (not performed
  here).
- 2026-09-21 — Batch 2 (Builder + empty, Pantry, Shopping, Paywall, Onboarding ×3) built,
  detector-cleaned, finish-reviewed: round 1 disposition fix (8 findings), all 8 scored
  resolved on the verdict pass; disposition ship. Set complete (17 frames). Open handoffs:
  optional engraved raster ill-empty-pantry.png (prompt queued); DESIGN.md amendments pending
  user ratification (imagery style = engraving set; new tokens: --destructive pair, tier-chip
  treatment incl. on-lime variant, tab glyph set).
- 2026-09-21 — DESIGN.md amended to 0.2.0 at the user's direction: engraving imagery style
  (variant2) canonical, `destructive` / `tier-chip` (+on-lime) / `provenance-on-image` roles,
  badge placement rules, icon families + strike grammar. Engraved empty-pantry raster
  (ill-empty-pantry.png) delivered by the user and wired into the Builder empty state.
  No open handoffs remain.
