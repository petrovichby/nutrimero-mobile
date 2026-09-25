import { MAX_SECONDS } from "./stage";

/**
 * New timer's duration (17, nutrimero-design b0dade59): hours, minutes and seconds are each a
 * typed number with its own − and + that change it by one. Steps act on the whole duration, so
 * "+" on 59 minutes rolls into the hour and "−" borrows from it; everything stays in 0 … 48 h.
 */
export type Unit = "hours" | "minutes" | "seconds";

export const UNIT_SECONDS: Readonly<Record<Unit, number>> = {
  hours: 3600,
  minutes: 60,
  seconds: 1,
};

const clamp = (seconds: number) => Math.min(MAX_SECONDS, Math.max(0, seconds));

export function split(seconds: number): Readonly<Record<Unit, number>> {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

/** One unit typed: digits only, minutes and seconds at most 59, the whole at most 48 h. */
export function typed(seconds: number, unit: Unit, text: string): number {
  const digits = text.replace(/\D/g, "");
  const value = digits === "" ? 0 : Number.parseInt(digits, 10);
  const parts = { ...split(seconds), [unit]: unit === "hours" ? value : Math.min(59, value) };
  return clamp(parts.hours * 3600 + parts.minutes * 60 + parts.seconds);
}

/** One unit's − or +: by one of that unit. */
export function stepped(seconds: number, unit: Unit, direction: 1 | -1): number {
  return clamp(seconds + direction * UNIT_SECONDS[unit]);
}
