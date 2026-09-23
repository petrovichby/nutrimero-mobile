import { describe, expect, it } from "vitest";

describe("core's entry points", () => {
  it("the main entry loads under Node, so every package's tests can import it", async () => {
    const core = await import("./index");
    expect(typeof core.createSession).toBe("function");
    expect(typeof core.createMemoryAdapter).toBe("function");
  });

  it("the platform adapters are only in the native entry", async () => {
    const core = await import("./index");
    expect(Object.keys(core)).not.toContain("secureStoreAdapter");
    expect(Object.keys(core)).not.toContain("fileInstallMarker");
  });
});
