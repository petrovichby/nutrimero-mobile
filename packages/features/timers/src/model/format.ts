import type { Stage } from "./stage";

/**
 * The large readout (DESIGN.md *Timers*, 18-timer): "1:12:40" from an hour, "8:12" below it.
 * Tabular digits are the screen's job; this only lays the numbers out.
 */
export function clockText(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

/** A clock time in the UI locale's own convention ("15:44", or "3:44 PM" in English). */
export function timeOfDay(at: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(at);
}

/**
 * Sentence case where a title or sentence *starts* with a stage name (coordinator, 2026-09-25):
 * the first letter is capitalized at composition, locale-aware, and never through styling.
 * Code-point safe, so a leading emoji or combining mark is left as it is.
 */
export function capitalizeFirst(text: string, locale: string): string {
  const [first, ...rest] = [...text];
  return first === undefined ? text : first.toLocaleUpperCase(locale) + rest.join("");
}

/** Timed seconds across a routine's stages (21-saved-routines: "5 stages · 17 h 45 min timed"). */
export function timedSeconds(stages: readonly Stage[]): number {
  return stages.reduce((sum, stage) => sum + (stage.seconds ?? 0), 0);
}

/** Share of a running clock already elapsed, 0–1, for the progress bar (18-timer). */
export function elapsedShare(endAt: number, totalSeconds: number, now: number): number {
  if (totalSeconds <= 0) return 1;
  const left = Math.max(0, (endAt - now) / 1000);
  return Math.min(1, Math.max(0, 1 - left / totalSeconds));
}
