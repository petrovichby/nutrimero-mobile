import type { Translator } from "@nutrimero/core";
import { stageLabel } from "../model/content";
import { formatDuration } from "../model/duration";
import { capitalizeFirst, clockText, timeOfDay } from "../model/format";
import type { View } from "../model/item";

/**
 * How one item reads on the chip, in the sheet and in announcements — one source, so the chip and
 * the sheet never disagree (NOTES: "the chip and the sheet read the same source"). Stage names are
 * the baker's data (lowercase picks, or their own text); a sentence that starts with one is
 * capitalized at composition.
 */
export interface Described {
  /** The row's name: the timer's or the routine's. */
  readonly name: string;
  /** The small line under the name (16): ends at, paused, done · 3 min ago, or the stage line. */
  readonly sub: string;
  /** The right-hand readout: time left, or null when done or waiting. */
  readonly readout: string | null;
  /** The whole row for a screen reader. */
  readonly a11y: string;
  /** What ended, as a sentence ("Bulk ferment is done" / "Final proof is done"). */
  readonly doneTitle: string;
}

export function agoFor(endedAt: number, now: number, t: Translator): string {
  const { text } = formatDuration(Math.max(0, (now - endedAt) / 1000), t);
  return t("home.timers.ui.agoShort", { duration: text });
}

export function describe(view: View, t: Translator, locale: string, now: number): Described {
  const left =
    view.secondsLeft === null
      ? null
      : {
          readout: clockText(view.secondsLeft),
          spoken: t("home.timers.ui.leftA11y", {
            duration: formatDuration(view.secondsLeft, t).spoken,
          }),
        };

  if (view.stage !== null) {
    const stage = stageLabel(view.stage.current, t);
    const next = view.stage.next === null ? null : stageLabel(view.stage.next, t);
    const line =
      next === null
        ? t("home.timers.ui.sheet.routineLineLast", {
            position: view.stage.position,
            total: view.stage.total,
            stage,
          })
        : t("home.timers.ui.sheet.routineLine", {
            position: view.stage.position,
            total: view.stage.total,
            stage,
            next,
          });
    const sub =
      view.status === "done" && view.endsAt !== null
        ? t("home.timers.ui.sheet.done", { ago: agoFor(view.endsAt, now, t) })
        : view.status === "paused"
          ? `${line} · ${t("home.timers.ui.sheet.paused")}`
          : line;
    const doneTitle = capitalizeFirst(t("home.timers.ui.routine.stageDone", { stage }), locale);
    return {
      name: view.name,
      sub,
      readout: left?.readout ?? null,
      doneTitle,
      a11y: [view.name, view.status === "done" ? doneTitle : line, left?.spoken]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join(", "),
    };
  }

  const sub =
    view.status === "done" && view.endsAt !== null
      ? t("home.timers.ui.sheet.done", { ago: agoFor(view.endsAt, now, t) })
      : view.status === "paused"
        ? t("home.timers.ui.sheet.paused")
        : view.endsAt !== null
          ? t("home.timers.ui.endsAt", { time: timeOfDay(view.endsAt, locale) })
          : "";
  const doneTitle = t("home.timers.notification.timerDone.title", { name: view.name });
  return {
    name: view.name,
    sub,
    readout: left?.readout ?? null,
    doneTitle,
    a11y: [
      view.status === "done" ? doneTitle : view.name,
      view.status === "done" ? sub : left?.spoken,
    ]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join(", "),
  };
}
