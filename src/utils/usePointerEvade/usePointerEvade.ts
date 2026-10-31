"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PointerEvadeOptions {
  /**
   * Maximum travel in px. **Load-bearing.** Keep it under half the element's
   * smallest side: at exactly half, the element can step out from under a
   * stationary cursor and stop being clickable at all.
   */
  strength?: number;
  /** How far away the pointer starts to be noticed, in px from the centre. */
  reach?: number;
}

/**
 * Slides an element away from the pointer.
 *
 * The inverse of `usePointerOffset`, and deliberately not that hook with a
 * negative strength. That one ramps the offset up with distance, which for a
 * pull is right — far away, nothing; close, a tug. Flipping its sign gives
 * something that flees hardest when the pointer is furthest away and goes
 * limp as it closes in, which reads as a bug rather than as shyness. Here the
 * displacement grows as the pointer *approaches*, so the thing backs away.
 *
 * It stays clickable on purpose. With `strength` under half the element's
 * smallest side, a pointer that reaches the old centre is still inside the
 * moved element, so the chase always ends in a catch.
 *
 * Gated on a fine pointer and on motion being welcome, so it never runs on
 * touch — where there is no hover and it would only fire mid-tap — and never
 * for a reader who asked for less movement. In both cases the element simply
 * sits still and behaves like any other link.
 *
 * Reads are batched into a frame and applied as a transform, so moving the
 * mouse never triggers layout.
 */
export function usePointerEvade<T extends Element>({
  strength = 24,
  reach = 140,
}: PointerEvadeOptions = {}) {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const reset = useCallback(
    () =>
      setOffset((previous) =>
        previous.x === 0 && previous.y === 0 ? previous : { x: 0, y: 0 },
      ),
    [],
  );

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

        /*
         * Measured from where the element started, not where it has drifted
         * to. Reading the live box would feed the element's own movement back
         * in: it shifts, the distance changes, it shifts again, and it drifts
         * off on its own without the pointer having moved.
         *
         * The displacement is read back off the computed transform rather
         * than taken from state. State holds the target, while the box is
         * wherever the transition currently has it — during the glide those
         * disagree, and subtracting the target from a mid-flight box puts
         * home in the wrong place for as long as the element is moving.
         */
        const box = element.getBoundingClientRect();
        const matrix = new DOMMatrixReadOnly(
          window.getComputedStyle(element).transform,
        );
        const homeX = box.left + box.width / 2 - matrix.m41;
        const homeY = box.top + box.height / 2 - matrix.m42;

        const dx = event.clientX - homeX;
        const dy = event.clientY - homeY;
        const distance = Math.hypot(dx, dy);

        if (distance >= reach || distance < 0.5) {
          reset();
          return;
        }

        /*
         * Two falloffs, and the inner one is the important one.
         *
         * `escape` is the obvious half: hardest push when the pointer is
         * closest, easing to nothing at the edge of reach, so it backs away
         * rather than lunging in from a corner.
         *
         * `settle` fades the push back out over the last half-width. Without
         * it the element shakes when the pointer sits on its centre: the
         * direction is dx/dy normalised, so at a couple of pixels from home
         * the faintest tremor from the mouse swings it right round while the
         * push is still near full strength, and the element jitters on the
         * spot. Scaling the magnitude to zero exactly where the direction
         * stops being meaningful kills that at the source — and it means
         * that once the pointer is genuinely on the logo it stops running
         * and sits still to be clicked.
         */
        const halfSize = Math.min(box.width, box.height) / 2;
        const escape = 1 - distance / reach;
        const settle = Math.min(1, distance / halfSize);
        const push = escape * settle * strength;
        setOffset({
          x: (-dx / distance) * push,
          y: (-dy / distance) * push,
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
  }, [reach, strength, reset]);

  return { ref, offset };
}
