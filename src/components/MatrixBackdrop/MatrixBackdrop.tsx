"use client";

import React, { useEffect, useRef } from "react";

const INK = "#0B0D0B";
const RAIN = "rgba(74, 222, 128, 0.55)";
const RAIN_HEAD = "rgba(190, 255, 214, 0.95)";
const TEXT = "rgba(110, 231, 160, 0.72)";
const TEXT_DIM = "rgba(110, 231, 160, 0.45)";

const COLUMN_WIDTH = 14;
const ROW_HEIGHT = 15;
/** Matrix rain reads better choppy than smooth, and costs less that way. */
const FPS = 18;

/** The chipped edge, in px. */
const CHIP = 8;
/** Deepest the page eats into the block, in chips. */
const CHIP_DEPTH = 4;
/** How often a few chips are re-cut, in ms. */
const CHIP_INTERVAL = 2600;

/**
 * The set dressing, anchored to a corner so it reflows instead of being
 * positioned in pixels. Drawn from the edges inward, because the middle of
 * this block belongs to the headline.
 */
const BLOCKS: {
  corner: "tl" | "tr" | "bl" | "br";
  lines: string[];
  dim?: boolean;
  /** Hidden below this width, so a phone does not get a wall of text. */
  minWidth?: number;
}[] = [
  {
    corner: "tl",
    lines: [
      "> booting universe42.exe",
      "> initializing reality...",
      "> loading dimensions...",
      "> compiling consciousness...",
      "> injecting chaos...",
      "> connection established ✓",
    ],
  },
  {
    corner: "tr",
    lines: [
      "const universe = new Reality();",
      "if (coffee) {",
      "  continue();",
      "}",
      "await loadWorld();",
    ],
    minWidth: 900,
  },
  {
    corner: "bl",
    lines: [
      "// alternate timelines",
      "// higher consciousness",
      "// same weird humans",
    ],
    dim: true,
    minWidth: 600,
  },
  {
    corner: "br",
    lines: [
      "> npm run newsletter",
      "> connecting...",
      "> almost there...",
      "> subscribed ✓",
    ],
    minWidth: 720,
  },
];

const GLYPHS = "01";

/**
 * Falling code, drawn rather than filmed.
 *
 * A video or an image is a fixed grid of pixels, and this block runs the full
 * width of the page — on a 2x display it was being upscaled past 2x, which is
 * what softens glyph detail no matter the bitrate. A canvas is sized to the
 * device's own pixels, so it is sharp at any width and costs no download.
 *
 * Skipped entirely for a reader who asked for less motion: they get one
 * static frame rather than a blank panel. Paused off screen too, because an
 * article can carry two of these.
 */
export interface MatrixBackdropProps {
  /**
   * `band` is the subscribe block: chipped edges where the page breaks away.
   * `full` fills the screen, so there is no page beside it to chip into.
   */
  variant?: "band" | "full";
}

