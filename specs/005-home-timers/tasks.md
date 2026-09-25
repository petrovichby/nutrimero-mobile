---
description: "Task list for 005 Home timers, stage notifications and keep-awake"
---

# Tasks: Home Baker timers, stage notifications and keep-awake

**Input**: `specs/005-home-timers/`: plan.md (gate 2 passed at `35d6571`), spec.md, research.md,
data-model.md, contracts/timers-package.md, quickstart.md

**Tests**: requested by the plan. The pure core is covered by Vitest (colocated `*.test.ts` under
`src/`). Native adapters and screens are verified on devices (quickstart M1–M9, C1–C5), not by
component tests (no React Native test harness is admitted).

**House rules** (constitution 1.2.0, DESIGN.md 0.5.2):
- Informal register; say "device", never "phone"; lowercase "nutrimero".
- Seven catalogs; plurals take an integer `count` only.
- Pacifico for page titles.
- `pnpm quality` exits 0 before every push. No suppressions and no casts.
- Commit and open PRs; never merge.
- **Every PR states that Android verification is owed** (no emulator in this lane).

**Blockers**:

| Tag | Clears when |
|---|---|
| ⛔WALK | design-mobile has drawn the 10-item inventory (after F23) and the owner has walked it |
| ⛔HOME1 | Home 1's fix making Clear my data run every registered wiper has merged (the bug is on `main`: #38, `apps/home-baker/app/_layout.tsx:74`), **and** 005's app-root change has been announced through the owner |

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Create the pack `packages/features/timers/`:
  - `package.json`: name `@nutrimero/feature-timers`, private, exports `"."` → `./src/index.ts` and `"./native"` → `./src/native.ts` (the core/ui pattern), a `typecheck` script, and deps `@nutrimero/core` and `@nutrimero/ui` as `workspace:*`
  - `tsconfig.json` extending `../../../tsconfig.base.json`
  - `src/index.ts`
  - `src/native.ts`
- [x] T002 [P] Add `expo-notifications@~57.0.20` and `expo-keep-awake@~57.0.2` (ADR 0001 rows, accepted) to `packages/features/timers/package.json` with `pnpm --filter`. Commit the lockfile, and confirm that `pnpm install --frozen-lockfile` is clean

---

## Phase 2: Foundational — the pure core (no native imports; builds now)

**Checkpoint**: every story depends on this phase. `src/index.ts` must stay importable from Node
(Vitest).

- [x] T003 [P] Write `packages/features/timers/src/model/stage.ts` + `stage.test.ts`:
  - the `StageKey` union (`mix`, `autolyse`, `bulkFerment`, `stretchAndFold`, `preShape`, `shape`, `proof`, `coldProof`, `preheat`, `bake`, `cool`)
  - `Stage { name: {key}|{text}; seconds: number|null }`
  - validation: free text 1–40 characters trimmed; seconds an integer from 5 to 172,800, or null
  - `isBakeStage` (FR-013a: `bake` or `preheat`)
- [x] T004 Write `packages/features/timers/src/model/item.ts` + `item.test.ts`: the `Timer` and `RoutineRun` types (data-model.md).
  - `transition(item, action, now)` for start, pause, resume, addTime, cancel, dismiss, startNextStage and doneHandsOn. It returns `{ item, intents: ("schedule"|"cancel")[] }`.
  - `derive(item, now)`: time left or time since, the stage position "n / N", the next stage, and `done`.
  - Tests cover:
    - end time as the truth, with no stored field changing as time passes (FR-003)
    - **manual chaining** (gate 1, Q1): a done stage waits for `startNextStage`
    - a hands-on stage schedules nothing
    - at most one schedule intent per run (FR-011)
    - pause and resume moving `endAt` correctly
- [x] T005 [P] Write `packages/features/timers/src/model/reconcile.ts` + `reconcile.test.ts` (research R1): stored items plus pending ids give the intents.
  - A running item with no pending notification is re-scheduled; this covers restart, force-stop and a later grant.
  - An orphan pending id is cancelled.
  - A done item has no pending notification.
  - Pending notifications never exceed the active-item cap of 10 (C4).
