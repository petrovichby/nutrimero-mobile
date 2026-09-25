# Research — 005 Home timers, stage notifications, keep-awake

Phase 0 of `/speckit-plan`. Every unknown is resolved here, or stated as a **check** that must
pass on a real device before release. Expo facts are from the SDK 57 docs
(`docs.expo.dev/versions/v57.0.0`), read 2026-09-24, per `AGENTS.md`.

---

## R1 — Local scheduled notifications (F27, FR-010–FR-015)

**Decision**: `expo-notifications` ~57.0.20 (the SDK 57 pin), used **only** for local
scheduling. It is **an ADR 0001 row first** (proposed in this PR; see `plan.md`).
- One `scheduleNotificationAsync` per timed item, with a `DATE` trigger at the stored end time
  and the channel `home-timers`. The returned id is persisted with the item.
- The notification carries `data: { kind: "timer" | "stage", itemId }`, so a tap can route.
- `cancelScheduledNotificationAsync(id)` on cancel, pause and dismiss. Adding time cancels and
  re-schedules.
- **Reconcile at launch and on every foreground**:
  - `getAllScheduledNotificationsAsync()` is compared with the stored items.
  - A running item with no pending notification is re-scheduled; this covers the Android
    reboot and force-stop cases and permission granted later (US5-3).
  - A pending notification with no stored item is cancelled; this covers a wipe that raced a
    crash.
- **Android channel** `home-timers` is created with `setNotificationChannelAsync` at
  importance HIGH, default sound. It is named "Timers" in the UI language. The channel exists
  for timers only (FR-012).
- **Foreground** (`setNotificationHandler`): when the app is open, the banner is suppressed
  (`shouldShowBanner: false`, `shouldShowList: false`), because the in-app completion alert is
  shown instead (US1-5). `shouldPlaySound: true` gives the completion sound without a second
  native module.
- **Tap routing**: `addNotificationResponseReceivedListener` for a warm app, and
  `getLastNotificationResponse()` at launch for a cold one. Both open the routine screen at
  "Start next stage" (gate 1, Q1).

**Alternatives rejected**:
- Server push: F27 rules it out (offline, no backend).
- A background-fetch or task module that ticks: violates "JS never ticks a long proof", and is
  unreliable anyway.
- `expo-audio` for the completion sound: another native module, for a sound the notification
  already plays.

## R2 — Android: no exact alarms, a stated tolerance (FR-013, FR-013a)

**Finding (SDK 57 docs)**: "Starting from Android 12 (API level 31), to schedule a notification
that triggers at an exact time, you need to add … SCHEDULE_EXACT_ALARM". Without it, the system
falls back to inexact scheduling.

