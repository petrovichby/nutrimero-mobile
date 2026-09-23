# Data model: 001-home-first-run

All entities below are **device-only** (VI) except the FID snapshot, which ships with the app.
Nothing here is sent to a server.

## Device store (packages/core `deviceStore`)

One namespace, `nutrimero.home.v1`, keys below. Values are JSON strings. The store is the only
persistence 001 has.

| Key | Type | Default | Written by | Validation |
|---|---|---|---|---|
| `units` | `"metric" \| "imperial"` | `"metric"` | FR-005 | enum; unknown value ⇒ default |
| `dietaryProfile` | `DietaryOption[]` (set, sorted) | `[]` | FR-006 | each ∈ the six options; duplicates dropped |
| `pantrySeed` | `FidIngredientId[]` (set, manifest order) | `[]` | FR-007 | each ∈ staples manifest; unknown ids dropped |
| `onboarding` | `{ units: StepState, diet: StepState, pantry: StepState, completed: boolean }` | all `pending`, `false` | FR-008 | — |

`DietaryOption` = `glutenFree | lactoseFree | nutAllergy | eggFree | vegan | vegetarian`.
`StepState` = `pending | answered | skipped`.

### Onboarding state transitions

```
launch ──▶ [no install marker] ──▶ wipeAll() ──▶ write marker ──▶ onboarding.units
launch ──▶ onboarding.completed ──▶ Recipes tab
units ──(Continue: answered | Skip: skipped)──▶ diet ──▶ pantry ──▶ completed=true ──▶ Recipes
interrupted at step S ──▶ next launch resumes at first step still `pending`
```

### Wipe (FR-011–013)

`wipeAll()` deletes every key in the namespace (and, from 003 on, the cached collection) and
resets the install marker's companion state, returning the app to `units`. Callers:

| Trigger | Feature | Behavior |
|---|---|---|
| "Clear my data on this device" (More) | 001 | confirm ⇒ `wipeAll()` ⇒ restart first run |
| Fresh install / reinstall (no marker) | 001 | `wipeAll()` before any read (iOS Keychain survives uninstall) |
| Sign-out | future auth | `wipeAll()` ⇒ first run (FR-011 contract) |
| Account erase | future auth | `wipeAll()` regardless of server response (FR-012 contract) |

Storage class: iOS Keychain `WHEN_UNLOCKED_THIS_DEVICE_ONLY`; Android Keystore-backed with app
backup disabled (FR-009).

## FID reference snapshot (packages/features/diet-profile, generated)

```
header: apiCommit (40-hex), contractSource (contract/SOURCE line), generatedAt (ISO date),
        "GENERATED — do not edit; a hand edit is a suppression-class violation (XII)"
languages: { en: LanguageId, de: LanguageId, lt: LanguageId }
staples: [ { fidId, names: { en, de, lt }, dietary: { vegan, vegetarian, lactoseFree, glutenFree } } ] × 14
allergens: [ { id, code, names: { en, de, lt } } ]   // exactly the codes the mapping uses
```

Field types derive from the generated contract schema (`components["schemas"]`), so a contract
change that alters them fails typecheck rather than silently diverging.

## Dietary mapping (owner's ruling, FR-018)

| Option | Maps to |
|---|---|
| Gluten-free | allergen: cereals containing gluten |
| Lactose-free | allergen: milk (incl. lactose) |
| Nut allergy | allergens: tree nuts **and** peanuts |
| Egg-free | allergen: eggs |
| Vegan | dietary fact `vegan` |
| Vegetarian | dietary fact `vegetarian` |

`evaluateFit`: per mapped item, state `yes`/contains ⇒ `notFitting`; `unknown`,
`depends_on_brand` ⇒ `check`; `no` (or dietary fact `yes`) ⇒ `fits`; missing data ⇒ `check`.
Result across the profile = worst of (`notFitting` > `check` > `fits`); empty profile ⇒ `fits`.
