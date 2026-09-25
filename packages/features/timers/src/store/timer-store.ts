import { type DeviceStoreAdapter, utf8ByteLength } from "@nutrimero/core";
import type { Clock, Item, RoutineRun, Timer } from "../model/item";
import { MAX_ACTIVE_ITEMS } from "../model/reconcile";
import { MAX_STAGES, parseStage, type Stage, validName } from "../model/stage";

/**
 * 005's device-only data (research R6) under `nutrimero.home.timers.*`, in its own sub-namespace so
 * Home lane 1's `home-data` keys are never touched. The secure store cannot list its keys, so an
 * **index** lists every id: ids are added to the index *before* their value is written and removed
 * *after* it is deleted — every stored key is always reachable by the wiper (FR-021). A reader
 * skips an index id whose value is missing or corrupt. Reads never throw on stored data.
 */
export const TIMER_KEYS = {
  index: "nutrimero.home.timers.index",
  item: (id: string) => `nutrimero.home.timers.item.${id}`,
  saved: "nutrimero.home.timers.saved",
  routine: (id: string) => `nutrimero.home.timers.routine.${id}`,
  prefs: "nutrimero.home.timers.prefs",
} as const;

export const MAX_SAVED_ROUTINES = 20;
/**
 * Every stored value stays under ADR 0001 condition 5's 2,048-byte budget. Names are capped at 40
 * characters, but a character can take up to four bytes: a routine of twelve stages named in a
 * four-byte script would not fit. So a value over this ceiling is **refused at save time**
 * (`reason: "size"`) rather than risk the platform rejecting it. Twelve stages with 40-character
 * Cyrillic names (two bytes each) fit.
 */
export const VALUE_CEILING_BYTES = 1900;

/**
 * Whether a routine of these stages can be saved **and** run (19c): the larger of the two values
 * is its run, which also carries ids, a clock and a notification id, so it is measured at their
 * longest. The editor refuses at the save action rather than after a write fails.
 */
export function routineFits(name: string, stages: readonly Stage[]): boolean {
  const longId = "z".repeat(24);
  const run: RoutineRun = {
    id: longId,
    kind: "routine",
    name,
    savedRoutineId: longId,
    stages,
    index: MAX_STAGES - 1,
    clock: { status: "running", endAt: 9_999_999_999_999, total: 172_800 },
    notificationId: "z".repeat(40),
  };
  return utf8ByteLength(JSON.stringify(run)) <= VALUE_CEILING_BYTES;
}

export interface SavedRoutine {
  readonly id: string;
  readonly name: string;
  readonly stages: readonly Stage[];
}

export type Permission = "granted" | "denied" | "undetermined";

export interface Prefs {
  /** FR-016: the in-context reason and prompt are shown once, ever. */
  readonly permissionAsked: boolean;
  readonly lastPermission: Permission;
  /** FR-013a: the Android bake-stage notice is shown once per install. */
  readonly androidBakeNoticeShown: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  permissionAsked: false,
  lastPermission: "undetermined",
  androidBakeNoticeShown: false,
};

export type SaveResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: "cap" | "size" };

export interface TimerStore {
  items(): Promise<Item[]>;
  saveItem(item: Item): Promise<SaveResult>;
  removeItem(id: string): Promise<void>;
  savedRoutines(): Promise<SavedRoutine[]>;
  saveRoutine(routine: SavedRoutine): Promise<SaveResult>;
  removeRoutine(id: string): Promise<void>;
  prefs(): Promise<Prefs>;
  setPrefs(prefs: Prefs): Promise<void>;
  /** Every stored key gone (FR-021). Idempotent. */
  wipeAll(): Promise<void>;
}

const ID = /^[a-z0-9]{1,24}$/;

