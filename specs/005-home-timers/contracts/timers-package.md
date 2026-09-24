# Contract: `@nutrimero/feature-timers` (packages/features/timers)

This is 005's surface to the Home app and to later features (007 starter reminders, 009 baking
mode). Signatures are behavioral; the exact TypeScript lands in implementation.

## Pure core (Node-testable, no native imports)

| Member | Behavior |
|---|---|
| `createTimerStore(adapter: DeviceStoreAdapter)` | Reads and writes timers, runs, saved routines and prefs under `nutrimero.home.timers.*` (research R6). It enforces caps (10 active, 20 saved, 12 stages) and the size budget. |
| `derive(item, now)` | Returns what the UI shows: time left or time since, `done`, the stage position, and the next stage. Pure; the only place "now" is used. |
| `transition(item, action, now)` | Applies a user action (start, pause, resume, addTime, cancel, dismiss, startNextStage, doneHandsOn) and returns the new item plus the scheduling intents (`schedule` / `cancel`). Pure, and testable without a device. |
| `reconcile(items, pending, now)` | Given the stored items and the platform's pending notifications, returns the intents that bring them into line (research R1). |
| `formatDuration(seconds, t)` | Whole-unit composition, with an integer `count` for every plural (R10). |
| `isBakeStage(stage)` | FR-013a. |

## Native adapters (in the package's `./native` entry, as in core)

| Member | Behavior |
|---|---|
| `notificationScheduler` | Performs the intents via `expo-notifications`: `schedule(item)` (returns the id), `cancel(id)`, `pending()`, `ensureChannel(t)`, `permission()`, `requestPermissionInContext()`. |
| `useTimerKeepAwake(tag, focused)` | `expo-keep-awake` while the screen is focused (R5). |
| `useNotificationRouting(onOpenRun)` | The tap-response listener plus the cold-start last response (R1). |

## Wiring (the one app-root change; made after Home 1's More-walk PR, announced first)

```ts
// apps/home-baker boot, BEFORE session.restore():
registerTimersWiper(session, timerStore, notificationScheduler); // name "home.timers"
// app-root / shell:
<TimerChip … />            // on every Home screen (FR-018)
// Home 1's "Clear my data on this device" must run the registered wipers (seam ask, R7).
```

## Screens (built only after the owner walks design-mobile's drawings)

`TimerChip`, `TimersSheet`, `NewTimerScreen`, `TimerScreen`, `RoutineEditor`, `RoutineScreen`,
`SavedRoutines`, `PermissionMoment`, `CompletionAlert`, and the entry point chosen on the walk.

## Catalog namespace

`home.timers.*` in all seven catalogs, in the informal register, saying "device" (never "phone"),
and with integer `count` plurals. The stage-name picks are `home.timers.stage.<StageKey>`.
