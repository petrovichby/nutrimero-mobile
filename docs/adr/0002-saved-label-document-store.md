# ADR 0002 — Saved-label document store and reconnect events

**Status**: Proposed (gate 2 of 002-pro-label-desk) · **Date**: 2026-09-23 · **Deciders**: owner
(Aliaksandr), coordinator

**Scope**: Pro Baker only, as ruled at 002 gate 2. The coordinator assigned authorship to the pro
lane. Home 001 needs neither package. Navigation, secure store, locale and i18n runtime are
**ADR 0001**'s (shared, Home-owned), and this ADR does not touch them.

## Context

Spec 002 makes issued labels the Label desk's one offline cache (FR-019–022):
- Documents are immutable apart from status, and every one is saved as it is loaded.
- They are readable offline, grouped by product.
- They are purged per bakery, on sign-out, on an account switch and on membership loss.
- They are **excluded from OS-level backups**.
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
  - **No documented backup-exclusion option.**
- **expo-file-system**:
  - `Paths.document` is "safe from being deleted by the system".
  - `Paths.cache` "can be deleted by the system when the device runs low on storage".
  - **No documented backup-exclusion API** (no `isExcludedFromBackup` or equivalent).
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

### Backup exclusion: the stated fallback

SDK 57 documents **no supported way** to exclude an expo-sqlite database, or any
expo-file-system path, from iCloud or iTunes backup on iOS. The decision is therefore:

1. **iOS**: open the database in the **caches directory** (`directory` = the `Paths.cache` URI).
   iOS does not include `Library/Caches` in device backups, which satisfies FR-022's exclusion.
   **Cost**: the OS may delete caches under storage pressure, so saved labels can disappear
   without the app acting.
2. **Android**: `android.allowBackup: false` in `apps/pro-baker/app.json`. This matches Home's
   ADR 0001 condition 1, and the database stays in the default directory.
3. **Disclosure** turns the cost from a silent loss into a stated one:
   - The secure store keeps a per-bakery "labels were saved" marker.
   - If the store is found empty while the marker is set, Saved labels says so: "This device
     cleared saved labels to free space. They are saved again the next time you open them
     online."
   - Then the marker clears.

**This fallback amends spec 002.** FR-019's "MUST be saved … and be readable offline" becomes
"saved, readable offline **unless the device clears them under storage pressure**, which the
desk states". The amendment is proposed with this ADR and takes effect only on the
coordinator's word.

## Alternatives considered

- **A local Expo module** (Swift, about 20 lines) setting `NSURLIsExcludedFromBackupKey` on a
  database directory under `Library/Application Support`. It gives exclusion without eviction,
  but it would be the **repo's first native code** (a prebuild, a module package, and native
  review), a larger step than this feature justifies. It remains the upgrade path if saved labels
  turn out to be evicted in practice. That would need its own ADR.
- **Default directory + SQLCipher**: the data would still be in the backup (only encrypted), so
  it fails FR-022's "excluded", and it adds key management. Rejected.
- **expo-file-system, one JSON file per label in `Paths.cache`**: the same eviction cost, with
  no atomic purge or query. Rejected in favour of SQLite.
- **The secure store for documents**: the iOS docs warn values above about 2048 bytes can be
  refused, and a rendering is far larger. Rejected.
- **No reconnect listener (foreground-only refresh)**: it breaks FR-020 for a tablet that stays
  open all day on the shop counter. Rejected.

## Consequences

- Saved labels are best-effort durable on iOS. The eviction is disclosed, never silent.
- The Pro app's `app.json` gains `android.allowBackup: false` and the expo-sqlite config plugin
  entry.
- The store adapter lives in `packages/features/labels`. That is under `packages/*`, so it is
  announced to Home through the coordinator (III seam), even though Home does not consume it.
- The store schema has **no verdict field** (plan R8). A test asserts this.
- Phase 3 of 002 is unblocked when this ADR is ruled. Phases 1 and 2 do not depend on it.
