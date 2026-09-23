# Implementation Plan: Pro Baker Label desk

**Branch**: `lane/pro-baker` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md) (gate 1 passed with rulings)

**Input**: Feature specification from `specs/002-pro-label-desk/spec.md`

**Status**: Draft for **gate 2**. Nothing is implemented. Phase 1 is blocked behind the Home
lane's contract sync (II) and the XI stops below.

## Summary

This is a read-only Label desk for Pro Baker on tablet:
- the product list with readiness, and a bounded on-device filter
- the declarations grid with every gap as a sentence
- the label preview in a proven label language
- issued labels with the api's `differsFromCurrent` verdict
- saved issued labels as the one offline cache

Where the work lands:
- **Shared session capability** goes into `packages/core`: sign-in and sign-out, an
  app-registered wiper contract honouring Home FR-011, the company context, and a typed client
  middleware.
- The desk's domain model, saved-label store and screens form a new feature pack,
  `packages/features/labels`.
- `apps/pro-baker` stays thin: navigation shell, wiper registration, configuration.

What the plan avoids:
- There is no state library and no decimal library.
- **Three new dependency categories stop for ADRs**: the secure token store, the local
  persistence store, and navigation. Two Expo device modules are flagged for a ruling.

## Technical Context

| | |
|---|---|
| **Language/Version** | TypeScript 6.0 (strict), React 19.2, React Native 0.86 |
| **Primary Dependencies** | Existing: Expo SDK 57, `openapi-fetch` 0.17, generated types (`openapi-typescript` 7). **Proposed, behind ADRs**: secure store (R4), local store (R5), navigation (R6). **Flagged**: `expo-localization`, `expo-network` (R6) |
| **Storage** | Secure store: tokens, `userId`, `pendingWipe`. Local store: saved issued labels, per company, outside OS backups (R5). Nothing else persisted (FR-021) |
| **Testing** | Vitest (existing) for every pure module: session, wipe, error classifier, filter, readiness, gap sentences, rendering equality, language set, pinned contract facts. Screens are validated by `quickstart.md` Q1–Q16 and the VoiceOver/TalkBack audit |
| **Target Platform** | iOS and iPadOS, and Android (phone and tablet) via Expo; **13" tablet first** |
| **Project Type** | Mobile app in a pnpm monorepo (thin app + shared packages) |
| **Performance Goals** | SC-001 (answer readiness in < 30 s); Saved labels offline open < 2 s (SC-005); the product list is interactive after the first page while pages 2–5 load |
| **Constraints** | Read-only; online-only apart from saved labels; label text verbatim from the api; no hardcoded strings (en/de/lt); accessibility gate (44pt, 1.3×, VoiceOver/TalkBack, external keyboard) |
| **Scale/Scope** | ≤ 1,000 products loaded per bakery (R2); ~8 offered label types; tens to hundreds of saved labels per bakery; 9 screens/states |

## Constitution Check

