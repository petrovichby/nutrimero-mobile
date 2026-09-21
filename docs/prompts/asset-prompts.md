# Generation prompts — immediate assets

Prompts for Nano Banana (Gemini image generation). Scope: the immediate batch from
[`ASSETS.md`](./ASSETS.md) — two app-icon masters and the recipe-illustration style seed.
Everything generated here falls under the imagery policy (ideation doc §3.3): illustration
style only, labeled provenance.

**Workflow rules:**
- Icons: Nano Banana output is a *concept draft*. The chosen candidate gets recreated as clean
  vectors before shipping (adaptive-icon layers and the iOS tinted variant require it).
- Illustrations: the approved style seed becomes the canonical reference image — commit it to
  `nutrimero-design` and condition every subsequent recipe illustration on it.
- Generate 4–6 variants per prompt; iterate wording rather than settling for a near-miss.

---

## 1. App icon — Nutrimero Home Baker (lime field / navy mark)

```
Flat minimalist mobile app icon design, full-bleed square, no rounded corners, no drop shadow,
no text. Solid chartreuse-lime background, hex #b9bf05. A single centered glyph in deep navy
blue, hex #1b1f58: a simple geometric round bread loaf with three curved score lines on top,
drawn as one bold clean vector shape. Flat 2D vector style, no gradients, no outlines, no
texture, generous even margins around the glyph, crisp edges, professional app icon quality.
```

## 2. App icon — Nutrimero Pro Baker (navy field / lime mark, same glyph family)

```
Flat minimalist mobile app icon design, full-bleed square, no rounded corners, no drop shadow,
no text. Solid deep navy blue background, hex #1b1f58. A single centered glyph in
chartreuse-lime, hex #b9bf05: the same simple geometric round bread loaf with three curved
score lines, placed on a minimal flat baker's peel handle extending diagonally beneath it,
drawn as one bold clean vector shape. Flat 2D vector style, no gradients, no outlines,
generous even margins, crisp edges, professional app icon quality.
```

Family logic: shared loaf glyph = brand family; the baker's peel = "professional" signal.
The inverted color pair makes the two apps distinguishable at a glance on a home screen.

## 3. Recipe illustration — style seed

```
Warm editorial flat illustration of a rustic sourdough bread loaf on a linen cloth, viewed at
a slight three-quarter angle. Limited palette: cream background (#f7f4ec), warm terracotta and
honey-brown tones for the food, deep navy blue (#1b1f58) for line accents and shadows, a
single chartreuse-lime (#b9bf05) accent detail. Soft subtle grain texture, simplified shapes,
gentle rounded forms, cozy and appetizing but clearly an illustration — absolutely not
photorealistic. Centered composition, 4:3, generous negative space, no text, no border,
no people.
```

## 4. Recipe illustration — series template (after the seed is approved)

Attach the approved seed image as reference, then:

```
In the exact same illustration style, palette, grain texture, and composition as this
reference image: [SUBJECT — e.g. "a braided challah on a wooden board",
"three linzer cookies with jam centers on a small plate",
"a cinnamon babka loaf with one slice cut"].
Cream background, 4:3, centered, generous negative space, no text, clearly an illustration,
not photorealistic.
```

Keep a running list of generated subjects next to the recipe pipeline so illustrations are
batch-produced with content drops.

---

Deferred (not generation-blocking now): splash screens and lockups (compositing from the
final icon/mark), store screenshots (need real UI), category/tool icons (derive from the
approved icon glyph language), founder/tier badges, OG template.
