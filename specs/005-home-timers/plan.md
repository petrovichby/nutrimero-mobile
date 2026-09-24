# Implementation Plan: Home Baker timers, stage notifications and keep-awake

**Branch**: `lane/home-2` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md) (gate 1 passed at `e118563`)

**Status**: **Gate 2 PASSED at `35d6571`** (coordinator, 2026-09-24). The build order: the pure
core now, the native adapters next, and the screens after the owner's walk. The one app-root wiring
change comes after Home 1's Clear-my-data fix merges, announced through the owner first.

## Gate 2 rulings

- **ADR 0001 rows accepted**: `expo-notifications` ~57.0.20 (local scheduling only; one
  timers-only channel) and `expo-keep-awake` ~57.0.2 (declared, although transitive).
- **Exact alarms**: the manifest check stays. If `expo-notifications` itself contributes
  `SCHEDULE_EXACT_ALARM`, it is stripped with the app config's `android.blockedPermissions`, and
  the check is the proof.
- **Sound without `expo-audio` / `expo-haptics`**: accepted. With permission refused, completion
  is visual plus vibration only, and FR-017's note says so.
- **The cap of 10, the launch reconcile, and C1–C4**: accepted. A C1 or C2 disagreement goes to
  the owner before release.
- **The seam bug is on `main`**: #38 made Clear my data a direct `homeStore.wipeAll()`
  (`apps/home-baker/app/_layout.tsx:74`). Home 1 is fixing it to run every registered data
  wiper. 005's wiper registers before `restore()`, as planned.
- **The Clear-my-data list gains "your timers and saved routines"**. The string goes in all seven
  catalogs in 005's PR.

## Summary

- **Timers and multi-stage routines**: truth is a persisted end time, recomputed at launch and
  on every foreground. Nothing ticks (research R8).
- **Local notifications** via `expo-notifications`: one pending notification per active item,
  reconciled with the stored truth at launch (R1).
- **Android**: inexact scheduling, with no exact-alarm permission and the ruled lateness wording
  (R2).
- **Permission** asked in context.
- **Keep-awake** via `expo-keep-awake`, while a timer screen is focused (R5).
- **Code**: everything lives in **`packages/features/timers`**, a pure, Node-testable core plus a
  `./native` entry for the two modules. Strings live under **`home.timers.*`** in all seven
  catalogs.
- **The one app-root wiring change** (the chip, and registering the wiper) waits for Home 1's
  More-walk PR, and is announced through the owner first.
- **Dependencies**: two native modules, each an ADR 0001 row proposed in this PR. Nothing else is
  new: sound comes from the notification itself, and the haptic from React Native's built-in
  `Vibration` (R9).

## Technical Context

| | |
|---|---|
| **Language/Version** | TypeScript 6.0 strict, React 19.2, React Native 0.86, Expo SDK 57 |
| **Primary Dependencies** | Existing: `@nutrimero/core` (device store, session wipers, translator, `formatNumber`), `@nutrimero/ui`. **Proposed (ADR 0001 rows)**: `expo-notifications` ~57.0.20, `expo-keep-awake` ~57.0.2 |
| **Storage** | The shared device store (`secureStoreAdapter`), under `nutrimero.home.timers.*` (R6) |
| **Testing** | Vitest on the pure core (`transition`, `derive`, `reconcile`, store, wiper, `formatDuration`) and on the catalogs. On devices: quickstart M1–M9 and the platform checks C1–C5. Android is owed on a real device |
| **Target Platform** | iOS and Android devices, phone-first. A **development build** is required, because Expo Go lacks notification support on Android |
| **Project Type** | Mobile, pnpm monorepo, one new feature package |
| **Performance Goals** | Remaining time correct to within 1 s after a relaunch (SC-002). The display refreshes about once a second, and only while visible |
| **Constraints** | Fully offline; at most 10 active items; at most 1 pending notification per item; no exact alarms; informal register; "device"; integer plural counts; Pacifico page titles |
| **Scale/Scope** | 10 screens/components (inventory); about 60 catalog keys × 7 |

## Constitution Check

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack | ✅ | Expo modules only |
| II | Contract consumer | ✅ n/a | No api calls |
| III | Core + packs, seam | ✅ **seam announced** | All code in `packages/features/timers`. One app-root change, after Home 1's More-walk PR and announced through the owner. The ask that "Clear my data" runs the registered wipers goes to Home 1 through the owner (R7) |
| IV | FID-only facts | ✅ | No food facts; no preset durations (gate 1, Q3) |
| V | Honest provenance | ✅ | The timer channel is never used for marketing (FR-012). Lateness is stated honestly (FR-013, FR-013a) |
| VI | Privacy | ✅ | Device-only, no server; wiped by the wiper registered before `restore()` |
| VII | Entitlements | ✅ n/a | Free tier |
| VIII | Offline first-class | ✅ | Fully offline by construction |
| IX | Multilingual | ✅ | Seven catalogs, informal register, "device", integer `count` plurals. Notification texts follow language changes (FR-015) |
| X | Tokens, a11y | ✅ **blocked on design** | Nothing is built before the owner's walk. Pacifico titles, 44 pt targets, screen-reader announcements |
| XI | Stop conditions | ⛔ → ✅ **two ADR 0001 rows proposed here** | `expo-notifications` (a new category: local notifications) and `expo-keep-awake` (a platform capability, transitive today, now declared). Nothing is added before the rows are accepted |
| XII | Gates | ✅ | Gate 1 passed; this stops at gate 2; `quality` exits 0 before every push |

