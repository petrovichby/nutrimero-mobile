# Pro Baker — capability map (draft)

**Status:** study draft, 2026-09-23 · PRO lane (`lane/pro-baker`) · input for the coordinator's first
pro-side assignment. Not a spec, not a plan; nothing here is decided until the owner rules.

**Sources:** `nutrimero-docs/mobile/IDEATION.md` (§3.2, §3.3, §4, §5.3, §7, §8.5, §12), this repo's
`PRODUCT.md`, `docs/DESIGN.md` (0.4.0 draft), `.specify/memory/constitution.md` (0.1.0 draft),
`nutrimero-api` specs 001, 009–019 and its `openapi.json` at `a4704e0` (019 S2), plus
`nutrimero-docs/MIGRATION_PLAN.md` §6, `PARKED.md` and `PRODUCT.md`.

---

## 1. Headline findings

1. **The api shipped the opposite half of Pro from the one the ideation sells.** IDEATION §3.2
   pitches Pro as floor recipes + scaling, costing, wholesaler ordering, team roles and a supplier
   directory. The api (010–019) shipped recipes, roll-ups, products, declarations, the EU
   ingredient list, article composition, and label rendering with issuing. Costing and ordering
   are **explicitly fenced out**: cost in 012 FR-023, 013 FR-032, 014 FR-040a and 015 FR-037;
   orders in 012 FR-022. Scaling is not an api concept at all. Of the five Pro tabs in
   DESIGN.md (**Production · Recipes · Costing · Orders · More**), **Production, Costing and
   Orders have no api behind them.**
2. **Declarations and labels are the most finished capability Pro could ship today**, but the
   ideation never names them as a Pro feature. They appear only as template quality (§3.3) and
   under the future "Maker" vertical (§3.5). Whether labels belong in Pro, and in which tier, is
   an owner decision.
3. **In practice, only counter cards can be issued today.** Every `*_packaging` rule-set requires
   `additives`, and that cell is hard-coded to `cannot_be_held`
   (`nutrimero-api/src/declarations/completeness.ts`, 016 FR-018, kept by 017's amendment, SC-007;
   verified by the api lane and recorded as `nutrimero-docs` PARKED P-02). So issuing any packaging label
   returns `409 DECLARATION_INCOMPLETE`. Only `eu1_counter_card` and `eu2_counter_card` (allergens
   only) are issuable. Rendering works for EU1 and EU2 only; other regions get `engine:null`.
4. **Offline-first has no server support.** The api has no `updated_since`, no tombstones, no
   ETags and no cursors. Roll-ups, grids, lists and renderings are computed on every read and
   stored nowhere. Constitution VIII requires delta sync, so this is api work before any offline
   Pro feature. **Issued labels are the one naturally cacheable unit**: they are immutable and
   self-contained, and only their status changes.
5. **Pricing and tiers conflict at the docs level.** `nutrimero-docs/PRODUCT.md:97` says "Pricing,
   tiers, customers-as-payers, and any monetization mechanism have never been defined", and says
   Hobby Mode is "not a commercial tier". IDEATION §5.3 "decides" Pro Essential €24 and Pro
   Business €59. Entitlements do not exist in the api. This needs an owner ruling before any
   paywall or tier-gated Pro screen.
6. **The mobile contract snapshot is out of date.** `contract/openapi.json` has 56 paths and ends
   at FID reference data. The api has 104 paths, and `origin/main` is two commits past the local
   api checkout (#78 fixes two wrong numbers in 017, #79 relabels ingredient-name language
   columns). Syncing it is a **shared-package change** (`packages/core` generated client) and is
   the prerequisite for every capability below.

---

## 2. The map

