# Contract: what the desk consumes from `nutrimero-api`

This is the consumer-side contract (Constitution II). Every operation listed here must exist in
the synced `contract/openapi.json` before phase 1. Pinned facts are checked by tests in this
repo, so an api change surfaces through the drift gate and CI, not through a user.

The baseline is `nutrimero-api` `origin/main` `4a4356b`, and the contract is consumed from the Home lane's
standalone contract-sync PR (number to be named by the coordinator).

## Operations

| Op | Method + path | Headers | Used by | Offline |
|---|---|---|---|---|
| O1 | `POST /api/v1/auth/login` | — | FR-001 | n/a |
| O2 | `POST /api/v1/auth/refresh` | — | session refresh | n/a |
| O3 | `POST /api/v1/auth/logout` | bearer | FR-001 | best-effort; the local wipe proceeds regardless |
| O4 | `GET /api/v1/me` | bearer | FR-002, membership loss (FR-022) | no |
| O5 | `GET /api/v1/fid/declaration-rule-sets` | bearer | label types, R7 | no |
| O6 | `GET /api/v1/products?limit=200&offset=…` | bearer, `X-Company-Id` | FR-004/005 (≤ 5 pages) | no |
| O7 | `GET /api/v1/declarations?limit=200&offset=…` | bearer, `X-Company-Id` | readiness (FR-004) | no |
| O8 | `GET /api/v1/products/{id}/declarations` | bearer, `X-Company-Id` | grid (FR-006–009) | no |
| O9 | `GET /api/v1/products/{id}/labels/{ruleSetId}?language=` | bearer, `X-Company-Id` | preview (FR-010–014) | no |
| O10 | `GET /api/v1/products/{id}/labels/{ruleSetId}/issued` | bearer, `X-Company-Id` | issued list (FR-015), once per offered rule-set | saved (FR-019) |
| O11 | `GET /api/v1/issued-labels/{issuedId}` | bearer, `X-Company-Id` | detail + verdict (FR-016/017) | document saved; verdict never |

**Not consumed, by rule:**
- any `POST` besides auth: issue, withdraw, assign, choices, compositions
- `PATCH /companies/current` (toggles)
- `POST /me/erase`: no erase UI in this feature. If added later, it runs the R10 wipe sequence.

## Pinned facts (tested in this repo)

| # | Fact | How pinned |
|---|---|---|
| P1 | O9's `language` is a free string (2–35), default `en-US`; no enum | Contract test on the generated param type. If it becomes an enum, the test fails and FR-011 switches its source to the enum (B11) |
| P2 | **`declarationsEnabled` is on the company schema only and gates no route** (016 FR-039; api test `src/declarations/boundaries.spec.ts:159`) | Contract test: no response schema of O5–O11 varies on, or references, the toggle. The desk never reads `companies/current` (B12, FR-003) |
| P3 | O11 carries `differsFromCurrent`; O10 does not | Contract test on both generated types. If O10 gains it, R8 is revisited, not silently used |
| P4 | O9 always answers 200 for a held product; unrenderable content arrives as `gaps` / `engine: null` | Fixture tests. The UI treats non-200 as an error state and never as "no label" |
| P5 | Refusals the desk acts on: `401` (refresh), `403 INSUFFICIENT_ROLE` (not expected, since all reads are allowed for viewers; shown as an error), `404` (not found or other company), `409 COMPANY_ARCHIVED` (purge + switch) | Error classifier unit tests against the generated error envelope |
| P6 | Packaging rule-sets require `additives`; that cell is `cannot_be_held` by design (P-02) | No app logic depends on it (FR-018). A fixture keeps the "not issuable yet" rendering honest |

## Asks raised to the api lane (none block phase 1)

| Ask | What | Status |
|---|---|---|
| B2 | `q` on `/products` | queued (coordinator) |
| B6 | per-product issued-label list, or paging | queued, non-blocking |
| B8 | entitlements, per-bakery scope for Pro (and per-user for Home) | queued after api 020 P1; **blocks store release** |
| B11 | a listing of label-vocabulary languages | new, raised by this plan |
| B11b | e2e coverage for lt-LT rendering (the LT pilot's language) | new, raised by this plan |
