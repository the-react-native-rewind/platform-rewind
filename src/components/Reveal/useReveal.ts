"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One observer for the whole document, rather than one per element. A card
 * grid can hold a hundred reveals, and a hundred IntersectionObservers is a
 * hundred sets of bookkeeping for the same question.
 */
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(element: Element, onReveal: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    // No observer: reveal immediately rather than leaving content hidden.
    onReveal();
    return () => {};
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          /*
           * Reveal on intersection, or if the element is already above the
           * viewport. A deep link with a hash, a restored scroll position or
           * a fast jump can carry the page past an element without it ever
           * being sampled as intersecting — and it would then sit invisible
           * until the reader happened to scroll back up to it.
           */
          const alreadyPassed = entry.boundingClientRect.bottom < 0;
          if (!entry.isIntersecting && !alreadyPassed) {
            return;
          }
          callbacks.get(entry.target)?.();
          sharedObserver?.unobserve(entry.target);
          callbacks.delete(entry.target);
        });
      },
      // Fire a little before the element is fully on screen, so the motion
      // reads as "already happening" rather than "triggered by me".
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
  }

  callbacks.set(element, onReveal);
  sharedObserver.observe(element);

  return () => {
    sharedObserver?.unobserve(element);
    callbacks.delete(element);
  };
}

/**
 * Reveals once, when the element first comes into view.
 *
 * Never un-reveals. Content that re-hides as you scroll back up is the
 * fastest way to make a page feel broken.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) {
      return;
    }
    return observe(element, () => setRevealed(true));
  }, [revealed]);

  return { ref, revealed };
}