**Post-design re-check**: unchanged. The design added no dependency beyond the two rows, and no
server surface.

## ADR 0001 rows (proposed in `docs/adr/0001-first-run-shell-dependencies.md` by this PR)

| Package | Category | Where | Why |
|---|---|---|---|
| `expo-notifications` ~57.0.20 | local scheduled notifications | `packages/features/timers` (`./native`); `apps/home-baker` (plugin) | F27: local, offline, one pending notification per item (R1). The config plugin sets up the `home-timers` channel only. **No `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM`** (R2, asserted by a build check). No remote-notification setup |
| `expo-keep-awake` ~57.0.2 (transitive via `expo` today; declared) | platform capability (screen wake) | `packages/features/timers` (`./native`) | F37: the screen stays on while a timer screen is focused (R5). No plugin, no permission |

## Platform assumptions, stated as checks (owed before release)

| Check | Assumption | Evidence today | Where verified |
|---|---|---|---|
| **C4 — iOS pending limit** | iOS keeps the soonest **64** pending local notifications per app, and we never exceed 10 | Apple `UNUserNotificationCenter` behavior; not in the Expo docs | quickstart C4 on an iOS device; a unit test caps pending notifications at 10 |
| **C2 — Android force-stop** | A force-stopped app's scheduled notifications do not fire until the app is next launched, and the launch reconcile restores them | Android AlarmManager behavior; not in the Expo docs | quickstart C2, **on a real Android device (owed)** |
| C1 — Android lateness | Inexact delivery fits "typically up to about 10 minutes, never early" | SDK 57 docs: inexact without the exact-alarm permission | quickstart C1, real Android device (owed) |
| C3 — iOS restart | Pending notifications survive a restart | Expected iOS behavior | quickstart C3 |

If C1 or C2 disagrees with the stated wording, the wording goes back to the owner before release.

## Project Structure

```text
packages/features/timers/            # new feature pack (@nutrimero/feature-timers)
├── package.json                     # exports "." (pure) and "./native"
├── src/
│   ├── model/        stage.ts · item.ts (transition, derive) · reconcile.ts · duration.ts
│   ├── store/        timer-store.ts (R6 layout, caps, budget) · wiper.ts
│   ├── native/       scheduler.ts (expo-notifications) · keep-awake.ts · routing.ts · index.ts
│   ├── screens/      chip · sheet · new-timer · timer · routine-editor · routine · saved ·
│   │                 permission-moment · completion-alert   (after the owner's walk)
│   └── **/*.test.ts  (the pure core only)
packages/core/messages/{7}.json      # home.timers.* keys
apps/home-baker/                     # AFTER Home 1's More-walk PR, announced:
├── app.config / app.json            # expo-notifications plugin (channel; no exact alarm)
├── src/boot.ts                      # registerTimersWiper BEFORE session.restore()
└── src/app-root.tsx (shell)         # <TimerChip/>
docs/adr/0001-…md                    # the two rows (this PR)
```

## Delivery phases (for `/speckit-tasks`)

| Phase | Content | Blocked by |
|---|---|---|
| 0 | Gate 2; ADR rows accepted | coordinator |
| 1 | The pure core: model, `transition` / `derive` / `reconcile`, store, wiper, `formatDuration`; tests; `home.timers.*` keys for the non-screen strings (notification texts, stage names, durations) | gate 2 |
| 2 | Native adapters: scheduler, channel, permission, routing, keep-awake; the exact-alarm manifest check | ADR rows |
| 3 | Screens 1–10 | **the owner's walk** of design-mobile's drawings (drawn after F23) |
| 4 | The one app-root wiring change (chip; wiper registered before `restore()`) | **Home 1's More-walk PR merged**, and announced through the owner |
| 5 | Device verification: M1–M9 on iOS; C1–C5; Android owed on a real device, and said so | phase 4 |

## Amendments from implementation (PR 1, accepted by the coordinator)

- **P1, index before item**: every stored key stays reachable by the wiper (R6).
- **P2, the 1,900-byte refusal**: the worst case is 2,773 bytes against ADR 0001's 2,048. The
  routine editor shows the refusal, and design-mobile draws that state.
- **P3, three allowances in `catalogs.test.ts`**: Polish "min", the SI "s" in lt and pl, and
  German "Autolyse". Announced to Home 1.
- `endedAt` is derived, not stored. English stage names are capitalized in notifications
  ("Bulk ferment done: Shape next"): they are the stages' names, which is fine.

## Complexity Tracking

*None.* No constitution deviation.
