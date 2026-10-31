import React from "react";
import classNames from "classnames";

export interface GraffitiHighlightProps {
  className?: string;
}

/**
 * A highlighter swipe behind text.
 *
 * Yellow in both schemes, and the text riding on it stays ink — a marker
 * swipe does not invert, and leaving the ink on top is what keeps it legible
 * on the dark wall.
 *
 * The edges are deliberately uneven and the ends overshoot, because a
 * highlighter drawn by hand does not stop cleanly at a letter.
 */
export function GraffitiHighlight({ className }: GraffitiHighlightProps) {
  return (
    <svg
      viewBox="0 0 300 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={classNames(
        "pointer-events-none absolute text-highlighter",
        className,
      )}
    >
      <path
        d="M4 34c38-9 86-13 142-14 54-1 108 1 150 5-40 8-92 12-148 13-53 1-104-1-144-4z"
        fill="currentColor"
      />
      <path
        d="M10 20c44-8 96-11 150-11 52 0 104 2 138 6-38 6-88 9-142 9-52 0-104-2-146-4z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
