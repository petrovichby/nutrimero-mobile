/**
 * The owned glyph sets (DESIGN.md *Imagery* — two families, per web ADR-0008; no library icons
 * for domain symbols), transcribed verbatim from the approved corpus's `<symbol>` defs
 * (nutrimero-design:mobile/home-baker — 01-recipes, 07-onboarding-*, 03-builder-empty). All are
 * drawn on a 24-unit grid. Plain data, so the set is testable under Node.
 *
 * - `filled`: UI chrome glyphs — solid shapes in the current colour.
 * - `stroke`: the diet & allergen set shared with nutrimero-web — 2pt stroke, round caps and
 *   joins. **Strike grammar:** a glyph with the diagonal `M4 20 20 4` means "-free"/suitability;
 *   without it the glyph means "contains". Never mix the two meanings on one surface without text
 *   naming it.
 */
export type Shape =
  | { kind: "path"; d: string; evenOdd?: boolean; opacity?: number }
  | { kind: "circle"; cx: number; cy: number; r: number }
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx: number;
      opacity?: number;
    };

export const STRIKE = "M4 20 20 4";

const path = (d: string, extra: { evenOdd?: boolean; opacity?: number } = {}): Shape => ({
  kind: "path",
  d,
  ...extra,
});

const WHEAT = [
  path("M12 21v-9"),
  path("M12 12c0-2.5 2-4.5 4.5-4.5C16.5 10 14.5 12 12 12z"),
  path("M12 12c0-2.5-2-4.5-4.5-4.5C7.5 10 9.5 12 12 12z"),
  path("M12 7.5C12 5 14 3 16.5 3 16.5 5.5 14.5 7.5 12 7.5z"),
  path("M12 7.5C12 5 10 3 7.5 3 7.5 5.5 9.5 7.5 12 7.5z"),
];
const MILK = [path("M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z")];
const EGG = [
  path("M12 21c-3.6 0-6.5-2.7-6.5-7C5.5 9.5 8.5 3 12 3s6.5 6.5 6.5 11c0 4.3-2.9 7-6.5 7z"),
];
const NUT = [
  path("M6.5 8.3C6.5 6 9 4.5 12 4.5s5.5 1.5 5.5 3.8l-.3 1.2H6.8l-.3-1.2z"),
  path("M7 11.5h10c-.3 4-2.3 7.2-5 8.9-2.7-1.7-4.7-4.9-5-8.9z"),
];
const strike = (shapes: Shape[]) => [...shapes, path(STRIKE)];

export const STROKE_GLYPHS = {
  wheat: WHEAT,
  milk: MILK,
  egg: EGG,
  nut: NUT,
  glutenFree: strike(WHEAT),
  lactoseFree: strike(MILK),
  eggFree: strike(EGG),
  vegan: [path("M20 4c1 8-2 13-6 15s-8 1-9-1 0-6 4-9 8-4 11-5z"), path("M5 20c3-5 7-9 12-12")],
  // UI chrome, but stroke-drawn in the corpus (09-more `i-chev`, stroke 2.2 there; 2 here, the set's width).
  chevron: [path("m9 6 6 6-6 6")],
  vegetarian: [
    path("M12 21v-8"),
    path("M12 13c0-4 3-6 8-6 0 4-3 6-8 6z"),
    path("M12 15c0-3-2-5-6-5 0 3 2 5 6 5z"),
  ],
  // Timers (spec 005, MA-27): transcribed from design's home-baker/_gen/gen_timers.py symbols.
  bellOff: [
    path("M3 3l18 18"),
    path("M17.5 13V11a5.5 5.5 0 0 0-8.3-4.7"),
    path("M6.5 9.5V15l-2 2.5h12"),
    path("M10 20.5a2.2 2.2 0 0 0 4 0"),
  ],
  minusCircle: [{ kind: "circle", cx: 12, cy: 12, r: 9 }, path("M8 12h8")],
  info: [{ kind: "circle", cx: 12, cy: 12, r: 9 }, path("M12 11v6"), path("M12 7.5h.01")],
} satisfies Record<string, Shape[]>;