export function MatrixBackdrop({ variant = "band" }: MatrixBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const wantsMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let chipTop: number[] = [];
    let chipBottom: number[] = [];
    let crumbs: { x: number; y: number }[] = [];
    let lastChip = 0;

    /*
     * The page colour, read off the body rather than hard-coded. The block is
     * dark in both schemes but the page behind it is not — cream in light,
     * near-black in dark — and these chips are meant to be the page showing
     * through, so they have to be whatever it currently is.
     */
    let paper = "#FEF4E8";
    const readPaper = () => {
      const found = getComputedStyle(document.body).backgroundColor;
      if (found && found !== "rgba(0, 0, 0, 0)") {
        paper = found;
      }
    };
    let frame: number | null = null;
    let last = 0;
    let running = false;

    /*
     * How deep the page eats into the block, per chip column.
     *
     * Each column steps at most one chip from its neighbour, so the edge
     * reads as one broken line rather than a row of unrelated towers. On a
     * recut only about an eighth of the columns move, which is what makes it
     * look like it is still eroding rather than being redrawn.
     */
    const cutChips = (fresh: boolean) => {
      const columns = Math.ceil(width / CHIP) + 1;

      const cut = (previous: number[]) => {
        const next: number[] = [];
        for (let i = 0; i < columns; i++) {
          if (!fresh && previous[i] !== undefined && Math.random() > 0.12) {
            next[i] = previous[i];
            continue;
          }
          const last = next[i - 1] ?? Math.floor(Math.random() * CHIP_DEPTH);
          const step = Math.round(Math.random() * 2) - 1;
          next[i] = Math.max(0, Math.min(CHIP_DEPTH, last + step));
        }
        return next;
      };

      chipTop = cut(chipTop);
      chipBottom = cut(chipBottom);

      // Loose chips past the edge, so it crumbles instead of stepping.
      crumbs = [];
      for (let i = 0; i < columns; i++) {
        if (Math.random() > 0.08) continue;
        const fromTop = Math.random() > 0.5;
        const depth = (fromTop ? chipTop[i] : chipBottom[i]) + 1;
        const extra = depth + Math.floor(Math.random() * 3);
        crumbs.push({
          x: i * CHIP,
          y: fromTop ? extra * CHIP : height - (extra + 1) * CHIP,
        });
      }
    };

    const drawChips = () => {
      context.fillStyle = paper;
      for (let i = 0; i < chipTop.length; i++) {
        if (chipTop[i] > 0) {
          context.fillRect(i * CHIP, 0, CHIP, chipTop[i] * CHIP);
        }
        if (chipBottom[i] > 0) {
          context.fillRect(
            i * CHIP,
            height - chipBottom[i] * CHIP,
            CHIP,
            chipBottom[i] * CHIP,
          );
        }
      }
      for (const crumb of crumbs) {
        context.fillRect(crumb.x, crumb.y, CHIP, CHIP);
      }
    };

    const setup = () => {
      const box = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      if (width === 0 || height === 0) {
        return;
      }

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw against the backing store, not the box that produced it.
      // Rounding up to whole device pixels leaves the box a fraction of a
      // pixel short of the canvas, and every fill here is anchored to that
      // short height — so the last device row went unpainted and the dark
      // section behind the canvas showed through it as a hairline along the
      // bottom edge of the block.
      width = canvas.width / dpr;
      height = canvas.height / dpr;

      // Start each column at a random height so it does not begin as one
      // straight line of heads marching down together.
      const columns = Math.ceil(width / COLUMN_WIDTH);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / ROW_HEIGHT),
      );

      cutChips(true);

      context.fillStyle = INK;
      context.fillRect(0, 0, width, height);
    };

    const drawBlocks = () => {
      context.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textBaseline = "top";

      for (const block of BLOCKS) {
        if (block.minWidth && width < block.minWidth) {
          continue;
        }
        context.fillStyle = block.dim ? TEXT_DIM : TEXT;

        const top = block.corner.startsWith("t");
        const left = block.corner.endsWith("l");
        context.textAlign = left ? "left" : "right";

        const x = left ? 28 : width - 28;
        const blockHeight = block.lines.length * 16;
        /*
         * Cleared of the chipped edge rather than inset by a fixed amount, so
         * the two stay in step. At a flat 22px the deepest chips were biting
         * into the first line of the log and it read as damaged text rather
         * than a damaged edge.
         */
        const inset = CHIP_DEPTH * CHIP + 12;
        const y = top ? inset : height - blockHeight - inset;

        block.lines.forEach((line, index) => {
          context.fillText(line, x, y + index * 16);
        });
      }
    };

    const drawRain = () => {
      // A translucent wash instead of a clear, so heads leave a trail.
      context.fillStyle = "rgba(11, 13, 11, 0.12)";
      context.fillRect(0, 0, width, height);

      context.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "left";
      context.textBaseline = "top";

      for (let i = 0; i < drops.length; i++) {
        const x = i * COLUMN_WIDTH;
        const y = drops[i] * ROW_HEIGHT;
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

        context.fillStyle = RAIN_HEAD;
        context.fillText(glyph, x, y);

        // The character just above the head, dimmer, which is what makes a
        // column read as falling rather than as a row of dots.
        context.fillStyle = RAIN;
        context.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          x,
          y - ROW_HEIGHT,
        );

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }

      drawBlocks();

      /*
       * The wash lives here rather than in a div over the canvas, because the
       * chips have to sit above it. Over the top they would be dimmed by it
       * and stop matching the page they are pretending to be.
       */
      const vignette = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7,
      );
      vignette.addColorStop(0, "rgba(11, 13, 11, 0.92)");
      vignette.addColorStop(0.45, "rgba(11, 13, 11, 0.72)");
      vignette.addColorStop(1, "rgba(11, 13, 11, 0.42)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (variant === "band") {
        drawChips();
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 1000 / FPS) {
        return;
      }
      last = now;
      if (now - lastChip > CHIP_INTERVAL) {
        lastChip = now;
        cutChips(false);
      }
      drawRain();
    };

    const start = () => {
      if (running || !wantsMotion) {
        return;
      }
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    readPaper();
    setup();
    // One frame regardless, so reduced motion and the moment before the
    // observer fires both show the texture rather than a black panel.
    drawRain();

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "200px 0px" },
    );
    observer.observe(parent);

    const resizeObserver = new ResizeObserver(() => {
      setup();
      drawRain();
    });
    resizeObserver.observe(parent);

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      readPaper();
      drawRain();
    };
    scheme.addEventListener("change", onScheme);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      scheme.removeEventListener("change", onScheme);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    />
  );
}
