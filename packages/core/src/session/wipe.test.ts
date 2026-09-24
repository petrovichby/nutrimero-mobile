import { describe, expect, it } from "vitest";
import { createMemoryAdapter } from "../device-store/adapter";
import { SESSION_KEYS, SESSION_OWN_KEYS } from "./keys";
import { CORE_WIPER_NAME, createWipeSequence } from "./wipe";

function seeded() {
  return createMemoryAdapter({
    [SESSION_KEYS.accessToken]: "a",
    [SESSION_KEYS.refreshToken]: "r",
    [SESSION_KEYS.userId]: "u",
    [SESSION_KEYS.activeCompanyId]: "c",
  });
}

describe("the wipe sequence (002 plan R10)", () => {
  it("clears core's own keys first, then each wiper in registration order", async () => {
    const store = seeded();
    const order: string[] = [];
    const wipe = createWipeSequence(
      store,
      SESSION_OWN_KEYS,
      SESSION_KEYS.pendingWipe,
      SESSION_KEYS.pendingDataWipe,
    );
    wipe.register("pro.savedLabels", async () => {
      expect(await store.get(SESSION_KEYS.accessToken)).toBeNull();
      order.push("pro.savedLabels");
    });
    wipe.register("home.deviceData", async () => {
      order.push("home.deviceData");
    });

    expect(await wipe.run()).toEqual({ complete: true, failed: [] });
    expect(order).toEqual(["pro.savedLabels", "home.deviceData"]);
    expect(store.snapshot()).toEqual({});
  });

  it("isolates a failing wiper: the rest still run, and the wipe stays pending", async () => {
    const store = seeded();
    const ran: string[] = [];
    const wipe = createWipeSequence(
      store,
      SESSION_OWN_KEYS,
      SESSION_KEYS.pendingWipe,
      SESSION_KEYS.pendingDataWipe,
    );
    wipe.register("first", async () => {
      throw new Error("disk full");
    });
    wipe.register("second", async () => {
      ran.push("second");
    });

    expect(await wipe.run()).toEqual({ complete: false, failed: ["first"] });
    expect(ran).toEqual(["second"]);
    expect(await wipe.isPending()).toBe(true);
    expect(await store.get(SESSION_KEYS.userId)).toBeNull();
  });

  it("clears the pending mark once a later run completes", async () => {
    const store = seeded();
    let fail = true;
    const wipe = createWipeSequence(
      store,
      SESSION_OWN_KEYS,
      SESSION_KEYS.pendingWipe,
      SESSION_KEYS.pendingDataWipe,
    );
    wipe.register("flaky", async () => {
      if (fail) throw new Error("once");
    });
    await wipe.run();
    fail = false;
    expect((await wipe.run()).complete).toBe(true);
    expect(await wipe.isPending()).toBe(false);
  });

  it("refuses duplicate or reserved wiper names, and unregisters cleanly", async () => {
    const wipe = createWipeSequence(
      createMemoryAdapter(),
      SESSION_OWN_KEYS,
      SESSION_KEYS.pendingWipe,
      SESSION_KEYS.pendingDataWipe,
    );
    const unregister = wipe.register("x", async () => undefined);
    expect(() => wipe.register("x", async () => undefined)).toThrow();
    expect(() => wipe.register(CORE_WIPER_NAME, async () => undefined)).toThrow();
    unregister();
    expect(() => wipe.register("x", async () => undefined)).not.toThrow();
  });

  it("a data-only run clears every data wiper in order and keeps core's own keys", async () => {
    const store = seeded();
    const order: string[] = [];
    const wipe = createWipeSequence(
      store,
      SESSION_OWN_KEYS,
      SESSION_KEYS.pendingWipe,
      SESSION_KEYS.pendingDataWipe,
    );
    wipe.register("home.deviceData", async () => {
      expect(await wipe.isDataPending()).toBe(true);
      order.push("home.deviceData");
    });
    wipe.register("home.timers", async () => {
      order.push("home.timers");
    });

    expect(await wipe.runData()).toEqual({ complete: true, failed: [] });
    expect(order).toEqual(["home.deviceData", "home.timers"]);
    expect(await wipe.isDataPending()).toBe(false);
    expect(await store.get(SESSION_KEYS.userId)).toBe("u");
    expect(await store.get(SESSION_KEYS.accessToken)).toBe("a");
  });
});
