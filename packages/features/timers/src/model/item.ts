import type { Stage } from "./stage";

/**
 * Timers and routine runs (005 data-model), and the only two things that act on them:
 * `transition` (a user action) and `derive` (what to show at a moment).
 *
 * The truth of a running timer is its **end time** (FR-003). Nothing is stored because time
 * passed: a running timer whose end time is behind "now" is *derived* as done, so a killed app,
 * a dropped refresh or a restart can never drift it. Scheduling is described as intents; the
 * native adapter performs them and writes the notification id back.
 */
/**
 * `total` is the clock's full length in seconds, kept only so a screen can draw how far along it
 * is (18-timer's bar). It is display data, never truth: the end time decides everything.
 */
export type Clock =
  | { readonly status: "running"; readonly endAt: number; readonly total?: number }
  | { readonly status: "paused"; readonly remaining: number; readonly total?: number };

export interface Timer {
  readonly id: string;
  readonly kind: "timer";
  readonly name: string;
  readonly clock: Clock;
  /** The pending notification for this timer, once the adapter has scheduled it. */
  readonly notificationId: string | null;
}

export interface RoutineRun {
  readonly id: string;
  readonly kind: "routine";
  readonly name: string;
  readonly savedRoutineId: string | null;
  /** A copy of the stages, so editing a saved routine never changes a run. */
  readonly stages: readonly Stage[];
  readonly index: number;
  /** The current stage's clock; `waiting` for a hands-on stage. */
  readonly clock: Clock | { readonly status: "waiting" };
  readonly notificationId: string | null;
}

export type Item = Timer | RoutineRun;

export type Intent =
  | { readonly type: "schedule"; readonly itemId: string }
  | { readonly type: "cancel"; readonly notificationId: string };

export type Action =
  | { readonly type: "pause" }
  | { readonly type: "resume" }
  | { readonly type: "addTime"; readonly seconds: number }
  | { readonly type: "cancel" }
  /** "Done early" (spec 005 amendment, 2026-09-25): the running clock ends now. */
  | { readonly type: "finishEarly" }
  | { readonly type: "dismiss" }
  /** Routines: after a timed stage is done (gate 1, Q1: manual). */
  | { readonly type: "startNextStage" }
  /** Routines: a hands-on stage is finished. */
  | { readonly type: "doneHandsOn" };

export interface Outcome {
  /** The item after the action; null when it is removed. */
  readonly item: Item | null;
  readonly intents: readonly Intent[];
  /** False when the action does not apply to the item's current state (nothing changes). */
  readonly applied: boolean;
}

const unchanged = (item: Item): Outcome => ({ item, intents: [], applied: false });

function cancelPending(item: Item): Intent[] {
  return item.notificationId === null
    ? []
    : [{ type: "cancel", notificationId: item.notificationId }];
}

function isDone(clock: Item["clock"], now: number): boolean {
  return clock.status === "running" && clock.endAt <= now;
}

