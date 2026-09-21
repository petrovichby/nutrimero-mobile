# Graphic assets checklist

Tracked inventory of every visual asset the mobile apps need. Derived from
[`nutrimero-mobile-ideation.md`](./nutrimero-mobile-ideation.md) §13.2 and §3.3.

Conventions:
- Brand tokens: lime `#b9bf05`, navy `#1b1f58` (source of truth: `nutrimero-design` `_registry` / `nutrimero-web` `globals.css`).
- Icon family concept: **inverted pair** — Home Baker = lime field / navy mark, Pro Baker = navy field / lime mark.
- AI-generated artwork is allowed for illustration-style assets only, under the imagery policy (illustration style, never photorealistic, always labeled). Icons and lockups get a human-finished pass.
- Asset sources live in `nutrimero-design` (new `mobile/` set, same idempotent-generator discipline); exports are consumed here.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## 1. App icons — blocks M1 beta

### Nutrimero Home Baker
- [ ] iOS master icon 1024×1024 (light)
- [ ] iOS dark variant
- [ ] iOS tinted variant (grayscale, transparent bg)
- [ ] Android adaptive: foreground layer (108dp grid, safe zone respected)
- [ ] Android adaptive: background layer
- [ ] Android 13+ monochrome layer (themed icons)
- [ ] Notification icon (flat, white, transparent bg, 96×96)

### Nutrimero Pro Baker
- [ ] iOS master icon 1024×1024 (light)
- [ ] iOS dark variant
- [ ] iOS tinted variant
- [ ] Android adaptive: foreground layer
- [ ] Android adaptive: background layer
- [ ] Android 13+ monochrome layer
- [ ] Notification icon

## 2. Identity lockups

- [ ] Master Nutrimero logo exported as clean SVG + PNG set (from `nutrimero-web` brand-mark)
- [ ] Home Baker lockup — horizontal, light + dark
- [ ] Home Baker lockup — stacked, light + dark
- [ ] Pro Baker lockup — horizontal, light + dark
- [ ] Pro Baker lockup — stacked, light + dark
- [ ] Cross-promo banner for nutrimero.org ("Get the app")

## 3. Splash screens — blocks M1 beta

- [ ] Home Baker splash (Expo config), light + dark
- [ ] Pro Baker splash, light + dark

## 4. Store listing assets — blocks store submission (M1/M2)

Per app × per locale (launch locales: **en, de, lt**).

### App Store (iOS)
- [ ] iPhone 6.9" screenshots, 1320×2868, 3–10 frames — Home Baker × en/de/lt
- [ ] iPhone 6.5" screenshots, 1284×2778 — Home Baker × en/de/lt
- [ ] iPhone screenshots — Pro Baker × en/de/lt
- [ ] iPad 13" screenshots, 2064×2752 — **Pro Baker (mandatory, tablet-first)** × en/de/lt
- [ ] iPad screenshots — Home Baker (optional)
- [ ] App preview video 15–30s — Home Baker (optional, high-converting)
- [ ] App preview video — Pro Baker (optional)

### Google Play
- [ ] Phone screenshots — Home Baker × en/de/lt
- [ ] Phone screenshots — Pro Baker × en/de/lt
- [ ] Tablet screenshots — Pro Baker × en/de/lt
- [ ] Feature graphic 1024×500 — Home Baker
- [ ] Feature graphic 1024×500 — Pro Baker
- [ ] Play icon 512×512 — both apps

Note: design screenshots as narrative marketing frames (headline + UI), not raw screen grabs. Build one template, then localize text per market.

## 5. In-product content assets — produced alongside recipes (M0)

- [ ] **Recipe illustration style guide** — prompt templates + reference sheet locking style, palette, composition; the one-time effort that makes batch generation cheap and consistent
- [ ] Category icons: breads, rolls/buns, cakes, cookies, laminated pastry, tarts/pies, quick breads, desserts, seasonal (flat, token-colored)
- [ ] Tool icons for the tool cupboard: scale, thermometers, mixers, bowls, scraper, tins, banneton, lame, Dutch oven, piping set, … (match category-icon style)
- [ ] Provenance label badges: "Illustration (AI)" · "Photo — baked by Markus" · "Photo — baked by Aliaksandr" · "Community photo"
- [ ] Founder badge, numbered template ("Founder #N of 100")
- [ ] Tier badges: Plus, Premium (paywall + profile)
- [ ] OG/social share image template (recipe title + illustration + brand frame)

## 6. Supporting / easy to forget

- [ ] Empty-state illustrations: empty pantry, empty tool cupboard, no search results, offline/no data (illustration style)
- [ ] Error-state illustration (generic)
- [ ] Paywall artwork (subscription screens, both apps)
- [ ] Onboarding illustrations (units, dietary profile, pantry seeding steps)
- [ ] Favicon / web-app icons for cross-promo and policy pages
- [ ] Email header/footer graphics (transactional emails: recovery, receipts)

---

## Effort notes

| Batch | Effort shape |
|---|---|
| 1–3 (icons, lockups, splash) | Few days of focused design; human-finished pass required — the icon is the most-seen pixel in the product |
| 4 (store sets) | Template once, then repetitive per-locale production; regenerate at every major UI change |
| 5 (content assets) | Style guide is the one-time investment; everything after is cheap batch generation under the labeling policy |
| 6 (supporting) | Fill in during M1 development as screens materialize |
