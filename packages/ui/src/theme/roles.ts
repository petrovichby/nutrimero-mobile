import { generatedTokens as g } from "../tokens.generated";
import { withAlpha } from "./color";

export type App = "home" | "pro";
export type Scheme = "light" | "dark";

/**
 * The colour roles every shared component reads — one vocabulary for both apps (DESIGN.md: "the
 * temperament difference is carried by the app-accent role …, never by forked components").
 * Home Baker resolves them from its own ramp (colors-home); Pro Baker from the web ramps it
 * inherits. Components never read raw hex.
 */
export interface Roles {
  surface: string;
  surface1: string;
  surface2: string;
  ink: string;
  ink2: string;
  ink3: string;
  heading: string;
  outline: string;
  outlineStrong: string;
  /** Primary action fill and the text/glyphs on it (never white on the action colour). */
  action: string;
  onAction: string;
  actionSoft: string;
  structure: string;
  onStructure: string;
  /**
   * The edge of a selected card or chip. Home: the structure rust in light, and in dark the
   * outline-strong edge — rust on chocolate is 2.0:1, below WCAG's 3:1 for a state boundary; the
   * same substitution DESIGN.md MA-6 makes for the secondary button in dark.
   */
  selectedLine: string;
  secondaryLine: string;
  secondaryInk: string;
  chipBg: string;
  chipSelectedBg: string;
  chipSelectedInk: string;
  /** A quiet reassurance panel (DESIGN.md MA-21, C4 `note-assurance`): the privacy card. */
  noteBg: string;
  noteInk: string;
  noteLine: string;
  noteGlyph: string;
  /** Banner field for quiet status (offline) — DESIGN.md: surface-container-high. */
  statusBg: string;
  destructive: string;
  onDestructive: string;
  /** Destructive TEXT and glyphs on a surface (the More row) — see PENDING_DECLARATION. */
  destructiveInk: string;
  /** The scrim behind a bottom sheet — see PENDING_DECLARATION. */
  sheetScrim: string;
  focusRing: string;
  scrim: string;
  shadowColor: string;
  /** Scheme-fixed: the cream plate and the stamp that sits on it. */
  illustrationCanvas: string;
  /** Text on the cream canvas — pinned to the light ramp in both schemes (the canvas is fixed). */
  canvasInk: string;
  canvasHeading: string;
  plateFrame: string;
  stampBg: string;
  stampInk: string;
  stampLine: string;
}

function homeRoles(scheme: Scheme): Roles {
  const fixed = g.home.fixed;
  const ramp = g.home[scheme];
  return {
    surface: ramp.surface,
    surface1: ramp.surface1,
    surface2: ramp.surface2,
    ink: ramp.ink,
    ink2: ramp.ink2,
    ink3: ramp.ink3,
    heading: ramp.heading,
    outline: ramp.outline,
    outlineStrong: ramp.outlineStrong,
    action: fixed.action,
    onAction: fixed.onAction,
    actionSoft: ramp.actionSoft,
    structure: fixed.structure,
    onStructure: fixed.onStructure,
    selectedLine: scheme === "light" ? fixed.structure : ramp.outlineStrong,
    secondaryLine: ramp.secondaryButton.line,
    secondaryInk: ramp.secondaryButton.ink,
    chipBg: ramp.chipBg,
    chipSelectedBg: ramp.chipSelectedBg,
    chipSelectedInk: ramp.chipSelectedInk,
    noteBg: ramp.noteAssurance.bg,
    noteInk: ramp.noteAssurance.ink,
    noteLine: ramp.noteAssurance.line,
    noteGlyph: ramp.noteAssurance.glyph,
    statusBg: ramp.surface2,
    destructive: ramp.destructive,
    onDestructive: ramp.onDestructive,
    destructiveInk: scheme === "light" ? ramp.destructive : PENDING_DECLARATION.destructiveInkDark,
    sheetScrim: PENDING_DECLARATION.sheetScrim,
    focusRing: ramp.focusRing,
    scrim: ramp.scrim,
    shadowColor: ramp.shadow.color,
    illustrationCanvas: fixed.illustrationCanvas,
    canvasInk: g.home.light.ink2,
    canvasHeading: g.home.light.heading,
    plateFrame: fixed.plateFrame,
    stampBg: fixed.provenanceStamp.bg,
    stampInk: fixed.provenanceStamp.ink,
    stampLine: fixed.provenanceStamp.line,
  };
}

