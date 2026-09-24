# Data model: Measures (004)

Nothing here is personal data and nothing leaves the device. Three kinds of data: the **generated
snapshot** (FID, verbatim), the **curated manifest** (the owner's choices, in code), the
**evidence file** (the multi-source proof, in the spec directory), plus one **device setting**.

## MeasuresSnapshot — generated (`measures-snapshot.generated.ts`)

Written only by `scripts/fid-snapshot.mts` from a LOCAL api at `contract/SOURCE`'s commit. A hand
edit is a suppression-class violation (XII).

| Field | Type | Notes |
|---|---|---|
| `apiCommit` | 40-hex string | equals `contract/SOURCE`'s commit (asserted by the script and a test) |
| `contractSource` | string | copied from `contract/SOURCE` |
| `ingredients` | `MeasuresIngredient[]` | in the manifest's order |
| `forms` / `states` / `sizeClasses` | vocabulary maps | `id` → `{ code, names: LocalizedNames, ordinal? }` |

### MeasuresIngredient

| Field | Type | Notes |
|---|---|---|
| `fidId` | 7-hex string | resolves in FID (build fails otherwise) |
| `names` | `LocalizedNameSets` | every FID name per UI locale, api order (001's type) |
| `searchKeys` | `string[]` | folded names, all languages (research R9) |
| `volume` | `VolumeRow[]` | FID's `reserved.volumeToMass`, every row |
| `pieces` | `PieceRow[]` | FID's `reserved.pieceWeight`, every row |

### VolumeRow (verbatim FID)

`id`, `physicalFormId`, `preparationStateId`, `referenceVolumeMl` (decimal string),
`referenceMassG` (decimal string), `source`, `method` (`MEASURED|LITERATURE|CALCULATED|ESTIMATE`),
`confidence` (`HIGH|MEDIUM|LOW`). Derived at run time: `gramsPerMl = referenceMassG /
referenceVolumeMl`.

### PieceRow (verbatim FID)

`id`, `physicalFormId`, `preparationStateId`, `pieceSizeClassId`, `massGMean`, `massGMin?`,
`massGMax?`, `source`, `method`, `confidence`.

## MeasuresManifest — curated (`measures-manifest.ts`)

| Field | Type | Rule |
|---|---|---|
| `MEASURES_FID_IDS` | readonly 7-hex ids | the owner-confirmed set (FR-018); ⊇ the 13 staples (test) |
| `RULED_PICKS` | `{ fidId, formId, stateId, rowId, ruling }[]` | FR-005a; `rowId` names one of that ingredient's own FID volume rows (test); `ruling` records who and when |
| `SOURCE_CLASS` | map source → `"published" \| "aiDerived"` | closed list; an unlisted source fails the build (research R3) |
| `SOURCE_ORDER` | ordered sources | the fixed rule's third key (gate-2 item) |

Moves to the api when FID gains a display density (gate-1 Q2).

## DensityEvidence — `specs/004-measures-conversion/density-evidence.md`

One table row per **AI-derived FID volume row in the curated set**:

| Column | Content |
|---|---|
| FID id · ingredient · form · state | identifies the row's context |
| FID row id · FID g/ml | the value under test |
| Sources | ≥ 1 entries of `URL · locus · value (g/ml or g per stated volume)` |
| Verdict | `confirmed` (≥ 2 independent within 5 %) · `unconfirmed` · `disputed` |

Parsed by a test; the app admits exactly the `confirmed` rows (FR-004a).

## Resolution (run time, pure)

```text
resolveVolume(ingredient, formId, stateId)
  rows       = ingredient.volume where form and state match
  admissible = rows where SOURCE_CLASS = published, or evidence verdict = confirmed
  if RULED_PICKS has (fidId, formId, stateId)          → value(pick row)
  if admissible is empty                               → none
  if max(g/ml) / min(g/ml) > 1.05                      → inconsistent(admissible)
  else                                                 → value(first by confidence, method,
                                                           SOURCE_ORDER, row id)
```

States: `none` → no volume measures shown (FR-007); `inconsistent` → no volume conversion, "not
settled yet" wording (FR-005a); `value` → shown, provenance on tap (FR-016).

## MeasuringStandard (core, constants)

`id` (`us | metric | uk | au`), `cupMl`, `tbspMl`, `tspMl`, `flOzMl?` — exact values in research R6.

## Device setting (Home store)

| Key | Values | Default | Wipe |
|---|---|---|---|
| `nutrimero.home.measureStandard` | `"usMetric" \| "uk" \| "au"` | `"usMetric"` (US and metric side by side) | Home's wiper (Clear my data, sign-out, erase); reinstall clear |

Corrupt or unknown values read as the default (001's store rule).

## Converter state (screen-local, not stored)

`amount` (decimal, locale input), `from` unit, `to` unit, `formId`/`stateId` (when the ingredient
has variants), `pieceSizeClassId` (for pieces). Flip swaps `from`/`to` and moves the result into
`amount`.
