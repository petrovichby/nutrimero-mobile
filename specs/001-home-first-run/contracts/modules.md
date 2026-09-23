# Module contracts: 001-home-first-run

001 exposes no network interface. Its contracts are the **shared-package surfaces** other
features (003, the pro lane) will consume — each is a III-seam change announced through the
coordinator. Signatures are indicative; types come from the modules themselves.

## packages/core

```ts
// i18n (use-intl over messages/{en,de,lt}.json, ICU shape as nutrimero-web)
resolveLocale(deviceLocales: readonly string[]): Locale            // "de" | "lt" | "en"
createTranslator(locale: Locale): Translator                        // typed keys from en.json

// device store — ADOPTED from pro 002's PR A (packages/core/src/device-store/), not forked:
//   DeviceStoreAdapter {get, set, delete} · secureStoreAdapter (Keychain class set once, key
//   alphabet, 2,048-byte budget, key names only in errors) · createMemoryAdapter ·
//   fileInstallMarker / createMemoryMarker · ensureFreshInstallWiped(marker, wipe) — ONE call for
//   all owners, made by core before session.restore().
// Home adds only its typed namespace over that adapter:
createHomeStore(adapter: DeviceStoreAdapter): HomeStore            // typed get/set per key in data-model.md
HomeStore.wipeAll(): Promise<void>                                  // Home's single wipe path (idempotent)

// consumed from pro 002's session core (createSession({client, store, marker}))
session.registerWiper("home.deviceData", () => homeStore.wipeAll()) // registered BEFORE session.restore(),
                                                                    // so the orphan clear covers Home keys;
                                                                    // FR-011/012 via core's wipe sequence

// units
formatQuantity(value, unit, system: Units, locale): string          // shared formatter (IX)
```

## packages/ui

Generated `tokens` (from DESIGN.md frontmatter) · font registry · `Screen` (safe areas) ·
`Masthead` · `Button` (primary / secondary / destructive, 44pt) · `SelectionCard` · `ToggleChip`
· `EmptyState` (illustration, one sentence, one action) · `OfflineBanner` (component only; wired
in 003) · `ConfirmSheet` (equal-weight cancel) · `TabBar` (labels always visible) ·
`ProvenanceStamp` (cover plate). Every component carries role, label and state props.

## packages/features/diet-profile (new — within III)

```ts
DIETARY_OPTIONS: readonly DietaryOption[]
mapping: Record<DietaryOption, MappedAllergens | MappedDietaryFact>  // owner's ruling
evaluateFit(profile, facts): "fits" | "check" | "notFitting"         // FR-018
fidSnapshot                                                           // generated, read-only
```

## packages/features/first-run (new — within III)

Screens: `CoverScreen`, `UnitsStep`, `DietStep`, `PantryStep`, `RecipesConnectOnce`,
`ComingSoonTab` (Builder/Shopping/Pantry), `MoreScreen` (reset + version). Hook
`useFirstRunGate()` decides cover → onboarding step | Recipes.

## apps/home-baker

`app/` route files re-exporting the screens (thin, III) · `package.json` lists `expo-secure-store`
and `expo-file-system` itself (autolinking and config plugins resolve from the app, not core) ·
`app.json`: static splash `#f7f4ec`
both schemes, `android.allowBackup: false`, plugins (`expo-router`, `expo-secure-store` with `configureAndroidBackup`,
`expo-font`, `expo-localization`, `expo-splash-screen`).

## Scripts

| Script | Inputs | Output | Guard |
|---|---|---|---|
| `scripts/fid-snapshot.ts` | `NUTRIMERO_API_URL`, `NUTRIMERO_API_TOKEN` (env), `--api-commit` | `fid-snapshot.generated.ts` | refuses unless `--api-commit` = `contract/SOURCE` commit |
| `scripts/tokens-generate.ts` | `docs/DESIGN.md` frontmatter | `tokens.generated.ts` | deterministic; CI regenerates and fails on drift (added to `contract`-style check) |
| `scripts/no-suppressions.test.ts` | the source tree | Vitest result | denominator floor asserted |
