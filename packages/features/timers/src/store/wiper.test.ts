import {
  createApiClient,
  createMemoryAdapter,
  createMemoryMarker,
  createSession,
} from "@nutrimero/core";
import { describe, expect, it, vi } from "vitest";
import { createTimerStore, TIMER_KEYS } from "./timer-store";
import { registerTimersWiper, TIMERS_WIPER_NAME } from "./wiper";

const offline = async () => {
  throw new TypeError("no network in this test");
};

describe("the timers wiper (FR-021)", () => {
  it("registers as home.timers, deletes every timers key and cancels every notification", async () => {
    const adapter = createMemoryAdapter();
    const store = createTimerStore(adapter);
    await store.saveItem({
      id: "a",
      kind: "timer",
      name: "Proof",
      clock: { status: "running", endAt: Date.now() + 60_000 },
      notificationId: "n1",
    });
    const registerWiper = vi.fn();
    const cancelAll = vi.fn(async () => undefined);
    registerTimersWiper({ registerWiper }, store, cancelAll);
    expect(registerWiper).toHaveBeenCalledWith(TIMERS_WIPER_NAME, expect.any(Function));
    await registerWiper.mock.calls[0]?.[1]();
    expect(adapter.snapshot()).toEqual({});
    expect(cancelAll).toHaveBeenCalledOnce();
  });

  it("the reinstall-orphan clear reaches it when registered before restore() (ADR 0001 condition 3)", async () => {
    const adapter = createMemoryAdapter({
      [TIMER_KEYS.index]: JSON.stringify(["a"]),
      [TIMER_KEYS.item("a")]: "{}",
      [TIMER_KEYS.prefs]: JSON.stringify({ permissionAsked: true }),
    });
    const session = createSession({
      client: createApiClient("https://api.test", { fetch: offline }),
      store: adapter,
      marker: createMemoryMarker(false), // a fresh install: orphaned Keychain values
    });
    const cancelAll = vi.fn(async () => undefined);
    registerTimersWiper(session, createTimerStore(adapter), cancelAll);
    await session.restore();
    expect(adapter.snapshot()).toEqual({});
    expect(cancelAll).toHaveBeenCalledOnce();
  });
});
