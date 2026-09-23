# Research — 002 Pro Baker Label desk

Phase 0 of `/speckit-plan`. Every unknown from the Technical Context is resolved here, or named as
a stop that the coordinator rules on at gate 2. Facts are cited to the api at `origin/main`
`4a4356b` unless stated.

---

## R1 — Where does the label-language list come from? (FR-011, B11)

**Finding.**
- The label endpoint's `language` is a free query string (`minLength 2`, `maxLength 35`,
  default `en-US`). There is no enum.
- No endpoint lists the languages the label vocabulary holds.
- The vocabulary seed (`seeds/label-vocabulary/manifest.json`) derives 584 terms from 24 official
  language versions of the regulations, plus 47 CLDR locale formats. Neither is served.
- The api's label e2e suites (`src/label-text/labels.e2e-spec.ts`, `issuing.e2e-spec.ts`) render
  and issue in **en-US, de-DE and mt-MT only**.
- **lt-LT label rendering is not exercised by any api test.**

**Decision.**
- The desk's label-language list is a **proven set**. A language enters only when an api
  **rendering** test (one that asserts rendered content) exercises it (gate 2 ruling):
  - `en-US`: `src/label-text/labels.e2e-spec.ts:210` (EU1 packaging nutrition in English)
  - `de-DE`: `src/label-text/labels.e2e-spec.ts:211`, and `issuing.e2e-spec.ts:126`
  - `mt-MT`: `src/label-text/labels.e2e-spec.ts:303` and `:359` (EU1 packaging rendered in Maltese)
- **Checked and excluded at gate 2**: `hu-HU` and `lt-LT` appear in the label suites only at
  `src/label-text/query-cost.e2e-spec.ts:420`. That test issues twenty counter cards in twenty
  locales and asserts query counts and list length, never rendered content, so it is not a
  rendering proof. hu-HU's other mentions are FID name-locale and ingredient-list tests, not
  label rendering.
- It is held as data in `packages/features/labels`. Each entry cites the api test that proves it,
  so an entry cannot be added without a citation.
- lt-LT is **not offered** until the api proves it (ask **B11b**) or serves a language listing
  (ask **B11**).
- The default is the last used language, else the UI language's match if it is offered, else
  en-US. A Lithuanian-UI user therefore defaults to en-US.

**Consequence (accepted at gate 2, G2-Q2).** The LT pilot cannot preview Lithuanian labels in this feature until
B11 or B11b lands. Issued labels already issued in lt-LT on the web still display, because they
are frozen text and the match check re-renders server-side in the stored locale.

**Alternatives rejected.**
- A hardcoded 24: the coordinator ruled it out, and it has no source.
- Probing each language against the api at runtime: that invents a capability probe the api
  does not define.
- Deriving the list from FID `/fid/languages`: those are 64 name locales, not label-vocabulary
  coverage.

## R2 — Page bound for the on-device product filter (FR-005, Q3-A)

**Finding.**
- `/products` is paged (`limit` ≤ 200, `offset`, `total`) and has no `q`.
- 015 A4 assumes "hundreds" of products per company.
- `/declarations` (the readiness overview) has the same paging.

**Decision.**
- The desk loads **at most 5 pages of 200, which is 1,000 active products**, and the matching
  overview pages. The filter matches name and product number, case- and diacritic-insensitive,
  over those rows only.
- **Past the bound**, a persistent line reads: "Showing the first 1,000 of N products — search
  covers these only." N is the api's `total`. There is no silent truncation.
- The pages load in parallel after the first response reveals `total`.
- When `/products?q=` ships (B2), the filter switches to server-side and the bound disappears.

**Alternatives rejected.**
- Loading everything unbounded: this is unsafe for a large chain, and the coordinator asked
  for a bound.
- A single page of 200: too small for a DACH bakery with seasonal products.

## R3 — Declarations toggle (FR-003, B12)

**Finding.**
- `declarationsEnabled` exists in `src/db/schema/company.ts:66`, `company.schema.ts` and
  `company.service.ts`.
- No route reads it. The api pins this itself: `src/declarations/boundaries.spec.ts:159`
  ("gates nothing on the company's declarations toggle (FR-039)").

**Decision.**
- The desk never reads the toggle.
- The contract check records both the schema-only fact and the api's own boundary test.
- A contract test in this repo asserts that the generated types for every endpoint the desk
  consumes carry no toggle-dependent response variant. A future api change that introduces
  one fails the drift gate plus that test, not a user.

## R4 — Secure token store (Q1 condition 3, XI)

**Finding.**
- The session holds a bearer access token and a rotating refresh token (api ADR 0004).
- These are secrets at rest. No secret-storage module is in the repo.

