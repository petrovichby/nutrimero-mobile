---
description: "Task list for 002 Pro Baker Label desk"
---

# Tasks: Pro Baker Label desk

**Input**: `specs/002-pro-label-desk/` — plan.md (gate 2 passed with rulings), spec.md, research.md,
data-model.md, contracts/, quickstart.md

**Tests**: requested by the plan. Every pure module ships with Vitest tests, and the pinned
contract facts P1–P6 are tests. Tests are colocated as `*.test.ts` under `src/`, per
`vitest.config.ts`. Screens are verified by `quickstart.md` and the accessibility audit, not by
component tests (plan R6; no React Native test harness is admitted).

**Organization**: Setup and Foundational come first, then one phase per user story. The plan's
delivery phases map as follows:
- plan phase 1 → Setup + Foundational
- plan phase 2 → the model tasks in US1–US3
- plan phase 3 → US4's store (waits for **ADR 0002**)
- plan phase 4 → the screen tasks (wait for the **design-mobile pass**)
- plan phase 5 → Polish

**Blockers** (no task below them starts before they clear):

| Tag | Clears when |
|---|---|
| ~~⛔SYNC~~ ✅ | **Cleared**: PR #5 merged as `fab871e`, and the lane was rebased (T001) |
| ⛔ADR1 | **PR #4 merges with ADR 0001 `Accepted`** (Home; expo-router, expo-secure-store, expo-localization, use-intl). This does not wait for Home's phase 3. Whichever lane's PR lands first installs `expo-secure-store` and widens `pnpm-workspace.yaml`; the other lane rebases |
| ~~⛔ADR2~~ ✅ | **Cleared**: ADR 0002 accepted 2026-09-23 (saved labels in the default, backed-up directory; FR-019 unchanged; FR-022's backup clause removed for saved labels) |
| ⛔DESIGN | the design-mobile lane's Label desk pass approved (screen inventory 1–9) |

**Git discipline** (constitution XII):
- The lane commits and opens PRs on `lane/pro-baker`, and never merges.
- CI must be green.
- No suppressions or skipped tests.
- Every `packages/*` change is announced to the Home lane through the coordinator **before its
  PR opens** (III seam).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (⛔ADR1)

**Purpose**: make the workspace ready for a feature pack and the shared session work.

- [x] T001 Rebase `lane/pro-baker` onto `main` after PR #5 merges. *(Done 2026-09-23: rebased onto `fab871e`; `pnpm contract:generate` gives no diff; O1–O11 present.)* Confirm `pnpm contract:generate` produces no diff and that `packages/core/src/api/generated/schema.d.ts` contains O1–O11 from `specs/002-pro-label-desk/contracts/api-consumption.md`
- [x] T002 Add `packages/features/*` to `pnpm-workspace.yaml`, unless Home's PR #4 landed it first (then rebase instead). This is a shared file, so it goes in the seam announcement (T011) *(Done in PR A: `packages/features/*` added — this lane landed first.)*
- [x] T003 Create the feature pack `packages/features/labels/` with `package.json` (`@nutrimero/feature-labels`, private, `main: src/index.ts`, `typecheck` script, deps `@nutrimero/core` and `@nutrimero/ui` as `workspace:*`), `tsconfig.json` extending `../../../tsconfig.base.json`, and `src/index.ts` *(Done in PR A: an empty pack.)*
- [x] T004 [P] Add `@nutrimero/feature-labels: workspace:*` to `apps/pro-baker/package.json` and run `pnpm install`, so the lockfile updates *(Done in PR A.)*
- [x] T005 [P] Create the api-shaped fixtures under `packages/features/labels/src/__fixtures__/`, typed by generated types only. Each is recorded from a **local** api at `contract/SOURCE`'s commit (`4a4356b`), seeded with `fid:import`, the same rule as Home's snapshot. **Never from production.** The recording script and seed commit are noted in `__fixtures__/README.md`. Fixtures: *(Moved to PR B: the core tests use inline data typed by the generated types; recorded fixtures serve the models.)* *(Done in PR B: 16 fixtures from a local api at `4a4356b` in a throwaway Postgres, seeded with `fid:import`. The recorder refuses non-loopback URLs and a commit that is not `contract/SOURCE`'s. Each fixture module `satisfies` its generated type.)*
  - a counter-card grid (complete)
  - a packaging grid (Additives `cannot_be_held`, P-02)
  - a no-composition grid
  - renderings for `eu1_counter_card` in every **offered** label language (en-US and de-DE today; add hu-HU, lt-LT and pl-PL when each is cited)
  - an `eu1_packaging` rendering in en-US with nutrition
  - a non-EU `engine: null` rendering
  - issued labels in active, superseded and withdrawn states
  - a `/me` with two memberships

---

## Phase 2: Foundational — shared session, client, entitlement, release block (⛔ADR1)

**Purpose**: the `packages/core` capability from `contracts/session-core.md`. Every story needs
it. **No user-story work starts before this checkpoint.**

- [x] T006 [P] Write `packages/core/src/api/errors.ts` + `errors.test.ts`. It classifies generated error envelopes into `unauthorized | insufficientRole | notFound | companyArchived | validation | network | unknown`, and covers pinned fact P5 *(Done in PR A.)*
- [x] T007 [P] Write `packages/core/src/session/token-store.ts`: a port plus the `expo-secure-store` adapter (install `expo-secure-store` only if Home's PR #4 has not) per ADR 0001's conditions (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`, the reinstall-marker clear before any read, no value logging). Add `token-store.test.ts` covering the port contract with an in-memory fake *(Done in PR A. The adapter is `packages/core/src/device-store/secure-store-adapter.ts`; the port is `DeviceStoreAdapter` in `adapter.ts`, named per Home's contract.)*
- [x] T008 Write `packages/core/src/session/wipe.ts` + `wipe.test.ts` (R10): *(Done in PR A.)*
  - `registerWiper(name, fn)` and an ordered, isolated wipe sequence
  - `pendingWipe` set before the wipe and cleared only when every wiper succeeds
  - the sequence resumes on launch
  - tests prove core's own wipe runs first, one failing wiper does not skip the others, and a failure keeps `pendingWipe`
- [x] T009 Write `packages/core/src/api/middleware.ts` + `middleware.test.ts` (depends on T006 and T007): *(Done in PR A. **Change from plan:** no `X-Company-Id` injection; the generated types require the header on every company-scoped operation, so callers pass `session.companyHeaders()`. Only GETs are retried after a refresh.)*
  - bearer header
  - `X-Company-Id` on company-scoped paths only
  - single-flight refresh on 401 via O2, with the rotated refresh token persisted
  - wire it into `packages/core/src/api/client.ts` without changing `createApiClient`'s existing signature for Home
- [x] T010 Write `packages/core/src/session/session.ts`, `company.ts` + `session.test.ts` (depends on T007–T009), following the data-model Session state machine: *(Done in PR A.)*
  - `signIn` via O1 then O4, with the **wipe before any read when the `userId` differs or none is stored** (FR-001a; ADR 0002 relies on the missing-id case, and the tests cover both)
  - `signOut` runs the wipe, then best-effort O3
  - `chooseCompany` rejects ids that are not memberships
  - `onMembershipLost` fires on the O4 diff, `COMPANY_ARCHIVED` or a company 404
  - export it all from `packages/core/src/index.ts`
- [ ] T011 Send the **seam announcement block** to the coordinator when PR A is ready (III). Home has already read `contracts/session-core.md`; the coordinator acknowledges in one line. It lists the `packages/core` surface (T006–T010, T012), `pnpm-workspace.yaml` (T002), and the new `packages/features/labels`. Record the coordinator's acknowledgement in the PR body. **The phase-1 PR does not open before this**
- [x] T012 [P] Write `packages/core/src/entitlements/entitlement.ts` + `entitlement.test.ts` (R9): *(Done in PR A. The source lives in `source.json`, so the build-time config can read it.)*
  - a port returning `included | not_included | unavailable`
  - the stub adapter always returns `unavailable`
  - `ENTITLEMENT_SOURCE` is exported as `'stub'`
- [x] T013 Convert `apps/pro-baker/app.json` to `apps/pro-baker/app.config.ts` (same values). Add `apps/pro-baker/eas.json` with `development`, `internal` and `store` profiles. The config **throws at evaluation** when `process.env.EAS_BUILD_PROFILE === 'store'` and `ENTITLEMENT_SOURCE === 'stub'` (G2-Q1, mechanical block). Add `apps/pro-baker/src/app-config.test.ts`, which asserts that it throws under a simulated store profile and evaluates cleanly otherwise *(Done in PR A. Verified with the real Expo CLI: `EAS_BUILD_PROFILE=store npx expo config` refuses.)*
- [x] T014 [P] Write `packages/core/src/api/contract-facts.test.ts`: the type-level and fixture assertions for pinned facts: *(Done in PR A. P1–P4 are type-level and negative-controlled; P5 is the exhaustive `Record` in `errors.ts`.)*
  - P1: O9's `language` is a free string
  - P2: no O5–O11 response references `declarationsEnabled`, and the desk never calls `companies/current`
  - P3: `differsFromCurrent` is on O11, not O10
  - P4: O9 answers 200 with `gaps` / `engine: null`

**Checkpoint**: `pnpm quality` is green. Open the phase-1 PR (T011 acknowledged). User stories
can begin.

---

## Phase 3: User Story 1 — See which products are ready for which label (P1) 🎯 MVP

**Goal**: sign in, choose a bakery, see products with per-label-type readiness, and open a grid
with every gap named.

**Independent Test**: `quickstart.md` Q1, Q2 and Q13 (viewer), and the Q15 bound.

### Tests and model (plan phase 2; after Foundational)

- [x] T015 [P] [US1] Write `packages/features/labels/src/model/readiness.ts` + `readiness.test.ts`: *(Done in PR B. "Not issuable" = a required cell with a `cannot_be_held` gap whose **target is `system`**. A record-shape `cannot_be_held` stays fixable.)*
  - display readiness comes from the api cells: ready, or a count of incomplete required categories
  - packaging reads "not issuable yet" when Additives is `cannot_be_held`, **derived from the gap kind, never from the rule-set id** (FR-018, P-02)
  - fixtures: complete, packaging, no-composition
- [x] T016 [P] [US1] Write `packages/features/labels/src/model/gap-sentence.ts` + `gap-sentence.test.ts`: *(Done in PR B. `datum.type`/`target.type` are open strings in the contract; known types come from the api's own sources, others use `other` templates.)*
  - a gap (kind, datum, path/occurrences) becomes a catalog key + parameters, with server names inserted
  - `cannot_be_held` gets a distinct template (FR-008)
  - an unknown kind or datum falls back to a generic template that still shows kind + path
  - the test asserts **every gap in every fixture yields a sentence** (SC-002)
- [x] T017 [P] [US1] Write `packages/features/labels/src/model/product-filter.ts` + `product-filter.test.ts` (R2): *(Done in PR B.)*
  - loads ≤ 5 × 200 pages
  - matches name and number, case- and diacritic-insensitive
  - exposes `{ rows, loaded, total, bounded }` for the "first 1,000 of N" line
  - tested at 1,200 rows
- [x] T018 [P] [US1] Write `packages/features/labels/src/model/label-types.ts` + `label-types.test.ts`: offered rule-sets from O5, with display names as catalog keys `labels.labelType.<id>` falling back to the api name (FR-025) *(Done in PR B.)*
- [x] T019 [US1] Add the `labels.*` catalog keys (readiness, gap templates, label-type names, bound line, grid headings, sign-in, bakery chooser, states) to all **seven** UI catalogs under `packages/core/messages/` (en, de, hu, lt, be, pl, uk), translated, with key parity and Home's plural check passing. The catalog plumbing is on `main` (#8: the seven catalogs, the `LOCALES` export, and parity and plural tests); add the keys to every locale in `LOCALES`, and do not create plumbing here *(Done in PR B for the model-facing keys: 87 `labels.*` keys × 7 catalogs, none addressing the reader (FR-025a). **Screen keys (sign-in, bakery chooser, states) come with PR C**, in the Pro namespace, formal register.)*
- [x] T020 [US1] Write `packages/features/labels/src/data/products.ts`: loaders over the session client for O6 and O7 (parallel after the first page reveals `total`) and O8. Online-only, with no persistence (FR-021) *(Done in PR B: `data/products.ts`, `data/result.ts`.)*

### Screens (⛔DESIGN, ⛔ADR1 for expo-router and use-intl)

- [ ] T021 [US1] Build `apps/pro-baker/src/app/` routing (expo-router) per the approved design. It has sign-in, bakery chooser, and the Label desk split view (list | detail on tablet, stacked on phone), and **no Production tab**
- [ ] T022 [US1] Write `packages/features/labels/src/screens/sign-in.tsx` and `bakery-chooser.tsx` (FR-001, FR-002; link out to nutrimero.org for account and recovery; "last chosen bakery" remembered through the session) **Copy (owner ruling 2026-09-23):** "Sign in with your nutrimero.org account", with the link-out kept, in the Pro namespace and the formal register (FR-001, FR-025a).
- [ ] T023 [US1] Write `packages/features/labels/src/screens/product-list.tsx`: rows with readiness per label type (T015), the bounded filter and its line (T017), and a "no label types assigned" row that still opens (US1-3)
- [ ] T024 [US1] Write `packages/features/labels/src/screens/declarations-grid.tsx`:
  - label types × five cells, with required/complete in text and glyph
  - gap sentences (T016)
  - "current as of" (FR-009)
  - the P-02 cell copy
- [ ] T025 [US1] Write `apps/pro-baker/src/wiring.ts`: create the session with the API base URL from Expo public env, register the app's wipers, and handle `onMembershipLost` with a message and the bakery switch (US5-3 hook point)
  - **Sweep condition (PR A, coordinator):** register **every** wiper **before** `session.restore()`. `restore()` runs the wipe sequence as registered at that moment, so the order is a contract. A test proves that the fresh-install wipe reaches an app-registered wiper.

**Checkpoint**: US1 is demonstrable on a tablet against staging (Q1, Q2, Q13, Q15).

---

## Phase 4: User Story 2 — Preview the label text in a chosen language (P1)

**Goal**: render the api's label for product × label type × proven language, verbatim.

**Independent Test**: `quickstart.md` Q3 and Q4.

- [x] T026 [P] [US2] Write `packages/features/labels/src/model/label-languages.ts` + `label-languages.test.ts` (R1): *(Done in PR B.)*
  - the **owner's list** is en-US, de-DE, hu-HU, lt-LT and pl-PL, with `provenBy` = **spec file › describe › test title** or `null` (verbatim titles in research R1; never line numbers)
  - **offered = entries with a citation** (en-US and de-DE today)
  - the test fails if an offered entry lacks a citation, if a tag outside the owner's list appears (mt-MT), or if be-BY appears
  - the default is the last used language, else the UI match if offered (en/de/hu/lt/pl map to their EU tag; be and uk have none), else en-US
  - follow-up when the api's two PRs merge (the refuse-on-gap fix and the vocabulary completion): add the three citations from the new rendering tests (**never `query-cost.e2e-spec.ts`**), and add their fixtures to T005 and T027
- [x] T027 [P] [US2] Write `packages/features/labels/src/model/rendering.ts` + `rendering.test.ts`: *(Done in PR B.)*
  - sections and runs become a view model with emphasis flags; nutrition rows carry the rounded figure, unit, source and rule
  - the test asserts that the runs joined per the api's section order **equal the api `text` exactly** for every offered language's fixtures (SC-003)
  - no string transformation of runs
  - `engine: null` becomes the no-engine state (FR-013)
  - symbol ids become reference-data names, marked "not part of the label text"
- [x] T028 [US2] Write `packages/features/labels/src/data/rendering.ts`: an O9 loader with `language` from T026. Online-only *(Done in PR B.)*
- [ ] T029 [US2] (⛔DESIGN) Write `packages/features/labels/src/screens/label-preview.tsx`:
  - label type and language selectors
  - sections with bold emphasis, and an accessibility announcement of the emphasis
  - a nutrition table with source/rule disclosure per value (FR-012)
  - a gaps and notices panel
  - the no-engine state
  - no text alteration (FR-010, FR-014)

---

## Phase 5: User Story 3 — Check a printed label still matches (P2)

**Goal**: list a product's issued labels and show one with the api's match verdict.

**Independent Test**: `quickstart.md` Q5, Q6 and Q7.

- [x] T030 [P] [US3] Write `packages/features/labels/src/data/issued.ts` + `issued.test.ts` (R7): *(Done in PR B.)*
  - O10 is queried for **every offered rule-set** from O5, in parallel, with no hardcoded regions
  - merged and ordered per label type and language, active first
  - O11 detail read
- [x] T031 [P] [US3] Write `packages/features/labels/src/model/verdict.ts` + `verdict.test.ts` (R8): *(Done in PR B.)*
  - the verdict comes only from an O11 response, with its check time from the HTTP `Date` header (fallback: device time, labelled)
  - the test proves no verdict is produced from a stored document or while offline (SC-004)
- [ ] T032 [US3] (⛔DESIGN) Write `packages/features/labels/src/screens/issued-list.tsx` and `issued-detail.tsx`:
  - frozen text as stored
  - a status banner (withdrawn with who and when)
  - the verdict with its check time
  - an optional side-by-side with the current preview (T029), with **no diff highlighting**, and a "reissue on the web" note (US3-3)

---

## Phase 6: User Story 4 — Saved labels on the floor with no signal (P2)

**Goal**: issued labels persist per bakery and are readable offline. Everything else shows an
offline state.

**Independent Test**: `quickstart.md` Q8 and Q9.

- [ ] T033 [US4] Install `expo-sqlite` and `expo-network` via `npx expo install` in `packages/features/labels`, and add the expo-sqlite plugin to `apps/pro-baker/app.config.ts` (ADR 0002). `android.allowBackup: false` comes from ADR 0001; set it here if PR #4 did not
- [ ] T034 [US4] Write `packages/features/labels/src/store/saved-labels.ts` + `saved-labels.test.ts` (data model: Saved label):
  - one table keyed (companyId, issuedId) with a JSON document, **no verdict column**; the test asserts the schema has none
  - upsert on every O10/O11 read
  - list grouped by product
  - `purgeCompany`, `purgeAll`
  - database in expo-sqlite's default directory (ADR 0002, as accepted)
  - the test runs against the port with an in-memory fake
- T035 — **Dropped** (ADR 0002 accepted: saved labels live in the durable default directory, so there is no eviction and no notice). The ID is retained so later IDs stay stable.
- [ ] T036 [US4] Write `packages/features/labels/src/store/status-refresh.ts` + test (FR-020): on app foreground and on the `expo-network` reconnect event, re-read each saved label via O11 for its status only, update `status` and `statusConfirmedAt`, and never store the verdict
- [ ] T037 [US4] Register the saved-labels wiper (`purgeAll`) and the `onMembershipLost` → `purgeCompany` handler in `apps/pro-baker/src/wiring.ts` (FR-022)
  - **Sweep condition (PR A, coordinator):** the session's membership-loss emission must **isolate** its listeners, the way `wipe.run` isolates wipers. Today a throwing purge listener skips the listeners after it and leaves the active company set. Fix this in `packages/core/src/session/session.ts` (a seam item) and cover it in T042.
- [ ] T038 [US4] Wire T030's loaders to upsert into the store (FR-019)
- [ ] T039 [US4] (⛔DESIGN) Write `packages/features/labels/src/screens/saved-labels.tsx`: grouped by product, "status as of", "Match check needs a connection". Offline launch opens here (US4-1). Write `packages/features/labels/src/screens/offline-state.tsx` for list, grid and preview with retry (FR-021)

---

## Phase 7: User Story 5 — Tier state and leaving the device clean (P3)

**Goal**: render the server's entitlement answer, and keep the device clean on sign-out, account
switch and membership loss.

**Independent Test**: `quickstart.md` Q10, Q11, Q12 and Q14, plus T013's build-failure test.

- [ ] T040 [US5] (⛔DESIGN) Write `packages/features/labels/src/screens/plan-status.tsx`:
  - `unavailable` gives the **persistent, non-dismissible** "Plan status not available from the server" banner, which does not block use (G2-Q1)
  - `not_included` gives a plain explanation with real previews and an equal-weight decline, no blur and no purchase flow
  - `included` shows nothing
  - fixture-driven for all three
- [ ] T041 [US5] (⛔DESIGN) Write `packages/features/labels/src/screens/company-archived.tsx` and the session-expired handling (re-sign-in; saved labels kept only for the same person, per FR-001a)
- [ ] T042 [US5] Write `apps/pro-baker/src/wipe-flows.test.ts`: an integration test over the real session and store ports with fakes, covering sign-out (Q10), crash mid-wipe then resume (Q11), a different account (Q12) and membership loss (Q14). **No saved label or session key survives** Also cover a **throwing membership-loss listener**: later listeners still run, and the active company is cleared (sweep condition on T037).

---

## Phase 8: Polish & Cross-Cutting

- [ ] T043 [P] Review the six non-English catalogs, with a 1.3× text stress pass on every screen in inventory 1–9 across the full stress set (en, de, hu, lt, be, pl, uk; German long words, and Cyrillic be/uk with widths measured in **Onest**, per design-mobile's ruling G-2 (fb999ed6): be/uk UI face Onest, stamp face Yeseva One) (FR-026)
- [ ] T044 VoiceOver + TalkBack walkthrough of screens 1–9 in all seven UI languages (en, de, hu, lt, be, pl, uk; be/uk render in Onest and Yeseva One per G-2), plus external-keyboard navigation on the tablet (SC-007). Record the findings in the PR
- [ ] T045 Run `quickstart.md` Q1–Q16 on a 13" tablet and a phone against staging. Record the results in the PR body
- [ ] T046 [P] Update `docs/pro-baker/CAPABILITY-MAP.md` §5 to reflect what 002 delivered (Label desk shipped; asks B2, B6, B8, B11 and B11b outstanding)
- [ ] T047 Final `pnpm quality` green and CI green. Open the feature PR with honest body sections: what is blocked on api B8 (store release fails by construction), the P-02 packaging state, and the proven-language set

---

## Dependencies & execution order

```text
⛔ADR1 (PR #4) → Phase 1 → Phase 2 (T006,T007,T012,T014 ∥ → T008 → T009 → T010 → T011 → T013) ─┐
                                                                                             │
   ┌─────────────────────────────────────────────────────────────────────────────────────────┘
   ├─ US1 model (T015–T020) ── ⛔DESIGN ─→ US1 screens (T021–T025) ─┐
   ├─ US2 model (T026–T028) ── ⛔DESIGN ─→ T029                      ├─→ US5 (T040–T042) → Polish
   ├─ US3 (T030–T031) ──────── ⛔DESIGN ─→ T032                      │
   └─ US4 (T033–T038) ─ ⛔DESIGN ─→ T039 ──────────────────┘
```

- **The US1–US3 model tasks are independent of each other** and can start in parallel as soon as
  Phase 2 is done.
- The screens share T021 (routing), so each story's screens follow T021.
- US4's store depends on T030 (issued loaders) for T038.
- US5's T042 depends on T034 (the store) and T010 (the session).

## Parallel examples

- **After Phase 2**: T015, T016, T017, T018, T026, T027, T030 and T031 all run in parallel. They
  touch different files and depend only on Phase 2 and the fixtures (T005).
- **Phase 2 opening**: T006, T007, T012 and T014 run in parallel. T008 → T009 → T010 are
  sequential.

## Implementation strategy

1. **MVP = Phase 1 + Phase 2 + US1** (readiness and grid). This is shippable to internal builds
   under the `unavailable` banner. The store profile cannot build (T013), by design.
2. Add US2 (preview), then US3 (match check). Each is demonstrable on its own.
3. US4 follows (ADR 0002 is accepted). US5's wipe tests close the feature.
4. **PR slicing** (proposed):
   - PR A: Phases 1–2, the shared core, after the seam acknowledgement
   - PR B: the US1–US3 models
   - PR C: screens, after the design pass
   - PR D: US4
   - PR E: US5 + Polish
   - Each PR must be CI-green and stop for the coordinator's sweep.
