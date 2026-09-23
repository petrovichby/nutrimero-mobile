import type { TextStyle } from "react-native";
import type { UiWeight } from "../fonts";
import type { Theme } from "../theme/provider";
import { tokens } from "../tokens";

type Role = Exclude<keyof typeof tokens.type, "floorModeScale">;

/**
 * A DESIGN.md type role as a React Native style in the locale's UI face. The face carries the
 * weight (fonts are registered per weight), so no `fontWeight` is set: mixing the two makes
 * Android fall back to a platform font.
 */
export function textRole(theme: Theme, role: Role, weight?: UiWeight): TextStyle {
  const spec = tokens.type[role];
  const face = theme.face(weight ?? spec.fontWeight);
  return {
    fontFamily: face,
    fontSize: spec.fontSize,
    lineHeight: spec.lineHeight,
    ...("letterSpacing" in spec ? { letterSpacing: spec.letterSpacing } : {}),
    ...("fontVariant" in spec ? { fontVariant: [...spec.fontVariant] } : {}),
  };
}
