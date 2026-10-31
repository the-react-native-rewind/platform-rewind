"use client";

import React from "react";
import classNames from "classnames";
import { usePointerOffset } from "@/utils/usePointerOffset/usePointerOffset";

export interface GraffitiSplashProps {
  className?: string;
}

/**
 * The orange paint blob, with drips and speckles.
 *
 * **One per page, maximum.** It is the loudest thing in the vocabulary and a
 * second one immediately reads as wallpaper rather than a mark.
 *
 * Unlike the rest of the set this does not invert — spray paint does not care
 * what it is sprayed on, so it stays `primary` in both schemes.
 */
export function GraffitiSplash({ className }: GraffitiSplashProps) {
  const { ref, offset } = usePointerOffset<SVGSVGElement>({
    strength: 6,
    radius: 180,
  });

  return (
    <svg
      ref={ref}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      viewBox="0 0 200 330"
      aria-hidden="true"
      focusable="false"
      className={classNames(
        "pointer-events-none text-primary transition-transform duration-500 ease-out",
        className,
      )}
    >
      <g fill="currentColor">
        {/* Blob */}
        <path d="M126 26c-18-10-44-4-58 14-13 17-6 34-16 47-11 14-31 15-35 32-4 18 15 27 13 43-2 17-19 25-12 41 7 17 31 13 45 3 15-11 17-30 31-38 13-8 30 0 40-11 6-6 7-14 6-22-1-13-9-22-6-35 3-14 16-22 12-38-3-14-14-22-20-24z" />
        {/* Drips */}
        <path d="M104 208c6 30 4 54 10 82 2 11-11 14-14 4-8-27-11-58-12-87z" />
        <path d="M62 224c4 33 11 58 12 87 0 10-12 12-15 3-8-28-13-61-14-91z" />
        <path d="M140 186c5 19 4 34 8 51 2 9-9 12-12 3-6-17-8-36-10-53z" />
        {/* Speckles */}
        <path d="M86 6c9-5 18 2 15 12-3 9-17 10-21 3-3-6 0-13 6-15z" />
        <path d="M148 62c8-3 13 5 8 12-5 6-15 5-17-2-2-6 3-9 9-10z" />
        <path d="M28 40c7-3 12 4 8 10-4 6-13 5-15-1-2-5 2-8 7-9z" />
      </g>
    </svg>
  );
}
