import { describe, expect, it } from "vitest";
import {
  chipItem,
  createTimer,
  derive,
  type Item,
  type RoutineRun,
  startRoutine,
  transition,
} from "./item";
import type { Stage } from "./stage";

const T0 = 1_000_000_000_000;
const MIN = 60_000;

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("expected a value");
  return value;
}

const sourdough: Stage[] = [
  { name: { key: "bulkFerment" }, seconds: 4 * 3600 },
  { name: { key: "shape" }, seconds: null },
  { name: { key: "coldProof" }, seconds: 12 * 3600 },
];

function routine(): RoutineRun {
  const outcome = must(
    startRoutine({ id: "r1", name: "Sourdough", savedRoutineId: null, stages: sourdough, now: T0 }),
  );
  const item = must(outcome.item);
  if (item.kind !== "routine") throw new Error("expected a routine");
  return { ...item, notificationId: "n1" };
}

describe("a timer's truth is its end time (FR-003, FR-004)", () => {
  it("starts running, with one schedule intent", () => {
    const outcome = createTimer({ id: "t1", name: "Final proof", seconds: 5400, now: T0 });
    expect(outcome.item).toMatchObject({ clock: { status: "running", endAt: T0 + 5400_000 } });
    expect(outcome.intents).toEqual([{ type: "schedule", itemId: "t1" }]);
  });

  it("derives time left from now, and done once the end time passes — nothing is stored for it", () => {
    const timer = must(createTimer({ id: "t1", name: "Proof", seconds: 90, now: T0 }).item);
    expect(derive(timer, T0 + 30_000)).toMatchObject({ status: "running", secondsLeft: 60 });
    expect(derive(timer, T0 + 89_001)).toMatchObject({ status: "running", secondsLeft: 1 });
    expect(derive(timer, T0 + 90_000)).toMatchObject({
      status: "done",
      secondsLeft: null,
      endsAt: T0 + 90_000,
    });
    // The same stored item at any later time: derivation only.
    expect(timer.clock).toEqual({ status: "running", endAt: T0 + 90_000, total: 90 });
  });

  it("pauses to the seconds left and resumes to a new end time, cancelling and re-scheduling", () => {
    const timer: Item = {
      ...must(createTimer({ id: "t1", name: "Proof", seconds: 600, now: T0 }).item),
      notificationId: "n1",
    };
    const paused = transition(timer, { type: "pause" }, T0 + 4 * MIN);
    expect(paused.item?.clock).toEqual({ status: "paused", remaining: 360, total: 600 });
    expect(paused.intents).toEqual([{ type: "cancel", notificationId: "n1" }]);
    const resumed = transition(must(paused.item), { type: "resume" }, T0 + 60 * MIN);
    expect(resumed.item?.clock).toEqual({ status: "running", endAt: T0 + 66 * MIN, total: 600 });
    expect(resumed.intents).toEqual([{ type: "schedule", itemId: "t1" }]);
  });

  it("adds time: extends a running timer, restarts a done one; always re-schedules", () => {
    const timer: Item = {
      ...must(createTimer({ id: "t1", name: "Oven", seconds: 60, now: T0 }).item),
      notificationId: "n1",
    };
    expect(transition(timer, { type: "addTime", seconds: 300 }, T0 + 10_000).item?.clock).toEqual({
      status: "running",
      endAt: T0 + 360_000,
      total: 360,
    });
    const late = transition(timer, { type: "addTime", seconds: 60 }, T0 + 10 * MIN);
    expect(late.item?.clock).toEqual({ status: "running", endAt: T0 + 11 * MIN, total: 60 });
    expect(late.intents).toEqual([
      { type: "cancel", notificationId: "n1" },
      { type: "schedule", itemId: "t1" },
    ]);
    expect(transition(timer, { type: "addTime", seconds: 1.5 }, T0).applied).toBe(false);
  });

  it("cancels at any time; dismisses only when done", () => {
    const timer: Item = {
      ...must(createTimer({ id: "t1", name: "Oven", seconds: 60, now: T0 }).item),
      notificationId: "n1",
    };
    expect(transition(timer, { type: "dismiss" }, T0 + 1000).applied).toBe(false);
    expect(transition(timer, { type: "dismiss" }, T0 + MIN)).toEqual({
      item: null,
      intents: [{ type: "cancel", notificationId: "n1" }],
      applied: true,
    });
    expect(transition(timer, { type: "cancel" }, T0).item).toBeNull();
  });
});

