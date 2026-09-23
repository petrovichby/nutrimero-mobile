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
 * The marker is written only after a complete wipe; an incomplete one retries next launch.
 */
export async function ensureFreshInstallWiped(
  marker: InstallMarker,
  wipe: () => Promise<WipeOutcome>,
): Promise<"fresh" | "known"> {
  if (await marker.exists()) {
    return "known";
  }
  const outcome = await wipe();
  if (outcome.complete) {
    await marker.write();
  }
  return "fresh";
}