export const FILLED_GLYPHS = {
  book: [
    path(
      "M11 5.4C9.4 4 7.2 3.2 4.8 3.2c-1 0-1.9.1-2.8.4v14.8c.9-.3 1.8-.4 2.8-.4 2.4 0 4.6.8 6.2 2.2V5.4Z",
    ),
    path(
      "M13 5.4C14.6 4 16.8 3.2 19.2 3.2c1 0 1.9.1 2.8.4v14.8c-.9-.3-1.8-.4-2.8-.4-2.4 0-4.6.8-6.2 2.2V5.4Z",
    ),
  ],
  builder: [
    { kind: "circle", cx: 12, cy: 4.9, r: 1.8 },
    { kind: "rect", x: 8.75, y: 7.6, width: 6.5, height: 4, rx: 1.2 },
    { kind: "rect", x: 6, y: 12.3, width: 12, height: 4, rx: 1.2 },
    { kind: "rect", x: 3.5, y: 17, width: 17, height: 4, rx: 1.2 },
  ],
  basket: [
    path("M15.7 2.6 18.7 8H22v2H2V8h3.3l3-5.4 1.75 1L7.6 8h8.8l-2.45-4.4 1.75-1Z"),
    path("M3.6 11h16.8l-1.4 8.2A2.5 2.5 0 0 1 16.5 21h-9a2.5 2.5 0 0 1-2.5-1.8L3.6 11Z"),
  ],
  pantry: [
    path(
      "M6 2.5h12A2.5 2.5 0 0 1 20.5 5v12.5a2 2 0 0 1-2 2h-.5v2h-2v-2H8v2H6v-2h-.5a2 2 0 0 1-2-2V5A2.5 2.5 0 0 1 6 2.5Zm5.3 2h1.4v13h-1.4v-13Zm-2.1 5.9h1.2v3.2H9.2v-3.2Zm4.4 0h1.2v3.2h-1.2v-3.2Z",
      { evenOdd: true },
    ),
  ],
  dots: [
    { kind: "circle", cx: 5, cy: 12, r: 2.2 },
    { kind: "circle", cx: 12, cy: 12, r: 2.2 },
    { kind: "circle", cx: 19, cy: 12, r: 2.2 },
  ],
  check: [path("M9.5 16.2 5.8 12.5l-1.8 1.8 5.5 5.5L20 9.3l-1.8-1.8-8.7 8.7Z")],
  plus: [path("M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z")],
  back: [path("M14.7 19.2 7.5 12l7.2-7.2 1.8 1.8L11.1 12l5.4 5.4-1.8 1.8Z")],
  globe: [
    path(
      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.6 2.8A7.4 7.4 0 0 0 4.7 11h3.1c.1-2.3.9-4.5 2.6-6.2Zm3.2 0c1.7 1.7 2.5 3.9 2.6 6.2h3.1a7.4 7.4 0 0 0-5.7-6.2ZM13.8 11c-.1-2-.8-3.8-1.8-5.2-1 1.4-1.7 3.2-1.8 5.2h3.6Zm-3.6 2c.1 2 .8 3.8 1.8 5.2 1-1.4 1.7-3.2 1.8-5.2h-3.6Zm-2.4 0H4.7a7.4 7.4 0 0 0 5.7 6.2C8.7 17.5 7.9 15.3 7.8 13Zm8.4 0c-.1 2.3-.9 4.5-2.6 6.2a7.4 7.4 0 0 0 5.7-6.2h-3.1Z",
      { evenOdd: true },
    ),
  ],
  trash: [
    path(
      "M9 2h6a1 1 0 0 1 1 1v1h4v2H4V4h4V3a1 1 0 0 1 1-1Zm-3.5 6h13l-1 12.2A2 2 0 0 1 15.5 22h-7a2 2 0 0 1-2-1.8L5.5 8Zm4 2.5v8h2v-8h-2Zm3 0v8h2v-8h-2Z",
      { evenOdd: true },
    ),
  ],
  search: [
    path(
      "M10.5 3a7.5 7.5 0 1 0 4.55 13.45l4.25 4.25 1.8-1.8-4.25-4.25A7.5 7.5 0 0 0 10.5 3Zm0 2.6a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Z",
      { evenOdd: true },
    ),
  ],
  clock: [
    path(
      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.6a7.4 7.4 0 1 1 0 14.8 7.4 7.4 0 0 1 0-14.8Z",
      { evenOdd: true },
    ),
    path("M11 7h2v5.4l4 2.3-1 1.74-5-2.9V7Z"),
  ],
  gauge: [
    { kind: "rect", x: 4, y: 13, width: 4.5, height: 7, rx: 1.5 },
    { kind: "rect", x: 9.75, y: 9, width: 4.5, height: 11, rx: 1.5 },
    { kind: "rect", x: 15.5, y: 5, width: 4.5, height: 15, rx: 1.5, opacity: 0.35 },
  ],
  sparkle: [
    path("M12 2.5 14 9l6.5 2L14 13 12 19.5 10 13l-6.5-2L10 9l2-6.5Z"),
    path("M19 15.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"),
  ],
  camera: [
    path(
      "M9.2 4 7.8 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.8L14.8 4H9.2ZM12 8.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 2.4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
      { evenOdd: true },
    ),
  ],
  lock: [
    path(
      "M7 10V8a5 5 0 0 1 10 0v2h.5A2.5 2.5 0 0 1 20 12.5v7A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-7A2.5 2.5 0 0 1 6.5 10H7Zm2.4 0h5.2V8a2.6 2.6 0 1 0-5.2 0v2Z",
      { evenOdd: true },
    ),
  ],
  // Timers (spec 005, MA-27): transcribed from design's home-baker/_gen/gen_timers.py symbols.
  timer: [
    path("M9 1.5h6v2H9z"),
    path(
      "M12 4.5a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2.6a6.4 6.4 0 1 1 0 12.8 6.4 6.4 0 0 1 0-12.8Z",
      {
        evenOdd: true,
      },
    ),
    path("M11 8.5h2v5.2l-1 .8-1-.8V8.5Z"),
    path("m18.3 5.3 1.4-1.4 1.4 1.4-1.4 1.4z"),
  ],
  routine: [
    { kind: "circle", cx: 5, cy: 6, r: 2.2 },
    { kind: "circle", cx: 5, cy: 12, r: 2.2 },
    { kind: "circle", cx: 5, cy: 18, r: 2.2 },
    path("M9.5 5h11v2h-11zM9.5 11h11v2h-11zM9.5 17h7v2h-7z"),
  ],
  close: [
    path(
      "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z",
    ),
  ],
  pause: [path("M7 5h3.5v14H7zM13.5 5H17v14h-3.5z")],
  play: [path("M8 5.1v13.8L19 12 8 5.1Z")],
  bell: [
    path(
      "M12 2.5a1.5 1.5 0 0 1 1.5 1.5v.7A6.5 6.5 0 0 1 18.5 11v4.2l1.8 2.3V19H3.7v-1.5l1.8-2.3V11a6.5 6.5 0 0 1 5-6.3V4A1.5 1.5 0 0 1 12 2.5ZM9.5 20.5h5a2.5 2.5 0 0 1-5 0Z",
    ),
  ],
  sun: [
    { kind: "circle", cx: 12, cy: 12, r: 4 },
    path(
      "M11 1.5h2v3h-2zM11 19.5h2v3h-2zM1.5 11h3v2h-3zM19.5 11h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zM16.3 17.7l1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zM16.3 6.3l2.1-2.1 1.4 1.4-2.1 2.1z",
    ),
  ],
  grip: [
    { kind: "circle", cx: 9, cy: 6, r: 1.6 },
    { kind: "circle", cx: 15, cy: 6, r: 1.6 },
    { kind: "circle", cx: 9, cy: 12, r: 1.6 },
    { kind: "circle", cx: 15, cy: 12, r: 1.6 },
    { kind: "circle", cx: 9, cy: 18, r: 1.6 },
    { kind: "circle", cx: 15, cy: 18, r: 1.6 },
  ],
  moreVertical: [
    { kind: "circle", cx: 12, cy: 5, r: 2 },
    { kind: "circle", cx: 12, cy: 12, r: 2 },
    { kind: "circle", cx: 12, cy: 19, r: 2 },
  ],
  pencil: [
    path(
      "M14.8 4.2 19.8 9.2 9 20H4v-5L14.8 4.2Zm2.1-2.1a1.5 1.5 0 0 1 2.1 0l2.9 2.9a1.5 1.5 0 0 1 0 2.1l-1.1 1.1-5-5 1.1-1.1Z",
    ),
  ],
} satisfies Record<string, Shape[]>;

export type StrokeGlyphName = keyof typeof STROKE_GLYPHS;
export type FilledGlyphName = keyof typeof FILLED_GLYPHS;
export type GlyphName = StrokeGlyphName | FilledGlyphName;

export function isStrokeGlyph(name: GlyphName): name is StrokeGlyphName {
  return name in STROKE_GLYPHS;
}

export function shapesOf(name: GlyphName): readonly Shape[] {
  return isStrokeGlyph(name) ? STROKE_GLYPHS[name] : FILLED_GLYPHS[name];
}
