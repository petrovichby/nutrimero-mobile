# Nutrimero Mobile Apps — Product Ideation & Architecture Analysis

**Date:** 2026-09-21
**Prepared as:** PM / solution-architect ideation (analysis only, nothing built)
**Inputs:** survey of `nutrimero-api`, `nutrimero-web`, `nutrimero-docs`, `nutrimero-design`; discovery answers from Aliaksandr

---

## 1. Executive summary

- **Portfolio:** Two launch apps — **Nutrimero Bake (home bakers)** and **Nutrimero Pro Bakery (professional)** — on a shared React Native codebase, with the platform designed so later verticals (meal prep, allergy shopping, small food producers) are new "skins + feature packs," not new codebases.
- **Tech stack — DECIDED (Aliaksandr, 2026-09-21): React Native + Expo.** The Flutter question is closed. It was barely a contest for this project — `MIGRATION_PLAN.md` §2.4 already pointed here, the API contract tooling (OpenAPI 3.1 → `openapi-typescript` → `openapi-fetch`) carries over unchanged, and a solo TypeScript developer working with Claude Code gets one language across the whole stack (rationale record in §6).
- **Monetization: hybrid, not pure one-off and not pure subscription.** The features that make the apps worth paying for — live retail prices, LLM recipe generation, monthly recipe drops — all have *recurring* marginal costs, so a one-off price structurally loses money on your best users. Recommendation: free-to-download app + one modest subscription tier for home bakers (~€3–4/mo or €25–30/yr), and per-seat B2B SaaS pricing for the professional app (~€19–39/mo per bakery). Numbers in §5.
- **Market sequencing (decided 2026-09-21):** **DACH first** (Markus's domain and contacts, highest willingness to pay), **Lithuania** as the low-cost pilot market (Aliaksandr is on the ground there), then Poland/CEE and Benelux/Nordics after the price-data pipeline is proven. Launching price data in all four regions at once was rejected as the most expensive, least validated item on the wishlist.
- **Hard prerequisite:** the API currently has **no recipe domain at all** (identity, company, and FID reference data only — no recipes, search, push, offline sync, or entitlements). The mobile plan is gated on the web platform's Phase 2–3 roadmap shipping recipes first. §7 lists the exact API work mobile needs.
- **One discrepancy to resolve:** `PRODUCT.md`/`MIGRATION_PLAN.md` claim API features 010 (branded products) and 011 (purchased items) merged in early September, but the local `nutrimero-api` checkout's `origin/main` is still at feature 004. Either newer work lives in the `151Concepts` org remotes or the docs are ahead of the code — worth checking before planning against the contract.

---

## 2. Where the platform stands today (grounding)

What exists and matters for mobile:

| Asset | State | Mobile relevance |
|---|---|---|
| `nutrimero-api` (NestJS 11, Postgres 17, Drizzle) | Identity + multi-tenant companies + FID reference data (~6,000 ingredients, 64 locales), 56 endpoints under `/api/v1` | The foundation is deliberately mobile-ready: bearer JWT + rotating refresh tokens (ADR 0004 chose tokens over cookies *for mobile*), versioned routes, pagination, typed error codes |
| OpenAPI 3.1 contract with CI drift gate | Committed artifact, generates the web client via `openapi-typescript` | The same generated client works unchanged in React Native — this is the single strongest argument for the RN stack |
| `nutrimero-web` (Next.js 16, React 19) | App shell + placeholders; no recipes UI yet | Little UI to share, but message catalogs (en/de/hu), the nav model with `professionalOnly` visibility, and design tokens are portable |
| `nutrimero-docs` | Migration plan, product truth, Markus's domain corpus (nutrition algorithms, QUID rules, `.rex` recipe schema) | §2.4 already specs mobile: "React Native via Expo … the API contract is the mobile-readiness guarantee." Offline recipe viewing is flagged as an open question for Markus |
| `nutrimero-design` | ~62 normalized screens, light+dark, clickable prototype | Direct visual reference, but desktop/tablet-oriented — phone layouts are new work |
| Hobby Mode | Per-company boolean toggles (`price_calculation_enabled`, `declarations_enabled`), explicitly *not* a paid tier | The nearest thing to an entitlement system; a real entitlements model is missing and needed for paid apps (§7) |

**What does not exist yet (all needed before or alongside mobile):** recipe/product/declaration endpoints, any search, push notifications (only a logging stub), offline/delta sync, image/asset endpoints, payments or entitlements, price/vendor data endpoints.

---

## 3. App portfolio

### 3.1 Nutrimero Bake — home bakers (B2C, launch app #1)

The consumer wedge. Positioning: *"the baking app made with a professional bakery consultant, backed by a real food-science database."* The FID nutrition/allergen depth is a genuine differentiator over recipe-blog apps.

**Core value vs. free nutrimero.org:**
1. **App-exclusive recipe collection** — 50–100 professional-grade recipes at launch, curated by Markus + Aliaksandr, ~10/month after. Each recipe carries what only Nutrimero can attach: exact nutrition per slice, allergen declarations, baker's percentages, scaling.
2. **Pantry-based recipe builder (hybrid)** — free/included tier: deterministic matching (rank recipes by % of pantry ingredients on hand, substitution suggestions from a rules table over the FID physical model — zero marginal cost, works offline). Premium tier: LLM-powered generation/adaptation via a server-side Claude API proxy (metered, subscription-gated).
3. **Shopping lists with EU retail prices** — build a shopping list from a recipe, see estimated basket cost per nearby chain (Lidl, Rewe, Edeka, Maxima, Biedronka…). This is the feature with the hardest data problem (§8) and the clearest recurring-cost signature.
4. **Online cart handoff ("Shop this list")** — match the shopping list to online grocery retailers and hand the basket over for checkout. Lithuania pilot targets: **Barbora** (Maxima), **Rimi online**, **Iki e-parduotuvė**; DACH later (Rewe online, Knuspr, Flink). Delivered in tiers — deep links first, real cart integration only where a partnership materializes (§8.5). This is the feature that turns price data from informational into transactional, and it opens an affiliate-commission revenue stream on top of the subscription.
4. **Baking-specific tooling:** oven timers with recipe steps, hydration/baker's-% calculator, tin-size scaling, unit conversion using the FID unit catalog, offline recipe viewing (kitchen use — flour-covered hands, no signal in the pantry).
5. **Toolkit ("tool cupboard") + gear guide** — the equipment counterpart to the pantry: mark which tools you own, every recipe shows a "you'll need" checklist, the builder can filter to recipes you can actually make ("no stand mixer → hand-knead recipes"), and a Markus-curated gear guide with affiliate purchase links monetizes the gaps (§3.4).

### 3.2 Nutrimero Pro Bakery — professional bakeries (B2B, launch app #2)

Rides on the existing multi-tenant company model (roles, memberships, invitations already shipped in the API). Positioning: *"your recipes, costing, and ordering on the bakery floor."*

**Core value:**
1. **Bakery-floor recipe access** — production-scaled recipes (batch scaling from the `.rex` genealogy model), offline-first, tablet-friendly. This directly answers the open question in `MIGRATION_PLAN.md` §2.4: yes, offline viewing is a requirement — bakery floors are exactly the flagged use case.
2. **Costing & margin** — recipe cost from purchased-item prices (the web platform's price-calculation domain, surfaced mobile).
3. **Wholesaler ordering** — build purchase orders from production plans, send to suppliers. **Start manual, not integrated:** generate a structured order (PDF/email/EDI-lite) from the recipe plan and send it to the supplier the bakery already uses. Real supplier API integrations (Transgourmet, Bäko, local millers) come only after pilots prove demand. Markus's contacts are the entry point: target **3–5 pilot bakeries in DACH** as design partners before writing any integration code.
   - **Online wholesaler handoff (LT pilot):** where the wholesaler already runs an e-shop — e.g. **e-promo Cash & Carry** (Promo/Sanitex) in Lithuania — the order document can be upgraded to a pre-filled online cart or a structured order file matching their upload format. This is a cheaper first "integration" than a real API partnership and a good LT-side counterpart to the DACH manual-order pilots (§8.5).
4. **Team features** — the API's membership roles map directly: admin configures recipes/suppliers, editors adjust batches, viewers (floor staff) execute.
5. **Regional equipment-supplier directory** — deliberately *not* affiliate product links (decided 2026-09-21): professional equipment (deck ovens, spiral mixers, dividers, retarder-proofers) is bought through regional dealers with installation, service, and financing attached, so the Pro app offers a Markus-curated directory of equipment suppliers and dealers per region (DACH first, LT for the pilot) — categories, coverage area, contact, and what Markus knows about them. It's a trust feature at launch (the consultant's rolodex as an app screen); if it earns traffic, the future revenue shape is sponsored/verified listings, never per-click links (§3.4).

**Pricing intuition:** a bakery that saves one ordering mistake or one mispriced batch per month justifies €19–39/mo without blinking. B2B is where the revenue is; B2C is where the audience is.

### 3.3 Content volume targets (decided 2026-09-21)

Three features each set a floor on corpus size; the pantry builder is the binding constraint:

| Surface | Launch target | Rationale |
|---|---|---|
| Free starter set | **40–60** | Funnel must prove the format: 4–6 recipes in each major baking category (breads, rolls, cakes, cookies, laminated, tarts, quick breads, seasonal) so no category shelf is empty. Below ~40 the app reads as a demo |
| Plus exclusive collection | **60–80** at launch, **+10/mo** | The subscription promise is the *cadence*, not the stock — ~120 new recipes/yr for €15 ≈ 12¢ per validated recipe. A missed month is a churn event; if forced to choose, cut the launch number, never the cadence |
| Pantry-builder matching pool | **~150+ effective** | A typical pantry must return 5–10 matches that *change* as the pantry changes. Mitigation: the builder matches over the **whole corpus** (free + community/web recipes included) — builder value is capability, not exclusivity — and the substitution engine stretches coverage |
| Pro master formulations | **20–30** | Bakeries bring their own recipes; these are Markus-grade templates demonstrating scaling/costing/declarations done right, doubling as onboarding material |

**Total: ~100–140 at launch → ~250–300 by end of year 1.** Cost reality: each recipe needs FID-linked ingredients, validated nutrition, allergen mapping, scaling parameters, imagery, and en/de/hu (+lt) catalogs — 10/month for two people is already ambitious. That's acceptable: the data richness is why 250 Nutrimero recipes outweigh 5,000 blog recipes. Reserve ~20% of monthly drops for seasonal timing (Stollen/Lebkuchen before Christmas in DACH, Easter breads, etc.) — seasonal relevance is cheap retention. Content production must start in **Phase M0**, well before code.

#### Recipe imagery policy (decided 2026-09-21)

Real photography for every recipe is not feasible at this team size. Policy: **AI-generated imagery is allowed, always honestly labeled, and never photorealistic.**

- **Style: branded illustration, not fake photography.** AI images are produced in one consistent, deliberately *illustrative* style aligned with the design tokens (lime `#b9bf05` / navy `#1b1f58`). Rationale: (1) *trust* — a photoreal AI "photo" sets an expectation the user's real bake gets compared against; when it doesn't match, the recipe lied. An illustration makes no such promise. (2) *brand* — generic AI food-photorealism reads as filler; a signature illustration style becomes recognizable, and makes real photos visibly special. A one-time style-guide + prompt-template effort in M0, then batch generation is cheap (fits the €100–500/mo budget easily).
- **Labeling, three layers:**
  1. Visible badge on every image: **"Illustration (AI)"** vs. **"Photo — baked by Markus"** / "baked by Aliaksandr" / later "baked by the community". Real photos are the premium signal, not the default.
  2. Machine-readable provenance: `media.origin: real_photo | ai_illustration` on the asset record (API field), plus C2PA Content Credentials embedded in the files where tooling allows.
  3. A short, plainly-worded imagery policy page in-app — the freeware community will respect the honesty; discovering unlabeled AI art would cost far more than it saves.
- **Legal driver, not just ethics:** EU AI Act Art. 50 transparency obligations (in force since Aug 2026) require disclosure of AI-generated content — machine-readable, and visible for photorealistic content. The illustration-only + always-labeled policy over-complies by design, so store-policy or regulation changes don't force a content migration later.
- **Path to real imagery over time:** community photo uploads ("show us your bake") attached to recipes, moderated, credited, and labeled as real user photos — crowdsourced authenticity that AI can't fake, and a retention loop for free. Founders and pilot bakeries get their photos featured first.

### 3.4 Basic toolset & gear affiliates (added 2026-09-21)

Baking is the one cooking vertical where equipment *gates* recipes — no banneton means no classic sourdough shaping, no stand mixer changes which enriched doughs are practical. That makes tools a product feature first and an affiliate channel second.

**The feature — "tool cupboard":** mirrors the pantry. Users mark what they own; every recipe carries a `tools_required` list (with "essential" vs "nice-to-have" flags and substitution hints — *"no banneton? bowl + floured tea towel"*); the recipe builder gains a filter: *only recipes I can make with my tools*. This is a genuine differentiator no recipe blog offers, and it's free-tier (like the deterministic builder) — affiliate revenue scales with traffic, so gating it would strangle its own monetization.

**The curated gear guide — three levels, Markus-endorsed:**

| Level | Budget | Contents |
|---|---|---|
| **Starter kit** | ~€60–100 | Digital scale (1g; the single most important tool in baking — lead with it), instant-read probe thermometer, oven thermometer (home ovens routinely lie by 10–20 °C), mixing bowls, dough/bench scraper, whisk, silicone spatula, loaf tin + sheet pan, cooling rack |
| **Enthusiast** | ~€150–400 | Stand mixer (or quality hand mixer with dough hooks), banneton + lame, springform + tart tin, rolling pin, piping set, baking steel/stone, Dutch oven (sourdough), fine-mesh sieve |
| **Serious hobbyist** | €400+ | Precision 0.01g scale (yeast, spices), proofing box, Thermapen-class thermometer, tart rings, dough thermometer, couche |

Markus's endorsement is the differentiator: *"the consultant who equips professional bakeries picks your starter kit"* is a credibility story generic affiliate listicles can't match. Keep picks few and opinionated — one recommendation per slot, not a comparison grid.

**Affiliate programs (EU):**
- **Amazon Associates EU** — one program spans the .de/.fr/.nl/.pl/.se/.it/.es marketplaces; kitchen category ~3%; the default for DACH and most markets, easiest to start.
- **Affiliate networks (Awin, TradeDoubler, Daisycon)** — direct programs of EU kitchenware retailers and brands (KitchenAid, Springlane-type shops) often pay 5–8%, better than Amazon; adopt selectively per market once volume justifies the setup.
- **Lithuania:** Amazon coverage is weak — use local marketplaces via affiliate networks (Pigu.lt, 220.lv, Senukai run programs through regional networks); verify current terms during the LT pilot.
- **Direct brand programs** (e.g. thermometer makers) where a Markus pick has one — highest rates, most work; only for the few hero products.

**Rules, consistent with the honesty positioning (§3.3 imagery policy):** every affiliate link visibly disclosed ("we earn a small commission — it never affects the price or the pick"), disclosure is also an EU consumer-law requirement; picks are Markus's editorial choice, never pay-to-play — the first time a user suspects a recommendation was bought, the channel is dead. Physical-goods links are exempt from Apple/Google IAP rules, so this monetizes even free users without store friction.

**Revenue expectation — keep it modest:** at a 3–5% commission on a €80 starter kit, one conversion ≈ €3–4. A few hundred conversions/year is realistic pocket money (€1–2k/yr), not a pillar — its real value is that the tool cupboard *feature* drives retention and builder quality, with the commissions as a bonus. Don't let affiliate optics shape editorial content.

**Pro app boundary (decided 2026-09-21):** affiliate product links are a **home-app-only** mechanic. For professional bakeries the equivalent is the regional equipment-supplier *directory* (§3.2 #5) — B2B equipment purchases run through dealers with service and financing, where a per-click link is both useless and credibility-damaging. Same honesty rule applies in reverse: directory entries are curated, and any future paid placement must be labeled as such.

**API implication (adds to §7):** a `tools` catalog + `recipe_tools` join + per-user `tool_cupboard` (same per-user scope decision as the pantry) + per-market affiliate URL per tool with the same `last_seen` freshness handling as retailer offers. The Pro supplier directory is a simpler read-only `equipment_suppliers` resource (region, categories, contact, notes).

### 3.5 Future verticals (platform proof, not launch scope)

The "first of many verticals" ambition should shape the architecture (shared core + vertical feature packs), not the launch scope. Candidates, roughly in order of fit with existing assets:

- **Nutrimero Kitchen (home cooks / meal prep):** same pantry builder + shopping lists, general recipe corpus instead of baking. Cheapest second vertical — it's the same app with different content.
- **Nutrimero Safe (allergy & intolerance shopping):** the FID allergen model + branded-product DB (nutrID) makes a scan-and-check shopping assistant credible. Strong retention hook, sensitive domain (accuracy liability — needs care).
- **Nutrimero Maker (small food producers / farmers-market sellers):** declarations + labeling on mobile for people too small for the web platform's full workflow. Monetizes the legal-declaration crown jewels.
- **Culinary schools / vocational training:** Markus's consulting world again; site licenses, structured recipe curricula.

Recommendation: commit publicly to baking only; build the codebase as `core` + `packs/baking-home` + `packs/baking-pro` so the second vertical is a content-and-config exercise.

---

## 4. Value ladder vs. the free website

The freeware promise of nutrimero.org must stay intact — the apps must never feel like the website got worse. The line that works:

| | nutrimero.org (free, forever) | Mobile apps (paid) |
|---|---|---|
| FID ingredient/nutrition data | ✅ full | ✅ full |
| Community/shared recipes | ✅ | ✅ |
| App-exclusive curated recipes | — | ✅ Plus tier |
| Pantry → recipe builder (deterministic) | — | ✅ free (limited) / Plus (unlimited) |
| Pantry → recipe builder (LLM) | — | ✅ Premium tier |
| Shopping lists + retail prices | — | ✅ Premium tier |
| Online cart handoff (Barbora, Rimi, …) | — | ✅ Premium tier |
| Offline access, timers, calculators | — | ✅ free basics / Plus full |
| Tool cupboard + Markus's gear guide (affiliate) | — | ✅ free in app |
| Recipe book, batch scaling, costing (Pro) | — | ✅ Pro Essential |
| Wholesaler prices, ordering, analytics (Pro) | — | ✅ Pro Business |

The differentiators are *capabilities and convenience*, not withheld data — that keeps the freeware positioning honest and avoids community backlash.

---

## 5. Monetization analysis

### 5.1 The structural fact that decides most of it

Three of the four headline features have **recurring marginal costs**:

- **Live retail prices:** scraping/API/licensing costs run monthly whether or not a user opened the app this week.
- **LLM recipe generation:** every premium generation is an API call you pay for (rough order: €0.01–0.05/generation with a mid-tier Claude model; a heavy user doing 100 generations/month costs €1–5 — a €30 lifetime purchase is underwater within a year).
- **Monthly recipe drops:** Markus's and your ongoing time.

A pure one-off price sells a perpetual claim on recurring costs. It only works if the paid surface is static (calculators, offline, a fixed recipe set).

### 5.2 Options compared

| Model | Year-1 revenue/user (illustrative) | Pros | Cons |
|---|---|---|---|
| **One-off** €14.99 | ~€13 after the 15% small-business store cut | Simple, no churn ops, buyers love it | Underwater on price-data + LLM costs; no revenue for ongoing content; every future feature raises "why isn't this included" |
| **Pure subscription** €3.49/mo | ~€21 at 7-month average retention | Aligns with costs; funds content cadence | Subscription fatigue is real in B2C food apps; conversion friction; obligates a delivery cadence |
| **Hybrid (recommended, B2C)** free app + €2.99–3.99/mo or €24.99–29.99/yr "Nutrimero Plus" | ~€15–25 blended | Free tier = funnel + honest freeware story; subscription only gates the things that cost you money monthly (prices, LLM, new drops); calculators/offline/launch recipes included free or behind a small one-off unlock | Two-tier feature matrix to maintain |
| **Founders' Lifetime** €120, capped at 100 units | €12,000 one-time | Upfront launch financing (~2 years of opex); per-user beats typical subscription lifetime value; 100 numbered founders as evangelists | Perpetual obligation to 100 users (bounded); must be scoped to Plus-in-Bake only, with the same LLM quota; cap must be enforced server-side |
| **B2B SaaS (recommended, Pro)** €19–39/mo per bakery (not per seat; bakeries are small teams) | €228–468/bakery/yr | Matches B2B norms; 20 pilot bakeries ≈ €5–9k/yr already; funds supplier integrations | Requires invoicing/VAT handling for businesses (Paddle/Lemon Squeezy as merchant of record solves EU VAT) |

### 5.3 Recommendation

- **Home app — two tiers (decided 2026-09-21):** free download stays the funnel (deterministic pantry builder with a small daily limit, core calculators, starter recipe set, basic shopping list). Above it:

  | | **Plus** (cheap) | **Premium** (expensive) |
  |---|---|---|
  | Price | **€1.99/mo · €14.99/yr** | **€4.49/mo · €34.99/yr** |
  | What it sells | *Content & convenience* — near-zero marginal cost | *Everything live & transactional* — the recurring-cost features |
  | Exclusive recipe drops (Markus-curated, ~10/mo) | ✅ | ✅ |
  | Full offline mode (recipes, FID data) | ✅ | ✅ |
  | Advanced calculators (baker's %, tin scaling, hydration) | ✅ | ✅ |
  | Unlimited deterministic pantry builder + substitutions | ✅ | ✅ |
  | Unlimited shopping lists (no prices) | ✅ | ✅ |
  | Retail price estimates per chain | — | ✅ |
  | Online cart handoff (Barbora, Rimi, … §8.5) | — | ✅ |
  | LLM recipe builder | — | ✅ (50 generations/mo fair-use) |
  | Price alerts on watched staples | — | ✅ |
  | Founder badge eligibility | — | via Lifetime only |

  **Why this split works:** Plus is an easy yes (€15/yr for a pro-curated recipe stream + offline is impulse-purchase territory) and costs you almost nothing to serve — content is produced once for everyone. Premium is where every feature either costs you money per use (LLM, price data) or completes a transaction (cart handoff), so its higher price is self-justifying and its margin is protected. The upgrade pitch is one sentence: *"Plus gives you the recipes; Premium does your shopping."* Keep the one-off **"Recipe Vault" unlock (€9.99)** below both tiers as subscription-hater insurance.
  **Anti-patterns to avoid:** don't put *some* recipe drops in Premium (content splitting breeds resentment — content is Plus, capabilities are Premium); don't limit offline to Premium (it's a trust feature, not a luxury); don't offer a Plus-monthly at €1.99 *and* annual at €14.99 without emphasizing annual — push annual everywhere for retention.
- **Founders' Lifetime (decided to offer, 2026-09-21):** **€120, strictly limited to 100 units**, grants the top home tier — **Premium** — for the lifetime of the Bake app (€120 ≈ 3.4 years of Premium-annual; still ahead of typical retention). Why it works *only* because it's capped:
  - **Launch financing:** 100 × €120 = €12,000 gross — ~€11.4k via web checkout (merchant of record), or ~€10.2k if sold as an IAP non-consumable at the 15% small-business rate. That alone covers roughly two years of the €500/mo operating ceiling.
  - **Break-even vs. subscription:** €120 = 4 years of the €29.99 annual plan. Average B2C subscription retention rarely exceeds 2–3 years, so per-user this likely *beats* subscription revenue — the cap means the downside (a few very-long-term users) is bounded at 100 people.
  - **Evangelism:** number the badges ("Founder #37 of 100"), give founders early access to recipe drops and a feedback channel to Markus. 100 invested early users in a niche community are worth more than the revenue.
  - **Guardrails (non-negotiable):** (1) the promise is scoped precisely — *"all Nutrimero Plus features in the Bake app, forever"*, not "everything Nutrimero ever makes" — so Pro, future verticals, and future add-ons stay sellable; (2) lifetime users get the **same LLM fair-use meter** as Plus subscribers (e.g. 50 generations/mo), so no unbounded recurring cost; (3) the 100-unit cap is enforced **server-side in the entitlements service** — app-store IAPs can't count inventory, so either sell via web checkout or gate the IAP offer behind a remotely-toggled flag that flips off at 100.
  - **Timing:** open the offer at the Phase-M2 subscription launch (or as a pre-launch to the M1 soft-launch audience) and let the visible countdown ("23 of 100 left") do the marketing. Never repeat or extend it — scarcity credibility is the whole point.
- **Pro app — two tiers (decided 2026-09-21):** 30-day trial, then per-bakery (not per-seat — bakeries are small teams and per-seat pricing punishes exactly the team adoption you want):

  | | **Pro Essential** | **Pro Business** |
  |---|---|---|
  | Price | **€24/mo · €240/yr** | **€59/mo · €590/yr** |
  | What it sells | *Digital recipe book on the bakery floor* | *The bakery's commercial operations* |
  | Production-scaled recipes, batch scaling, floor/tablet mode | ✅ | ✅ |
  | Offline-first floor access | ✅ | ✅ |
  | Team roles (admin/editor/viewer) & member management | ✅ up to 5 members | ✅ unlimited |
  | Recipe costing — manually entered ingredient prices | ✅ | ✅ |
  | Costing from live wholesaler price lists | — | ✅ |
  | Margin & cost analytics (price-change impact on recipes) | — | ✅ |
  | Order generation — PDF/email to any supplier | ✅ | ✅ |
  | Structured order export / online wholesaler handoff (e-promo format, §8.5 T3) | — | ✅ |
  | LLM recipe adaptation (scaling, substitution, allergen variants) | — | ✅ (metered) |
  | Multi-location support | — | ✅ |
  | Priority support | — | ✅ |

  **Why this split works:** Essential is priced so a single owner-baker doesn't hesitate — it's the recipe book + costing they already do on paper, at less than one hour of anyone's wage per month. Business is gated on the features that touch *money flow* (wholesaler prices, order integration, margin analytics) — the moment a bakery uses those, €59/mo is invisible next to the ingredient spend it optimizes. The upgrade trigger is organic: Essential users hand-type prices until they ask "can it just pull them from my supplier?" — that question *is* the Business pitch.
  **Pilot note:** run the 3–5 Markus-sourced pilots on **Business at Essential's price, locked for life** — you need Business-tier usage data (ordering, price lists) from the pilots, and the founders' discount is the thank-you.
- **Billing plumbing:** Apple/Android IAP for B2C (enroll in both small-business programs → 15% cut). For B2B, prefer web-based checkout via a merchant of record (Paddle / Lemon Squeezy) — Apple now permits external purchase links in the EU (DMA), and B2B buyers expect invoices, not IAP. This also keeps 30% of Pro revenue out of Apple's pocket.
- **Revenue-viability sketch:** at the €500/mo cost ceiling, break-even is roughly **21 Essential bakeries**, or **~9 Business bakeries**, or **~240 Plus + 60 Premium subscribers** (a realistic 80/20 tier mix), or any blend — e.g. **5 Business bakeries + 100 Plus + 30 Premium** clears it. All plausible year-1 targets for a niche with a known consultant attached. Note the Premium tier's serving costs (LLM, price data) scale with its subscriber count, so Premium price must stay ≥ ~3–4× its marginal cost per user — at €4.49/mo with a 50-generation cap it comfortably is.

### 5.4 What "undecided" should decide first

The only decision needed *now* is: **don't promise "buy once, get everything forever."** Everything else (exact price points, annual vs monthly emphasis) can be A/B-tested post-launch. Entitlements must be modeled server-side from day one (§7) so the packaging can change without app updates.

---

## 6. Tech stack: React Native (Expo) vs. Flutter

**DECISION — React Native with Expo.** Recommended in this analysis, confirmed by Aliaksandr on 2026-09-21; the Flutter option is closed. The comparison below is preserved as the rationale record.

| Factor | React Native + Expo | Flutter |
|---|---|---|
| Existing decision | Already chosen in `MIGRATION_PLAN.md` §2.4 (D-decisions) | Would reverse a documented ADR-level decision |
| Contract reuse | `openapi-typescript` types + `openapi-fetch` client work **unchanged**; `pnpm contract:sync` extends naturally | Regenerate a second Dart client; two type systems to keep honest against one contract |
| Language surface | TypeScript everywhere (API, web, mobile) — one mental model, one lint/test toolchain (Biome/Vitest ecosystem) | Adds Dart; every shared concept (error codes, zod-derived types, i18n keys) needs a second implementation |
| Solo dev + Claude Code | Claude Code is strongest in the TS ecosystem you already run; cross-repo refactors (api contract → web → mobile) stay in one language | Perfectly workable, but every context switch costs a solo developer more than it costs a team |
| Ecosystem needs | Expo covers the actual requirements: EAS Build/Submit (no local Xcode pain), OTA updates (ship recipe-builder fixes without store review), expo-notifications, SQLite/offline via expo-sqlite + a sync layer, RevenueCat for IAP | Equivalent capabilities exist, but you assemble more of them yourself |
| UI performance / custom rendering | Fine for this app class (lists, forms, timers) | Flutter's rendering edge matters for canvas-heavy apps — not this one |
| Web/desktop future | RN-web exists but your web is already Next.js — no need. Desktop later: Expo's Electron story is weak; Tauri wrapping the web app is the likelier desktop path anyway | Flutter desktop is more mature — the one real Flutter advantage, but desktop is explicitly "possibly, future" |
| i18n | Port the `messages/{en,de,hu}.json` catalogs; enforce the same key-parity test | Restate catalogs in ARB format |

**Verdict:** Flutter's genuine advantages (rendering performance, desktop maturity, single-codebase purity) don't intersect with this project's constraints. The decisive factors — contract-first OpenAPI reuse, one-language solo development with Claude Code, OTA updates for a content-driven app — all point at Expo. If desktop ever becomes real, wrap the web app (Tauri) rather than betting the mobile stack on it today.

**Proposed repo shape** (matches decision D5's planned `nutrimero-mobile`):

```
nutrimero-mobile/            # Expo monorepo (pnpm workspaces)
  apps/bake/                 # home-baker app (thin: config, branding, feature flags)
  apps/pro/                  # professional app
  packages/core/             # generated API client, auth/session, offline sync, entitlements
  packages/ui/               # RN component library from nutrimero-design tokens
  packages/features/         # pantry-builder, shopping-list, prices, ordering, timers
  contract/openapi.json      # synced from nutrimero-api, drift-gated in CI like web
```

Two store listings, one codebase, shared feature packages — this is also exactly the structure that makes vertical #3 cheap.

---

## 7. Backend work the apps require (API roadmap deltas)

Grouped by when mobile needs them. Items marked ⬥ are already implied by the web roadmap; items marked ★ are new, mobile/monetization-driven.

**Before any mobile beta:**
- ⬥ Recipe domain (`/recipes`, `.rex` genealogy model) — the entire app is pointless without it; this is web Phase 2 work.
- ⬥ Search (there is currently *no* search endpoint; only limit/offset/language params exist). Postgres FTS is enough to start.
- ★ **Entitlements service** — per-user (not per-company) plan state: `plan`, `expires_at`, feature flags, LLM quota. Server-verified IAP receipts (App Store Server API / Play Developer API, or RevenueCat webhooks doing that for you). Hobby Mode toggles are a precedent but per-company and not commercial — don't overload them.
- ★ **Exclusive-content flag + access control** on recipes (`visibility: public | app_exclusive`), enforced server-side so the web app can't leak paid content.

**For launch:**
- ★ **LLM proxy endpoint** (`POST /builder/generate`): server-side Claude API calls, prompt templates grounded in FID data, per-user metering against entitlements, response caching for identical pantry sets. Never ship an API key in the app.
- ★ **Pantry + shopping-list + tool-cupboard resources** (per-user, not per-company — a new ownership scope in the tenancy model; the current `ScopedRepository` is company-scoped and this needs a deliberate design decision, not a workaround). Tools also need a `tools` catalog + `recipe_tools` join + per-market affiliate URLs (§3.4).
- ★ **Price data service** (§8): separate ingestion pipeline + `GET /prices?ingredient&region` read API. Keep it a distinct module/deployable so its (messy, scraping-adjacent) lifecycle never destabilizes the core API.
- ⬥ Delta sync for offline: `updated_since` cursors + soft-delete tombstones on recipes/ingredients; ETags on FID reference lists (41 MB of seed data must not be re-downloaded wholesale). Client: SQLite cache, read-only offline at first (offline *editing* with conflict resolution is a v2 problem — don't buy it early).
- ★ Push notifications: replace the `NotificationPort` log stub with an Expo Push / FCM+APNs transport; device-token registration endpoint. Launch uses: recipe-drop announcements, price-alert on watched items, Pro order confirmations.

**For Pro app pilots:**
- ⬥ Purchased items / vendors / order-rates domain (already in `DOMAIN.md` parity list from the Laravel app).
- ★ Order document generation (structured PDF/email to supplier) — deliberately *not* supplier API integrations yet.

**Infra note:** all of this lands on one Contabo VPS shared with other projects, with reverse proxy/backup/firewall listed as undecided in `INFRA.md`. Before charging money: settle backups (paid users' pantries and orders are real data), add Redis (LLM quota counters, price cache), and put the price-ingestion workers somewhere they can't starve the API.

---

## 8. The price-data problem (the hard part, be honest about it)

This is the feature users will love and the one that can quietly eat the entire €100–500/mo budget and more. Reality per source type:

- **Retailer APIs:** essentially none are public in the EU. A few (Rewe, Albert Heijn) have app APIs that people reverse-engineer — fragile and ToS-hostile. Not a foundation.
- **Scraping:** legally grey (DB-rights in the EU, ToS), operationally endless (bot walls, layout churn). As a solo operator, treat self-run scraping as a last resort.
- **Third-party price APIs / datasets:** exist per-country (grocery price-comparison services, e.g. daisycon-style affiliate feeds, national price observatories, discounter-flyer aggregators like Marktguru/Bonial data). Quality and licensing vary; this needs a dedicated sourcing investigation per market — budget one before promising the feature.
- **Open Food Facts "Open Prices":** open, crowdsourced, EU-active, free — sparse but improving, and ideologically aligned with a freeware project. Good bootstrap + fallback layer.
- **Crowdsourcing your own:** users snap/enter prices, you validate with the MAD/Hampel outlier machinery already specced in Markus's corpus for nutrition averaging. Slow to start, but it's the only source you *own*.

**Recommended strategy:**
1. **Ship the feature as "estimated basket cost," not "live price comparison"** at first — weekly-granularity averages per chain per region. This drops the data-freshness bar enormously and still delivers the decision users actually make ("is this recipe a €6 bake or a €14 bake, and is Lidl or Rewe cheaper for it?").
2. **Sequence markets (decided):** DACH first (paying users, Markus's ground truth, best flyer-aggregator data), **Lithuania** second as the low-cost pilot — Aliaksandr lives there, and the chain set is small and known (Maxima, Lidl, Rimi, Iki, Norfa). Five chains × ~150 baking staples is a table one person can seed in a weekend and refresh monthly while crowdsourcing ramps; being local also means real-shelf validation of crowdsourced data. Then PL/CEE, then Benelux/Nordics. Lithuania can even *precede* DACH as the technical pilot of the price pipeline (cheap, local, low stakes) while DACH remains the first *monetized* price market.
3. **Layer sources:** licensed/aggregated feed where affordable → Open Prices → own crowdsourced data, converging on crowdsourced+validated as the moat.
4. Baking softens the problem: recipes draw from a small staple set (flour, butter, sugar, eggs, yeast, chocolate…) — **~100–200 SKUs per market cover most baskets.** That's maintainable; a general grocery price DB is not.

### 8.5 Online cart handoff — matching the shopping list to online retailers

Added 2026-09-21. The shopping list shouldn't stop at "here's your estimated basket" — it should end in a checkout. Targets:

- **Lithuania (B2C pilot):** Barbora (Maxima's e-shop, the dominant LT online grocer), Rimi online, Iki e-parduotuvė.
- **Lithuania (B2B):** e-promo Cash & Carry (Promo/Sanitex) for the Pro app's wholesale orders.
- **DACH (later):** Rewe online, Knuspr, Flink, Bringmeister-successors; wholesale via whatever Markus's pilot bakeries actually use.

**Why it's strategically valuable:**
- It converts price data from *informational* to *transactional* — retention and willingness-to-pay both jump when the app finishes the job.
- It creates a **second revenue stream**: affiliate/referral commissions on handed-off baskets (grocery affiliate rates are low, 1–3%, but they're pure margin on top of the subscription and they scale with usage, not with your effort).
- The SKU matching it requires (FID ingredient → branded retail product) is the *same* matching the price-estimate feature needs — one investment, two features. It also dovetails with the branded-product/nutrID corpus already in Markus's domain artifacts.

**Integration reality check — none of these retailers have public cart APIs**, so ship in tiers:

| Tier | What it is | Cost/dependency | When |
|---|---|---|---|
| **T1 — deep links** | Each list item links to the retailer's search/product page (`barbora.lt/paieska?q=…`); user adds to cart themselves in the webview/app | Zero partnership, a URL template per retailer, breaks rarely | LT pilot, day one |
| **T2 — matched product links** | We resolve each ingredient to a *specific SKU* (name, size, price) per retailer and deep-link straight to it; basket total becomes exact, not estimated | The SKU-matching table (~100–200 baking staples/market, human-curated + crowd-validated); catalog scraping or affiliate feeds for price/URL freshness | LT pilot, weeks after T1 |
| **T3 — cart injection / order file** | One tap builds the whole cart. B2C: requires a partnership or an affiliate program with basket support (pursue with Barbora first — Maxima group does run partner programs). B2B: e-promo and similar wholesalers often accept structured order uploads (CSV/e-invoice) — that's cart injection without an API | Business development, per-retailer; fragile if reverse-engineered, so **only via official channels** | After pilot proves basket volume worth a retailer's attention |

**Rule: no reverse-engineered private APIs.** A paid app that breaks every time Barbora ships an update, or gets a cease-and-desist, is worse than deep links. T1/T2 deliver most of the user value at near-zero fragility; T3 is a partnership conversation backed by pilot usage numbers.

**Pro-side note:** for wholesalers, the order-document generator (§3.2) and T3 converge — a structured order file in the wholesaler's upload format *is* the integration. e-promo is the LT test case; if a pilot bakery buys through it, build that exporter first.

**API implication (adds to §7):** a `retailer_offers` resource — per-market retailer registry + SKU match table (`fid_ingredient_id → retailer, sku, name, size, price, url, last_seen`) — feeding both price estimates and cart handoff. Same ingestion pipeline, one more read endpoint.

---

## 9. Risks & open questions

| # | Risk / question | Mitigation / needed decision |
|---|---|---|
| 1 | **Docs–code discrepancy:** PRODUCT.md claims API features through 011 merged; local repo is at 004 | Check the `151Concepts` remotes; re-baseline the mobile plan on the real contract |
| 2 | Mobile is gated on the recipe domain that doesn't exist yet | Treat mobile spec work as parallelizable now (this doc → specs → design), code later; don't fork API attention |
| 3 | Price data cost/legality per market | Per-market sourcing investigation before the feature is promised publicly; launch as "estimates" |
| 4 | Per-user resources (pantry, lists, subscriptions) vs. per-company tenancy architecture | Deliberate design decision on a `user`-scoped repository path; don't bolt on |
| 5 | Solo bus-factor + subscription obligations | Annual-plan emphasis (revenue predictability), OTA updates (fast fixes), keep the free tier genuinely useful so a slow month doesn't breach paid promises |
| 6 | Freeware community backlash ("they're paywalling it") | Value ladder in §4: paid = capabilities & convenience, never data lock-up; say so publicly |
| 7 | LLM builder quality (recipes must actually bake) | Ground generation in FID + Markus's validation rules; Markus reviews the prompt templates and a sample set before launch; label generated recipes as such |
| 8 | App Store rules for external B2B billing | DMA-era EU rules allow external purchase links; keep B2C inside IAP to stay uncontroversial |
| 9 | Offline sync scope creep | v1 = read-only offline cache; offline editing/conflicts deferred |
| 10 | `nutrimero-design` artwork is desktop/tablet-oriented | Phone-first design pass needed; reuse tokens + normalization rulings, not layouts |
| 11 | Cart handoff: no public retailer APIs; SKU matches go stale (delistings, size changes) | Tiered rollout (§8.5): deep links → matched SKUs → official partnerships only; `last_seen` freshness checks + graceful fallback from T2 to T1 links; never reverse-engineer private APIs |
| 12 | AI imagery: EU AI Act Art. 50 disclosure duties; community trust if labeling is sloppy | Imagery policy in §3.3: illustration-only style, three-layer labeling (visible badge, `media.origin` field, C2PA), public policy page; real photos as the earned premium signal |

**Questions still open for Aliaksandr/Markus:**
- Which DACH wholesalers/suppliers do Markus's contacts actually reach (Bäko? regional millers? Transgourmet?) — determines the Pro pilot shape.
- ~~Baltic pilot market~~ — **resolved 2026-09-21: Lithuania** (Aliaksandr is based there).
- Confirm the docs-vs-code state of API features 005–011.
- Comfort level with a merchant of record (Paddle/Lemon Squeezy) handling EU VAT for Pro subscriptions?

---

## 10. Proposed phasing (analysis-level, not a build plan)

- **Phase M0 — now, parallel to web Phase 2:** resolve risk #1; write specs for entitlements, per-user scope, and the mobile contract deltas; price-data sourcing memo for DACH + Lithuania (LT staples table can be seeded by hand immediately); Markus recruits 3–5 pilot bakeries; recipe content pipeline starts (targets in §3.3: 40–60 free + 60–80 exclusive + 20–30 Pro templates for launch).
- **Phase M1 — after API recipes ship:** `nutrimero-mobile` Expo monorepo; **Nutrimero Bake** MVP: exclusive recipes, deterministic pantry builder, calculators/timers, offline cache, shopping list *without* prices. Soft launch in 1–2 markets, free + Recipe Vault unlock only (no subscription yet — validate before you meter).
- **Phase M2 — monetization on:** Nutrimero Plus subscription; LLM builder (metered); DACH price estimates; **cart handoff T1/T2 in Lithuania** (Barbora + Rimi deep links, then matched SKUs — §8.5). This is where entitlements, LLM proxy, and price service must be live.
- **Phase M3 — Pro pilots:** **Nutrimero Pro Bakery** with pilot bakeries: floor recipes, costing, order-document generation (incl. e-promo-format order export if an LT pilot bakery uses it). Founders' pricing, hand-held onboarding via Markus.
- **Phase M4 — expand:** PL/CEE → Benelux/Nordics price coverage (Lithuania already live from the pilot); supplier integrations if pilots demand them; evaluate vertical #3 (Kitchen is the cheapest test of the platform thesis).

---

## 11. Gap analysis — what the plan was missing (added 2026-09-21)

A checklist pass over everything above surfaced these omissions, roughly ordered by how much they hurt if discovered late.

### 11.1 Foundational / legal (decide before money changes hands)

1. **Allergen & nutrition liability.** The web platform serves professionals who verify; the home app serves consumers who *won't*. If a user with an allergy trusts a recipe's allergen list and gets hurt, that's the worst day this project can have. Needed: prominent in-app disclaimers ("always check the actual product label"), "may contain" conservatism in generated content, and — for the LLM builder especially — allergen output must come from FID data, never from model text. This deserves its own spec.
2. **Legal entity & seller of record.** Who signs the Apple/Google developer agreements and the merchant-of-record contract, and who invoices Pro customers? An individual can start, but B2B customers want invoices from a company, and the Markus arrangement (below) needs a counterparty. Decide the entity question (LT company?) before Pro pilots take money.
3. **The Markus agreement.** Exclusive recipes, gear-guide endorsements, supplier introductions, and a name on the brand — currently all on goodwill. Settle in writing: IP ownership of the recipe corpus, revenue share or fee, what happens to "curated by Markus" content if the collaboration ends. Do this while everything is friendly; it protects both sides.
4. **EU consumer-law mechanics for subscriptions:** 14-day withdrawal right on digital purchases, Germany's *Kündigungsbutton* (one-click cancellation) if selling to DACH via web checkout, price-change notification rules. Mostly solved by IAP + a good merchant of record, but must be verified, not assumed.
5. **European Accessibility Act** — in force for consumer apps since June 2025. Practically: RN accessibility props from day one, minimum contrast/touch targets (the design-token system helps), screen-reader labels on the builder and timers. Cheap if done from the start, a retrofit project if not.
6. **GDPR specifics for mobile:** pantry/dietary data is personal data (dietary and allergen profiles arguably *health-adjacent* — keep them local-first or clearly consented); app-store privacy labels; analytics must be EU-hosted and consent-clean (PostHog EU or self-hosted Plausible-class, no ad-tech SDKs — also a brand statement consistent with the honesty positioning).

### 11.2 Product gaps

7. **Users' own recipes.** Half the value of any baking app is *my* grandmother's recipe living next to the curated ones — scaled, costed, nutrition-computed by the same engine. This was entirely missing. It's also the strongest retention lock-in and a natural bridge to the web platform. Free tier: a handful; Plus: unlimited. Needs the per-user scope (§7) anyway.
8. **Allergen & dietary profiles.** The FID allergen model is a crown jewel and the apps didn't use it: a per-user profile (celiac, lactose-free, nut allergy, vegan) filtering recipes, warning on builder output, and adjusting shopping lists. Cheap to build on existing data, high perceived value — arguably a *free*-tier trust feature with premium depth (substitution suggestions honoring the profile).
9. **Personal recipe annotations:** notes ("reduce yeast 2g in summer"), private ratings, favorites/collections. Small feature, large retention effect; syncs via the same per-user scope.
10. **Onboarding flow:** first-run experience — units (metric/imperial), language, dietary profile, pantry seeding ("scan your baking shelf: check what you have"). The activation moment decides subscription conversion more than any paywall design.

### 11.3 Go-to-market (the doc had monetization but no distribution)

11. **B2C acquisition plan.** Where do the first 1,000 home bakers come from? Candidates: the nutrimero.org user base (cross-promotion is free), baking communities (subreddits, Facebook groups per market — LT groups are small and reachable), Markus's professional audience trickling down, content marketing (the gear guide and calculators are SEO-able as web pages linking to the app), and app store optimization per locale. Needs a real plan by M1, not launch week.
12. **Competitive analysis — never done.** Home: KptnCook, Paprika, Crumb, BreadMe, Mob, plus free blogs. Pro: Apicbase, FoodNotify, recipe-costing SaaS, and Excel (the real incumbent in small bakeries). Worth a half-day web research pass to sharpen positioning and pricing before specs are frozen; the differentiators (FID data depth, Markus, declarations) look defensible, but assumed ≠ verified.
13. **Naming & trademark:** check "Nutrimero Bake"/"Pro Bakery" for EU trademark conflicts and app-store name availability; reserve store listings early.
14. **Success metrics undefined.** Set targets now so M1's soft launch measures something: activation (first recipe cooked / pantry filled), D30 retention, trial→paid conversion, Plus→Premium upgrade rate, pilot-bakery weekly active usage.

### 11.4 Technical/operational plumbing (unglamorous, all mandatory)

15. **Real email sending** — password recovery on mobile requires it; the API's `NotificationPort` is a log stub today. An SMTP/provider transport (e.g. Postmark/SES) is a prerequisite for *any* public mobile beta.
16. **Media pipeline** — recipe illustrations and future community photos need object storage + CDN (the Contabo VPS should not serve images); S3-compatible bucket + CDN is fine and cheap.
17. **Force-update / kill-switch** — a `GET /app-config` endpoint with minimum supported app version per platform, so an old client with a broken assumption can be forced to update. Every store app needs this; retrofitting it after v1 ships is impossible for already-installed versions.
18. **Crash reporting & release health** (Sentry or equivalent, EU-hosted), staging environment, and a beta channel (TestFlight / Play internal track) with the pilot bakeries and founders on it.
19. **Account deletion in-app** — both stores mandate it; the API's `/me/erase` already exists, it just must be reachable from the apps.
20. **Pro-tier support definition** — "priority support" is promised in Business; define what it actually is at this team size (e.g. email, next-business-day) before a bakery asks at 5 a.m.

**Sequencing impact:** items 1–3 and 15–17 join Phase M0/M1 as prerequisites; 7–10 are scope additions to the Bake app spec (7 and 8 are significant and worth it); 11–14 are a parallel non-engineering track that can start immediately. Regulatory, T&C, and data-handling detail is expanded in §12.

---

## 12. Regulations, terms & conditions, privacy, data handling (added 2026-09-21)

What applies, what it means concretely, and what needs a lawyer vs. what is checklist work. Not legal advice — a structured brief for one focused session with an EU tech lawyer (budget one; the LT startup-lawyer market is affordable).

### 12.1 GDPR — the core obligations

**Role:** Nutrimero (the legal entity, §11.1 #2) is the **data controller** for app users; for Pro, also controller of bakery staff account data (a light **DPA offered to Pro customers** is worth having — B2B buyers increasingly ask).

**Data map (the actual inventory to maintain):**

| Data | Category | Sensitivity | Where | Retention |
|---|---|---|---|---|
| Account (email, name, argon2 hash) | Personal | normal | Postgres (Contabo, DE) | until erasure (`/me/erase` exists) |
| Pantry, shopping lists, own recipes, tool cupboard | Personal | normal | Postgres | account lifetime |
| **Dietary/allergen profile** | Personal | **likely Art. 9 special category** — celiac/allergy reveals health; halal/kosher reveals religion | see box below | account lifetime |
| Purchase/entitlement state | Personal | normal | Postgres + RevenueCat/MoR | legal retention (tax: 10 yrs for invoices) |
| LLM builder prompts | Personal if identifiable | normal | transient; strip identifiers | days, not months |
| Push tokens, device info | Personal | normal | Postgres + Expo | until unregister |
| Analytics events | Pseudonymous | normal | EU-hosted analytics | ≤ 14 months |
| Pro bakery recipes/costs/orders | **Customer business data** (plus staff personal data) | commercially confidential | Postgres, company-scoped | contract + export on exit |

**The Article 9 box (architecture decision needed):** two compliant designs for the allergen/dietary profile — (a) **server-side with explicit consent**: a dedicated, freely-given, specific consent screen ("store my dietary profile to filter recipes"), revocable, profile deleted on revocation; or (b) **device-local only**: the profile never leaves the phone, filtering happens client-side — no Art. 9 processing at all, but no cross-device sync. **Recommendation: start device-local (b)** — zero legal surface, ship faster; add consented sync later if users ask. Never use the profile for analytics or marketing segmentation in either design.

**Processor inventory (each needs a DPA signed; flag non-EU transfers):** Contabo (DE — clean), Vercel (US parent, fra1 region — DPA + SCCs), Anthropic (US — DPA available; don't send user identifiers in prompts anyway), Expo/EAS push (US — SCCs; tokens only), RevenueCat (US — SCCs) or skip it and use store APIs directly, Paddle/Lemon Squeezy (MoR is its own controller for checkout — simpler for you), email provider (pick EU: e.g. Scaleway TEM, or Postmark+DPA), crash/analytics (**choose EU-hosted**: Sentry EU region, PostHog EU Cloud or self-hosted — this is both compliance and brand).

**User rights plumbing:** erasure exists (`/me/erase` — verify it cascades to the new per-user resources: pantry, own recipes, profile, cupboard); add **data export** (JSON download of everything — also a Pro-tier trust feature); access/rectification are covered by normal account UI. Breach notification: 72h to the supervisory authority (LT: VDAI) — have a one-page internal runbook, not just awareness.

**What you *don't* need at this scale:** a DPO (no large-scale special-category processing if the device-local design is chosen), a formal DPIA is likely unnecessary with design (b) — revisit if (a).

### 12.2 Consumer & platform law (B2C)

- **Consumer Rights Directive:** 14-day withdrawal on digital purchases. Standard handling: user expressly consents to immediate delivery and acknowledges losing the withdrawal right at purchase (IAP flows and good MoRs handle this — verify the checkbox exists on web checkout).
- **Germany (DACH launch!):** the ***Kündigungsbutton*** — web-sold subscriptions must be cancellable via a prominent one-click button on the site; and §312 BGB auto-renewal rules. Applies to the web-checkout path, not IAP. Non-negotiable for DACH web sales.
- **Omnibus Directive:** any "was €X now €Y" promo must reference the lowest price of the prior 30 days — relevant to the Founders' Lifetime countdown marketing; sell it as a *limited quantity*, never as a fake discount.
- **Geo-blocking regulation:** don't restrict EU customers from buying cross-border tiers.
- **DSA (community content, later):** when community photos/recipes ship — notice-and-action reporting, a stated moderation policy in the T&C, and a contact point. Small-enterprise exemptions cover most heavy obligations, but the basics apply.
- **Age:** not a children's app — state 16+ in terms; no parental-consent machinery needed, no ads to minors questions.

### 12.3 Food-adjacent & liability (the sharpest edge)

- **FIC Regulation 1169/2011** (food labeling) binds *food business operators*, not the app — but Pro users rely on Nutrimero output for legally binding declarations. Both apps need clear positioning in T&C: **"Nutrimero provides calculation tools and reference data; the food business operator / the user is responsible for verifying final labels and actual product composition."** In-app, at the point of allergen/nutrition display: "always check the actual product label — recipes and reference data can't know your specific brands."
- **New Product Liability Directive (2024/2853):** software is now explicitly a "product" — defective software causing personal injury (an allergen miss) is in scope, with reversed burden-of-proof helps for claimants. Consequences: (1) the LLM builder must source allergen statements **only** from FID data joins, never model-generated text — make this an architectural invariant with tests, not a guideline; (2) conservative "may contain" defaults; (3) once revenue exists, **product/professional liability insurance** (~€500–1,500/yr for a small software business) — cheap against this tail risk.
- **EU AI Act, Art. 50:** already applied to imagery (§3.3). Also applies to the LLM builder: users must be informed they're interacting with AI-generated content — a persistent "AI-generated recipe — reviewed rules, not reviewed by a baker" label on generated recipes covers it (and honesty-brand-consistent anyway).

### 12.4 Terms & conditions — the document set

| Document | Audience | Key clauses beyond boilerplate |
|---|---|---|
| **B2C Terms + EULA** | Bake app | Plain language; subscription/renewal/cancellation terms; withdrawal-right consent; allergen/nutrition disclaimer (§12.3); LLM content disclosure; user-content license (community photos: user keeps ownership, grants display license); affiliate-link disclosure; 16+; governing law (LT) + EU consumer-forum carve-outs; Apple's standard EULA can be used for iOS or one custom EULA for both stores |
| **B2B Terms (Pro)** | Bakeries | Liability cap (e.g. 12 months' fees); explicit "declarations responsibility stays with the food business operator"; support definition (§11.4 #20); data ownership: *the bakery owns its recipes/costs*, export guaranteed on termination (retention window, e.g. 90 days); price-change notice period; DPA annex |
| **Privacy policy** | both + web | One document, layered/short-form on top; store-listing privacy labels (Apple nutrition labels / Play data safety) must match it exactly — mismatches are a common rejection/fine vector |
| **Imagery & AI policy page** | both | Already specced in §3.3 — cross-link from T&C |
| **DPA template** | Pro customers on request | Standard EU controller-processor terms |

Use a quality template service/lawyer for the first pass (LT or DE firms do fixed-price startup packages, ~€1–3k for the set) — this is not a place for fully DIY, but also not a €20k engagement.

### 12.5 Data-handling architecture principles (engineering-facing)

1. **EU data residency by default:** Postgres on Contabo (DE) already; keep every processor EU-region where an EU option exists.
2. **Minimize what the LLM sees:** builder prompts contain pantry ingredient names and constraints — never email, name, user ID, or the dietary profile directly (send derived constraints like "no gluten" only under the consent design, or compute the filter client-side under device-local).
3. **Dietary profile device-local** until consented sync is a proven user demand (§12.1).
4. **Backups:** encrypted, tested-restore, EU-located — currently listed as "undecided" in `INFRA.md`; becomes mandatory the day the first paying user exists.
5. **Logging discipline:** no personal data in application logs (the typed error contract helps); 30–90 day log retention.
6. **Deletion cascade test:** an automated test that `/me/erase` leaves no orphaned per-user rows (pantry, recipes, profile, cupboard, push tokens) — the mobile additions must join the existing erasure path, and this is exactly the kind of invariant the api repo's architecture-test pattern already does well.
7. **Pro data exit:** export endpoint (recipes + costs as JSON/`.rex`) — contractual promise (§12.4) needs the feature to exist.

**Sequencing:** the entity decision, lawyer session, T&C set, and privacy policy join **Phase M0–M1** (before any public beta collects real emails); the Art. 9 device-local decision is an **M1 architecture decision**; insurance and the DPA template can wait for first revenue/first Pro customer respectively.

---

## 13. Branding: app names & visual assets (added 2026-09-21)

### 13.1 App naming — options and recommendation

"Nutrimero Bake" / "Nutrimero Pro Bakery" used throughout this document are **working names**. Final names must pass the trademark/store-availability check (§11.3 #13) before anything ships. Constraints: App Store name limit is 30 characters; the pattern must scale to future verticals (§3.5); "Nutrimero" always leads (the master brand is the freeware site's credibility).

| Option | Home app | Pro app | Assessment |
|---|---|---|---|
| **A — audience-named pair (recommended)** | **Nutrimero Home Baker** (20 ch) | **Nutrimero Pro Baker** (19 ch) | Names the *user*, not the activity — instantly self-selecting in store search results; perfectly symmetric; scales cleanly to future verticals (Nutrimero Home Chef / Pro Chef, Home Brewer / Pro Brewer). The strongest option |
| B — verb + Pro-suffix | Nutrimero Bake | Nutrimero Bake Pro | Shortest; "Pro" suffix is a familiar store convention — but implies Pro is an *upgraded tier of the same app*, which it isn't (different product, different buyer). Mild but real confusion risk for B2B sales |
| C — activity/business pair | Nutrimero Baking | Nutrimero Bakery | Elegant distinction (the hobby vs. the business) but subtle — "Baking" vs "Bakery" is easy to mix up verbally and in reviews/support |
| D — sub-brands | e.g. "Krusta by Nutrimero" | … | Rejected: dilutes the master brand a two-person team can't afford to build twice |

**Recommendation: Option A — "Nutrimero Home Baker" and "Nutrimero Pro Baker."** Store subtitles carry the keywords and localize per market (e.g. DE: "Rezepte, Nährwerte & Einkauf" / LT equivalent), so the names themselves can stay English everywhere — both are understood across DACH/LT/Nordics. Action for M0: EUIPO trademark screen on "Nutrimero" (the master mark matters more than the app names), both app names checked in App Store/Play, store listings reserved early, matching domains/subpaths (nutrimero.org/home-baker) secured.

### 13.2 Visual assets required

The master brand exists (lime `#b9bf05` / navy `#1b1f58`, brand-mark component in `nutrimero-web`, token registry in `nutrimero-design`) — mobile needs derivative work, not a new identity. Inventory, grouped by when it blocks something:

**Blocks the M1 beta:**
- **App icon family** — the highest-value single asset. One shared Nutrimero mark, differentiated per app at a glance: recommendation — *Home Baker: lime field / navy mark; Pro Baker: navy field / lime mark* (inverted pair = family resemblance + instant distinction on a home screen). Deliverables per app: iOS icon (incl. dark and tinted variants — iOS 18 requirement), Android adaptive icon (foreground/background layers) + Android 13+ monochrome/themed variant, notification icon (flat monochrome).
- **Splash screens** (Expo splash config, light + dark, both apps).
- **Logo lockups:** master Nutrimero logo + per-app lockups (icon + wordmark, horizontal and stacked) for in-app headers, store pages, and the web cross-promotion banner on nutrimero.org.

**Blocks store submission (M1/M2):**
- **Store screenshot sets** — per app, per locale (en/de/lt to start), per required device class (6.9" and 6.5" iPhone, 13" iPad since the Pro app is tablet-first on the bakery floor; Play phone + tablet). Design them as *narrative frames* (headline + UI) — this is marketing surface #1, not documentation. Optional but high-converting: a 15–30s app preview video.
- **Play feature graphic** (1024×500), store promotional text/keywords per locale.

**Product-content assets (M0, alongside content production):**
- **Recipe illustration style guide** — already decided in §3.3 (branded illustration, never photorealistic); this is where it gets produced: prompt templates + reference sheet locking style, palette, composition rules, so every batch-generated image is consistent. One-time effort, then cheap at scale.
- **Founder badge design** (§5.3 — numbered "Founder #37 of 100"), tier badges (Plus/Premium) for paywall and profile.
- **Category icons** for baking categories (breads, cakes, laminated…) and **tool icons** for the tool cupboard (§3.4) — flat, token-colored, consistent with the illustration style.
- **OG/social share images** template (recipe shares out of the app are free acquisition — every share is an ad).

**Production approach:** derive everything from the existing token system; the natural home for sources is `nutrimero-design` (it already has the normalization/generator discipline — mobile assets should join it as a new set with the same idempotent-build approach). AI generation is fine for illustration-style assets under the §3.3 labeling policy; the icon/logo lockups deserve a human-finished pass even if AI-drafted — the icon is seen more times than any other pixel in the product.

**Operating-cost fit vs. the €100–500/mo budget:** EAS Build ~$0–19/mo, Apple+Google dev accounts ~€10/mo amortized, RevenueCat free tier to start, Claude API €20–100/mo at early volumes (cache aggressively), price-data sourcing €0–200/mo depending on the per-market decision, Redis on the existing VPS €0. It fits — *if* price data starts with the estimate-grade, one-market approach.
