import type { Locale, Translator } from "@nutrimero/core";
import { createContext, useContext } from "react";

/**
 * What the root layout hands every route: the translator and locale of the moment, the device's
 * own locale, and the two device-level actions More exposes. Routes stay thin (plan 5b).
 */
export interface Shell {
  t: Translator;
  locale: Locale;
  /** The device's own UI locale (IX 1.2.0 rule 1), for the Language picker's device row. */
  deviceLocale: Locale;
  /** Apply a language in place and store it; `null` follows the device again (FR-026). */
  chooseLocale: (choice: Locale | null) => void;
  /** Home's wipe (FR-013): deletes Home's data and returns to the first question (FR-027). */
  clearData: () => Promise<void>;
  /** Opens the timers sheet (005) — from More, and from the chip. */
  openTimers: () => void;
}

const ShellContext = createContext<Shell | null>(null);

export const ShellProvider = ShellContext.Provider;

export function useShell(): Shell {
  const shell = useContext(ShellContext);
  if (shell === null) throw new Error("useShell is only available under the root layout");
  return shell;
}