describe("routines: manual chaining, one notification at a time (gate 1 Q1, FR-008, FR-011)", () => {
  it("starts the first timed stage and schedules only it", () => {
    const outcome = must(
      startRoutine({
        id: "r1",
        name: "Sourdough",
        savedRoutineId: null,
        stages: sourdough,
        now: T0,
      }),
    );
    expect(outcome.intents).toEqual([{ type: "schedule", itemId: "r1" }]);
    expect(derive(must(outcome.item), T0).stage).toMatchObject({ position: 1, total: 3 });
  });

  it("a done stage waits for 'Start next stage' — time passing never advances it", () => {
    const run = routine();
    const later = T0 + 5 * 3600_000;
    expect(derive(run, later)).toMatchObject({ status: "done", stage: { position: 1 } });
    expect(transition(run, { type: "startNextStage" }, T0 + 60_000).applied).toBe(false);
    const next = transition(run, { type: "startNextStage" }, later);
    // The next stage is hands-on: it waits, and nothing is scheduled for it.
    expect(next.item).toMatchObject({
      index: 1,
      clock: { status: "waiting" },
      notificationId: null,
    });
    expect(next.intents).toEqual([{ type: "cancel", notificationId: "n1" }]);
  });

  it("a hands-on stage is finished by the baker, then the next timed stage schedules", () => {
    const run = routine();
    const shaping = must(transition(run, { type: "startNextStage" }, T0 + 5 * 3600_000).item);
    const cold = transition(shaping, { type: "doneHandsOn" }, T0 + 6 * 3600_000);
    expect(cold.item).toMatchObject({
      index: 2,
      clock: { status: "running", endAt: T0 + 18 * 3600_000 },
    });
    expect(cold.intents).toEqual([{ type: "schedule", itemId: "r1" }]);
  });

  it("never emits more than one schedule intent for a routine", () => {
    const run = routine();
    for (const action of [
      { type: "pause" },
      { type: "resume" },
      { type: "addTime", seconds: 600 },
      { type: "startNextStage" },
    ] as const) {
      const outcome = transition(run, action, T0 + 5 * 3600_000);
      expect(
        outcome.intents.filter((intent) => intent.type === "schedule").length,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("the last timed stage is dismissed; a last hands-on stage ends the routine", () => {
    const end: RoutineRun = { ...routine(), index: 2, clock: { status: "running", endAt: T0 } };
    expect(transition(end, { type: "startNextStage" }, T0 + 1).applied).toBe(false);
    expect(transition(end, { type: "dismiss" }, T0 + 1).item).toBeNull();
    const handsOnLast: RoutineRun = {
      ...routine(),
      stages: [{ name: { key: "cool" }, seconds: null }],
      index: 0,
      clock: { status: "waiting" },
      notificationId: null,
    };
    expect(transition(handsOnLast, { type: "doneHandsOn" }, T0).item).toBeNull();
  });
});

describe("done early (spec 005 amendment 2026-09-25)", () => {
  it("ends a running stage now, withdraws its notification, then offers the next stage", () => {
    const run = routine();
    const early = transition(run, { type: "finishEarly" }, T0 + 60 * MIN);
    expect(early.item?.clock).toEqual({ status: "running", endAt: T0 + 60 * MIN });
    expect(early.intents).toEqual([{ type: "cancel", notificationId: "n1" }]);
    expect(derive(must(early.item), T0 + 60 * MIN).status).toBe("done");
    expect(transition(must(early.item), { type: "startNextStage" }, T0 + 60 * MIN).applied).toBe(
      true,
    );
  });

  it("ends a paused clock too, and does nothing to a done or hands-on one", () => {
    const paused: Item = {
      ...routine(),
      clock: { status: "paused", remaining: 600 },
      notificationId: null,
    };
    expect(transition(paused, { type: "finishEarly" }, T0).item?.clock).toEqual({
      status: "running",
      endAt: T0,
    });
    const done = routine();
    expect(transition(done, { type: "finishEarly" }, T0 + 5 * 3600_000).applied).toBe(false);
    const waiting: Item = { ...routine(), index: 1, clock: { status: "waiting" } };
    expect(transition(waiting, { type: "finishEarly" }, T0).applied).toBe(false);
  });
});

describe("the chip names the most urgent item (FR-018)", () => {
  it("done first, then the soonest to end", () => {
    const a = must(createTimer({ id: "a", name: "Oven", seconds: 600, now: T0 }).item);
    const b = must(createTimer({ id: "b", name: "Proof", seconds: 60, now: T0 }).item);
    expect(chipItem([a, b], T0)?.id).toBe("b");
    expect(chipItem([a, b], T0 + 2 * MIN)).toMatchObject({ id: "b", status: "done" });
    expect(chipItem([], T0)).toBeNull();
  });
});