*Gate: must pass before Phase 0. Re-checked after Phase 1 (bottom of this section).*

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack settled | ✅ | Expo / TS / pnpm / Biome / Vitest only; no stack change |
| II | Contract consumer | ✅ **with a blocking dependency** | Every server type is generated. The operations and pinned facts are in `contracts/api-consumption.md`. The sync is the Home lane's standalone contract-sync PR (api `4a4356b`; number to be named by the coordinator), and **phase 1 here does not start before it merges**. Missing capabilities are raised as api asks (B2, B6, B8, B11, B11b), never faked |
| III | Core + packs, shared seam | ✅ **seam announcement required** | Session goes into `packages/core`, the desk into `packages/features/labels`, and `apps/pro-baker` stays thin. The `packages/*` additions (`contracts/session-core.md`) are announced to Home through the coordinator before merge |
| IV | FID-only allergen/nutrition | ✅ | Emphasis, statements and figures come only from the api rendering (FR-014). There is no local derivation path, pinned by a test that the preview renders only `sections` |
| V | Honest provenance | ✅ n/a | No imagery. The FR-023 plan-lacks state has no dark pattern (equal-weight decline, no blur) |
| VI | Privacy by architecture | ✅ | No dietary profile involved. Bakery data is purged on sign-out, account switch and membership loss, and kept out of OS backups |
| VII | Entitlements server-side | ✅ | An entitlement port renders the server state; its only implementation returns `unavailable`; store release is blocked (R9). **G2-Q1** covers the dev rendering of `unavailable` |
| VIII | Offline read-only, first-class | ⚠️ **justified deviation** | Saved issued labels are the offline cache, refreshed by re-reading. There is **no delta sync** because the api has none, and other data is online-only by the coordinator's 002 ruling. See Complexity Tracking |
| IX | Multilingual | ✅ | All strings come from the catalogs. Label-type names are catalog keys by id. Gap sentences use catalog templates. The label language is separate from the UI language |
| X | Design from tokens, a11y gate | ✅ **blocked on design** | No screen is built before the design-mobile lane's pass. `packages/ui` components carry the a11y props |
| XI | Stop conditions | ⛔ **three stops raised** | The secure store (R4), local persistence (R5) and navigation (R6) are new categories, and ADR proposals are in `research.md`. `expo-localization` and `expo-network` are flagged for a ruling. No new top-level package (`packages/features/*` is per the coordinator's ruling) |
| XII | Gates | ✅ | Gate 1 passed. This plan stops at gate 2. PRs only; CI green; no suppressions |

**Post-design re-check:** unchanged. The design added no dependency beyond R4–R6, no persistence
beyond saved labels and session, and no write path.

## Project Structure

### Documentation (this feature)

```text
specs/002-pro-label-desk/
├── spec.md              # gate 1 passed with rulings
├── plan.md              # this file
├── research.md          # R1–R10
├── data-model.md        # generated-type map + device-owned entities
├── quickstart.md        # CI + manual Q1–Q16
├── contracts/
│   ├── api-consumption.md   # O1–O11, pinned facts P1–P6, asks
│   └── session-core.md      # shared packages/core surface (III seam)
└── checklists/requirements.md
```

### Source Code

```text
packages/core/src/
├── api/
│   ├── client.ts                # existing; gains middleware wiring
│   ├── middleware.ts            # bearer, X-Company-Id, single-flight refresh
│   └── errors.ts                # typed classification (P5)
├── session/
│   ├── session.ts               # signIn/signOut/state machine (data-model: Session)
│   ├── wipe.ts                  # wiper registry + wipe sequence (R10)
│   ├── company.ts               # active company, membership-loss events
│   └── token-store.ts           # port; the adapter depends on ADR (R4)
├── entitlements/entitlement.ts  # port, `unavailable` implementation (R9)
└── i18n/format.ts               # interpolation helper (if not landed by Home first)

packages/features/labels/        # new feature pack (@nutrimero/feature-labels)
├── src/model/
│   ├── readiness.ts             # display readiness from api cells (FR-004, FR-018)
│   ├── gap-sentence.ts          # gap → catalog template + names (FR-007/008)
│   ├── rendering.ts             # sections/runs → view model, text equality (FR-010)
│   ├── label-languages.ts       # proven set with provenBy (R1)
│   └── product-filter.ts        # bounded filter (R2)
├── src/store/saved-labels.ts    # repository over the persistence port (R5)
├── src/screens/                 # inventory 3–8, after the design pass
└── test/                        # Vitest + api-shaped fixtures typed by generated types

apps/pro-baker/src/
├── app-root.tsx                 # navigation shell (ADR R6), sign-in, bakery chooser
└── wiring.ts                    # registerWiper(savedLabels), API base URL from Expo public env
```

**Structure decision.**
- Shared session and api concerns go into `packages/core` (both apps need them).
- Everything desk-specific goes into `packages/features/labels`. A future Maker vertical
  (IDEATION §3.5) would reuse labels, so it must not sit in `apps/` (III).
- Catalog keys for the desk are added to `packages/core/messages/{en,de,lt}.json` under a
  `labels.*` namespace. Key parity is enforced by the existing test.

## Delivery phases (for `/speckit-tasks`)

| Phase | Content | Blocked by |
|---|---|---|
| **0** | Nothing to build. Wait for: the Home lane's contract-sync PR (number TBD); ADR rulings for R4, R5 and R6; the R6 flag rulings; gate 2 | coordinator |
| **1** | `packages/core`: middleware, error classifier, session state machine, wipe sequence, company context, entitlement port, and the P1–P6 contract tests. The seam announcement is sent before the PR opens | sync + R4 ADR |
| **2** | `packages/features/labels/model`: readiness, gap sentences, rendering view model, language set, bounded filter, with fixture tests (SC-002/003) | phase 1 types |
| **3** | Saved-labels store, purge rules, backup exclusion (verified on device), and status refresh on foreground/reconnect | R5 ADR (+ `expo-network` ruling) |
| **4** | Screens 1–9 per the approved design; navigation shell; wiring | the design pass + R6 ADR |
| **5** | Accessibility audit (VoiceOver/TalkBack, 1.3×, keyboard), de/lt catalog review, quickstart Q1–Q16 on tablet and phone | phase 4 |
| **Release** | Store release waits for api B8 (entitlements) and a server-backed entitlement adapter. It is not part of this feature's done-ness; it is a release checklist item | api B8 |

## Questions for gate 2

- **G2-Q1 — How does the desk render entitlement `unavailable` in development and internal
  builds?** Both options are client choices, so the coordinator picks.
  - (A) The desk is usable, with a persistent "plan status not available from server" banner.
    Store release is blocked by the checklist.
  - (B) The desk renders the FR-023 "not included" state until a server answer exists. Every
    screen is then reachable only in tests and fixtures.
  - The lean is **(A)**: it keeps the desk testable on devices, it does not pretend to know
    the plan, and release stays blocked by R9.
- **G2-Q2 — The LT pilot without Lithuanian label preview.** R1 offers en-US and de-DE only,
  because lt-LT is untested in the api. Accept this for 002, or ask the api lane to prioritise
  B11b (lt-LT e2e coverage) before phase 4?
- **G2-Q3 — ADR ownership for the shared categories.** R5 (local store) and R6 (navigation, and
  the i18n/locale module) are also needed by Home 001. Which lane authors each ADR, and which
  merges first? This lane has drafted the options in `research.md` and holds.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| VIII: an offline cache without delta sync (`updated_since` + tombstones) | The api has no delta sync. Issued labels are immutable except for status, and the coordinator ruled them this feature's one offline cache | Waiting for delta sync would leave the desk with no offline story. Re-reading each saved label's status on foreground and reconnect is bounded (tens to hundreds of reads, and only for labels already viewed) and correct, because the frozen content cannot change |
| VIII: products, grids and previews online-only | They are computed per read and move with any upstream edit; a stale copy would misstate label readiness (a liability edge) | Caching them would need the api's freshness signals, which do not exist (no ETag; `currentAsOf` is a date, not a version) |
