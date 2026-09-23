/** `#rrggbb` → `rgba(r,g,b,alpha)`: a ramp colour at a DESIGN.md-stated alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const value = /^#([0-9a-f]{6})$/i.exec(hex)?.[1];
  if (!value) throw new Error(`withAlpha expects #rrggbb, got ${hex}`);
  const channel = (at: number) => Number.parseInt(value.slice(at, at + 2), 16);
  return `rgba(${channel(0)},${channel(2)},${channel(4)},${alpha})`;
}

type Rgb = readonly [number, number, number];

function parse(color: string): { rgb: Rgb; alpha: number } {
  const hex = /^#([0-9a-f]{6})$/i.exec(color)?.[1];
  if (hex) {
    const channel = (at: number) => Number.parseInt(hex.slice(at, at + 2), 16);
    return { rgb: [channel(0), channel(2), channel(4)], alpha: 1 };
  }
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(color);
  if (rgba) {
    return { rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])], alpha: Number(rgba[4]) };
  }
  throw new Error(`unsupported colour ${color}`);
}

/** A (possibly translucent) colour flattened onto an opaque base. */
function over(color: string, base: Rgb): Rgb {
  const top = parse(color);
  const mix = (i: 0 | 1 | 2) => top.rgb[i] * top.alpha + base[i] * (1 - top.alpha);
  return [mix(0), mix(1), mix(2)];
}

function luminance([r, g, b]: Rgb): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

const WHITE: Rgb = [255, 255, 255];

/**
 * WCAG 2.x contrast ratio of `foreground` on `background`. Translucent colours are flattened: the
 * background onto `backdrop` (default white), then the foreground onto that.
 */
export function contrastRatio(
  foreground: string,
  background: string,
  backdrop = "#ffffff",
): number {
  const bg = over(background, backdrop === "#ffffff" ? WHITE : parse(backdrop).rgb);
  const fg = over(foreground, bg);
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}
