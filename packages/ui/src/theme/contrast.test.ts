import { describe, expect, it } from "vitest";
import { contrastRatio, withAlpha } from "./color";
import { type App, type Roles, rolesFor, type Scheme } from "./roles";

/**
 * DESIGN.md *Accessibility* (WCAG AA, a gate): every text/background pair the shared components
 * render, in both apps and both schemes — text ≥ 4.5:1, state boundaries and the focus ring ≥ 3:1.
 */
type Pair = [label: string, foreground: keyof Roles, background: keyof Roles];

const TEXT: Pair[] = [
  ["body on surface", "ink", "surface"],
  ["secondary text on surface", "ink2", "surface"],
  ["secondary text on surface-1 (selected card)", "ink2", "surface1"],
  ["heading on surface", "heading", "surface"],
  ["heading on surface-1 (selected card, chip)", "heading", "surface1"],
  ["unselected tab label on surface", "ink3", "surface"],
  ["selected tab label on its pill", "heading", "actionSoft"],
  ["primary button label", "onAction", "action"],
  ["destructive button label", "onDestructive", "destructive"],
  ["secondary button label", "secondaryInk", "surface"],
  ["selected chip label", "chipSelectedInk", "chipSelectedBg"],
  ["offline banner text", "ink2", "statusBg"],
];

const BOUNDARIES: Pair[] = [
  ["selected card / chip edge", "selectedLine", "surface"],
  ["secondary button outline", "secondaryLine", "surface"],
  ["focus ring", "focusRing", "surface"],
];

const cases: [App, Scheme][] = [
  ["home", "light"],
  ["home", "dark"],
  ["pro", "light"],
  ["pro", "dark"],
];

describe("shared components meet WCAG AA", () => {
  for (const [app, scheme] of cases) {
    const roles = rolesFor(app, scheme);
    it(`${app} / ${scheme}: text pairs ≥ 4.5:1`, () => {
      const failing = TEXT.map(
        ([label, fg, bg]) => [label, contrastRatio(roles[fg], roles[bg])] as const,
      )
        .filter(([, ratio]) => ratio < 4.5)
        .map(([label, ratio]) => `${label}: ${ratio.toFixed(2)}`);
      expect(failing).toEqual([]);
    });
    it(`${app} / ${scheme}: boundaries ≥ 3:1`, () => {
      const failing = BOUNDARIES.map(
        ([label, fg, bg]) => [label, contrastRatio(roles[fg], roles[bg])] as const,
      )
        .filter(([, ratio]) => ratio < 3)
        .map(([label, ratio]) => `${label}: ${ratio.toFixed(2)}`);
      expect(failing).toEqual([]);
    });
  }

  it("the stamp reads on its cream plate (scheme-fixed, 8pt text ≥ 4.5:1)", () => {
    for (const app of ["home", "pro"] as const) {
      const roles = rolesFor(app, "light");
      expect(
        contrastRatio(roles.stampInk, roles.stampBg, roles.illustrationCanvas),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("measures known pairs correctly", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(withAlpha("#7a3520", 0.3)).toBe("rgba(122,53,32,0.3)");
  });
});
