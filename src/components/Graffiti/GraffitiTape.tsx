import React from "react";
import classNames from "classnames";

export interface GraffitiTapeProps {
  /** Degrees of rotation. Defaults to a slightly-off 24°. */
  rotate?: number;
  className?: string;
}

/**
 * A torn strip of masking tape, for pinning an image to the page — the hero
 * video's corner and the About photo.
 *
 * Deliberately not a token colour: tape is tape in both schemes, so it stays
 * a warm translucent cream and lets whatever is behind it show through.
 */
export function GraffitiTape({ rotate = 24, className }: GraffitiTapeProps) {
  return (
    <div
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute h-7 w-24 bg-[rgba(244,233,214,0.82)] shadow-[0_1px_3px_rgba(28,25,23,0.22)] dark:bg-[rgba(230,218,198,0.5)]",
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
        // Torn edges, left and right
        clipPath:
          "polygon(0% 12%, 5% 0%, 12% 10%, 20% 2%, 88% 4%, 95% 0%, 100% 14%, 96% 92%, 100% 100%, 88% 96%, 14% 100%, 6% 94%, 0% 100%)",
      }}
    />
  );
}
