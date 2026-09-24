# Feature Specification: Home Baker timers, stage notifications and keep-awake

**Feature Branch**: `lane/home-2` (spec directory `specs/005-home-timers/`)

**Created**: 2026-09-24

**Status**: Draft — gate 1 (coordinator reads before anything is planned)

**Input**: Owner assignment to Home lane 2, 2026-09-24: spec 005 = **F07 timers + F27 stage
notifications + F37 wake-lock** (`nutrimero-docs:mobile/FEATURES.md` at `fb29dcb`, delivery
order #2). Constitution 1.2.0 and DESIGN.md 0.5.2 govern.

**Sources, in authority order**: `nutrimero-docs/mobile/FEATURES.md` (the F07, F27 and F37
entries and the F27 decision log) · constitution 1.2.0 · `docs/DESIGN.md` 0.5.2 (the Timers
component rule, MA-25 Pacifico page titles, MA-26 "device", the Home register) · 001's shipped
device store and wipe rules (`packages/features/home-data`, ADR 0001). **No drawing exists yet**:
the design-mobile lane draws 005's screens after F23. The Screen inventory below is that lane's
input, and nothing is built before the owner has walked the drawings.

## Scope

**In**:
- **Named timers**: start, pause/resume, add time, cancel and dismiss; several running at once.
- **Multi-stage routines**: an ordered list of named stages with durations (for example mix →
  bulk ferment → shape → cold proof → bake), run one stage after another, with **one
  notification per stage**.
- **Local scheduled notifications** that fire when a stage or timer ends, with the app in the
  background, closed or on a locked device. Fully offline, no server.
- **Notification permission asked in context** at the first timer start, and an honest state
  when it is refused.
- **Timer truth kept on the device** as persisted end times, recomputed at every launch.
- DESIGN.md's **persistent timer chip** (on any screen while a timer runs) and the
  **named-timers sheet**.
- **Keep-awake (F37)**: the screen stays on while a timer screen is open.
- All seven UI languages in the informal Home register.

**Out**, each named so it is not silently assumed:
- **Baking mode** and its oversized controls (F37's second half, which comes with 009 because
  baking mode needs recipes).
- Timers started from a recipe step (they arrive with recipes: 003 and 008).
- **Backward scheduling** ("ready Saturday 18:00 → start Friday 21:00", parked; a Plus candidate).
- **iOS Live Activities** and lock-screen countdowns (parked; native work).
- Server push, and any marketing, recipe-drop or price-alert notification (F16 is a separate,
  server-side channel later).
- Starter feeding reminders (F31 is spec 007; it will ride this feature's notification layer).
- Sound pickers and custom alert tones.
- Watch/Wear apps.
- Sync across devices.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A proof timer that survives the locked device (Priority: P1)

A home baker shapes a loaf, starts a timer named "Final proof" for 1 h 30 min, locks the device
and walks away. At the end the device shows a notification: "Final proof is done". Back in the
app, the timer reads "done" with how long ago.

**Why this priority**: F27's own verdict is that a proof timer that dies with the locked device
is broken. This is table stakes, and the reason the feature exists.

**Independent Test**: Start a 2-minute timer, lock the device, wait. The notification arrives at
the end, within the stated tolerance on Android (FR-013). Force-quit and relaunch before the end:
the timer is still running with the right time left.

**Acceptance Scenarios**:

1. **Given** no timer has ever run, **When** the baker starts their first timer, **Then** the app
   first explains in one sentence why it wants to notify, then shows the system permission
   prompt. The timer starts whatever the answer.
2. **Given** a running timer, **When** the device is locked or the app is closed, **Then** a
   notification fires when it ends, naming the timer.
3. **Given** a running timer, **When** the app is killed and relaunched, **Then** the timer shows
   the correct remaining time, recomputed from its stored end time. No time is lost or gained.
4. **Given** a timer ended while the app was closed, **When** the app opens, **Then** it shows as
   done, with how long ago it ended, until the baker dismisses it.
5. **Given** the app is open when a timer ends, **Then** the baker gets an in-app completion
   alert, which screen readers announce, instead of relying on the system notification.

---

### User Story 2 — A multi-stage routine, one notification per stage (Priority: P1)

The baker runs a sourdough routine: mix, bulk ferment 4 h, shape, cold proof 12 h, bake 45 min.
Each stage with a duration notifies when it ends ("Bulk ferment is done — next: shape"), and the
app always shows the current stage and what comes next.

**Why this priority**: long, multi-stage routines are what separate bread baking from a kitchen
egg timer, and F27 names them explicitly.

**Independent Test**: Create a three-stage routine with 1-minute stages. Run it with the device
locked, and confirm one notification per stage, each naming the stage that ended and the next.

**Acceptance Scenarios**:

1. **Given** a routine, **When** it starts, **Then** the first stage's timer runs, and the routine
   screen shows the stage position ("2 / 5"), the current stage, its time left, and the next
   stage.
2. **Given** a timed stage ends, **Then** exactly one notification fires for it, naming the
   finished stage and the next one.
3. **Given** a stage has **no duration** (hands-on work such as "shape"), **Then** it has no timer
   and no notification. It waits for the baker to mark it done.
4. **Given** a stage ended, **When** the baker moves on, **Then** the next stage starts according
   to the chaining rule (Q1), and its notification is scheduled.
5. **Given** a routine is cancelled, **Then** every notification it scheduled is withdrawn.
6. **Given** the baker has built a routine, **Then** it can be saved on the device and started
   again later.

---

### User Story 3 — See every running timer from anywhere (Priority: P2)

With a proof and an oven timer both running, the baker opens any screen. A chip shows the timer
that ends soonest, and tapping it opens the sheet listing every running timer and routine by name.

**Why this priority**: DESIGN.md's Timers rule. Several timers at once is the normal kitchen case
(dough proofing, oven preheating).

**Independent Test**: Start two named timers, move between tabs, confirm the chip is on every
screen, and open the sheet from it.

**Acceptance Scenarios**:

1. **Given** at least one timer or routine is running, **Then** the chip is shown on every screen,
   naming the timer that ends soonest and its time left.
2. **Given** the chip, **When** it is tapped, **Then** the named-timers sheet lists every running
   and finished-but-not-dismissed timer and routine, with name, time left or "done", and actions.
3. **Given** a screen reader, **Then** the chip and every sheet row are fully labelled, and
   completions are announced (live region / accessibility announcement).
4. **Given** no timer is running, **Then** no chip is shown.

---

### User Story 4 — The screen stays on while I'm watching the timer (Priority: P2)

Hands covered in flour, the baker keeps a timer screen open on the counter. The screen does not
dim or lock while that screen is open.

**Why this priority**: F37 on F07. Flour-covered hands are the persona. This is small and cheap,
and baking mode (009) builds on it.

**Independent Test**: Open a running timer's screen and leave the device untouched past its
auto-lock time. The screen stays on. Leave the screen, and auto-lock applies again.

**Acceptance Scenarios**:

1. **Given** a timer or routine screen is open and in the foreground, **Then** the device does not
   auto-dim or auto-lock.
2. **Given** the baker leaves that screen or sends the app to the background, **Then** keep-awake
   is released at once.

---

### User Story 5 — No notifications allowed, still honest (Priority: P3)

The baker declined notifications. Timers still work while the app is open, and the app says
plainly that it can only alert them while it's open, with a way to the device's settings.

**Why this priority**: permission is the baker's right. The feature must stay usable and truthful
without it.

**Independent Test**: Deny the permission, start a timer, and confirm the timer screen and sheet
show the "alerts only while the app is open" note with a settings link. Confirm the app never
asks again on its own.

**Acceptance Scenarios**:

1. **Given** permission was refused, **Then** timers run and complete in-app, and the timer
   surfaces carry a one-line note with an "Open settings" action.
2. **Given** permission was refused, **Then** the app never shows the system prompt again
   unprompted. Re-enabling happens in the device's settings.
3. **Given** permission is granted later in settings, **Then** timers started afterwards
   notify. Timers already running are re-scheduled the next time the app is foregrounded.

---

### Edge Cases

- **Language changed** while timers run: the notification texts already scheduled are
  re-scheduled in the new UI language at once.
- **Device clock or time zone changed**: an end time is an absolute instant, so a time-zone change
  does not move it. A manual clock change can, and the app recomputes from the stored end time and
  does not correct for it (the timer help says so).
- **Device restarted** with timers running: they keep running (end times are stored), and pending
  notifications survive the restart (FR-014).
- **App force-stopped on Android**: the platform may withhold scheduled notifications until the
  app is opened again. This is a platform rule, stated in the Android note (FR-013). On opening,
  everything is recomputed.
- **Many timers**: at least 10 concurrent timers or routine stages are supported. The platform's
  pending-notification limit is respected, because only the next stage of each routine is
  scheduled (FR-011).
- **Timer ends while the device is on "do not disturb"**: the platform decides. The app does not
  ask for a bypass.
- **Very long durations**: timers up to 48 h (a long cold proof, or a two-day levain build).
- **Very short durations**: timers of at least 5 s are accepted. The on-screen countdown is exact;
  the notification follows FR-013's tolerance.
- **Clear my data on this device** (001 FR-013) and account wipes: every timer, routine, saved
  routine and scheduled notification is removed (FR-021).
- **German and other long strings at 1.3×**: timer and stage names wrap, and never clip the time
  left.
- **Reduce motion**: no pulsing chip. Completion is a state change plus an announcement.

## Requirements *(mandatory)*

### Functional Requirements

**Timers**

- **FR-001**: The baker MUST be able to start a timer with a name and a duration (5 s to 48 h),
  pause and resume it, add time to it, cancel it, and dismiss it once done. A name defaults to a
  localized "Timer" plus its number when left empty.
- **FR-002**: Several timers and routines MUST be able to run at the same time (at least 10).
- **FR-003**: A running timer's truth MUST be its **end time**, an absolute instant persisted in
  the device store. The time left is always computed as end time minus now. Nothing counts time by
  ticking. Pausing stores the time left and clears the end time; resuming sets a new end time.
- **FR-004**: At launch and on every return to the foreground, every timer MUST be recomputed from
  its stored state: running, done (with the time since it ended), or paused.

**Routines**

- **FR-005**: A routine MUST be an ordered list of 1–12 stages. Each stage has a name and either a
  duration or none (a hands-on stage).
- **FR-006**: Stage names MUST be pickable from a localized list of common baking stages (mix,
  autolyse, bulk ferment, stretch and fold, pre-shape, shape, proof, cold proof, preheat, bake,
  cool), or typed freely.
- **FR-007**: Running a routine MUST show the stage position, the current stage, its time left
  (or "when you're ready" for a hands-on stage) and the next stage.
- **FR-008**: How a stage leads into the next MUST follow the chaining rule settled at gate 1
  (Q1).
- **FR-009**: Routines MUST be savable on the device, then started, edited, renamed and deleted.
  Durations come from the baker; see Q3.

**Notifications (F27)**

- **FR-010**: Every timed stage and every timer MUST schedule **one local notification** for its
  end time, naming what ended (and, for a routine stage, what comes next). No server is involved,
  and it works with no network.
- **FR-011**: A routine MUST have at most one pending notification at any time: its current
  stage's. The next is scheduled when that stage starts. Cancelling, pausing or dismissing
  withdraws the pending notification. Adding time re-schedules it.
- **FR-012**: The notification channel MUST carry timers only. Nothing promotional,
  informational or content-related is ever sent on it (F27; F16 is a separate channel later).
- **FR-013**: **Android tolerance**: the app MUST NOT request exact-alarm permission, and uses the
  platform's inexact scheduling. The tolerance, stated in the in-app timer help and in the plan:
  **on Android a notification may arrive late when the device is idle. The design target is
  within about 10 minutes of the end time, and never early.** The on-screen countdown and the
  in-app alert are exact. The owner rules on the stated wording at gate 1 if it differs. The
  platform's actual window is verified on an Android device before release (Android
  verification is owed; no emulator here).
- **FR-014**: Scheduled notifications MUST survive a device restart. If the platform drops them,
  they are re-scheduled from the stored end times at the next launch.
- **FR-015**: Notification texts MUST be in the current UI language, re-scheduled when the
  language changes.

**Permission**

- **FR-016**: Notification permission MUST be requested **only in context**: at the first timer or
  routine start, preceded by a one-sentence reason in the app. **Never during onboarding** and
  never at launch.
- **FR-017**: If refused, the app MUST NOT prompt again on its own. Timer surfaces carry the
  "alerts only while the app is open" note with an "Open settings" action. When permission
  appears later, running timers are re-scheduled at the next foreground (US5-3).

**Chip, sheet, screens**

- **FR-018**: While any timer or routine is running or done-but-not-dismissed, the persistent
  **timer chip** MUST show on every Home screen. It names the item ending soonest (or "done") with
  its time left, and opens the **named-timers sheet** (DESIGN.md Timers rule).
- **FR-019**: Completions MUST be announced to screen readers, and signalled in-app with text plus
  haptic and sound, never by color alone. The chip never pulses under reduce motion.
- **FR-020 (F37)**: While a timer or routine screen is open in the foreground, the screen MUST be
  kept awake. It is released when that screen closes or the app backgrounds.

**Data and wipe**

- **FR-021**: Timers, routines, saved routines and the permission-asked marker MUST live only on
  the device, under Home's namespace in the shared device store. They MUST be removed, and every
  pending notification cancelled, by 001's "Clear my data on this device" and by any session wipe
  (the wiper registered **before** `session.restore()`, as ADR 0001 condition 3's order requires).

**Language, register, accessibility**

- **FR-022**: Every string MUST come from the seven UI catalogs under `home.timers.*`, in the
  **informal** Home register, saying "device", never "phone". Plural messages take a whole-number
  `count` only, so durations are composed from whole units (for example "1 h 30 min"), never a
  fractional count.
- **FR-023**: Every screen title MUST be set in Pacifico (MA-25). A stage name shown as the
  instruction heading on the routine screen is Operate text in the UI face (DESIGN.md: steps are
  not page titles).
- **FR-024**: Every screen MUST meet DESIGN.md's accessibility gate: 44 pt targets, role, label
  and state on every control, color never alone, 1.3× text, VoiceOver and TalkBack audited.
  Durations are read in words to screen readers ("1 hour 30 minutes left"), not as "1:30:00".

### Key Entities

- **Timer** (device): id, name, state (running / paused / done), end time (running), time left
  (paused), ended-at (done), the id of its pending notification.
- **Routine run** (device): id, the routine it came from (or an ad-hoc one), its stages, the
  current stage index, the current stage's timer state, the pending notification id.
- **Stage**: name (a picked stage key or free text), a duration or none.
- **Saved routine** (device): id, name, stages.
- **Notification preference** (device): whether the in-context prompt has been shown, and the
  last known permission.

## Screen inventory (input for the design-mobile lane)

1. **Timer chip**: persistent on every Home screen; soonest item and time left, or "done";
   the tap target that opens the sheet.
2. **Named-timers sheet**: running, paused and done timers and routines; per-row actions; a
   "New timer" and "New routine" entry.
3. **New timer**: name, a duration picker friendly to minutes and hours, Start.
4. **Timer screen** (keep-awake): large time left, name, pause/resume, "+1 min" / "+5 min",
   cancel; done state with dismiss.
5. **Routine editor**: stages list, add/reorder/remove, stage-name picker plus free text,
   duration or "hands-on", save.
6. **Routine screen** (keep-awake): stage position "n / N", current stage (UI face), time left or
   "when you're ready", next stage, "Done — next stage", cancel routine.
7. **Saved routines list**: start, edit, rename, delete.
8. **Permission moment**: the one-sentence reason before the system prompt; the refused-state note
   with "Open settings".
9. **In-app completion alert**: which timer or stage ended; dismiss, or "Start next stage".
10. **Entry point** to timers when none is running (see Q2).

## Clarifications — questions carried with defaults

**Q1 — How does one stage lead into the next?**
Default **(A) Gated.** When a timed stage ends, the next stage starts when the baker taps
"Start next stage" (from the notification's in-app follow-up, the sheet, or the routine screen).
Real routines have hands-on steps between waits (shaping takes the time it takes), and an
auto-chained schedule would drift from reality the first time the baker is late, notifying at the
wrong times. Alternatives:
- (B) Auto-chain every timed stage, scheduling all its notifications at the start. This is
  simpler for back-to-back waits, but wrong after any delay.
- (C) Gated by default, with a per-stage "starts automatically" flag in the editor. More
  flexible, at the cost of one more control.

**Q2 — Where does the baker start a timer before recipes exist?**
Default **(A) the sheet is always reachable**: the chip area shows a quiet "Timers" affordance
even when nothing runs, and opens the same sheet with "New timer" and "New routine". The final
placement is design-mobile's to draw, and the owner walks it. Alternatives:
- (B) A "Timers" row in More. This extends MA-24's "nothing else in 001" for More, which needs
  the owner's word.
- (C) A tab. Rejected by DESIGN.md's five-tab bar.

**Q3 — Do routines ship with preset durations?**
Default **(A) No preset durations.** The app ships the localized stage *names* (FR-006), and the
baker enters every duration. Default proof or bake times are baking content, and none is
validated for these apps yet, so the app invents none. Alternatives:
- (B) One owner-approved example routine with durations, marked as an example.
- (C) Presets from recipes, when recipes arrive (003/008/009). This is already implied, and not
  in 005.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A timer started with the device locked, or the app closed or killed, produces its
  notification: on iOS within 1 minute of its end time; on Android within the stated tolerance
  (FR-013). It never fires early.
- **SC-002**: After a kill-and-relaunch at any point, 100% of timers show a remaining time within
  1 second of the truth computed from their stored end time.
- **SC-003**: A routine of N timed stages produces exactly N notifications, and at most one is
  pending at any moment.
- **SC-004**: No permission prompt appears before the first timer start, and none appears again
  unprompted after a refusal.
- **SC-005**: With a timer screen open, the screen stays on past the device's auto-lock time.
  Within 1 second of leaving it, auto-lock applies again.
- **SC-006**: After "Clear my data on this device", zero timers, routines or scheduled
  notifications remain.
- **SC-007**: Every screen in scope passes VoiceOver and TalkBack walkthroughs in all seven UI
  languages at 1.3× text. The catalogs pass parity, plural and register ("device") tests.

## Assumptions

- Free tier (F27 verdict: table stakes); no entitlement gate.
- Local notifications and keep-awake need native modules, planned as `expo-notifications` and
  `expo-keep-awake`. **Each is an ADR 0001 row before it is added** (owner rule; constitution
  XI), and is raised at plan time.
- The platform's pending-notification limit on iOS (commonly stated as 64) is far above what
  FR-011 schedules. This is verified at plan time against SDK 57.
- On Android, platform behavior (inexact windows in idle, force-stop, restart) is **verified on a
  real Android device before release**. There is no emulator in this lane, and each PR states
  that Android verification is owed.
- Timer state is small, so it fits the shared device store's per-value budget (ADR 0001 condition
  5). The plan names the key layout under `nutrimero.home.timers.*`.
- **Seams**, announced through the owner before any change:
  - The chip sits in `apps/home-baker`'s app-root / the Home shell (MA-24, the Home lane's).
  - The wipe hooks into 001's "Clear my data" and the session's wipe sequence.
  - 005's own code lives in its own package (`packages/features/timers`), under its own catalog
    namespace (`home.timers.*`).
- 009 (baking mode) and 007 (starter tracker) reuse this feature's timer and notification layer.
  The layer is built so they can, without 005 building either.
