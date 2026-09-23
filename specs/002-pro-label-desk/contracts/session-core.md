# Contract: shared session capability in `packages/core` (III seam)

This is the surface 002 adds to `packages/core` for **both** apps. It is announced to the Home
lane through the coordinator before merge. The signatures are behavioral; exact TypeScript lands
in implementation.

## Surface

| Member | Behavior |
|---|---|
| `signIn(email, password)` | O1. If the returned user differs from the stored `userId`, **or no `userId` is stored**, runs the **wipe sequence** before resolving (FR-001a; ADR 0002 relies on the missing-id case). Resolves to the signed-in state with memberships from O4. |
| `signOut()` | Runs the wipe sequence, then best-effort O3. Resolves to signed-out even offline. |
| `registerWiper(name, fn)` | Called at app start. `fn` must be idempotent. Wipers run after core's own wipe, in registration order, each isolated. |
| `activeCompany` / `chooseCompany(id)` | FR-002. Rejects an id not in the current memberships. |
| `client` | The `openapi-fetch` client with middleware: bearer header, `X-Company-Id` for company-scoped paths, single-flight refresh on 401, and a typed error classification (P5). |
| `onMembershipLost(cb)` | Fires with the company id when O4 no longer lists it, or a read returns `COMPANY_ARCHIVED` or a company 404. Apps purge per-company data here. |
| `entitlement(subject)` | Port returning `included \| not_included \| unavailable`. Today's implementation always returns `unavailable` (R9). |

## Wipe sequence (R10)

1. Set `pendingWipe`.
2. Clear core's own data: tokens, `userId`, `activeCompanyId`, desk preferences.
3. Await each registered wiper.
4. Clear `pendingWipe` only if every wiper succeeded.
5. On launch, if `pendingWipe` is set, repeat the sequence before any read.

## Home 001 compatibility

- Home's FR-011 (sign-out wipe) and FR-012 (erase wipe) become Home's registered wipers: the
  dietary profile, units, pantry seed, onboarding marker and cached collection. Home decides
  what it registers; core never reaches into app data.
- Home has no sign-in in 001. Until Home adopts `signIn`, its wipers are simply never invoked by
  sign-out.
- Home's device-local "Clear my data on this device" (FR-013) is Home's own action, not this
  sequence.

## Dependencies (XI)

The secure token store is a **new category** and stops for an ADR (research R4). Phase 1 cannot
start until that ADR is ruled.
