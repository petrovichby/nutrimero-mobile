# Quickstart — validating 005 Home timers

This is a validation guide. The platform checks C1–C4 come from `research.md`.

## Automated (CI)

`pnpm quality` (it must exit 0 before any push), with suites covering:
- `transition` / `derive` for every state and action, including the manual stage chaining (gate
  1, Q1);
- `reconcile`: dropped notifications re-scheduled, orphans cancelled;
- the store: caps, the size budget, the index/item orphan tolerance;
- the wiper: no key left and every notification cancelled, including the **fresh-install path
  reaching "home.timers"**;
- `formatDuration` in all seven locales with integer counts;
- catalog parity, plurals, the "device" rule and register for `home.timers.*`;
- the manifest check that `SCHEDULE_EXACT_ALARM` and `USE_EXACT_ALARM` are absent (R2).

## Manual, on devices (a development build; Expo Go cannot run this)

| # | Steps | Expected |
|---|---|---|
| M1 | Fresh install, start the first timer | The one-sentence reason, then the system prompt. No prompt before this, and none in onboarding (SC-004) |
| M2 | 2-min timer, lock the device | A notification naming the timer; iOS within 1 min; never early (SC-001) |
| M3 | Start a timer, kill the app, reopen | The remaining time is correct to within 1 s (SC-002) |
| M4 | Routine: 1 min → shape (hands-on) → 1 min, device locked | Stage 1 notifies "…done: shape next". Tapping it opens "Start next stage". Shape waits. Stage 3 notifies. Never more than one pending (SC-003) |
| M5 | Deny permission, start a timer | The in-app alert still works; the note with "Open settings" shows; there is no re-prompt |
| M6 | Timer screen open past auto-lock | The screen stays on. Leave the screen: auto-lock resumes within 1 s (SC-005) |
| M7 | Change the UI language with a timer running | The pending notification text is now in the new language |
| M8 | Clear my data (once Home 1's More ships) | No timers, and no pending notifications (SC-006) |
| M9 | VoiceOver and TalkBack, all seven UI languages at 1.3× | SC-007 |
| C1 | **Android, idle, screen off: a 30-min and a 3-h timer** | The measured lateness fits FR-013's wording, or this goes back to the owner |
| C2 | **Android: Force stop with a timer running** | No notification. On reopen the timer is correct and re-scheduled |
| C3 | **iOS: restart the device with a timer running** | The notification still fires |
| C4 | **iOS: 10 concurrent items** | All 10 delivered |
| C5 | **Android: start a Bake stage** | The one-time lateness notice (FR-013a), shown only once |

**Android rows (C1, C2, C5, and M1–M9 on Android) are owed on a real Android device.** There is
no emulator in this lane, and every PR says so.
