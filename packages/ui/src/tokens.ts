// Design tokens per docs/DESIGN.md (draft 0.1.0). Mobile-specific roles are declared in the
// DESIGN.md frontmatter; the full light/dark ramps are inherited from the nutrimero token
// registry. TODO(design): replace this hand-seeded subset with generation from the registry —
// this file must never be extended by hand beyond bootstrap (Constitution X).
export const tokens = {
  color: {
    primary: "#1b1f58",
    onPrimary: "#ffffff",
    secondary: "#b9bf05",
    onSecondary: "#1d1e01",
    tertiary: "#2f0100",
    error: "#ba1a1a",
    surface: "#fbfafc",
    onSurface: "#1b1820",
    appAccentHome: "#b9bf05",
    appAccentPro: "#1b1f58",
    illustrationCanvas: "#f7f4ec",
    floorSurface: "#0b0e32",
  },
  spacing: {
    unit: 4,
    screenMargin: 16,
    cardPadding: 12,
    sectionGap: 24,
    listRowMinHeight: 48,
  },
  touchTarget: {
    minimum: 44,
    floorMode: 56,
  },
  radius: { sm: 2, md: 6, lg: 8, xl: 12, full: 9999 },
  type: {
    headlineLg: { fontSize: 28, fontWeight: "700", lineHeight: 36 },
    headlineMd: { fontSize: 22, fontWeight: "600", lineHeight: 30 },
    headlineSm: { fontSize: 18, fontWeight: "600", lineHeight: 26 },
    bodyLg: { fontSize: 17, fontWeight: "400", lineHeight: 26 },
    bodyMd: { fontSize: 15, fontWeight: "400", lineHeight: 22 },
    bodySm: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
    labelMd: { fontSize: 12, fontWeight: "600", lineHeight: 16 },
    labelSm: { fontSize: 11, fontWeight: "700", lineHeight: 14 },
  },
} as const;

export type AppAccent = "home" | "pro";
