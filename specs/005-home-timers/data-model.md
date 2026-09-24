# Data model — 005 Home timers

Device-only. Nothing here is sent to a server. The storage layout is research R6.

## Stage

| Field | Type | Rule |
|---|---|---|
| `name` | `{ key: StageKey }` or `{ text: string }` | `StageKey` is one of the localized picks (FR-006): `mix`, `autolyse`, `bulkFerment`, `stretchAndFold`, `preShape`, `shape`, `proof`, `coldProof`, `preheat`, `bake`, `cool`. Free text is 1–40 characters, trimmed |
| `seconds` | integer 5–172,800, or `null` | `null` = a hands-on stage: no timer, no notification (US2-3) |

A **bake stage** (for FR-013a) has the name key `bake` or `preheat`.

## Timer (an active item)

| Field | Type | Rule |
|---|---|---|
| `id` | base-36 string | key-alphabet safe |
| `kind` | `"timer"` | |
| `name` | string 1–40 | defaults to the localized "Timer {count}" |
| `state` | `running` \| `paused` \| `done` | |
| `endAt` | epoch ms | only when `running`, and **the truth** (FR-003) |
| `remaining` | seconds | only when `paused` |
| `endedAt` | epoch ms | only when `done` |
| `notificationId` | string \| null | only when `running` and permission is granted |

## Routine run (an active item)

| Field | Type | Rule |
|---|---|---|
| `id`, `kind: "routine"` | | |
| `name` | string 1–40 | the saved routine's name, or the localized "Routine" |
| `savedRoutineId` | string \| null | where it came from |
| `stages` | `Stage[]`, 1–12 | a copy, so editing a saved routine never changes a run |
| `index` | integer | the current stage |
| `stage` | `waiting` \| `running` \| `paused` \| `done` | `waiting` = a hands-on stage, or a timed stage not yet started |
| `endAt` / `remaining` / `endedAt` / `notificationId` | as for Timer | apply to the current stage only (FR-011: at most one pending notification per run) |

**Stage transitions** (gate 1, Q1: manual):

```
start routine → index 0: timed ? running (schedule) : waiting
running ── endAt passes ─────────────→ done (the notification fired; names the next stage)
done ── "Start next stage" ──────────→ index+1: timed ? running (schedule) : waiting
waiting (hands-on) ── "Done, next" ──→ index+1 …
last stage done ── dismiss ──────────→ removed
any ── cancel ───────────────────────→ removed (cancel the pending notification)
running ⇄ paused (cancel/re-schedule); running ── +time ──→ running (re-schedule)
```

## Saved routine

| Field | Type | Rule |
|---|---|---|
| `id` | base-36 | |
| `name` | string 1–40 | |
| `stages` | `Stage[]`, 1–12 | durations from the baker only (gate 1, Q3: no presets) |

Up to 20 saved routines.

## Preferences

| Field | Type | Rule |
|---|---|---|
| `permissionAsked` | boolean | FR-016: the in-context prompt is shown once, ever |
| `lastPermission` | `granted` \| `denied` \| `undetermined` | used for the FR-017 note and for re-scheduling after a later grant |
| `androidBakeNoticeShown` | boolean | FR-013a: once per install |

## Invariants (tested)

- **Only derived values change as time passes.** No stored field is written because time
  passed. Stored fields change only on user actions or reconciliation.
- **Pending notifications ≤ active items ≤ 10** (R4).
- Every value's worst-case serialized size is ≤ 1,500 bytes, under the 2,048-byte budget of ADR
  0001 condition 5.
- **After the wiper runs: no timers key remains, and no timers notification is pending.**
