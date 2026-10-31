import React from "react";
import classNames from "classnames";

export interface GraffitiStickerProps {
  children: React.ReactNode;
  /** Degrees of rotation. The nav logo sits at -7. */
  rotate?: number;
  /** Ink running off the bottom edge, as if the sticker were drawn on wet. */
  drips?: boolean;
  className?: string;
}

/**
 * Wraps a mark so it reads as a sticker slapped on the page: off-axis, with a
 * drop shadow and optional ink drips.
 *
 * The children are the content — this only ever handles the presentation, so
 * a logo inside it keeps its own alt text and link behaviour.
 */
export function GraffitiSticker({
  children,
  rotate = -7,
  drips = false,
  className,
}: GraffitiStickerProps) {
  return (
    <span
      className={classNames("relative inline-block", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 2px 3px rgba(28,25,23,0.28))",
      }}
    >
      {children}
      {drips && (
        <svg
          viewBox="0 0 40 34"
          aria-hidden="true"
          focusable="false"
          className="sticker-drips pointer-events-none absolute left-1/2 top-full h-5 w-6 -translate-x-1/2 text-ink-light opacity-85 dark:text-ink-dark"
        >
          <path
            d="M12 0c-1 8 2 12 1 18s-4 6-3 11c.4 2 3 3.4 4.4 1.6 1.6-2-.6-4-1-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <path
            d="M24 2c1 6-2 9-1.4 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <circle cx="14" cy="31" r="1.9" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
