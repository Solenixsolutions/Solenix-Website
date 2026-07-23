#!/usr/bin/env python3
"""Generate WebP siblings for every photo the site serves.

Part 2.6 performance: the site serves WebP (via <picture> for <img>s and CSS
image-set() for backgrounds) with the original JPEG as automatic fallback. Run
this after adding or replacing any photo:

    python tools/gen-webp.py        # requires Pillow:  pip install Pillow

Each source JPEG gets a same-basename `.webp` next to it. A missing .webp is
non-fatal (the <picture>/image-set fallback uses the JPEG) — running this just
keeps the ~50% size win. Encoding is deterministic, so re-running is a no-op.

Scope = the photos the site references: hero-bg, cta-bg, factory, and every
products/*.jpg (so new product photos are picked up automatically). The unused
solar-banner.jpg is intentionally skipped.
"""
import glob
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.normpath(os.path.join(HERE, "..", "images"))
QUALITY, METHOD = 80, 6  # method=6 = max compression effort

targets = [os.path.join(IMG, n) for n in ("hero-bg.jpg", "cta-bg.jpg", "factory.jpg")]
targets += sorted(glob.glob(os.path.join(IMG, "products", "*.jpg")))


def main():
    total_j = total_w = 0
    for src in targets:
        dst = os.path.splitext(src)[0] + ".webp"
        Image.open(src).convert("RGB").save(dst, "WEBP", quality=QUALITY, method=METHOD)
        j, w = os.path.getsize(src), os.path.getsize(dst)
        total_j += j
        total_w += w
        print(f"  {os.path.relpath(dst, IMG).replace(os.sep, '/'):22s} {j:>7d} -> {w:>7d}")
    n = len(targets)
    print(f"gen-webp: {n} images, {total_j} -> {total_w} bytes "
          f"({100 * (total_j - total_w) / total_j:.1f}% smaller)")


if __name__ == "__main__":
    main()
