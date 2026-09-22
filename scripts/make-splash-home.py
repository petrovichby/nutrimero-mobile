#!/usr/bin/env python
"""Generate the Home Baker splash marks from the source icon artwork.

Reads __artifacts__/raw/icon/icon-home-warm.png (golden field #dfa21c, rust
#863414 loaf + divider ornament), keys out the golden background, despeckles
the grain, and exports two 1024x1024 transparent splash images with the mark
centered at ~15% padding:

  apps/home-baker/assets/splash-icon.png       - mark in rust #863414 (light)
  apps/home-baker/assets/splash-icon-dark.png  - mark in butter gold #dfa621 (dark)

Idempotent: deterministic output from the same source; the source artwork is
never modified. Run with ~/Projects/venv/bin/python.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE = REPO_ROOT / "__artifacts__" / "raw" / "icon" / "icon-home-warm.png"
OUT_DIR = REPO_ROOT / "apps" / "home-baker" / "assets"

FIELD_GOLD = (0xDF, 0xA2, 0x1C)  # artwork background (slightly off the token)
MARK_RUST = (0x86, 0x34, 0x14)  # home-action mark, light splash
TOKEN_GOLD = (0xDF, 0xA6, 0x21)  # app-accent-home butter gold, dark splash

CANVAS = 1024
PADDING = 0.15  # fraction of canvas on each side
MIN_COMPONENT_PX = 300  # drop grain speckles smaller than this


def extract_alpha(img: Image.Image) -> np.ndarray:
    """Key out the golden field: alpha from relative RGB distance to field vs mark."""
    rgb = np.asarray(img.convert("RGB"), dtype=np.float64)
    d_field = np.linalg.norm(rgb - np.array(FIELD_GOLD, dtype=np.float64), axis=-1)
    d_mark = np.linalg.norm(rgb - np.array(MARK_RUST, dtype=np.float64), axis=-1)
    # 0 where the pixel matches the field, 1 where it matches the mark; the
    # ramp between keeps anti-aliased edges soft.
    t = d_field / np.maximum(d_field + d_mark, 1e-9)
    alpha = np.clip((t - 0.35) / 0.30, 0.0, 1.0)
    return (alpha * 255).astype(np.uint8)


def despeckle(alpha: np.ndarray) -> np.ndarray:
    """Median-filter the grain, then drop tiny connected components."""
    smoothed = np.asarray(
        Image.fromarray(alpha, mode="L").filter(ImageFilter.MedianFilter(5))
    )
    solid = smoothed >= 128
    keep = np.zeros_like(solid)
    seen = np.zeros_like(solid)
    h, w = solid.shape
    for sy, sx in zip(*np.nonzero(solid)):
        if seen[sy, sx]:
            continue
        stack = [(sy, sx)]
        seen[sy, sx] = True
        component = []
        while stack:
            y, x = stack.pop()
            component.append((y, x))
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        if len(component) >= MIN_COMPONENT_PX:
            ys, xs = zip(*component)
            keep[ys, xs] = True
    # Keep soft (sub-threshold) alpha only next to surviving solid pixels so
    # edges stay anti-aliased but isolated speckles vanish entirely.
    halo = np.asarray(
        Image.fromarray(keep.astype(np.uint8) * 255, mode="L").filter(
            ImageFilter.MaxFilter(5)
        )
    )
    return np.where(halo > 0, smoothed, 0).astype(np.uint8)


def compose(alpha: np.ndarray, color: tuple[int, int, int]) -> Image.Image:
    """Center the mark on a transparent 1024x1024 canvas with ~15% padding."""
    mask = Image.fromarray(alpha, mode="L")
    bbox = mask.getbbox()
    if bbox is None:
        raise SystemExit("mark extraction produced an empty mask")
    mask = mask.crop(bbox)
    box = round(CANVAS * (1 - 2 * PADDING))
    scale = min(box / mask.width, box / mask.height)
    mask = mask.resize(
        (max(1, round(mask.width * scale)), max(1, round(mask.height * scale))),
        Image.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    flat = Image.new("RGBA", mask.size, (*color, 255))
    flat.putalpha(mask)
    canvas.paste(
        flat, ((CANVAS - mask.width) // 2, (CANVAS - mask.height) // 2), flat
    )
    return canvas


def main() -> None:
    source = Image.open(SOURCE)
    alpha = despeckle(extract_alpha(source))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    compose(alpha, MARK_RUST).save(OUT_DIR / "splash-icon.png")
    compose(alpha, TOKEN_GOLD).save(OUT_DIR / "splash-icon-dark.png")
    print(f"wrote {OUT_DIR / 'splash-icon.png'}")
    print(f"wrote {OUT_DIR / 'splash-icon-dark.png'}")


if __name__ == "__main__":
    main()
