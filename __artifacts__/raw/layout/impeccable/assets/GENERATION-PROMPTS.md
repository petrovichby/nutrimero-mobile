# Illustration generation handoff

## 0. App icon — Home Baker, warm "Crust & Butter" version (replaces the lime/navy draft)

Generate at 1024×1024 (no reference image needed). Nano Banana / Gemini:

> Flat minimalist mobile app icon design, full-bleed square, no rounded corners, no drop
> shadow, no text. Solid butter-gold background, hex #dfa621. A single centered glyph in deep
> rust-brown, hex #7a3520: a simple geometric round bread loaf with three curved score lines
> on top, drawn as one bold clean vector shape in the manner of a 1960s cookbook cover
> ornament. Directly beneath the loaf, a small printer's fleuron: a thin horizontal rule
> interrupted at its center by one small solid diamond, in the same rust-brown. Flat 2D
> vector style, a very subtle letterpress ink texture is allowed, no gradients, no outlines,
> generous even margins around the glyph, crisp edges, professional app icon quality.

Family logic unchanged: the shared loaf glyph is the brand family; Pro Baker keeps the navy
field / lime mark pair. Save the chosen candidate as
`__artifacts__/raw/icon/icon-home-warm.png`; the shipped icon still gets the human-finished
vector pass (ASSETS.md §1).

The comps prefer raster illustrations and fall back to the flat SVG placeholders until the
PNGs exist. Generate each image below (Nano Banana / Gemini, per `docs/prompts/asset-prompts.md`),
**attach the approved style seed as the reference image**
(`__artifacts__/raw/illustration/chatgpt-illustration.png`), then save the result into this
`assets/` folder under the exact filename. Reload the comp — it picks the PNG up automatically.

Format: 4:3, ≥1200×900, cream background `#f7f4ec`. After dropping files in, tell Claude to
re-run the provenance embed + recapture screenshots.

## 1. `ill-choc-sourdough.png` (drop banner + recipe-detail hero)

> In the exact same illustration style, palette, grain texture, and composition as this
> reference image: a chocolate sourdough boule with a deep cocoa-brown crust, two curved
> score lines revealing a slightly lighter crumb, a few dark chocolate chunks visible, light
> flour dusting, resting on a cream linen cloth with thin navy stripes. Cream background,
> 4:3, centered, generous negative space, one small chartreuse-lime wheat-sprig detail,
> no text, clearly an illustration, not photorealistic.

## 2. `ill-butterzopf.png`

> In the exact same illustration style, palette, grain texture, and composition as this
> reference image: a golden braided butter loaf (Butterzopf) with glossy egg-washed strands,
> on a pale wooden board. Cream background, 4:3, centered, generous negative space, one small
> chartreuse-lime leaf detail, no text, clearly an illustration, not photorealistic.

## 3. `ill-linzer.png`

> In the exact same illustration style, palette, grain texture, and composition as this
> reference image: three round Linzer cookies with red-jam centers and powdered sugar, on a
> small plate with a thin navy rim. Cream background, 4:3, centered, generous negative space,
> one small chartreuse-lime leaf detail, no text, clearly an illustration, not photorealistic.

## 4. `ill-empty-pantry.png` (builder empty state — replaces the inline line-art cupboard when it lands; tell Claude to wire it)

> In the exact same illustration style as this reference image: an open, almost-empty kitchen
> cupboard with two shelves, a single small storage jar on the lower shelf and a few crumbs,
> drawn with visible engraving hatching. Cream background, 4:3, centered, generous negative
> space, no text, clearly an illustration, not photorealistic.

## 5. `ill-zwetschgen.png`

> In the exact same illustration style, palette, grain texture, and composition as this
> reference image: a rectangular slice of Zwetschgendatschi (Bavarian plum sheet cake) with
> rows of deep purple-navy plum wedges and streusel crumbs, on parchment. Cream background,
> 4:3, centered, generous negative space, one small chartreuse-lime leaf detail, no text,
> clearly an illustration, not photorealistic.
