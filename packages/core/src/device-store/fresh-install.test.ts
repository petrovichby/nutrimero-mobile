import { describe, expect, it, vi } from "vitest";
import { ensureFreshInstallWiped } from "./fresh-install";
import { createMemoryMarker } from "./install-marker";

describe("the reinstall-orphan clear (ADR 0001 condition 3)", () => {
  it("wipes everything and writes the marker when the marker is absent", async () => {
    const marker = createMemoryMarker(false);
    const wipe = vi.fn(async () => ({ complete: true, failed: [] }));
    expect(await ensureFreshInstallWiped(marker, wipe)).toBe("fresh");
    expect(wipe).toHaveBeenCalledOnce();
    expect(marker.present()).toBe(true);
  });

  it("does nothing on a known install", async () => {
    const wipe = vi.fn(async () => ({ complete: true, failed: [] }));
    expect(await ensureFreshInstallWiped(createMemoryMarker(true), wipe)).toBe("known");
    expect(wipe).not.toHaveBeenCalled();
  });

  it("leaves the marker unwritten after an incomplete wipe, so the next launch retries", async () => {
    const marker = createMemoryMarker(false);
    await ensureFreshInstallWiped(marker, async () => ({ complete: false, failed: ["home"] }));
    expect(marker.present()).toBe(false);
  });
});