- [x] T006 [P] Write `packages/features/timers/src/model/duration.ts` + `duration.test.ts` (R10): `formatDuration(seconds, t)` composes whole units for display (`1 h 30 min`) and a spoken form for screen readers ("1 hour 30 minutes left"). Every plural argument is an integer `count`. Test in all seven locales.
- [x] T007 Write `packages/features/timers/src/store/timer-store.ts` + `timer-store.test.ts` (R6), on `DeviceStoreAdapter` with keys under `nutrimero.home.timers.*`:
  - an index plus per-item keys, and saved routines plus per-routine keys, and prefs
  - caps: 10 active, 20 saved, 12 stages
  - worst-case values asserted ≤ 1,500 bytes, under the 2,048-byte budget
  - writes go item first, then index, and orphans are tolerated
  - tested with `createMemoryAdapter`
- [x] T008 Write `packages/features/timers/src/store/wiper.ts` + `wiper.test.ts` (FR-021, R7):
  - `registerTimersWiper(session, store, cancelAll)` registers under the name `"home.timers"`
  - the wiper deletes every timers key and cancels every stored notification id
  - tests: no key left and every notification cancelled; the **fresh-install path** (`session.restore()` with no marker) reaches `"home.timers"` when it was registered before `restore()`
- [x] T009 Add the non-screen `home.timers.*` keys to all seven catalogs under `packages/core/messages/`, informal, "device", integer `count`:
  - the stage-name picks
  - the duration units, visual and spoken
  - the notification title and body ("{name} is done", "{stage} done: {next} next")
  - the Android lateness help (FR-013, ruled wording) and the bake-stage notice (FR-013a)
  - the force-stop help (R3)
  - the refused-state note, including **"visual plus vibration only: no sound"** (FR-017)
  - **the Clear-my-data list line "your timers and saved routines"** (gate 2 ruling)
  - parity, plural and "device" tests pass

**Checkpoint**: the pure core is green. Open **PR 1** (the core, T001–T009) to the coordinator,
with the Android-owed line.

---

## Phase 3: User Story 1 — a proof timer that survives the locked device (P1) 🎯 MVP

**Goal**: a single named timer that notifies with the device locked, survives kill and relaunch,
and asks for permission in context.
**Independent test**: quickstart M1, M2 and M3.

- [x] T010 [US1] Write `packages/features/timers/src/native/scheduler.ts` (R1): `ensureChannel(t)` (the `home-timers` channel, HIGH, named in the UI language), `schedule(item, t)` (a `DATE` trigger at `endAt`, `data: {kind, itemId}`), `cancel(id)`, `pending()`, and `setNotificationHandler`. In the foreground the banner and list are off and the sound is on (R1, R9).
- [x] T011 [US1] Write `packages/features/timers/src/native/permission.ts` (FR-016, FR-017): `permission()` reads the status and `canAskAgain`. `requestInContext()` is called only from the first-start flow, only once (the `permissionAsked` pref), and never at launch or in onboarding.
- [x] T012 [US1] Write `packages/features/timers/src/native/lifecycle.ts`: on launch and on every foreground, `derive` everything, run `reconcile`, and apply the intents through the scheduler (FR-004, FR-014, US5-3). It also re-schedules every pending text when the UI language changes (FR-015).
- [x] T013 [US1] Add a build check, `packages/features/timers/src/android-permissions.test.ts`: evaluate `apps/home-baker`'s resolved config and assert that `SCHEDULE_EXACT_ALARM` and `USE_EXACT_ALARM` are absent. If `expo-notifications` contributes one, list it in `android.blockedPermissions` (gate 2 ruling) and keep the test as the proof. (The config edit itself is part of ⛔HOME1's wiring task T024; until then the test runs against the plugin's declared permissions.)
> **PR 3 note (2026-09-25):** the screens live in `packages/features/timers/src/ui/` and are exported as
> `@nutrimero/feature-timers/screens`. The permission moment is the sheet inside `new-timer-screen.tsx`;
> the Android bake note is inside `routine-screen.tsx`. On-device checks stay with T027/T028.

