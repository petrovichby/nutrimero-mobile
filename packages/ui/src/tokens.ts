import { generatedTokens as g } from "./tokens.generated";

/**
 * The design tokens both apps read (Constitution X). Every value comes from `tokens.generated.ts`,
 * which `pnpm tokens:generate` writes from docs/DESIGN.md (0.5.0) and the web ramps Pro Baker
 * inherits. This file only arranges them; it never states a value.
 *
 * `color` keeps the bootstrap names both app roots use (the Pro/web ramp plus the mobile roles).
 * Home Baker screens read `home` (Crust & Butter, DESIGN.md colors-home); Pro Baker screens read
 * `pro`.
 */
export const tokens = {
  color: {
    primary: g.pro.light.primary,
    onPrimary: g.pro.light.onPrimary,
    secondary: g.pro.light.secondary,
    onSecondary: g.pro.light.onSecondary,
    tertiary: g.pro.light.tertiary,
    error: g.pro.light.error,
    surface: g.pro.light.surface,
    onSurface: g.pro.light.onSurface,
    appAccentHome: g.mobile.appAccentHome,
    appAccentPro: g.mobile.appAccentPro,
    illustrationCanvas: g.mobile.illustrationCanvas,
    floorSurface: g.mobile.floorSurface,
  },
  home: g.home,
  pro: g.pro,
  mobile: g.mobile,
  spacing: g.spacing,
  touchTarget: g.touchTargets,
  radius: g.rounded,
  type: g.type,
  faces: g.faces,
} as const;

export type AppAccent = "home" | "pro";
