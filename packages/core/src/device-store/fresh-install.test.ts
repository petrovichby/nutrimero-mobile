import { describe, expect, it, vi } from "vitest";
import { createMemoryAdapter } from "./adapter";
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

describe("fresh-install-only keys (001 FR-027; coordinator seam ruling)", () => {
  it("are deleted beside the wipe sequence on a fresh install", async () => {
    const store = createMemoryAdapter({ "nutrimero.device.uiLocale": '"uk"' });
    const marker = createMemoryMarker(false);
    await ensureFreshInstallWiped(marker, async () => ({ complete: true, failed: [] }), {
      store,
      keys: ["nutrimero.device.uiLocale"],
    });
    expect(store.snapshot()).toEqual({});
    expect(marker.present()).toBe(true);
  });

  it("are left alone on a known install", async () => {
    const store = createMemoryAdapter({ "nutrimero.device.uiLocale": '"uk"' });
    await ensureFreshInstallWiped(
      createMemoryMarker(true),
      async () => ({ complete: true, failed: [] }),
      {
        store,
        keys: ["nutrimero.device.uiLocale"],
      },
    );
    expect(store.snapshot()).toEqual({ "nutrimero.device.uiLocale": '"uk"' });
  });

  it("leave the marker unwritten when a delete fails, so the next launch retries", async () => {
    const failing = {
      ...createMemoryAdapter(),
      delete: vi.fn(async () => Promise.reject(new Error("keychain"))),
    };
    const marker = createMemoryMarker(false);
    await ensureFreshInstallWiped(marker, async () => ({ complete: true, failed: [] }), {
      store: failing,
      keys: ["nutrimero.device.uiLocale"],
    });
    expect(marker.present()).toBe(false);
  });
});
