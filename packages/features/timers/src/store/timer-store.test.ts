import { createMemoryAdapter, utf8ByteLength } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import type { Item, RoutineRun } from "../model/item";
import { MAX_ACTIVE_ITEMS } from "../model/reconcile";
import { MAX_NAME_LENGTH, MAX_SECONDS, MAX_STAGES, type Stage } from "../model/stage";
import {
  createTimerStore,
  DEFAULT_PREFS,
  MAX_SAVED_ROUTINES,
  routineFits,
  type SavedRoutine,
  TIMER_KEYS,
  VALUE_CEILING_BYTES,
} from "./timer-store";

const T0 = 1_000_000_000_000;
const timer = (id: string): Item => ({
  id,
  kind: "timer",
  name: `Timer ${id}`,
  clock: { status: "running", endAt: T0 + 60_000 },
  notificationId: null,
});

/** The largest stage and routine the rules allow, in a four-byte-per-character script. */
const worstStage: Stage = { name: { text: "🥐".repeat(MAX_NAME_LENGTH) }, seconds: MAX_SECONDS };
const worstStages = Array.from({ length: MAX_STAGES }, () => worstStage);

describe("the timers store (research R6)", () => {
  it("round-trips items in index order", async () => {
    const store = createTimerStore(createMemoryAdapter());
    await store.saveItem(timer("a"));
    await store.saveItem(timer("b"));
    expect((await store.items()).map((item) => item.id)).toEqual(["a", "b"]);
  });

  it("caps active items at 10 and saved routines at 20", async () => {
    const store = createTimerStore(createMemoryAdapter());
    for (let i = 0; i < MAX_ACTIVE_ITEMS; i++) {
      expect(await store.saveItem(timer(`t${i}`))).toEqual({ ok: true });
    }
    expect(await store.saveItem(timer("extra"))).toEqual({ ok: false, reason: "cap" });
    expect(await store.saveItem(timer("t3"))).toEqual({ ok: true }); // an update, not a new item
    for (let i = 0; i < MAX_SAVED_ROUTINES; i++) {
      await store.saveRoutine({ id: `r${i}`, name: "Bread", stages: [worstStage] });
    }
    expect(await store.saveRoutine({ id: "rx", name: "One more", stages: [worstStage] })).toEqual({
      ok: false,
      reason: "cap",
    });
  });

  it("fits the realistic worst case — 12 stages named in 40 Cyrillic characters — under the ceiling", () => {
    const cyrillic: Stage = { name: { text: "ж".repeat(MAX_NAME_LENGTH) }, seconds: MAX_SECONDS };
    const run: RoutineRun = {
      id: "z".repeat(24),
      kind: "routine",
      name: "ж".repeat(MAX_NAME_LENGTH),
      savedRoutineId: "y".repeat(24),
      stages: Array.from({ length: MAX_STAGES }, () => cyrillic),
      index: MAX_STAGES - 1,
      clock: { status: "running", endAt: 9_999_999_999_999 },
      notificationId: "x".repeat(40),
    };
    const index = JSON.stringify(Array.from({ length: MAX_SAVED_ROUTINES }, () => "z".repeat(24)));
    expect(utf8ByteLength(JSON.stringify(run))).toBeLessThanOrEqual(VALUE_CEILING_BYTES);
    expect(utf8ByteLength(index)).toBeLessThanOrEqual(VALUE_CEILING_BYTES);
    expect(VALUE_CEILING_BYTES).toBeLessThan(2048);
  });

  it("refuses a value over the ceiling instead of risking the platform's budget", async () => {
    const adapter = createMemoryAdapter();
    const store = createTimerStore(adapter);
    const saved: SavedRoutine = { id: "big", name: "Emoji", stages: worstStages };
    expect(utf8ByteLength(JSON.stringify(saved))).toBeGreaterThan(VALUE_CEILING_BYTES);
    expect(await store.saveRoutine(saved)).toEqual({ ok: false, reason: "size" });
    expect(adapter.snapshot()).toEqual({}); // nothing written, not even the index
  });

  it("tells the editor before saving whether a routine fits, as a run at its longest (19c)", () => {
    const cyrillic: Stage = { name: { text: "ж".repeat(MAX_NAME_LENGTH) }, seconds: MAX_SECONDS };
    expect(routineFits("ж".repeat(MAX_NAME_LENGTH), Array(MAX_STAGES).fill(cyrillic))).toBe(true);
    expect(routineFits("Emoji", worstStages)).toBe(false);
  });

  it("skips an index id with no value, and a corrupt value, without throwing", async () => {
    const adapter = createMemoryAdapter({
      [TIMER_KEYS.index]: JSON.stringify(["a", "missing", "bad"]),
      [TIMER_KEYS.item("a")]: JSON.stringify(timer("a")),
      [TIMER_KEYS.item("bad")]: "{not json",
    });
    expect((await createTimerStore(adapter).items()).map((item) => item.id)).toEqual(["a"]);
  });

  it("writes the index before the value, so no stored value is ever unreachable", async () => {
    const adapter = createMemoryAdapter();
    const writes: string[] = [];
    const store = createTimerStore({
      get: (key) => adapter.get(key),
      set: async (key, value) => {
        writes.push(key);
        await adapter.set(key, value);
      },
      delete: (key) => adapter.delete(key),
    });
    await store.saveItem(timer("a"));
    expect(writes).toEqual([TIMER_KEYS.index, TIMER_KEYS.item("a")]);
  });

  it("reads defaults for missing or corrupt prefs", async () => {
    const store = createTimerStore(createMemoryAdapter({ [TIMER_KEYS.prefs]: "[]" }));
    expect(await store.prefs()).toEqual(DEFAULT_PREFS);
  });

  it("wipes every key it owns (FR-021)", async () => {
    const adapter = createMemoryAdapter({ "nutrimero.home.units": '"metric"' });
    const store = createTimerStore(adapter);
    await store.saveItem(timer("a"));
    await store.saveRoutine({ id: "r", name: "Bread", stages: [worstStage] });
    await store.setPrefs({ ...DEFAULT_PREFS, permissionAsked: true });
    await store.wipeAll();
    expect(adapter.snapshot()).toEqual({ "nutrimero.home.units": '"metric"' });
    await store.wipeAll(); // idempotent
  });
});
