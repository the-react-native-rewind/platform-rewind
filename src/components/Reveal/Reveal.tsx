"use client";

import React from "react";
import { useReveal } from "./useReveal";

export type RevealVariant = "up" | "rise" | "pop" | "tilt";

export interface RevealProps {
  children: React.ReactNode;
  /**
   * `rise` is transform-only and exists for the hero headline: it is the LCP
   * element, and fading it in from transparent would defer the largest paint.
   */
  variant?: RevealVariant;
  /** Milliseconds, for sequencing within a group. */
  delay?: number;
  /** End rotation for `tilt`, e.g. -0.9. */
  tilt?: number;
  as?: "div" | "span" | "li" | "section" | "figure";
  className?: string;
}

/**
 * Reveals its children once, on scroll into view.
 *
 * The hidden state is CSS, scoped to `prefers-reduced-motion: no-preference`,
 * so this component renders plain visible markup for anyone who asked for
 * less motion — and the server-rendered HTML is visible either way.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  tilt,
  as: Component = "div",
  className,
}: RevealProps) {
  const { ref, revealed } = useReveal<HTMLElement>();
  const Tag = Component as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-revealed={revealed ? "" : undefined}
      className={className}
      style={
        {
          ...(delay ? { "--reveal-delay": `${delay}ms` } : {}),
          ...(tilt !== undefined ? { "--tilt": `${tilt}deg` } : {}),
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