function secondsLeft(endAt: number, now: number): number {
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

function clockFor(stage: Stage, now: number): RoutineRun["clock"] {
  return stage.seconds === null
    ? { status: "waiting" }
    : { status: "running", endAt: now + stage.seconds * 1000, total: stage.seconds };
}

export function createTimer(input: {
  id: string;
  name: string;
  seconds: number;
  now: number;
}): Outcome {
  const item: Timer = {
    id: input.id,
    kind: "timer",
    name: input.name,
    clock: { status: "running", endAt: input.now + input.seconds * 1000, total: input.seconds },
    notificationId: null,
  };
  return { item, intents: [{ type: "schedule", itemId: item.id }], applied: true };
}

export function startRoutine(input: {
  id: string;
  name: string;
  savedRoutineId: string | null;
  stages: readonly Stage[];
  now: number;
}): Outcome | null {
  const first = input.stages[0];
  if (first === undefined) return null;
  const item: RoutineRun = {
    id: input.id,
    kind: "routine",
    name: input.name,
    savedRoutineId: input.savedRoutineId,
    stages: input.stages,
    index: 0,
    clock: clockFor(first, input.now),
    notificationId: null,
  };
  const intents: Intent[] =
    item.clock.status === "running" ? [{ type: "schedule", itemId: item.id }] : [];
  return { item, intents, applied: true };
}

function totalOf(clock: Clock): { total?: number } {
  return clock.total === undefined ? {} : { total: clock.total };
}

function grown(clock: Clock, seconds: number): { total?: number } {
  return clock.total === undefined ? {} : { total: clock.total + seconds };
}

function withClock(item: Item, clock: Clock): Item {
  return item.kind === "timer"
    ? { ...item, clock, notificationId: null }
    : { ...item, clock, notificationId: null };
}

export function transition(item: Item, action: Action, now: number): Outcome {
  const { clock } = item;
  const done = isDone(clock, now);

  switch (action.type) {
    case "pause": {
      if (clock.status !== "running" || done) return unchanged(item);
      return {
        item: withClock(item, {
          status: "paused",
          remaining: secondsLeft(clock.endAt, now),
          ...totalOf(clock),
        }),
        intents: cancelPending(item),
        applied: true,
      };
    }
    case "resume": {
      if (clock.status !== "paused") return unchanged(item);
      const next = withClock(item, {
        status: "running",
        endAt: now + clock.remaining * 1000,
        ...totalOf(clock),
      });
      return { item: next, intents: [{ type: "schedule", itemId: item.id }], applied: true };
    }
    case "addTime": {
      if (!Number.isInteger(action.seconds) || action.seconds <= 0) return unchanged(item);
      if (clock.status === "paused") {
        return {
          item: withClock(item, {
            status: "paused",
            remaining: clock.remaining + action.seconds,
            ...grown(clock, action.seconds),
          }),
          intents: [],
          applied: true,
        };
      }
      if (clock.status !== "running") return unchanged(item);
      // A done timer restarts from now; a running one extends its end time (FR-011: re-schedule).
      const endAt = (done ? now : clock.endAt) + action.seconds * 1000;
      return {
        item: withClock(
          item,
          done
            ? { status: "running", endAt, total: action.seconds }
            : { status: "running", endAt, ...grown(clock, action.seconds) },
        ),
        intents: [...cancelPending(item), { type: "schedule", itemId: item.id }],
        applied: true,
      };
    }
    case "cancel":
      return { item: null, intents: cancelPending(item), applied: true };
    case "finishEarly": {
      // The end time becomes now and the pending notification is withdrawn; the stage then reads
      // done and offers "Start next stage" (a timer offers Dismiss), exactly as if it had ended.
      if (clock.status === "paused") {
        return {
          item: withClock(item, { status: "running", endAt: now }),
          intents: cancelPending(item),
          applied: true,
        };
      }
      if (clock.status !== "running" || done) return unchanged(item);
      return {
        item: withClock(item, { status: "running", endAt: now }),
        intents: cancelPending(item),
        applied: true,
      };
    }
    case "dismiss": {
      if (!done) return unchanged(item);
      if (item.kind === "routine" && item.index < item.stages.length - 1) return unchanged(item);
      return { item: null, intents: cancelPending(item), applied: true };
    }
    case "startNextStage":
    case "doneHandsOn": {
      if (item.kind !== "routine") return unchanged(item);
      const ready = action.type === "startNextStage" ? done : item.clock.status === "waiting";
      const nextStage = item.stages[item.index + 1];
      if (!ready) return unchanged(item);
      if (nextStage === undefined) {
        // The last stage: a hands-on finish ends the routine; a timed one is dismissed instead.
        return action.type === "doneHandsOn"
          ? { item: null, intents: cancelPending(item), applied: true }
          : unchanged(item);
      }
      const next: RoutineRun = {
        ...item,
        index: item.index + 1,
        clock: clockFor(nextStage, now),
        notificationId: null,
      };
      const intents: Intent[] = [...cancelPending(item)];
      if (next.clock.status === "running") intents.push({ type: "schedule", itemId: item.id });
      return { item: next, intents, applied: true };
    }
  }
}

export type Status = "running" | "paused" | "done" | "waiting";

export interface View {
  readonly id: string;
  readonly kind: Item["kind"];
  readonly name: string;
  readonly status: Status;
  /** Running or paused: whole seconds left. */
  readonly secondsLeft: number | null;
  /** Running: when it ends. Done: when it ended. */
  readonly endsAt: number | null;
  /** Routines only. */
  readonly stage: {
    readonly position: number;
    readonly total: number;
    readonly current: Stage;
    readonly next: Stage | null;
  } | null;
}

/** What to show at `now` — the only place time passing is read (research R8). */
export function derive(item: Item, now: number): View {
  const { clock } = item;
  const status: Status =
    clock.status === "running" ? (clock.endAt <= now ? "done" : "running") : clock.status;
  const current = item.kind === "routine" ? item.stages[item.index] : undefined;
  return {
    id: item.id,
    kind: item.kind,
    name: item.name,
    status,
    secondsLeft:
      clock.status === "running"
        ? status === "done"
          ? null
          : secondsLeft(clock.endAt, now)
        : clock.status === "paused"
          ? clock.remaining
          : null,
    endsAt: clock.status === "running" ? clock.endAt : null,
    stage:
      item.kind === "routine" && current !== undefined
        ? {
            position: item.index + 1,
            total: item.stages.length,
            current,
            next: item.stages[item.index + 1] ?? null,
          }
        : null,
  };
}

/**
 * The chip's item (FR-018): a done item first (the earliest to have ended), else the running
 * item ending soonest; paused and hands-on items only when nothing else is there.
 */
export function chipItem(items: readonly Item[], now: number): View | null {
  const views = items.map((item) => derive(item, now));
  const rank = (view: View) => (view.status === "done" ? 0 : view.status === "running" ? 1 : 2);
  const sorted = [...views].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (a.endsAt ?? Number.POSITIVE_INFINITY) - (b.endsAt ?? Number.POSITIVE_INFINITY),
  );
  return sorted[0] ?? null;
}