- [x] T014 [US1] (⛔WALK) Build `packages/features/timers/src/screens/new-timer.tsx` and `timer-screen.tsx`:
  - large time left, via the display-only refresh (R8)
  - pause/resume, +1 min and +5 min, cancel, and the done state
  - a Pacifico title
  - the first start runs the permission moment (T018's component)
- [x] T015 [US1] (⛔WALK) Build `packages/features/timers/src/screens/completion-alert.tsx` (FR-019): text, a `Vibration` pattern, an accessibility announcement, and no pulsing under reduce motion.

---

## Phase 4: User Story 2 — multi-stage routines (P1)

**Goal**: routines with one notification per timed stage, manual chaining, and saved routines.
**Independent test**: quickstart M4.

- [x] T016 [US2] Write `packages/features/timers/src/native/routing.ts` (gate 1, Q1): the response listener plus `getLastNotificationResponse()` at cold start. A stage notification opens the routine screen at "Start next stage".
- [x] T017 [US2] (⛔WALK) Build `packages/features/timers/src/screens/routine-editor.tsx`, `routine-screen.tsx` and `saved-routines.tsx`:
  - stages with picks or free text, and a duration or hands-on
  - "n / N", the current stage in the UI face (steps are not page titles), and the next stage
  - "Start next stage" / "Done, next"
  - save, edit, rename and delete (FR-005 to FR-009)
  - the one-time Android bake-stage notice when a bake stage starts (FR-013a)

---

## Phase 5: User Story 3 — the chip and the named-timers sheet (P2)

**Goal**: every running item is visible from any screen.
**Independent test**: quickstart, two timers across tabs.

- [x] T018 [US3] (⛔WALK) Build `packages/features/timers/src/screens/timer-chip.tsx`, `timers-sheet.tsx` and `permission-moment.tsx`:
  - the chip names the item ending soonest, with a live region
  - the sheet lists running, paused and done items with actions, plus "New timer" / "New routine"
  - the entry point is the option the owner picks on the walk (gate 1, Q2)
  - the permission moment is the one-sentence reason before the system prompt

---

## Phase 6: User Story 4 — keep-awake (P2)

**Independent test**: quickstart M6.

- [x] T019 [US4] Write `packages/features/timers/src/native/keep-awake.ts` (R5): `useTimerKeepAwake(tag, focused)`, active only while the timer or routine screen is focused in the foreground, and released within a second of leaving. Use it in T014 and T017's screens.

---

## Phase 7: User Story 5 — refused permission, still honest (P3)

**Independent test**: quickstart M5.

- [x] T020 [US5] (⛔WALK) Add the refused-state note to the timer screen, routine screen and sheet, with the FR-017 wording from T009 (including "no sound") and an "Open settings" action (`Linking.openSettings`). The app never re-prompts on its own.

---

## Phase 8: Wiring — the one app-root change (⛔HOME1)

> **PR 4 note (2026-09-25):** the wiring. T021: announced, and the coordinator relays Home's acknowledgement before merge.
> T022: the composition is tested in `apps/home-baker/src/boot-timers.test.ts` and the source order in
> `scripts/home-boot-order.test.ts`. T023: the chip is mounted in the tabs layout, above the bar; lifecycle, routing, the sheet and the
> completion alert are in `apps/home-baker/src/timers-root.tsx`. T025: the Clear-my-data line is `home.clearData.items.timers`, and
> More's subtitle now names timers. The on-device part of T025 is M8 in T027.

- [x] T021 Send the **seam announcement** through the owner before touching `apps/home-baker`: the chip in the shell, the wiper registered before `restore()`, the `expo-notifications` plugin in the app config, and the lifecycle hook in the root layout.
- [x] T022 In `apps/home-baker/src/boot.ts`, call `registerTimersWiper(session, timerStore, scheduler.cancelAll)` **before** `session.restore()`. Add `apps/home-baker/src/boot-timers.test.ts`, proving the fresh-install wipe reaches `"home.timers"`.
- [x] T023 In `apps/home-baker/src/shell.tsx` (the Home shell), mount `<TimerChip/>` on every Home screen, and mount `lifecycle` (T012) and `routing` (T016) once in `apps/home-baker/app/_layout.tsx`.
- [x] T024 Add `expo-notifications` and `expo-keep-awake` to `apps/home-baker/package.json` (autolinking resolves from the app), and the `expo-notifications` plugin (channel only; no remote setup) to `apps/home-baker/app.json`. Set `android.blockedPermissions` if T013 finds an exact-alarm permission.
- [x] T025 Confirm that Home 1's Clear my data now runs every registered wiper (quickstart M8), and that the Clear-my-data sheet shows "your timers and saved routines" (T009's key).