**Gate 2: folded into ADR 0001** (Home-owned, the shared ADR for navigation, secure store,
locale and i18n runtime). These conditions go to the Home lane through the coordinator as
requirements. SDK 57 docs, checked 2026-09-23, **correct one condition**:
`AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` is marked *deprecated* in `expo-secure-store`, and the
docs recommend `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, which is ADR 0001's choice. The desk reads
tokens only while it is in the foreground, so the stricter class costs it nothing.

*Original judgement, kept for the record:* this is a new dependency category (secret storage)
and stops for an ADR.
- Candidate: `expo-secure-store`, first-party Expo, Keychain on iOS and Keystore-backed on
  Android.
- It is not "obviously fine": the ADR must state
  - the iOS Keychain accessibility class (`AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`, so tokens do
    not migrate via backup),
  - Android behavior on backup/restore,
  - value-size limits (the refresh token fits),
  - and that Keychain items can survive an app uninstall on iOS. The first launch after a
    reinstall must clear orphaned items before FR-001a's account comparison.

**Alternatives rejected.**
- Plain async storage: tokens would sit unencrypted, which rules it out.
- In-memory only: sign-in on every cold start is hostile on a shop tablet.

## R5 — Local persistence for saved labels (FR-019–022, XI)

**Finding.**
- Saved labels are immutable JSON documents: frozen rendering, structure, text, and status
  fields. Expect tens to a few hundred per bakery.
- They must be grouped by product, purged per bakery, and excluded from OS backups (FR-022).

**Gate 2: authored by this lane as ADR 0002** (`docs/adr/0002-saved-label-document-store.md`):
`expo-sqlite` plus `expo-network`, Pro-only.
- SDK 57 documents no iOS backup-exclusion path, so the ADR takes the stated fallback: the
  caches directory plus disclosed eviction.
- That fallback proposes an FR-019 amendment, pending the coordinator's word.

*Original judgement, kept for the record:* a local database or document store is a new
dependency category and stops for an ADR.
- **Shared with Home.** Home 001 needs a device store for the dietary profile, pantry and
  collection cache.
- One ADR should serve both lanes. The coordinator routes it through the III seam.
- This lane proposes; it does not pick unilaterally.

Candidates for the ADR:
- (a) **`expo-sqlite`**: one table keyed by (bakery, issued id) with a JSON column; purge by
  bakery is a single delete. Recommended: it also covers Home's collection cache query needs.
- (b) `expo-file-system`: one JSON file per issued label, with a directory per bakery.

**Open verification inside the ADR (Expo SDK 57 docs, per `AGENTS.md`).** How to place the store
outside iOS backup:
- a database directory under `Library/` with the exclude-from-backup attribute, or
- a config plugin.

On Android, the app config sets `allowBackup=false`.

If SDK 57 offers no supported path on iOS, the ADR must say so and propose the fallback. That
fallback is to store in the caches directory and disclose "the device may clear saved labels
under storage pressure", which is a spec change that goes back to the coordinator.

## R6 — Other runtime dependencies, judged honestly

| Need | Choice | XI judgement |
|---|---|---|
| Screen navigation (tablet split, stacks) | **`expo-router`** | **Gate 2: ADR 0001** (shared, Home-owned) |
| Server state / caching | **None**: plain hooks over `openapi-fetch` | No dependency. Every read is online-only and fresh by rule (FR-021), so a query-cache library adds nothing this feature may use. |
| Decimal arithmetic | **None** | The desk does no arithmetic. It displays the api's rounded strings and full-precision source strings verbatim (FR-010/012). |
| i18n runtime | **`use-intl`** (the web's ICU message shape) + **`expo-localization`** | **Gate 2: ADR 0001.** One runtime for both apps (III). The earlier "small interpolation helper in core" is **dropped** |
| Connectivity events (FR-020 reconnect refresh) | **`expo-network`** `addNetworkStateListener`; offline is otherwise inferred from fetch failure | **Gate 2: ADR 0002** (this lane) |
| Component tests | Not added | Logic lives in pure TS modules tested by Vitest. Screens are verified by the quickstart and the VoiceOver/TalkBack audit. Adding a React Native testing library is a dev-dependency decision left for later. |

## R7 — Issued labels for a product (FR-015, B6)

**Finding.** Issued labels are listed per product × rule-set, unpaged, and each item carries its
full rendering and structure.

**Decision.**
- The desk queries the issued list for **every offered rule-set** from `/fid/declaration-rule-sets`
  (8 today), in parallel.
- It makes no client-side assumption about which regions have an engine, so no hardcoded
  EU1/EU2.
- Empty lists are cheap.
- When B6 ships (a per-product issued list), the list collapses to one call.

## R8 — Match verdict (FR-017)

**Decision.**
- `differsFromCurrent` is read only from `GET /issued-labels/{id}`, fetched each time the detail
  opens online.
- It is held in component state, never written to the saved-labels store. The store's schema
  has no verdict field, so it cannot be carried forward.
- The check time shown is the response's HTTP `Date` header. There is no server-supplied field;
  if the header is absent, the device time is used, labelled "checked at (device time)".

## R9 — Entitlement answer while the api has none (FR-023, Q2-A)

**Decision.**
- `packages/core` defines an entitlement port: `included | not_included | unavailable`.
- Its only implementation today returns `unavailable`, because there is no endpoint. The desk
  renders both server states from fixtures.
- **Gate 2 ruling (G2-Q1-A).** While the port returns `unavailable`, the desk is usable under a
  **persistent, non-dismissible** banner: "Plan status not available from the server".

**Release rule: mechanical, not a checklist (gate 2).**
- The entitlement adapter exports its source (`stub | server`).
- `apps/pro-baker` moves from `app.json` to `app.config.ts`. It **throws at config evaluation**
  when the build profile is `store` (`EAS_BUILD_PROFILE === 'store'`, defined in a new
  `apps/pro-baker/eas.json`) and the source is `stub`, so the store build fails before any
  native step.
- A Vitest test evaluates the config under a simulated `store` profile and asserts that it
  throws.
- Q2-B (a pilot) is not planned.

## R10 — Account switch and wipe ordering (FR-001a/b, Q1 conditions 1–2)

**Decision.**
- The session layer stores the last signed-in user id in the secure store.
- On a successful sign-in, if the returned user id differs from the stored one:
  1. core wipes its own data;
  2. core awaits every app-registered wiper, in registration order, each isolated so one
     failure does not skip the rest;
  3. only then does the new session become readable.
- Sign-out and erase run the same sequence. A wiper failure is reported and retried on the next
  launch, before any read. A pending-wipe marker persists in the secure store.
- The Pro app registers the saved-labels wiper. Home 001's FR-011/012 wipers register the same
  way.
