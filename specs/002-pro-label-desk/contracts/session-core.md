# Contract: shared session capability in `packages/core` (III seam)

This is the surface 002 adds to `packages/core` for **both** apps. It is announced to the Home
lane through the coordinator before merge. The signatures are behavioral; exact TypeScript lands
in implementation.

## Surface

| Member | Behavior |
|---|---|
| `signIn(email, password)` | O1. If the returned user differs from the stored `userId`, **or no `userId` is stored**, runs the **wipe sequence** before resolving (FR-001a; ADR 0002 relies on the missing-id case). Resolves to the signed-in state with memberships from O4. |
| `signOut()` | Runs the wipe sequence, then best-effort O3. Resolves to signed-out even offline. |
| `restore()` | At launch, **before any read**: runs the fresh-install clear (below), resumes a pending wipe, then loads the stored session (`signedIn`, `expired` when only the person remains, or `signedOut`). |
| `registerWiper(name, fn)` | Called at app start, **before `restore()`**. `fn` must be idempotent. Wipers run after core's own wipe, in registration order, each isolated. |
| `state().activeCompanyId` / `chooseCompany(id)` | FR-002. Rejects an id that is not an active membership. |
| `companyHeaders()` | `{ "X-Company-Id": id }` for the active bakery; throws when none is chosen. The generated types make this header a **required parameter** on all 70 company-scoped operations, so callers pass it explicitly and the compiler enforces it. Middleware does not inject it. |
| `client` | The `openapi-fetch` client with middleware: a bearer header (never on `/auth/*`; an explicit `Authorization` is kept), and **one retry of a GET** after a single-flight refresh on 401. Writes are never replayed. Errors are classified by `classifyResponseError` (P5). |
| `onMembershipLost(cb)` | Fires with the company id when O4 no longer lists it, or a feature reports `COMPANY_ARCHIVED` / `MEMBERSHIP_REQUIRED` / `MEMBERSHIP_NOT_ACTIVE` via `reportCompanyUnavailable`. A plain `NOT_FOUND` never counts. Apps purge per-company data here. |
| `entitlement(subject)` | Port returning `included \| not_included \| unavailable`. Today's implementation always returns `unavailable` (R9). |

## Wipe sequence (R10)

1. Set `pendingWipe`.
2. Clear core's own keys (`nutrimero.session.*`: tokens, `userId`, `activeCompanyId`).
3. Await each registered wiper.
4. Clear `pendingWipe` only if every wiper succeeded.
5. On launch, if `pendingWipe` is set, repeat the sequence before any read.

## Fresh-install clear (ADR 0001 condition 3)

`ensureFreshInstallWiped(marker, wipe)`: if the install marker (a document-directory file) is
absent, run the **full** wipe sequence (core's keys plus every registered wiper) and write the
marker only when the wipe completes.
- It is one call for all owners, so one marker check can never clear one owner's keys and skip
  another's.
- `restore()` makes the call, so Home gets the orphan clear for its keys by registering its wiper
  before `restore()`.
- This refines Home's indicative `ensureFreshInstallWiped(store, marker)` in
  `specs/001-home-first-run/contracts/modules.md`.

## Device store

`DeviceStoreAdapter { get, set, delete }` (the name from Home's contract), plus:
- `secureStoreAdapter`: `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, key alphabet and the 2,048-byte budget
  enforced
- `createMemoryAdapter` for tests and fakes
- `fileInstallMarker` / `createMemoryMarker`

Home's typed per-key `DeviceStore` builds on the adapter and stays Home's.

## Home 001 compatibility

- Home's FR-011 (sign-out wipe) and FR-012 (erase wipe) become Home's registered wipers: the
  dietary profile, units, pantry seed, onboarding marker and cached collection. Home decides
  what it registers; core never reaches into app data.
- Home has no sign-in in 001. Until Home adopts `signIn`, its wipers are simply never invoked by
  sign-out.
- Home's device-local "Clear my data on this device" (FR-013) is Home's own action, not this
  sequence.

## Dependencies (XI)

Admitted by ADR 0001 (accepted, #4): `expo-secure-store` and `expo-file-system`, installed in
`packages/core` and in `apps/pro-baker` (autolinking and config plugins resolve from the app).
Home's app adds them the same way when it consumes this.
