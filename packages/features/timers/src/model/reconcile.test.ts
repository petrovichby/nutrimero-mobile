import { describe, expect, it } from "vitest";
import type { Item } from "./item";
import { MAX_ACTIVE_ITEMS, reconcile } from "./reconcile";

const T0 = 1_000_000_000_000;
const timer = (id: string, endAt: number, notificationId: string | null): Item => ({
  id,
  kind: "timer",
  name: id,
  clock: { status: "running", endAt },
  notificationId,
});

describe("launch reconcile (research R1, FR-004, FR-014)", () => {
  it("re-schedules a running item the platform dropped (restart, force-stop, later grant)", () => {
    expect(reconcile([timer("a", T0 + 60_000, "gone")], [], T0)).toEqual([
      { type: "schedule", itemId: "a" },
    ]);
    expect(reconcile([timer("a", T0 + 60_000, null)], [], T0)).toEqual([
      { type: "schedule", itemId: "a" },
    ]);
  });

  it("leaves a healthy item alone", () => {
    expect(
      reconcile([timer("a", T0 + 60_000, "n1")], [{ notificationId: "n1", itemId: "a" }], T0),
    ).toEqual([]);
  });

  it("cancels orphans and anything pending for an item that is no longer running", () => {
    const paused: Item = {
      id: "p",
      kind: "timer",
      name: "p",
      clock: { status: "paused", remaining: 30 },
      notificationId: "n2",
    };
    expect(
      reconcile(
        [paused],
        [
          { notificationId: "n2", itemId: "p" },
          { notificationId: "stray", itemId: null },
        ],
        T0,
      ),
    ).toEqual([
      { type: "cancel", notificationId: "n2" },
      { type: "cancel", notificationId: "stray" },
    ]);
  });

  it("never asks for a done item's notification again", () => {
    expect(reconcile([timer("a", T0 - 1, null)], [], T0)).toEqual([]);
  });

  it("never schedules more than the active-item cap (C4: iOS keeps 64)", () => {
    const items = Array.from({ length: MAX_ACTIVE_ITEMS }, (_, i) =>
      timer(`t${i}`, T0 + 60_000, null),
    );
    const schedules = reconcile(items, [], T0).filter((intent) => intent.type === "schedule");
    expect(schedules).toHaveLength(MAX_ACTIVE_ITEMS);
    expect(MAX_ACTIVE_ITEMS).toBeLessThan(64);
  });
});
