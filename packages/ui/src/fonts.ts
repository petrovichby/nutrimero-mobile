/**
 * The font registry (ADR 0001 *Fonts*; DESIGN.md 0.5.0 G-1, G-2). The UI face and the stamp face
 * follow the UI locale's script; no component chooses a face itself. React Native selects custom
 * fonts by family name, not by weight, so every weight is its own registered name.
 *
 * This module is plain data and stays Node-loadable; the font files themselves are registered in
 * the `@nutrimero/ui/native` entry (font-assets.ts).
 */
export const FONT_FILES = {
  "PlusJakartaSans-400": "PlusJakartaSans_400Regular.ttf",
  "PlusJakartaSans-500": "PlusJakartaSans_500Medium.ttf",
  "PlusJakartaSans-600": "PlusJakartaSans_600SemiBold.ttf",
  "PlusJakartaSans-700": "PlusJakartaSans_700Bold.ttf",
  "PlusJakartaSans-800": "PlusJakartaSans_800ExtraBold.ttf",
  "Onest-400": "Onest_400Regular.ttf",
  "Onest-500": "Onest_500Medium.ttf",
  "Onest-600": "Onest_600SemiBold.ttf",
  "Onest-700": "Onest_700Bold.ttf",
  "Onest-800": "Onest_800ExtraBold.ttf",
  "Pacifico-400": "Pacifico_400Regular.ttf",
  "StardosStencil-700": "StardosStencil_700Bold.ttf",
  "YesevaOne-400": "YesevaOne_400Regular.ttf",
} as const;

export type FontName = keyof typeof FONT_FILES;
export type FontScript = "latin" | "cyrillic";
export type UiWeight = "400" | "500" | "600" | "700" | "800";

/** The Cyrillic-script UI locales (Constitution IX 1.1.0); every other UI locale is Latin. */
const CYRILLIC_LOCALES: readonly string[] = ["be", "uk"];

export function scriptOf(locale: string): FontScript {
  return CYRILLIC_LOCALES.includes(locale) ? "cyrillic" : "latin";
}

const UI_FAMILY: Record<FontScript, "PlusJakartaSans" | "Onest"> = {
  latin: "PlusJakartaSans",
  cyrillic: "Onest",
};

/** Body, UI and control text: Plus Jakarta Sans (Latin) or Onest (Cyrillic) — G-1. */
export function uiFace(locale: string, weight: UiWeight = "400"): FontName {
  return `${UI_FAMILY[scriptOf(locale)]}-${weight}`;
}

/** The `provenance-stamp` role: Stardos Stencil 700 (Latin) or Yeseva One 400 (Cyrillic) — G-2. */
export function stampFace(locale: string): FontName {
  return scriptOf(locale) === "cyrillic" ? "YesevaOne-400" : "StardosStencil-700";
}

/** Brand moments only (splash title, mastheads, paywall headline); Pacifico covers both scripts. */
export function displayFace(): FontName {
  return "Pacifico-400";
}
