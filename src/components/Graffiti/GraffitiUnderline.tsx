import React from "react";
import classNames from "classnames";
import { TONE_CLASS, type GraffitiTone } from "./graffitiTone";

export interface GraffitiUnderlineProps {
  /** Pen-and-chalk `ink`, or the orange/cyan `mark`. Defaults to `mark`. */
  tone?: GraffitiTone;
  /**
   * One stroke for headings and labels, two for the navigation hover state.
   */
  strokes?: 1 | 2;
  /** Stroke weight in px. Held constant as the stroke stretches. */
  weight?: number;
  /**
   * Draw the stroke on rather than showing it whole. The parent supplies the
   * trigger by setting `data-revealed` on this element's wrapper.
   */
  draw?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Set by a parent that owns the reveal trigger. */
  "data-revealed"?: string;
  /** Marks the navigation's current page, which holds the stroke drawn. */
  "data-active"?: string;
}

/**
 * A hand-drawn underline. Absolutely positioned, so the parent needs
 * `relative` — and `w-fit` if the stroke should match the text rather than
 * the container. The caller supplies the full position and width through
 * `className`; there are no defaults to fight with.
 *
 * The paths stretch horizontally (`preserveAspectRatio="none"`) so one curve
 * serves every width. `vectorEffect="non-scaling-stroke"` keeps the stroke
 * weight even when the box is stretched, which is what stops a long underline
 * reading thinner than a short one.
 */
export function GraffitiUnderline({
  tone = "mark",
  strokes = 1,
  weight = 3.4,
  draw = false,
  className,
  style,
  "data-revealed": dataRevealed,
  "data-active": dataActive,
}: GraffitiUnderlineProps) {
  const shared = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      viewBox={strokes === 2 ? "0 0 100 14" : "0 0 300 10"}
      preserveAspectRatio="none"
      data-draw={draw ? "" : undefined}
      data-revealed={dataRevealed}
      data-active={dataActive}
      style={style}
      aria-hidden="true"
      focusable="false"
      className={classNames(
        "pointer-events-none absolute",
        TONE_CLASS[tone],
        className,
      )}
    >
      {strokes === 2 ? (
        <>
          <path d="M3 6c20-4 50-5 94-2" strokeWidth={weight} {...shared} />
          <path
            d="M10 11c18-3 46-3 84-1"
            strokeWidth={weight * 0.6}
            opacity={0.65}
            {...shared}
          />
        </>
      ) : (
        <path d="M3 7c70-6 168-7 294-3" strokeWidth={weight} {...shared} />
      )}
    </svg>
  );
}
