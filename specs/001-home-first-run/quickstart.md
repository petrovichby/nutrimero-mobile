# Quickstart validation: 001-home-first-run

## Prerequisites

`pnpm install`; iOS simulator and Android emulator (or devices); a proxy able to show all device
traffic (e.g. Proxyman / mitmproxy) for SC-002.

## Automated

```bash
pnpm quality          # lint → check → typecheck → unit (incl. no-suppressions, i18n parity,
                      # fit matrix, snapshot resolution, no-network static test) → bundles
pnpm tokens:generate && git diff --exit-code packages/ui/src/tokens.generated.ts   # tokens drift
```

## Manual walkthrough (both platforms; all seven UI locales once 3c vendors the G-2 faces; light and dark)

| # | Do | Expect | Covers |
|---|---|---|---|
| 1 | Fresh install, airplane mode on, launch | Cream static splash (no gold flash) → composed cover → Units step | FR-001–003, US3-4 |
| 2 | Skip × 3 | Recipes tab, connect-once state, tab bar with 5 labels | US1, FR-019, FR-021 |
| 3 | Relaunch | Cover → Recipes directly | US1-4 |
| 4 | Clear my data (More) → confirm | Back to Units; Cancel is the same size as confirm | US4, FR-013 |
| 5 | Imperial, Nut allergy + Vegan, tap 8 staples, Done | Counter "8 items…"; relaunch keeps all three | US2, US3 |
| 6 | Kill app on Diet step; relaunch | Resumes at Diet with Units kept | FR-008 |
| 7 | Device language de, then pl, text size 130% | No clipped meaning; staple names from the snapshot in that language | SC-006, IX |
| 7b | Device language be, then uk, text size 130% | UI text in Onest, stamps in Yeseva One; no clipped meaning; record Cyrillic string widths in Onest against de/pl | IX 1.1.0, G-2 |
| 7c | Dev build launch on each platform | Startup check passes: Hermes `Intl.PluralRules` gives the expected categories for all seven locales | FR-022 |
| 8 | Proxy on, repeat 1–5 online | **Zero** requests from the app | SC-002 |
| 9 | iOS: encrypted backup → restore to a second device; Android: `adb backup` | No profile/pantry restored; onboarding shows | FR-009, SC-003 |
| 10 | Uninstall → reinstall (iOS) | Onboarding shows; old profile gone | R2 reinstall rule |
| 11 | VoiceOver and TalkBack through 1–5 | Every control announced with role/label/state; loader "Loading" once | FR-023 |
| 12 | Reduce Motion on | Instant cuts on cover exit and steps | FR-024 |