**Decision**:
- **Do not add `SCHEDULE_EXACT_ALARM` or `USE_EXACT_ALARM`** (the owner's F27 decision). A build
  check asserts that neither appears in the generated Android manifest permissions. If
  `expo-notifications` contributes either one itself, the app config lists it in
  `android.blockedPermissions` (gate 2 ruling), and the check is the proof.
- The help text is the ruled wording (FR-013). The one-time bake-stage notice is FR-013a.

**Check C1 (owed, a real Android device)**: measure the actual lateness of a 30-minute and a
3-hour timer with the device idle and the screen off. The ruled wording stands only if the
measurements fit it; otherwise this goes back to the owner.

## R3 — Device restart and force-stop (FR-014)

**Finding (SDK 57 docs)**: Android `RECEIVE_BOOT_COMPLETED` is added by the library, and
scheduled notifications survive reboots. The docs are silent on iOS reboot and on Android
force-stop.

**Decision**: the stored end times are the truth, and R1's launch reconciliation re-schedules
anything the platform dropped. No other mechanism is needed.

**Check C2 — Android force-stop (owed, real device)**: Android cancels a force-stopped app's
alarms until the app is next launched. That is the platform's documented behavior for
AlarmManager, and the Expo docs don't address it. Verify:
- after Settings → Force stop, no notification fires;
- on the next launch the timer is correct (FR-004), and running items are re-scheduled.

The timer help states it, for Android only (`home.timers.help.androidForceStop`): "On Android, if
you force-stop the app, alerts pause until you open it again." On iOS a force-quit does not stop
scheduled local notifications, so the line is never shown there (coordinator, 2026-09-25). No
walked surface carries it yet; the catalog wording is reviewed with the owner.

**Check C3 — iOS restart (real device)**: pending local notifications survive a restart. This is
expected from iOS behavior, and verified once.

## R4 — The iOS pending-notification limit

**Finding**: the Expo docs do not state it. Apple's `UNUserNotificationCenter` keeps the
**soonest 64** pending local notifications per app and drops the rest.

**Decision**: FR-011 schedules at most **one pending notification per active item**. Active
items are capped at **10** (FR-002's floor), so the worst case is 10 pending, far below 64.
Future consumers (007's starter reminders) share the cap through the same scheduler, which
exposes the count. A test asserts the scheduler never holds more than the active-item cap.

**Check C4 (a real iOS device)**: schedule 10 items and confirm that all 10 are delivered, and
that `getAllScheduledNotificationsAsync` lists 10.

## R5 — Keep-awake (F37, FR-020)

**Decision**: `expo-keep-awake` ~57.0.2. It is already transitive through `expo`, and is
**declared explicitly as an ADR 0001 row**. It needs no config plugin and no permissions (SDK
57 docs).
- `useKeepAwake(tag)` is mounted by the timer and routine screens only, with a tag per screen.
  The docs say it holds "for as long as the owner component is mounted".
- The OS drops the window flag when the app backgrounds, which satisfies "released on
  background".
- Screens that stay mounted but lose focus (under a sheet or a pushed screen) switch to
  `activateKeepAwakeAsync` / `deactivateKeepAwake(tag)` on focus change. The plan's screen tasks
  choose one of the two per navigation shape. The rule under test: keep-awake holds **only
  while the timer screen is focused in the foreground**.

## R6 — Storage layout in the shared device store (FR-003, FR-021)

**Decision**: timers live under Home's namespace, in their **own sub-namespace** and their own
package (`packages/features/timers`). They are not added to `home-data`'s static key list
(Home lane 1's), so the two lanes never edit one file.

| Key | Value | Budget |
|---|---|---|
| `nutrimero.home.timers.index` | ids of active items, max 10 | < 200 bytes |
| `nutrimero.home.timers.item.<id>` | one timer or routine run | ≤ 1,500 bytes, asserted |
| `nutrimero.home.timers.saved` | ids of saved routines, max 20 | < 300 bytes |
| `nutrimero.home.timers.routine.<id>` | one saved routine (≤ 12 stages, names ≤ 40 chars) | ≤ 1,500 bytes, asserted |
| `nutrimero.home.timers.prefs` | the permission-asked marker, last permission, whether the Android bake notice has been shown | < 100 bytes |

- Ids are base-36 and inside the key alphabet (ADR 0001 condition 6).
- Each value's worst case is asserted ≤ 2,048 bytes (condition 5), with margin.
- **Amended in PR 1 (accepted):** the **index is written before the item**, and removal deletes
  the item before the index entry. The secure store cannot list its keys, so an item written
  first could be orphaned by a crash where no wipe can reach it. A reader skips an index id with
  no item.
- **Amended in PR 1 (accepted):** the worst case the data model allows (12 stages × 40-character
  names in a 4-byte script) serializes to **2,773 bytes**, over the 2,048 budget. So a save over
  **1,900 bytes is refused** (`reason: "size"`) before anything is written. Twelve stages named in
  Cyrillic fit. The routine editor shows the refusal (design-mobile draws that state).

## R7 — Wipe (FR-021) and the seam

**Decision**: the package exports a wiper. It deletes every timers key it can reach through the
indexes (plus the prefs key) and cancels each stored notification id.
- It is registered with the session as `"home.timers"` **before `session.restore()`**, so the
  reinstall-orphan clear and sign-out reach it (ADR 0001 condition 3, and the PR A sweep rule
  that wiper order is a contract).
- "Clear my data on this device" is being built by Home lane 1 (More walk). **Seam ask, through
  the owner**: that action must run the registered wipers (or call 005's wiper), not only
  `homeStore.wipeAll()`. Otherwise 001's FR-013 would leave timers behind.
- A test covers the fresh-install path reaching `"home.timers"`, the gate-1 sweep condition,
  mirrored here.

## R8 — Countdown display without "ticking" the truth

**Decision**: the truth is `endAt − now`, computed on demand. While a timer surface is visible, a
**display-only** refresh (about once a second) re-reads `now`. It never mutates the stored state,
and it stops when no timer surface is visible. This satisfies FR-003: nothing counts time, and a
dropped refresh cannot drift the timer.

## R9 — In-app completion without new modules (FR-019)

**Decision**:
- **Text**: the in-app completion alert (inventory 9).
- **Screen reader**: `AccessibilityInfo.announceForAccessibility` plus a live region on the chip.
- **Haptic**: React Native's built-in `Vibration`, a short pattern. No `expo-haptics`.
- **Sound**: the notification's own sound, when permission is granted (R1). Without permission
  there is no sound, and the refused-state note (FR-017) already tells the baker alerts are
  limited.

**Alternatives rejected**: `expo-haptics` and `expo-audio`, which are two more native modules for
what the platform already gives.

## R10 — Durations and plurals (FR-022)

**Decision**: durations are stored in whole seconds.
- Display composes **whole units**: `{h} h {m} min` for the visual, and ICU plural messages
  per unit for screen readers ("1 hour 30 minutes left"). Every plural argument is an integer
  `count` (ADR 0001 ruling 2026-09-24).
- The duration picker offers hours, minutes and (for short timers) seconds as integers.
- Formatting goes through a pure `formatDuration` in the timers package, which uses core's
  `formatNumber` for digits.

## R11 — Where the entry point and chip live (seam, gate 1)

**Decision**:
- `packages/features/timers` exports `TimerChip`, `TimersSheet` and the screens. The **one
  wiring change** mounts the chip and registers the wiper in `apps/home-baker`'s app-root and
  shell. It is made **after Home lane 1's More-walk PR merges**, and announced through the owner
  first.
- The entry point is one of the options design-mobile draws. If the owner picks a More row, that
  extends MA-24 and needs his word on the walk.
