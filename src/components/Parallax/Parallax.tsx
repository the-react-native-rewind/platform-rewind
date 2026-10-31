"use client";

import React, { useEffect, useRef } from "react";

export interface ParallaxProps {
  /**
   * How far this drifts, in px, across a full pass through the viewport.
   * Give two things in the same block different values and they separate —
   * that separation is the whole effect.
   */
  distance?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Drifts its children as the page scrolls past.
 *
 * The travel is one-directional: everything starts where the layout put it
 * and rises by `distance` as the block crosses the viewport. A parallax
 * centred on zero would sit half its travel *below* its resting spot on the
 * way in, which pushes anything anchored to the bottom of a clipped block
 * out through the bottom of it.
 *
 * The transform is the only thing written, and only while the block is on
 * screen. Reduced motion gets nothing at all — this is decoration, and
 * decoration tied to scrolling is exactly what that setting is asking not
 * to be given.
 */
export function Parallax({
  distance = 40,
  className,
  children,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    let frame: number | null = null;
    let onScreen = false;

    const apply = () => {
      frame = null;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 as the block's top reaches the bottom of the screen, 1 once its
      // bottom has left the top. The span covers both so the drift is spread
      // over the whole pass rather than finishing early on a tall block.
      const span = viewport + rect.height;
      const travelled = Math.min(Math.max((viewport - rect.top) / span, 0), 1);
      element.style.transform = `translate3d(0, ${(-travelled * distance).toFixed(2)}px, 0)`;
    };

    const request = () => {
      if (frame !== null || !onScreen) return;
      frame = requestAnimationFrame(apply);
    };

    // Off screen it stops reading layout entirely; several of these run on a
    // page and a scroll handler that measures all of them on every frame is
    // the thing that makes a page like this feel heavy.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) request();
    });
    observer.observe(element);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    apply();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
