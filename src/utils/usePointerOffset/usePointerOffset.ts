"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Beyond this distance from centre the pull is already at full strength. */
const REACH_CAP = 120;

export interface PointerOffsetOptions {
  /** Maximum travel in px, on each axis. */
  strength?: number;
  /**
   * How far outside the element the pointer still counts, in px. A magnetic
   * button wants a small halo; the splash wants a large one.
   */
  radius?: number;
}

/**
 * Nudges an element toward the pointer.
 *
 * Gated on a fine pointer and on motion being welcome, so it never runs on
 * touch — where there is no hover and the effect would only fire mid-tap —
 * and never for a reader who asked for less movement.
 *
 * Reads are batched into a frame and the result is applied as a transform, so
 * moving the mouse never triggers layout.
 */
export function usePointerOffset<T extends Element>({
  strength = 4,
  radius = 0,
}: PointerOffsetOptions = {}) {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") {
      return;
    }

    const allowed =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (!allowed) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      if (frame.current !== null) {
        return;
      }
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const box = element.getBoundingClientRect();
        const centreX = box.left + box.width / 2;
        const centreY = box.top + box.height / 2;
        const dx = event.clientX - centreX;
        const dy = event.clientY - centreY;

        /*
         * Normalise against a capped half-size plus the halo. Using the raw
         * half-size makes the pull vanish on a wide element — a full-width
         * CTA would move a fraction of a pixel — because the same cursor
         * travel is a much smaller fraction of a long box. The cap means the
         * pull reaches full strength at a consistent distance whatever the
         * element's size.
         */
        const reachX = Math.min(box.width / 2, REACH_CAP) + radius;
        const reachY = Math.min(box.height / 2, REACH_CAP) + radius;
        const withinReach = Math.abs(dx) <= reachX && Math.abs(dy) <= reachY;

        if (!withinReach) {
          setOffset((previous) =>
            previous.x === 0 && previous.y === 0 ? previous : { x: 0, y: 0 },
          );
          return;
        }

        setOffset({
          x: Math.max(-1, Math.min(1, dx / reachX)) * strength,
          y: Math.max(-1, Math.min(1, dy / reachY)) * strength,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", reset, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", reset);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [radius, strength, reset]);

  return { ref, offset };
}
