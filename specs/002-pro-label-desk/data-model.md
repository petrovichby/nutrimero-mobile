# Data model — 002 Pro Baker Label desk

Server shapes are **never re-declared here**. Every server entity's type is the generated
`components["schemas"][…]` / `paths[…]` type from `contract/openapi.json` (Constitution II). This
document names which generated type each entity is, and fully specifies only what the device
owns.

## Server entities (read-only, generated types)

| Entity | Source operation | Generated type (post-sync) | Held where |
|---|---|---|---|
| Me + memberships | `GET /me` | response of `paths['/api/v1/me']['get']` | memory (session) |
| Label type (rule-set) | `GET /fid/declaration-rule-sets` | its list-item schema | memory, per session |
| Product | `GET /products` (paged) | its list-item schema | memory, per screen |
| Readiness row | `GET /declarations` (paged) | overview row = `ProductGrid` | memory, per screen |
| Declarations grid | `GET /products/{id}/declarations` | `ProductGrid` | memory, per screen, **never persisted** (FR-021) |
| Gap | inside grid cells and renderings | gap schema (kind, datum, path/occurrences) | memory |
| Label rendering | `GET /products/{id}/labels/{ruleSetId}?language=` | rendering schema (`sections`, `text`, `gaps`, `notices`, `figures`, `symbolIds`) | memory, **never persisted** |
| Issued label | `GET …/labels/{ruleSetId}/issued`, `GET /issued-labels/{id}` | issued-label schema | memory, and **persisted** (see below) |
| Match verdict | `GET /issued-labels/{id}` → `differsFromCurrent` | a boolean field of that response | component state only, **never persisted** (R8) |

Readiness is derived for display only, not computed as a domain fact: "ready" means every
required cell is `complete`, and otherwise it is the count of incomplete required cells, read
from the api's own cells. For packaging label types it reads "not issuable yet" whenever the
Additives cell is `cannot_be_held` (FR-018, P-02). The app takes that from the gap kind, not
from the rule-set id.

## Device-owned entities

### Session (secure store; `packages/core/session`)

| Field | Type | Rule |
|---|---|---|
| `accessToken` | string | secret; secure store only |
| `refreshToken` | string | secret; secure store only; rotated on every refresh |
| `userId` | string (uuid) | the last signed-in person; drives FR-001a |
| `activeCompanyId` | string (uuid) \| null | FR-002; cleared when not in `/me` memberships |
| `pendingWipe` | boolean | set before a wipe starts, cleared when every wiper succeeds (R10) |

**Transitions:**
- `signedOut` → (sign-in, same `userId`) → `signedIn(company?)`
- `signedOut` → (sign-in, different or no stored `userId`) → `wiping` → `signedIn(company?)`
- `signedIn` → (sign-out \| erase) → `wiping` → `signedOut`
- `signedIn` → (refresh fails) → `expired` → (sign-in) → as above
- On launch, if `pendingWipe` → `wiping` before any read.

### Wiper registry (memory; `packages/core/session`)

- An ordered list of `{ name, wipe(): Promise<void> }`, registered at app start.
- Core runs its own wipe first, then each wiper, isolated.
- Failure keeps `pendingWipe`.

### Saved label (persistent store; `packages/features/labels/store`)

| Field | Type | Rule |
|---|---|---|
| `companyId` | uuid | partition key; purge-by-company (FR-022) |
| `issuedId` | uuid | primary key within the company |
| `productId` | uuid | grouping (US4) |
| `productName` | string | the name as last seen online, for offline grouping |
| `ruleSetId` | string | |
| `language` | string | the stored locale of the issued label |
| `document` | JSON | the issued-label payload **as received** (generated type), frozen text included; never edited |
| `status` | `active` \| `superseded` \| `withdrawn` | the only mutable server fact |
| `statusConfirmedAt` | ISO timestamp | server `Date` of the last read that confirmed the status (FR-020) |

**Invariants:**
- There is **no verdict field** (R8).
- `document` is replaced only by a newer read of the same `issuedId`. The api guarantees the
  frozen parts are identical, so only status and withdrawal fields differ.
- Rows for a company are deleted when:
  - `/me` no longer lists that membership;
  - a read returns `COMPANY_ARCHIVED`, or 404 on the company;
  - the session wipe runs (all companies).
- The store is **included** in OS backups (ADR 0002, as accepted). A restore to another device
  carries no session, so the first sign-in wipes the store (R10).

**Transitions (status):** `active → superseded | withdrawn`, `superseded → withdrawn`. The app
mirrors whatever the api reports and never infers a transition.

### Label-language set (bundled data; `packages/features/labels`)

- The owner's list as `{ tag, provenBy: '<api spec file › describe › test title>' | null }` for
  en-US, de-DE, hu-HU, lt-LT and pl-PL (owner ruling). **Offered = entries with a non-null
  `provenBy`.** Today that is en-US and de-DE; hu-HU, lt-LT and pl-PL gain their citations when
  the api's coverage PR merges (R1).
- Tests fail if an offered entry lacks a citation, if a tag outside the owner's list appears, or
  if be-BY appears.
- It is replaced by the api listing when B11 ships.

### Desk preferences (device, non-secret)

- `lastLabelLanguage` (FR-011).
- The last chosen company is stored in the session (FR-002).
- These are cleared by the session wipe.

## Validation rules (from requirements)

| Rule | Source |
|---|---|
| Rendered label text equals the api `text`; runs are displayed without alteration | FR-010, SC-003 |
| Every api gap produces exactly one sentence (or one grouped sentence per api group) | FR-007, SC-002 |
| An unknown gap kind or datum type still renders kind + path via the generic template, never dropped | FR-007 |
| Nothing offline serves products, grids or previews | FR-021 |
| No verdict is shown without a same-view online read | FR-017, SC-004 |
| The product filter operates on ≤ 1,000 loaded rows and shows the bound line when `total` > 1,000 | FR-005, R2 |
