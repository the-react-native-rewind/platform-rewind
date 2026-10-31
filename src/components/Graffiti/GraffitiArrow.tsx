import React from "react";
import classNames from "classnames";
import { TONE_CLASS, type GraffitiTone } from "./graffitiTone";

/**
 * Preset paths, deliberately not a generator. A curve generator produced
 * arrows that technically connected two points and read as noise; these are
 * drawn.
 */
const ARROWS = {
  /** Sweeps down and left — video down to the email input on the homepage. */
  "curve-down-left": {
    viewBox: "0 0 44 86",
    d: "M38 6C36 32 28 56 8 74M8 74l1-17M8 74l17-2",
  },
  /** Mirror of the above. */
  "curve-down-right": {
    viewBox: "0 0 44 86",
    d: "M6 6C8 32 16 56 36 74M36 74l-1-17M36 74l-17-2",
  },
} as const;

export type GraffitiArrowVariant = keyof typeof ARROWS;

export interface GraffitiArrowProps {
  variant?: GraffitiArrowVariant;
  tone?: GraffitiTone;
  /** Draw the stroke on instead of showing it whole. */
  draw?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Set by a parent that owns the reveal trigger. */
  "data-revealed"?: string;
}

export function GraffitiArrow({
  variant = "curve-down-left",
  tone = "ink",
  draw = false,
  className,
  style,
  "data-revealed": dataRevealed,
}: GraffitiArrowProps) {
  const arrow = ARROWS[variant];

  return (
    <svg
      viewBox={arrow.viewBox}
      data-draw={draw ? "" : undefined}
      data-revealed={dataRevealed}
      style={style}
      aria-hidden="true"
      focusable="false"
      className={classNames("pointer-events-none", TONE_CLASS[tone], className)}
    >
      <path
        d={arrow.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
