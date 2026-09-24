import { createTranslator } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { notificationContent, routeOf, stageLabel } from "./content";
import type { Item, RoutineRun } from "./item";

const en = createTranslator("en");
const T0 = 1_000_000_000_000;

const run: RoutineRun = {
  id: "r1",
  kind: "routine",
  name: "Sourdough",
  savedRoutineId: null,
  stages: [
    { name: { key: "bulkFerment" }, seconds: 14_400 },
    { name: { key: "shape" }, seconds: null },
    { name: { text: "Levain check" }, seconds: 600 },
  ],
  index: 0,
  clock: { status: "running", endAt: T0 },
  notificationId: null,
};

describe("notification content (FR-010, gate 1 Q1)", () => {
  it("names the stage that ended and the next one", () => {
    expect(notificationContent(run, en)).toEqual({
      title: "Bulk ferment done: Shape next",
      body: "Tap when you're ready to start the next stage.",
      data: { kind: "stage", itemId: "r1" },
      at: T0,
    });
  });

  it("says when it was the last stage, and uses the baker's own stage names", () => {
    const last: RoutineRun = { ...run, index: 2 };
    expect(notificationContent(last, en)?.title).toBe("Levain check done: that was the last stage");
  });

  it("names a timer, and notifies nothing for a paused or hands-on item", () => {
    const timer: Item = {
      id: "t1",
      kind: "timer",
      name: "Final proof",
      clock: { status: "running", endAt: T0 },
      notificationId: null,
    };
    expect(notificationContent(timer, en)?.title).toBe("Final proof is done");
    expect(
      notificationContent({ ...timer, clock: { status: "paused", remaining: 5 } }, en),
    ).toBeNull();
    expect(notificationContent({ ...run, index: 1, clock: { status: "waiting" } }, en)).toBeNull();
  });

  it("localizes picked stage names", () => {
    expect(stageLabel({ name: { key: "coldProof" }, seconds: 1 }, createTranslator("de"))).toBe(
      "Kalte Gare",
    );
  });

  it("routes only our own notification data", () => {
    expect(routeOf({ kind: "stage", itemId: "r1" })).toEqual({ kind: "stage", itemId: "r1" });
    expect(routeOf({ kind: "promo", itemId: "x" })).toBeNull();
    expect(routeOf(null)).toBeNull();
  });
});
