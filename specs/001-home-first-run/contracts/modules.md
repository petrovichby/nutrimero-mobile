# Module contracts: 001-home-first-run

001 exposes no network interface. Its contracts are the **shared-package surfaces** other
features (003, the pro lane) will consume — each is a III-seam change announced through the
coordinator. Signatures are indicative; types come from the modules themselves.

## packages/core

```ts
// i18n (use-intl over messages/{en,de,lt}.json, ICU shape as nutrimero-web)
resolveLocale(deviceLocales: readonly string[]): Locale            // "de" | "lt" | "en"
createTranslator(locale: Locale): Translator                        // typed keys from en.json

// device store (expo-secure-store behind a typed adapter)
interface DeviceStoreAdapter { get(key): Promise<string | null>; set(key, value): Promise<void>; delete(key): Promise<void> }
createDeviceStore(adapter: DeviceStoreAdapter): DeviceStore        // typed get/set per key in data-model.md
DeviceStore.wipeAll(): Promise<void>                                // Home's single wipe path (idempotent)
ensureFreshInstallWiped(store, marker): Promise<void>              // reinstall rule — shared with the
                                                                    // pro session store (ADR 0001 condition 2)

// consumed from pro 002's session core (specs/002-pro-label-desk/contracts/session-core.md)
registerWiper("home.deviceData", () => deviceStore.wipeAll())       // FR-011/012 via core's wipe sequence

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

`app/` route files re-exporting the screens (thin, III) · `app.json`: static splash `#f7f4ec`
both schemes, `android.allowBackup: false`, plugins (`expo-router`, `expo-secure-store` with `configureAndroidBackup`,
`expo-font`, `expo-localization`, `expo-splash-screen`).

## Scripts

| Script | Inputs | Output | Guard |
|---|---|---|---|
| `scripts/fid-snapshot.ts` | `NUTRIMERO_API_URL`, `NUTRIMERO_API_TOKEN` (env), `--api-commit` | `fid-snapshot.generated.ts` | refuses unless `--api-commit` = `contract/SOURCE` commit |
| `scripts/tokens-generate.ts` | `docs/DESIGN.md` frontmatter | `tokens.generated.ts` | deterministic; CI regenerates and fails on drift (added to `contract`-style check) |
| `scripts/no-suppressions.test.ts` | the source tree | Vitest result | denominator floor asserted |
