# ADR 0001 — First-run shell dependencies

**Status**: Proposed (gate 2 of 001-home-first-run) · **Date**: 2026-09-23 · **Deciders**: owner
(Aliaksandr), coordinator

**Scope**: ruled by the coordinator as **the shared ADR** for navigation, secure store, locale
and i18n runtime across both apps (home 001, pro 002). The pro lane's secure-store conditions are
folded in below when received.

## Context

Constitution XI: a plan that wants a new category of dependency stops and proposes an ADR first;
the coordinator ruled XI's categories are read broadly ("when in doubt, it's a stop"). The
first-run shell (spec 001) needs navigation, on-device storage, an i18n runtime, locale detection
and font loading, plus two dev tools. None exists in the repo today (runtime deps are `expo`,
`expo-splash-screen`, `expo-status-bar`, `openapi-fetch`).

## Decision

Admit the following, each Expo first-party or the web's own i18n family, each for the reason
given in `specs/001-home-first-run/research.md`:

| Package | Category | Where | Why (research) |
|---|---|---|---|
| `expo-router` (+ its peers `react-native-screens`, `react-native-safe-area-context`) | navigation | apps/home-baker, packages/features | R1 |
| `expo-secure-store` | local persistence | packages/core | R2 — backup-excluded device store (VI) |
| `expo-localization` | platform locale | packages/core | R3 |
| `use-intl` | i18n runtime | packages/core | R3 — same ICU shape as `next-intl` on web (IX) |
| `expo-font` (declared; already transitive via `expo`) | asset loading | packages/ui | R4 |
| `yaml` (dev) | build tooling | scripts | R5 — parse DESIGN.md frontmatter for token generation |

Versions are those Expo SDK 57 pins (`npx expo install`). No state library, database, analytics,
crash-reporting or payment SDK is admitted.

## Secure-store conditions (shared)

One secure-store adapter in `packages/core` serves both the pro lane's session (tokens, `userId`,
`activeCompanyId`, `pendingWipe`) and Home's device data (profile, units, pantry, onboarding).

1. **This-device-only.** iOS Keychain class `WHEN_UNLOCKED_THIS_DEVICE_ONLY` — never synced to
   iCloud Keychain, never restored to another device. Android: Keystore-backed, app backup
   disabled (`android.allowBackup: false`).
2. **Reinstall wipe.** iOS Keychain items survive uninstall. On launch, before any read, if the
   install marker (a file in the app's document directory, removed by uninstall) is absent, the
   adapter clears every key it owns — session tokens included — then writes the marker. Without
   this, a reinstalled app would resume a stale session and a stale dietary profile.
3. **No logging** of keys' values; no values in crash reports.
4. *Pro-lane conditions: pending — to be folded in here on receipt.*

## Consequences

- The pro lane inherits these through `packages/*` (III seam — announced via the coordinator).
- Scripts run on Node 22's built-in type stripping; no `tsx`.
- A React Native component-test harness is explicitly *not* admitted here (R11).
- Constitution follow-up (filed, not decided here): the general XI enumeration.
