# Data model: Measures (004)

Nothing here is personal data, nothing leaves the device, and nothing is stored on it. Three kinds
of data: the **generated snapshot** (FID and the api's definitions, verbatim), the **curated set**
(the owner-confirmed ids, in code), and the **evidence file** (the lane's multi-source proof,
feeding the api's overlays). Units and the density choice are the api's (gate-1 correction).

## MeasuresSnapshot — generated (`measures-snapshot.generated.ts`)

Written only by `scripts/fid-snapshot.mts` from a LOCAL api at `contract/SOURCE`'s commit. A hand
edit is a suppression-class violation (XII).

| Field | Type | Notes |
|---|---|---|
| `apiCommit` | 40-hex string | equals `contract/SOURCE`'s commit (asserted by the script and a test) |
| `contractSource` | string | copied from `contract/SOURCE` |
| `ingredients` | `MeasuresIngredient[]` | in the manifest's order |
| `forms` / `states` / `sizeClasses` | vocabulary maps | `id` → `{ code, names: LocalizedNames, ordinal? }` |
| `units` | `UnitDefinition[]` | the api's unit definitions (`change/002`): id, names, dimension, factor to ml or g (full-precision string) |

### MeasuresIngredient

| Field | Type | Notes |
|---|---|---|
| `fidId` | 7-hex string | resolves in FID (build fails otherwise) |
| `names` | `LocalizedNameSets` | every FID name per UI locale, api order (001's type) |
| `searchKeys` | `string[]` | folded names, all languages (research R9) |
| `volume` | `VolumeRow[]` | FID's `reserved.volumeToMass`, every row (for the provenance view) |
| `chosen` | `ChosenDensity[]` | the api's chosen density per form and state, with its recorded sources; absent where the api has none |
| `pieces` | `PieceRow[]` | FID's `reserved.pieceWeight`, every row |

### VolumeRow (verbatim FID)

`id`, `physicalFormId`, `preparationStateId`, `referenceVolumeMl` (decimal string),
`referenceMassG` (decimal string), `source`, `method` (`MEASURED|LITERATURE|CALCULATED|ESTIMATE`),
`confidence` (`HIGH|MEDIUM|LOW`). Derived at run time: `gramsPerMl = referenceMassG /
referenceVolumeMl`.

### PieceRow (verbatim FID)

`id`, `physicalFormId`, `preparationStateId`, `pieceSizeClassId`, `massGMean`, `massGMin?`,
`massGMax?`, `source`, `method`, `confidence`.

## Curated set (`measures-set.ts`)

`MEASURES_FID_IDS`: the owner-confirmed ids (FR-018), a superset of the 13 staples (test). No
picks, no source order and no rule live in the app; those are the api's (gate-1 correction).

### ChosenDensity (from the api, `change/002`; field names follow its contract)

`physicalFormId`, `preparationStateId`, `gramsPerMl` (full-precision string), the chosen FID row
id, and the sources the api records (including the published sources an AI-derived row was
proven by). **Empty is not zero**: no chosen density means no volume conversion.

## DensityEvidence — `specs/004-measures-conversion/density-evidence.md`

One table row per **AI-derived FID volume row in the curated set**:

| Column | Content |
|---|---|
| FID id · ingredient · form · state | identifies the row's context |
| FID row id · FID g/ml | the value under test |
| Sources | ≥ 1 entries of `URL · locus · value (g/ml or g per stated volume)` |
| Verdict | `confirmed` (≥ 2 independent within 5 %) · `unconfirmed` · `disputed` |

Parsed by a test. It **feeds the api's overlays**; the app shows the api's choice, not the file's.

## Units choices (Home store — reset by Clear my data)

| Key | Values | Legacy | Default |
|---|---|---|---|
| `nutrimero.home.units` | `metric` · `imperial` | a stored `imperial` with no region reads as Imperial + US | `metric` |
| region choice (new Home key) | `device` · `uk` · `us` · `europe` | — | `device` |
| amounts in recipes (new Home key, with More → Units) | `kitchen` · `exact` | — | per the approved frame |

## Market (run time, not stored)

`market` = the api's market for the device region (`regionCode`), resolved per QM1 for unknown regions.
Every list, household unit, egg grade and onboarding sample is filtered by it (FR-024–FR-026). The snapshot's
`MeasuresIngredient` gains `markets` (from the api); `units` gain the markets they are shown in.

## At run time

```text
volume conversion for (ingredient, form, state)
  chosen = snapshot.chosen for that form and state
  none   → "not settled yet": no volume conversion (FR-005, FR-007)
  chosen → grams = millilitres × gramsPerMl, millilitres = cups × unit factor (from snapshot.units)
```

## Converter state (screen-local, not stored)

`amount` (decimal, locale input), `from` unit, `to` unit, `formId`/`stateId` (when the ingredient
has variants), `pieceSizeClassId` (for pieces). Flip swaps `from`/`to` and moves the result into
`amount`. Nothing is stored.
