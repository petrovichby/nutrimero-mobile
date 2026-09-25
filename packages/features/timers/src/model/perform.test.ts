import { createMemoryAdapter, createTranslator } from "@nutrimero/core";
import { describe, expect, it, vi } from "vitest";
import { createTimerStore } from "../store/timer-store";
import type { Item } from "./item";
import { performIntents, rescheduleAll, type SchedulerPort } from "./perform";
import { shouldAskInContext, showsRefusedNote } from "./permission";

const T0 = 1_000_000_000_000;
const t = createTranslator("en");
const timer = (id: string, notificationId: string | null = null): Item => ({
  id,
  kind: "timer",
  name: `Timer ${id}`,
  clock: { status: "running", endAt: T0 + 60_000 },
  notificationId,
});

function fakeScheduler() {
  let next = 0;
  const scheduler: SchedulerPort = {
    schedule: vi.fn(async () => `n${++next}`),
    cancel: vi.fn(async () => undefined),
  };
  return scheduler;
}

describe("performing intents (research R1)", () => {
  it("schedules, and writes the notification id back to the stored item", async () => {
    const store = createTimerStore(createMemoryAdapter());
    await store.saveItem(timer("a"));
    const scheduler = fakeScheduler();
    await performIntents([{ type: "schedule", itemId: "a" }], {
      store,
      scheduler,
      t,
      locale: "en",
      permitted: true,
    });
    expect(scheduler.schedule).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Timer a is done", at: T0 + 60_000 }),
    );
    expect((await store.items())[0]?.notificationId).toBe("n1");
  });

  it("without permission skips scheduling (the reconcile re-issues it later) but still cancels", async () => {
    const store = createTimerStore(createMemoryAdapter());
    await store.saveItem(timer("a"));
    const scheduler = fakeScheduler();
    await performIntents(
      [
        { type: "schedule", itemId: "a" },
        { type: "cancel", notificationId: "old" },
      ],
      { store, scheduler, t, locale: "en", permitted: false },
    );
    expect(scheduler.schedule).not.toHaveBeenCalled();
    expect(scheduler.cancel).toHaveBeenCalledWith("old");
  });

  it("re-schedules every running text on a language change (FR-015)", () => {
    expect(rescheduleAll([timer("a", "n1"), timer("b")], T0)).toEqual([
      { type: "cancel", notificationId: "n1" },
      { type: "schedule", itemId: "a" },
      { type: "schedule", itemId: "b" },
    ]);
    expect(rescheduleAll([timer("a", "n1")], T0 + 120_000)).toEqual([]);
  });
});

describe("permission in context (FR-016, FR-017)", () => {
  const prefs = {
    permissionAsked: false,
    lastPermission: "undetermined",
    androidBakeNoticeShown: false,
  } as const;

  it("asks once, only while undetermined", () => {
    expect(shouldAskInContext(prefs, "undetermined")).toBe(true);
    expect(shouldAskInContext({ ...prefs, permissionAsked: true }, "undetermined")).toBe(false);
    expect(shouldAskInContext(prefs, "denied")).toBe(false);
    expect(shouldAskInContext(prefs, "granted")).toBe(false);
  });

  it("shows the refused note only when refused", () => {
    expect(showsRefusedNote("denied")).toBe(true);
    expect(showsRefusedNote("granted")).toBe(false);
  });
});
