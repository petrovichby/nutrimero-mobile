import type { Translator } from "@nutrimero/core";

/**
 * Durations in words (005 FR-022, research R10). Whole units only: every plural argument is an
 * integer `count` (ADR 0001 ruling 2026-09-24). Two forms: a compact one for the screen
 * ("1 h 30 min") and a spoken one for screen readers ("1 hour 30 minutes").
 *
 * The parts: from one hour, hours and minutes; from one minute, minutes and seconds; below a
 * minute, seconds. A zero part is left out ("2 h", not "2 h 0 min").
 */
export function durationParts(
  totalSeconds: number,
): { unit: "hours" | "minutes" | "seconds"; value: number }[] {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const parts: { unit: "hours" | "minutes" | "seconds"; value: number }[] = [];
  if (hours > 0) {
    parts.push({ unit: "hours", value: hours });
    if (minutes > 0) parts.push({ unit: "minutes", value: minutes });
  } else if (minutes > 0) {
    parts.push({ unit: "minutes", value: minutes });
    if (rest > 0) parts.push({ unit: "seconds", value: rest });
  } else {
    parts.push({ unit: "seconds", value: rest });
  }
  return parts;
}

export function formatDuration(
  totalSeconds: number,
  t: Translator,
): { readonly text: string; readonly spoken: string } {
  const parts = durationParts(totalSeconds);
  const text = parts
    .map(({ unit, value }) =>
      unit === "hours"
        ? t("home.timers.unit.hours", { value })
        : unit === "minutes"
          ? t("home.timers.unit.minutes", { value })
          : t("home.timers.unit.seconds", { value }),
    )
    .join(" ");
  const spoken = parts
    .map(({ unit, value }) =>
      unit === "hours"
        ? t("home.timers.spoken.hours", { count: value })
        : unit === "minutes"
          ? t("home.timers.spoken.minutes", { count: value })
          : t("home.timers.spoken.seconds", { count: value }),
    )
    .join(" ");
  return { text, spoken };
}