function parse(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function field(value: unknown, name: string): unknown {
  return typeof value === "object" && value !== null ? Reflect.get(value, name) : undefined;
}

function ids(value: unknown): string[] {
  const given = Array.isArray(value) ? value : [];
  const out: string[] = [];
  for (const id of given) {
    if (typeof id === "string" && ID.test(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

function parseClock(value: unknown, allowWaiting: boolean): Clock | { status: "waiting" } | null {
  const status = field(value, "status");
  const rawTotal = field(value, "total");
  const total =
    typeof rawTotal === "number" && Number.isInteger(rawTotal) && rawTotal > 0
      ? { total: rawTotal }
      : {};
  if (status === "running") {
    const endAt = field(value, "endAt");
    return typeof endAt === "number" && Number.isFinite(endAt) ? { status, endAt, ...total } : null;
  }
  if (status === "paused") {
    const remaining = field(value, "remaining");
    return typeof remaining === "number" && Number.isInteger(remaining) && remaining >= 0
      ? { status, remaining, ...total }
      : null;
  }
  return allowWaiting && status === "waiting" ? { status } : null;
}

function parseStages(value: unknown): Stage[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_STAGES) return null;
  const stages: Stage[] = [];
  for (const raw of value) {
    const stage = parseStage(raw);
    if (stage === null) return null;
    stages.push(stage);
  }
  return stages;
}

function notificationIdOf(value: unknown): string | null {
  const id = field(value, "notificationId");
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** An item from stored JSON, or null when it is not one (it is then skipped). */
export function parseItem(value: unknown): Item | null {
  const id = field(value, "id");
  const name = validName(field(value, "name"));
  if (typeof id !== "string" || !ID.test(id) || name === null) return null;
  const kind = field(value, "kind");
  if (kind === "timer") {
    const clock = parseClock(field(value, "clock"), false);
    if (clock === null || clock.status === "waiting") return null;
    const timer: Timer = { id, kind, name, clock, notificationId: notificationIdOf(value) };
    return timer;
  }
  if (kind === "routine") {
    const stages = parseStages(field(value, "stages"));
    const index = field(value, "index");
    const clock = parseClock(field(value, "clock"), true);
    const saved = field(value, "savedRoutineId");
    if (
      stages === null ||
      clock === null ||
      typeof index !== "number" ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= stages.length
    ) {
      return null;
    }
    const run: RoutineRun = {
      id,
      kind,
      name,
      savedRoutineId: typeof saved === "string" && ID.test(saved) ? saved : null,
      stages,
      index,
      clock,
      notificationId: notificationIdOf(value),
    };
    return run;
  }
  return null;
}

export function parseSavedRoutine(value: unknown): SavedRoutine | null {
  const id = field(value, "id");
  const name = validName(field(value, "name"));
  const stages = parseStages(field(value, "stages"));
  if (typeof id !== "string" || !ID.test(id) || name === null || stages === null) return null;
  return { id, name, stages };
}

function parsePrefs(value: unknown): Prefs {
  const last = field(value, "lastPermission");
  return {
    permissionAsked: field(value, "permissionAsked") === true,
    lastPermission:
      last === "granted" || last === "denied" || last === "undetermined" ? last : "undetermined",
    androidBakeNoticeShown: field(value, "androidBakeNoticeShown") === true,
  };
}

export function createTimerStore(adapter: DeviceStoreAdapter): TimerStore {
  async function readIds(key: string): Promise<string[]> {
    return ids(parse(await adapter.get(key)));
  }

  async function addId(key: string, id: string, cap: number): Promise<SaveResult> {
    const current = await readIds(key);
    if (current.includes(id)) return { ok: true };
    if (current.length >= cap) return { ok: false, reason: "cap" };
    await adapter.set(key, JSON.stringify([...current, id]));
    return { ok: true };
  }

  async function removeId(key: string, id: string): Promise<void> {
    const current = await readIds(key);
    if (current.includes(id)) {
      await adapter.set(key, JSON.stringify(current.filter((entry) => entry !== id)));
    }
  }

  async function readAll<T>(
    indexKey: string,
    valueKey: (id: string) => string,
    parseValue: (value: unknown) => T | null,
  ): Promise<T[]> {
    const out: T[] = [];
    for (const id of await readIds(indexKey)) {
      const value = parseValue(parse(await adapter.get(valueKey(id))));
      if (value !== null) out.push(value);
    }
    return out;
  }

  return {
    items: () => readAll(TIMER_KEYS.index, TIMER_KEYS.item, parseItem),

    async saveItem(item) {
      const json = JSON.stringify(item);
      if (utf8ByteLength(json) > VALUE_CEILING_BYTES) return { ok: false, reason: "size" };
      const added = await addId(TIMER_KEYS.index, item.id, MAX_ACTIVE_ITEMS);
      if (!added.ok) return added;
      await adapter.set(TIMER_KEYS.item(item.id), json);
      return { ok: true };
    },

    async removeItem(id) {
      await adapter.delete(TIMER_KEYS.item(id));
      await removeId(TIMER_KEYS.index, id);
    },

    savedRoutines: () => readAll(TIMER_KEYS.saved, TIMER_KEYS.routine, parseSavedRoutine),

    async saveRoutine(routine) {
      const json = JSON.stringify(routine);
      if (utf8ByteLength(json) > VALUE_CEILING_BYTES) return { ok: false, reason: "size" };
      const added = await addId(TIMER_KEYS.saved, routine.id, MAX_SAVED_ROUTINES);
      if (!added.ok) return added;
      await adapter.set(TIMER_KEYS.routine(routine.id), json);
      return { ok: true };
    },

    async removeRoutine(id) {
      await adapter.delete(TIMER_KEYS.routine(id));
      await removeId(TIMER_KEYS.saved, id);
    },

    async prefs() {
      return parsePrefs(parse(await adapter.get(TIMER_KEYS.prefs)));
    },

    async setPrefs(prefs) {
      await adapter.set(TIMER_KEYS.prefs, JSON.stringify(prefs));
    },

    async wipeAll() {
      for (const id of await readIds(TIMER_KEYS.index)) {
        await adapter.delete(TIMER_KEYS.item(id));
      }
      for (const id of await readIds(TIMER_KEYS.saved)) {
        await adapter.delete(TIMER_KEYS.routine(id));
      }
      await adapter.delete(TIMER_KEYS.index);
      await adapter.delete(TIMER_KEYS.saved);
      await adapter.delete(TIMER_KEYS.prefs);
    },
  };
}
