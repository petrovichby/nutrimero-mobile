# ADR 0002 — Saved-label document store and reconnect events

**Status**: Accepted (coordinator, 2026-09-23, with amendments; see *Backups*) · **Date**:
2026-09-23 · **Deciders**: owner (Aliaksandr), coordinator

**Scope**: Pro Baker only, as ruled at 002 gate 2. The coordinator assigned authorship to the pro
lane. Home 001 needs neither package. Navigation, secure store, locale and i18n runtime are
**ADR 0001**'s (shared, Home-owned), and this ADR does not touch them.

## Context

Spec 002 makes issued labels the Label desk's one offline cache (FR-019–022):
- Documents are immutable apart from status, and every one is saved as it is loaded.
- They are readable offline, grouped by product.
- They are purged per bakery, on sign-out, on an account switch and on membership loss.
- Their status refreshes on foreground **and on reconnect** (FR-020).

Volume is tens to a few hundred JSON documents per bakery, each carrying a full rendering and
structure (019). Constitution XI says a database is a new dependency category, and the
coordinator reads XI broadly. The api offers no delta sync, so refresh is a status re-read
per saved label (plan, Complexity Tracking).

Verified against the Expo SDK 57 docs (per `AGENTS.md`), 2026-09-23:
- **expo-sqlite**:
  - `openDatabaseAsync(databaseName, options?, directory?)`
  - `directory` defaults to `SQLite.defaultDatabaseDirectory`
  - config-plugin options: `enableFTS`, `useSQLCipher`, `useLibSQL`, `withSQLiteVecExtension`,
    `customBuildFlags`
  - no documented backup-exclusion option
- **expo-file-system**: no documented backup-exclusion API. `Paths.cache` "can be deleted by the
  system when the device runs low on storage".
- **App config**: `android.allowBackup`: "If this is set to false, no backup or restore of the
  application will ever be performed". The default is `true`.
- **expo-network**:
  - `addNetworkStateListener(listener)` and `useNetworkState()`
  - `NetworkState { isConnected, isInternetReachable, type }`
  - Android permissions `ACCESS_NETWORK_STATE` and `ACCESS_WIFI_STATE` are added automatically.

## Decision

| Package | Category | Where | Why |
|---|---|---|---|
| `expo-sqlite` | local persistence (document store) | `packages/features/labels` (store adapter) | One table keyed by (company, issued id) with a JSON column. Purge-by-bakery is one statement, grouping by product is one query, and replacing a document on re-read is atomic. The file-per-label alternative needs directory bookkeeping and gives no atomicity for purge |
| `expo-network` | platform connectivity events | `packages/features/labels` (refresh trigger) | FR-020's reconnect refresh. Without it, refresh happens on foreground only, and a tablet that regains Wi-Fi while open would keep showing stale statuses |

Versions are those Expo SDK 57 pins (`npx expo install`). Config-plugin defaults stay unchanged:
no SQLCipher, no libSQL, no extensions.

### Backups (ruled 2026-09-23)

**Saved labels are included in OS backups; session data is not.** Saved labels are copies of
documents already printed on packs, so they are not confidential. Spec 002's FR-022 is amended
to drop its backup-exclusion clause for saved labels. Session data stays excluded through the
secure store (ADR 0001).

1. **iOS**: the database lives in expo-sqlite's **default directory**
   (`SQLite.defaultDatabaseDirectory`). It is durable, backed up, and never evicted by the OS.
2. **Android**: `android.allowBackup: false` stays. This is ADR 0001's condition, applied to both
   apps.
3. **Why inclusion is safe.** Suppose a backup is restored to another device.
   - It carries the saved labels, but **no Keychain session**, because tokens are stored
     `WHEN_UNLOCKED_THIS_DEVICE_ONLY` and do not migrate.
   - The first sign-in therefore finds **no stored `userId`**, and the different-account wipe
     (spec FR-001a, plan R10) runs before any read.
   - It deletes the restored labels, which then reload online for whoever signs in.
   - A restored copy can never be read by the wrong account, and never outlives a sign-in.
4. **Rule this depends on**: a **missing** stored `userId` counts as a different account. The
   wipe runs whenever the comparison cannot prove it is the same person. This is stated in plan
   R10 and `contracts/session-core.md`, and covered by task T010's tests.

## Alternatives considered

- **Caches directory with disclosed eviction** (this ADR's original proposal). It excludes the
  labels from iOS backup, at the cost of OS eviction under storage pressure and an FR-019
  amendment. It became unnecessary once saved labels were ruled non-confidential. **It remains
  the fallback, as originally written, if the owner overturns the backup ruling.**
- **A local Expo module** (Swift) setting `NSURLIsExcludedFromBackupKey`. It would be the
  repo's first native code. **Never needed** under this ruling, and recorded only so the option
  is not rediscovered.
- **Default directory + SQLCipher**: encryption protects nothing that needs protecting here, and
  it adds key management. Rejected.
- **expo-file-system, one JSON file per label**: no atomic purge or query. Rejected in favour of
  SQLite.
- **The secure store for documents**: the iOS docs warn that values above about 2048 bytes can
  be refused, and a rendering is far larger. Rejected.
- **No reconnect listener (foreground-only refresh)**: it breaks FR-020 for a tablet that stays
  open all day on the shop counter. Rejected.

## Consequences

- Saved labels are durable on iOS. There is no eviction handling and no eviction notice (task
  T035 dropped).
- FR-019 is unchanged. FR-022 no longer requires backup exclusion for saved labels, but it
  still requires every purge.
- The Pro app config gains the expo-sqlite plugin entry. `android.allowBackup: false` is set per
  ADR 0001.
- The store adapter lives in `packages/features/labels`. That is under `packages/*`, so it is
  announced to Home through the coordinator (III seam), even though Home does not consume it.
- The store schema has **no verdict field** (plan R8). A test asserts this.
- Phase 3 of 002 is unblocked by this ADR. Phases 1 and 2 never depended on it.