/**
 * PROPOSED for the pro lane to confirm: Pro Baker's roles from the inherited web ramp (navy
 * structure, lime action, Material surface containers). Home's mapping is DESIGN.md's own.
 */
function proRoles(scheme: Scheme): Roles {
  const ramp = g.pro[scheme];
  const stamp = g.mobile.provenanceOnImage.pro;
  return {
    surface: ramp.surface,
    surface1: ramp.surfaceContainerLow,
    surface2: ramp.surfaceContainer,
    ink: ramp.onSurface,
    ink2: ramp.onSurfaceVariant,
    ink3: ramp.onSurfaceVariant,
    heading: scheme === "light" ? ramp.primary : ramp.onSurface,
    outline: ramp.outlineVariant,
    outlineStrong: ramp.outline,
    action: ramp.secondary,
    onAction: ramp.onSecondary,
    actionSoft: ramp.secondaryContainer,
    structure: ramp.primary,
    onStructure: ramp.onPrimary,
    selectedLine: ramp.primary,
    secondaryLine: scheme === "light" ? ramp.primary : ramp.outline,
    secondaryInk: scheme === "light" ? ramp.primary : ramp.onSurface,
    chipBg: ramp.surfaceContainerLow,
    chipSelectedBg: scheme === "light" ? ramp.primary : ramp.onSurface,
    chipSelectedInk: scheme === "light" ? ramp.onPrimary : ramp.surface,
    // MA-21's definition, in Pro's ramp: surface-1, outline edge, ink text, heading glyph.
    noteBg: ramp.surfaceContainerLow,
    noteInk: ramp.onSurface,
    noteLine: ramp.outlineVariant,
    noteGlyph: scheme === "light" ? ramp.primary : ramp.onSurface,
    statusBg: ramp.surfaceContainerHigh,
    destructive: g.mobile.destructive[scheme],
    onDestructive: g.mobile.destructive.on,
    destructiveInk:
      scheme === "light" ? g.mobile.destructive.light : PENDING_DECLARATION.destructiveInkDark,
    sheetScrim: withAlpha("#000000", 0.45),
    focusRing: ramp.focusRing,
    // DESIGN.md MA-8 shadow alphas (0.14 tinted light, 0.45 black dark); scrim a step lighter.
    scrim: scheme === "light" ? withAlpha(g.pro.light.primary, 0.1) : withAlpha("#000000", 0.35),
    shadowColor:
      scheme === "light" ? withAlpha(g.pro.light.primary, 0.14) : withAlpha("#000000", 0.45),
    illustrationCanvas: g.mobile.illustrationCanvas,
    canvasInk: g.pro.light.onSurfaceVariant,
    canvasHeading: g.pro.light.primary,
    plateFrame: withAlpha(g.pro.light.primary, 0.28), // DESIGN.md MA-4: navy at 28% in Pro
    stampBg: stamp.bg,
    stampInk: stamp.ink,
    stampLine: stamp.line,
  };
}

/**
 * Values the approved corpus draws that DESIGN.md does not declare yet (09-more, 09-more-clear-data;
 * flagged to design-mobile 2026-09-24). Kept here, named, until MA-18 declares them; then they come
 * from the generated tokens and this table is emptied (a test lists it, so it cannot grow quietly).
 *
 * - destructiveInkDark: the danger row's label and glyph in dark. The declared destructive FILL
 *   (#a03325) is ~2.4:1 as text on the dark surfaces.
 * - sheetScrim: the scrim behind the Clear my data sheet, heavier than the declared page scrim.
 */
export const PENDING_DECLARATION = {
  destructiveInkDark: "#e8a598",
  sheetScrim: "rgba(40,24,14,0.45)",
} as const;

export function rolesFor(app: App, scheme: Scheme): Roles {
  return app === "home" ? homeRoles(scheme) : proRoles(scheme);
}
