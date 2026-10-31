import React from "react";
import classNames from "classnames";
import { TONE_CLASS, type GraffitiTone } from "./graffitiTone";

/**
 * A closed set, on purpose. The brief was explicit about not scattering
 * doodles across the page, and an open-ended set is how that happens.
 * Adding a sixth needs a design decision, not just a new path.
 */
const DOODLES = {
  star: {
    viewBox: "0 0 24 24",
    d: "M12 2l2.6 6.6L21 10l-5 4.2 1.7 7-5.7-4-5.7 4 1.7-7L3 10l6.4-1.4z",
    weight: 1.8,
    join: "round" as const,
  },
  crown: {
    viewBox: "0 0 60 40",
    d: "M5 33L3 10l13 11L30 4l14 17 13-11-2 23z",
    weight: 3,
    join: "round" as const,
  },
  spark: {
    viewBox: "0 0 40 40",
    d: "M6 22L22 8M14 32L30 16M2 8l6 4M20 36l4-6",
    weight: 2.6,
    join: "round" as const,
  },
  tick: {
    viewBox: "0 0 16 26",
    d: "M4 2c-1 8 0 14 8 19M12 21l-6-1",
    weight: 2.2,
    join: "round" as const,
  },
} as const;

export type GraffitiDoodleName = keyof typeof DOODLES;

export interface GraffitiDoodleProps {
  name: GraffitiDoodleName;
  tone?: GraffitiTone;
  /** Draw the stroke on instead of showing it whole. */
  draw?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Set by a parent that owns the reveal trigger. */
  "data-revealed"?: string;
}

export function GraffitiDoodle({
  name,
  tone = "ink",
  draw = false,
  className,
  style,
  "data-revealed": dataRevealed,
}: GraffitiDoodleProps) {
  const doodle = DOODLES[name];

  return (
    <svg
      viewBox={doodle.viewBox}
      data-draw={draw ? "" : undefined}
      data-revealed={dataRevealed}
      style={style}
      aria-hidden="true"
      focusable="false"
      className={classNames("pointer-events-none", TONE_CLASS[tone], className)}
    >
      <path
        d={doodle.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={doodle.weight}
        strokeLinecap="round"
        strokeLinejoin={doodle.join}
      />
    </svg>
  );
}