Legend for **API**: ✅ shipped · 🟡 partial (inputs exist, capability doesn't) · ❌ absent or
fenced out. **Home?** means whether Home Baker needs the same capability, which decides
shared-core versus Pro-only.

### 2.1 Tenancy, team, account

| Capability | Pro need (source) | Home? | API | Notes |
|---|---|---|---|---|
| Sign-in, refresh-token session, password recovery | table stakes | yes | ✅ 001 | Bearer + rotating refresh (ADR 0004 chose tokens *for mobile*) |
| Company context (`X-Company-Id` on every call), company switcher | a consultant sits in several bakeries (001) | implicit only | ✅ 001 | Registering creates a company, so Home users have one too. The shared session layer must handle both "one implicit company" and "switcher". |
| Roles admin / editor / viewer with role-aware UI | §3.2 #4 | no | ✅ 001 FR-021 | Roles are fixed and coarse. "Editors adjust batches, viewers execute" works only as write vs read, since batches are not an entity. Role is re-read on every request, so a downgrade takes effect on the next call and the UI must handle a sudden `403 INSUFFICIENT_ROLE`. |
| Invitations, join codes, member management | §3.2 #4, Essential "≤5 members" | no | ✅ 001 | The member cap is an entitlement and does not exist. |
| Preferences (scheme, language) | both | yes | ✅ 009 | Per user. The api never reads them. |
| Account deactivate / erase in-app | store mandate (§11.4 #19) | yes | ✅ 001 | Shared. |
| Hobby Mode toggles (`priceCalculationEnabled`, `declarationsEnabled`) | Pro = professional mode | — | ✅ but advisory | **No api route checks them** (OQ-38; 016 FR-039). The client enforces them. Decide what Pro does when its company has them off. |

### 2.2 Recipe book and the bakery floor

| Capability | Pro need | Home? | API | Notes |
|---|---|---|---|---|
| Browse and read company recipes (versions, sub-recipes up to depth 8, steps with 39 actions) | §3.2 #1 | yes (different corpus) | ✅ 013, but no `q` | **No text search on recipes.** It is paged only, and paged in memory (015 A4 assumes "hundreds"). A floor tablet with 200 recipes needs search: api gap. |
| Edit recipes on tablet (components, steps, reorder) | editor role | "own recipes" (§11.2 #7) | ✅ 013 | Reorder uses exact-set confirm tokens (FR-012a). Offline editing is out of scope (constitution VIII). |
| **Floor Mode** (one step per screen, dark, 56pt, wake-lock, timers) | DESIGN.md §Floor Mode | **yes**, as Home's baking mode | n/a (client) | **Strongest shared component.** Home's "baking mode" is the same step viewer. Build once in `packages/features`, and theme the temperament. |
| **Batch scaling** ("×3 of the rye", "for 40 kg dough") | §3.2 #1, Essential | yes (tin scaling, §3.1 #4) | ❌ | Not an api concept. Goal-seek is fenced (013 FR-034) and parked (M46). Client-side scaling is plausible, but **resolved grams per component are internal only** (014 FR-028c has no route). Without them, scaling count or volume units means re-implementing 014's mass resolution, which duplicates server logic. The api should expose resolved component masses. |
| Baker's percentages | ideation only | yes (Plus calculators) | ❌ | Needs a "flour base" marker that no entity carries. Open question for Markus: is it computed from FID flour classes, or authored? Shared calculator engine with Home. |
| Production plan / today's list (the **Production** tab) | DESIGN.md nav, §3.2 #3 ("orders from production plans") | no | ❌ | No entity. Pax or production quantity is fenced (015 FR-049, M53d). **Unspecced on both sides.** Needs a product definition before design. |

### 2.3 Nutrition, allergens, declarations, labels (the shipped crown jewels)

| Capability | Pro need | Home? | API | Notes |
|---|---|---|---|---|
| Nutrition per 100 g / per portion, allergens (66 subjects), 4 dietary states, **named gaps** | quality of templates (§3.3) | **yes** (per-slice nutrition, allergen chips) | ✅ 014 | Shared: the gap vocabulary UI (`not_recorded`, `cannot_be_held`, `mass_unresolvable` with datum and path) and the allergen display rules (constitution IV invariant tests). |
| Products (sellable item → recipe lineage or article, scheduled swaps) | prerequisite for labels | no | ✅ 015 | Returns identities only, nothing computed. Pro-only. |
| Declarations grid (product × rule-set × 5 categories, required and complete, every gap named); overview list | not in ideation | no | ✅ 016 | 11 rule-sets, 7 regions. Additives are always incomplete (finding 3). `currentAsOf` is the only freshness signal. |
| EU ingredient list (structure, Art. 18 order, QUID, <2 %) plus editor **choices** (rename, hide, merge, compound, QUID, additive form…) | not in ideation | no | ✅ 017 (+019 P3) | Office work more than floor work, so tablet with keyboard. Every choice POST returns the whole list (heavy). An allergen line cannot be hidden (`CARRIES_ALLERGEN`). |
| Article composition capture (State 1 verbatim text / State 2 % breakdown with origins) | wholesaler articles | no | ✅ 018 | **Tablet data entry from a pack.** No parsing or AI is allowed (FR-023/040). The client should mirror `SUM_NOT_EXACT` and must preserve `localId`, otherwise 017 choices go dormant. |
| Label text render (sections/runs, nutrition rounded to the 2012 guidance, per language) | not in ideation | no | ✅ 019 S1 | EU1/EU2 only. 24 EU label languages, a **separate axis from UI locale** (en/de/lt), so a German-UI baker prints a Lithuanian label. The client applies emphasis from runs; the api emits no markup. |
| **Issue** a label (freeze), list issued, verify a printed pack (`differsFromCurrent`), withdraw | not in ideation | no | ✅ 019 S2 | Status-code semantics (201 new / 200 identical). `409 DECLARATION_INCOMPLETE {categories[]}`. Drift is shown only on the single read, which needs to be online. The issued list is unpaged and heavy. Contract doc paths ≠ shipped paths: trust `openapi.json`. |
| Print or share the label (PDF, AirPrint, label printer) | implied | no | n/a (client) | Needs a print/PDF module. That is likely a new dependency category, which requires an ADR (constitution XI). |
| Barcode scan to find or create an article | implied by 010/011 | maybe (Safe vertical) | 🟡 | Barcode fields exist, with lookup `?barcode=`. Scanning is client-side (camera module, ADR). New commons records from mobile stay `pending` indefinitely because moderation does not exist (M41). |

### 2.4 Purchasing, costing, ordering (the ideation's revenue half)

| Capability | Pro need | Home? | API | Notes |
|---|---|---|---|---|
| Purchased items (articles), overrides, package data | §3.2 #2 inputs | no | ✅ 011 | Pro-only. |
| Vendors and prices (multi-vendor, basis, currency, history) | §3.2 #2 inputs, Essential "manually entered prices" | no | ✅ 012 | The vendor is **a name only**: no email, phone or address. There is no default currency and no FX. |
| **Recipe costing and margin** | §3.2 #2, Essential + Business | no (Home uses retail *estimates*, a different domain) | ❌ fenced | The cost feature is referenced across 014 §E (FR-041a–043a, SC-019a: quote basis, content/drained weight, list vs effective price labels) but **has no spec number.** Constitution II forbids faking it client-side. **This is nutrimero-api work first.** |
| Live wholesaler price lists | Business | no | ❌ | No importer. The source field is an open set (011 FR-026). |
| **Order generation (PDF/email to supplier)** | Essential | no | ❌ fenced | 012 FR-022 fences out orders, order lines, delivery terms and contacts. Mailing a supplier needs vendor contact data, which does not exist. api work (the "Trade" module in MIGRATION_PLAN §6 v1.x). |
| Structured order export / e-promo handoff (T3) | Business, LT pilot | no | ❌ | Downstream of orders. Worth building only if a pilot bakery uses e-promo (§8.5). |
| Margin analytics, multi-location | Business | no | ❌ | Multi-location vs one company per location is a tenancy question. |

### 2.5 Directory, entitlements, platform

| Capability | Pro need | Home? | API | Notes |
|---|---|---|---|---|
| Regional equipment-supplier directory | §3.2 #5 | no (Home has the affiliate gear guide instead) | ❌ | Small read-only `equipment_suppliers` resource (§3.4). Low effort, low urgency. Content depends on Markus. |
| Entitlements: **per company** for Pro (per bakery, not per seat) | §5.3 | **per user** for Home | ❌ | One service, two subjects. Web checkout via merchant of record for B2B (§5.3). Blocked on finding 5. |
| Delta sync and offline cache | constitution VIII, §3.2 #1 | yes | ❌ | Shared. Needs a cache engine, which is a new dependency category and needs an ADR. |
| Push (order confirmations) | §7 | yes (drops, price alerts) | ❌ | Shared transport. |
| Force-update / `app-config` | §11.4 #17 | yes | ❌ | Shared. Must precede v1. |
| Data export on exit (recipes/costs JSON or `.rex`) | B2B terms (§12.4) | lighter | ❌ | `.rex` export is out of scope in 013 FR-036. |

---

## 3. What this implies for the shared core

These are candidates, not decisions. Every item touching `packages/` needs the coordinator's
sign-off and a message to the Home lane.

1. **`packages/core` API layer.** Contract sync to 104+ paths. An `X-Company-Id`-aware client
   middleware. Typed handling of the api's error envelope: `INSUFFICIENT_ROLE`,
   `COMPANY_ARCHIVED`, `422` issue codes, `409 DECLARATION_INCOMPLETE`. A session that supports an
   implicit single company (Home) and a switcher (Pro).
2. **Decimal-string numerics.** Every api figure is a full-precision decimal string (M38), and
   only 019 rounds. Scaling, costing display and 018's exact-sum validation all need a no-float
   decimal type. Locale formatting goes through core formatters (constitution IX), with **no
   digit grouping on label output** (019 FR-019/020), which differs from UI number formatting.
   Home needs the same for per-slice nutrition. This is one shared module; it probably needs an
   ADR if it pulls in a decimal library.
3. **Gap and completeness vocabulary UI.** One renderer for 014's gap kinds, reused by Home
   (nutrition and allergen confidence) and Pro (declarations, lists, labels). "Every gap named"
   is a platform-wide honesty pattern and fits PRODUCT principle 1.
4. **Allergen presentation.** One implementation of the FID-only rule (constitution IV) with
   invariant tests: Home's allergen chips and Pro's grid and label emphasis both draw from it.
5. **Step viewer, timers, wake-lock, and the scaling engine** (`packages/features`). Floor Mode
   and Home's baking mode are one component with two temperaments. Tin scaling and batch scaling
   are one engine. Both are blocked on the api exposing resolved component masses (§2.2).
6. **Offline cache and sync** (ADR first). Pro is the stricter consumer: floor use, and issued
   labels as an immutable cache. Home is the larger one: FID reference data and the recipe corpus.
7. **Role-aware UI primitives** (`useCan('write')`, disabled-with-reason states). They belong in
   core even though only Pro uses them at first, because a future vertical like Maker will reuse
   them.
8. **Entitlement client.** It renders server state for either subject (user or company) and
   never decides anything (constitution VII).

**Pro-only feature packs** (per constitution III, these still live in `packages/features`, not in
`apps/pro-baker`, because the Maker vertical §3.5 would reuse labels): `labels`
(016/017/019), `articles` (011/018 + barcode), `products` (015), `purchasing` (012 → costing),
`ordering`, `team-admin` (001 member management).

---

## 4. API work Pro needs (for `nutrimero-api`, not for this lane)

Listed in the order it unblocks Pro:

1. Recipe search (`q` on `/recipes`, and on `/products`).
2. Resolved component masses exposed (014 FR-028c as a route), which unblocks client scaling
   without duplicating 014.
3. Delta sync: `updated_since` plus tombstones on recipes, products and articles; ETag on FID
   reference lists.
4. **The cost feature** (numberless today; the requirements are already drafted in 014 §E).
5. The Trade/order domain, plus vendor contact data.
6. Entitlements (per-company subject), after the pricing conflict is ruled.
7. The additives capability (unblocks packaging-label issuing), and non-EU engines. Neither is
   urgent for DACH/LT.
8. The `equipment_suppliers` resource.

---

## 5. Proposed first pro-side assignment (recommendation, for the coordinator)

**A read-only "Label desk" on the tablet.** Scope: a product list, the declarations grid with
named gaps, a label render in a chosen EU language, and issued labels with "matches what was
printed?" verification.

Why this one:
- It is the only Pro capability whose api is **fully shipped**, so no nutrimero-api dependency
  and no violation of constitution II.
- Issued labels are immutable, which makes them the safe first offline cache with no sync
  engine needed.
- It exercises the shared-core items every later Pro feature needs: company context, roles,
  decimal strings, the gap UI and the allergen rule.
- It is read-mostly, so role gating is simple (issuing is editor-only).
- It depends on the owner ruling that labels belong in Pro (finding 2). If the owner says no,
  the fallback is below.

**Fallback: a read-only Floor Mode recipe viewer** (013 + 014, DESIGN.md already specifies it),
built as the shared step viewer with Home. Unscaled at first, because scaling waits on api item 2.

**Before either:**
- (a) Contract sync, a coordinated `packages/core` change.
- (b) A Pro design corpus pass through the `impeccable` skill. None exists yet, and DESIGN.md
  covers Pro only as temperament plus Floor Mode.
- (c) Owner rulings on the questions below.

---

## 6. Open questions for the owner / coordinator

1. Do declarations and labels belong in Pro? If yes, in Essential or Business? (They are the
   api's most finished capability and absent from the ideation's Pro pitch.)
2. `nutrimero-docs/PRODUCT.md` says tiers and pricing were never defined; IDEATION §5.3 decides
   them. Which one governs?
3. The Production tab: what *is* a production plan? No entity exists, and Pax is fenced (M53d).
   Should the tab stay in DESIGN.md's nav before it has a definition?
4. Costing, the ideation's Essential headline, is fenced out of the api with no spec number. Is
   it scheduled?
5. Hobby toggles off on a Pro company: hide, warn, or ignore?
6. Baker's percentages: flour base derived from FID classes, or authored per recipe? (Markus)
7. Which wholesalers do the pilot bakeries use (IDEATION §9)? This decides whether ordering is
   PDF/email or e-promo export first.
