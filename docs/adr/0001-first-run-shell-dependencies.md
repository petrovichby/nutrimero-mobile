# ADR 0001 — First-run shell dependencies

**Status**: Accepted (gate 2 of 001-home-first-run, 2026-09-23, with amendments a–d below) ·
**Date**: 2026-09-23 · **Deciders**: owner (Aliaksandr), coordinator

**Scope**: ruled by the coordinator as **the shared ADR** for navigation, secure store, locale
and i18n runtime across both apps (home 001, pro 002). The pro lane's secure-store conditions
(002 research R4, coordinator-checked) are folded in below.

## Context

Constitution XI: a plan that wants a new category of dependency stops and proposes an ADR first;
the coordinator ruled XI's categories are read broadly ("when in doubt, it's a stop"). The
first-run shell (spec 001) needs navigation, on-device storage, an i18n runtime, locale detection
and font loading, plus one dev tool. None exists in the repo today (runtime deps are `expo`,
`expo-splash-screen`, `expo-status-bar`, `openapi-fetch`).

## Decision

Admit the following, each Expo first-party or the web's own i18n family, each for the reason
given in `specs/001-home-first-run/research.md`:

| Package | Category | Where | Why (research) |
|---|---|---|---|
| `expo-router` (+ its peers `react-native-screens`, `react-native-safe-area-context`) | navigation | apps/home-baker, packages/features | R1 |
| `expo-secure-store` | local persistence | packages/core | R2 — backup-excluded device store (VI); session tokens (pro 002 R4) |
| `expo-file-system` | local persistence (files) | packages/core | Writes condition 2's install marker, which secure-store (Keychain/Keystore only) cannot; the pro lane's saved-label store (002 R5) will want it or `expo-sqlite` |
| `expo-localization` | platform locale | apps (read at launch; core stays free of native modules) | R3 |
| `use-intl` | i18n runtime | packages/core | R3 — same ICU shape as `next-intl` on web (IX) |
| `expo-font` (declared; already transitive via `expo`) | asset loading | packages/ui | R4 — vendored OFL faces; see *Fonts* below |
| `yaml` (dev) | build tooling | scripts | R5 — parse DESIGN.md frontmatter for token generation |

Versions are those Expo SDK 57 pins (`npx expo install`). No state library, database, analytics,
crash-reporting or payment SDK is admitted.

## Fonts (vendored, OFL; amended 2026-09-23 for design G-2)

Faces ship as vendored OFL files with their licenses in `packages/ui/assets/fonts/`, loaded by
`expo-font` — no runtime download, no `@expo-google-fonts/*` packages. The **font registry**
selects the UI face and the stamp face by the locale's script (design ruling G-2, design repo
`fb999ed6`; a global type element, the owner's word):

| Role | Latin locales (en, de, hu, lt, pl) | Cyrillic locales (be, uk) |
|---|---|---|
| UI text (body, controls) | Plus Jakarta Sans 400/500/600/700 | **Onest** (same weights) |
| Provenance stamp | Stardos Stencil 700 | **Yeseva One** |
| Display (brand moments) | Pacifico 400 (Latin + Cyrillic) | Pacifico 400 |

A test proves each locale's stamp text resolves to its ruled stamp face and its UI text to its
ruled UI face. With these faces vendored, be and uk are rendered locales (Constitution IX 1.1.0's
condition is met by the ruling; no constitution change).

## Secure-store conditions (shared)

One secure-store adapter in `packages/core` serves both the pro lane's session (tokens, `userId`,
`activeCompanyId`, `pendingWipe`) and Home's device data (profile, units, pantry, onboarding).

1. **One Keychain class for every key, both apps: `WHEN_UNLOCKED_THIS_DEVICE_ONLY`** — "the entry
   is not migrated to a new device when restoring from a backup" (SDK 57 docs). This includes
   session tokens: 002 has no background reads (refresh runs on foreground and reconnect while
   active), and `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` (002 R4's first proposal) is deprecated in
   SDK 57's `expo-secure-store`. The class is set once in the shared adapter, not per call; **a
   background read, if one ever appears, is an amendment to this ADR, not a per-call option.**
2. **Android backup.** `android.allowBackup: false` in **both** apps' `app.json`, and the
   `expo-secure-store` config plugin's `configureAndroidBackup` enabled so SecureStore's shared
   preferences are excluded from Auto Backup even if backup is later re-enabled. Reason: the
   Keystore keys that encrypt the entries go with uninstall, so a restored entry cannot be
   decrypted (SDK 57 docs warn of the same). Nothing we store is restorable by design.
3. **Reinstall orphan clear.** SDK 57 docs: data "will persist across app uninstallations if the
   app is reinstalled with the same bundle ID". On launch, **before any read — and before the pro
   session's `userId` comparison (002 FR-001a)** — if the install marker (a file in the app's
   document directory, written with `expo-file-system`, removed by uninstall) is absent, the
   adapter clears every key it owns, session tokens included, then writes the marker. The clear
   finishes before *any* read: an orphaned Keychain `userId` would otherwise make a fresh install
   look like the same person and skip the session wipe.
4. **No values in logs**, crash reports or analytics; the adapter logs key names at most.
5. **Size.** The SDK 57 docs state no fixed limit: "Large payloads can be rejected by the
   underlying platform. Historically, some iOS releases refused values above roughly 2048
   bytes." Design budget: **≤ 2048 bytes per value**. What we store fits:

   | Key | Largest value | Size |
   |---|---|---|
   | Home `pantrySeed` | 14 FID ids as a JSON array | ≈ 14 × (id + 3) bytes; ids are short strings — asserted by test against the real snapshot ids |
   | Home `dietaryProfile` | all six options | < 100 bytes |
   | Home `units`, `onboarding` | enum / four small fields | < 100 bytes |
   | Pro refresh token | `randomBytes(32)` base64url (api `token.service.ts`) | 43 bytes |
   | Pro access token | HS256 JWT `{sub, gen, iat, exp}` | ≈ 250 bytes |

   Each package asserts its own keys' maximal serialized size ≤ 2048 bytes in a unit test.
6. **Key names** use only alphanumerics, `.`, `-`, `_` (SDK 57 constraint); namespaced per owner:
   - `nutrimero.session.*` (session layer, pro 002): `accessToken`, `refreshToken`, `userId`,
     `activeCompanyId`, `pendingWipe`, plus pro's per-bakery markers;
   - `nutrimero.home.*` (Home 001): `units`, `dietaryProfile`, `pantrySeed`, `onboarding`.

   None of these values is ever logged (condition 4). If a Home value ever approaches the budget
   (e.g. a larger pantry), it is split across keys rather than raising the limit.

## Consequences

- `expo-network` is **not** admitted here: 001 makes no network calls (FR-020 moved to 003).
  It enters once, via the pro lane's ADR 0002 or 003, whichever is first.
- Adding a CI check needs no dual sign-off; relaxing one does (XII).

- The pro lane inherits these through `packages/*` (III seam — announced via the coordinator).
- Scripts run on Node 22's built-in type stripping; no `tsx`.
- A React Native component-test harness is explicitly *not* admitted here (R11).
- Constitution follow-up (filed, not decided here): the general XI enumeration.
