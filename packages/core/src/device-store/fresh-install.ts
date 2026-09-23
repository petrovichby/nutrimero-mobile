import type { DeviceStoreAdapter } from "./adapter";
import type { InstallMarker } from "./install-marker";

export interface WipeOutcome {
  readonly complete: boolean;
  readonly failed: readonly string[];
}

/**
 * ADR 0001 condition 3. Runs at launch **before any read** — before the session's `userId`
 * comparison (002 FR-001a) and before Home reads its device data. One call covers every owner:
 * `wipe` is the full wipe sequence (the session's own keys plus every registered wiper), so one
 * marker check can never clear one owner's keys and skip another's.
 *
 * Beside the wipe sequence it takes the **fresh-install-only keys**: device preferences (e.g. the
 * interface language, 001 FR-027) that a reinstall clears but sign-out, erase and "Clear my data"
 * must never touch — so they are deleted here and nowhere in the wipe sequence.
 *
 * The marker is written only after both the wipe sequence and the fresh-install-only deletes
 * completed; an incomplete run retries next launch.
 */
export async function ensureFreshInstallWiped(
  marker: InstallMarker,
  wipe: () => Promise<WipeOutcome>,
  freshInstallOnly: { store: DeviceStoreAdapter; keys: readonly string[] } | undefined = undefined,
): Promise<"fresh" | "known"> {
  if (await marker.exists()) {
    return "known";
  }
  const outcome = await wipe();
  let keysCleared = true;
  for (const key of freshInstallOnly?.keys ?? []) {
    try {
      await freshInstallOnly?.store.delete(key);
    } catch {
      keysCleared = false;
    }
  }
  if (outcome.complete && keysCleared) {
    await marker.write();
  }
  return "fresh";
}
