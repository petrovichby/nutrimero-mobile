import {
  createApiClient,
  createDevicePreferences,
  createMemoryAdapter,
  createMemoryMarker,
  createSession,
  registerDevicePreferences,
} from "@nutrimero/core";
import { createHomeStore, registerHomeWiper } from "@nutrimero/feature-home-data";
import { createTimerStore, registerTimersWiper, TIMER_KEYS } from "@nutrimero/feature-timers";
import { describe, expect, it, vi } from "vitest";

/**
 * 005 T022: boot.ts registers the timers wiper before `restore()` (ADR 0001 condition 3), and the
 * same composition makes a fresh install and Clear my data reach `home.timers`. boot.ts itself
 * loads native modules, so its composition is rebuilt here; its order is read from source by
 * scripts/home-boot-order.test.ts.
 */

const offline = async () => {
  throw new TypeError("no network in this test");
};

const TIMERS_DATA = {
  [TIMER_KEYS.index]: JSON.stringify(["a"]),
  [TIMER_KEYS.item("a")]: JSON.stringify({
    id: "a",
    kind: "timer",
    name: "Proof",
    clock: { status: "running", endAt: 2_000_000_000_000 },
    notificationId: "n1",
  }),
};

function compose(stored: Record<string, string>, markerPresent: boolean) {
  const adapter = createMemoryAdapter(stored);
  const session = createSession({
    client: createApiClient("https://api.test", { fetch: offline }),
    store: adapter,
    marker: createMemoryMarker(markerPresent),
  });
  const cancelAll = vi.fn(async () => undefined);
  registerHomeWiper(session, createHomeStore(adapter));
  registerTimersWiper(session, createTimerStore(adapter), cancelAll);
  registerDevicePreferences(session);
  return { adapter, session, cancelAll, preferences: createDevicePreferences(adapter) };
}

describe("Home Baker boot and 005's timers wiper", () => {
  it("clears timers on a fresh install and withdraws their notifications", async () => {
    const { adapter, session, cancelAll } = compose(TIMERS_DATA, false);
    await session.restore();
    expect(adapter.snapshot()).toEqual({});
    expect(cancelAll).toHaveBeenCalledOnce();
  });

  it("keeps timers on a known install", async () => {
    const { adapter, session, cancelAll } = compose(TIMERS_DATA, true);
    await session.restore();
    expect(adapter.snapshot()).toEqual(TIMERS_DATA);
    expect(cancelAll).not.toHaveBeenCalled();
  });

  it("Clear my data wipes timers and keeps the app language (001 FR-027)", async () => {
    const { adapter, session, cancelAll, preferences } = compose(TIMERS_DATA, true);
    await session.restore();
    await preferences.setUiLocale("de");
    const outcome = await session.clearDeviceData();
    expect(outcome).toEqual({ complete: true, failed: [] });
    expect(Object.keys(adapter.snapshot()).some((key) => key.includes(".timers."))).toBe(false);
    expect(await preferences.uiLocale()).toBe("de");
    expect(cancelAll).toHaveBeenCalledOnce();
  });
});