---

## Phase 9: Verification and polish

- [ ] T026 [P] Owner's review of the lane-authored translations of `home.timers.*` in de, hu, lt, be, pl and uk (a release item). Run a 1.3× stress pass on all 10 surfaces across the seven languages, including German long words and Cyrillic be/uk in Onest.
- [ ] T027 On devices, a development build: quickstart M1–M9 on iOS, plus **C3 and C4** on iOS.
  > **Simulator run, 2026-09-25** (iPhone 18 Pro, iOS 27, fresh dev build of #47, driven over Metro's CDP; not yet a real
  > iPhone). **Pass:** M1 (reason sheet, then the system prompt, at the first start only), M3 (kill and relaunch: `endAt`
  > unchanged, one pending notification kept), M4 as far as a simulator goes (stage 1 notifies "Bulk ferment done: shape
  > next"; the in-app alert starts the next stage; nothing is pending during the hands-on stage; stage 3 notifies), M7 (a
  > language switch re-schedules the pending text in German at the same fire time), M8 (Clear my data: no items, no saved
  > routines, no pending notification; the language is kept), C3 (delivered after a simulator restart with the app not
  > running), C4 (10 at once: 10 pending, 10 delivered). Also checked: 17c, 19d, and screens 15b–22 against the drawings.
  > **Found and fixed in #47:** iOS fired up to 0.9 s *early* (on a whole-second boundary at or before the date); the
  > scheduler now rounds up (`notBefore`), re-measured at +0.04 to +0.96 s. A done item's "ago" froze (the refresh ticked
  > only while counting down); the sheet's done row was clipped, not full-bleed. **Still owed on a real iPhone:** M2
  > (locked device), M5 (deny), M6 (auto-lock), M9 (VoiceOver, 1.3×).
- [ ] T028 **Android, on a real device (owed; say so on every PR until done)**: C1 (lateness against FR-013's wording), C2 (force-stop), C5 (the bake-stage notice), and M1–M9 on Android. **A C1 or C2 disagreement goes to the owner before release.**
- [ ] T029 VoiceOver and TalkBack walkthroughs of every surface in the seven languages (SC-007). Record the findings in the PR.

---

## Dependencies & execution order

```text
Phase 1 → Phase 2 (core; T003, T005, T006 ∥; T004 → T007 → T008; T009 ∥)  ──► PR 1
      └─► US1 native (T010–T013) ─► US2 routing (T016) ─► US4 keep-awake (T019)  ──► PR 2 (native)
⛔WALK ─► screens: T014, T015, T017, T018, T020                                 ──► PR 3 (screens)
⛔HOME1 ─► wiring T021–T025                                                     ──► PR 4 (wiring)
            ─► verification T026–T029 (Android owed)
```

- **Parallel after T001**: T003, T005 and T006 (separate files), and T009 (the catalogs).
- The native adapters (T010–T013, T016, T019) need only Phase 2 and the accepted ADR rows.
- The screens all wait for ⛔WALK. The wiring waits for ⛔HOME1.

## Implementation strategy

1. **Now**: Phase 1 and Phase 2 (the pure core, fully tested in Node), as PR 1.
2. **Next**: the native adapters (PR 2): scheduler, permission, lifecycle, routing, keep-awake, and
   the exact-alarm check. Reviewable without screens.
3. **After the owner's walk**: the screens (PR 3). US1's screens are the MVP.
4. **After Home 1's fix, announced**: the one wiring change (PR 4), then device verification.
   Android stays owed until a real device run, and every PR says so.
