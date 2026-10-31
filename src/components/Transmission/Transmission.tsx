"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  playBeamUp,
  playTerminalOpen,
  startTypeInLoop,
  stopTransmissionSounds,
  stopTypeInLoop,
} from "@/utils/transmissionSound/transmissionSound";

/** How long the digits take to cover the page. */
const FILL_MS = 2400;
/** How long they then take to thin out to the field behind the message. */
const THIN_MS = 800;
/**
 * How long the beam runs before the transmission comes through. The fill and
 * the thinning back to back, plus a beat at full strength between them.
 */
const BEAM_MS = FILL_MS + THIN_MS + 250;
/**
 * The share of cells showing a digit once the field has settled. The rest
 * stay black, and which cells are which keeps changing.
 */
const FIELD_RATIO = 0.3;
/** How often cells swap in and out of the field. */
const CHURN_MS = 90;
/** How much of the field swaps on each of those. */
const CHURN_RATE = 0.02;
/** Cell size, and the digit drawn in it. */
const CELL_W = 14;
const CELL_H = 18;
const FONT_PX = 13;
/** How often a handful of digits re-roll. */
const ROLL_MS = 70;
const INK = "#0B0D0B";
const CHAR_MS = 29;
/** Beat between lines, in characters' worth of time. */
const LINE_PAUSE = 22;

/**
 * The arrival.
 *
 * The page is taken a cell at a time: each one blacks out and a digit lands
 * on it, at full strength the moment it appears. Nothing fades — the screen
 * is eaten rather than dissolved, which is the difference between a machine
 * claiming the page and a slideshow changing slides. Once every cell is
 * taken most of the digits drop away again, and what is left is the field
 * the message is read against.
 *
 * Cell by cell, so nothing here flips the whole screen's brightness at once
 * — the thing that carries a seizure risk.
 */
function Beam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columns = Math.ceil(width / CELL_W);
    const rows = Math.ceil(height / CELL_H);
    const total = columns * rows;

    // The order the screen is taken in. Shuffled once: picking a random
    // cell each frame revisits cells it has already taken, so the fill
    // slows to a crawl long before the screen is actually covered.
    const order = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    // Which cells are currently showing a digit. Held as state and churned
    // rather than decided up front, so the settled field keeps moving
    // instead of freezing into one arrangement.
    const lit = new Uint8Array(total);
    let litCount = 0;
    let litCursor = 0;
    const digits = order.map(() => Math.floor(Math.random() * 10));

    let frame: number | null = null;
    const startedAt = performance.now();
    let lastRoll = startedAt;
    let lastChurn = startedAt;

    /** Turns `count` cells on or off, chosen from the ones already taken. */
    const flip = (count: number, taken: number, on: 0 | 1) => {
      let left = count;
      // Bounded: once the field is nearly all one way, random picks stop
      // finding candidates and this would spin.
      let guard = taken * 2;
      while (left > 0 && guard-- > 0) {
        const cell = order[Math.floor(Math.random() * taken)];
        if (lit[cell] === on) continue;
        lit[cell] = on;
        litCount += on === 1 ? 1 : -1;
        left--;
      }
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const t = now - startedAt;

      // A few digits change each frame so the field reads as live rather
      // than as a printed page.
      if (now - lastRoll > ROLL_MS) {
        lastRoll = now;
        for (let n = 0; n < total * 0.04; n++) {
          digits[Math.floor(Math.random() * total)] = Math.floor(
            Math.random() * 10,
          );
        }
      }

      const filling = Math.min(t / FILL_MS, 1);
      const taken = Math.floor(filling * total);

      // A cell lights up as it is taken, so the page is covered by a full
      // field of digits rather than a sparse one.
      while (litCursor < taken) {
        lit[order[litCursor]] = 1;
        litCount++;
        litCursor++;
      }

      // Then the field thins to FIELD_RATIO and stays there, swapping which
      // cells are lit. The black underneath is never given back.
      const thinning = Math.min(Math.max(t - FILL_MS, 0) / THIN_MS, 1);
      const ratio = 1 - (1 - FIELD_RATIO) * thinning;
      const desired = Math.round(taken * ratio);

      if (taken > 0 && now - lastChurn > CHURN_MS) {
        lastChurn = now;
        if (litCount > desired) flip(litCount - desired, taken, 0);
        else if (litCount < desired) flip(desired - litCount, taken, 1);

        // Swap a few even once the count is where it should be, so cells
        // keep arriving and leaving instead of the field going still.
        const swap = Math.round(taken * CHURN_RATE);
        flip(swap, taken, 0);
        flip(swap, taken, 1);
      }

      // A concrete stack: canvas resolves no CSS variables, and an invalid
      // font string is dropped silently, leaving the default 10px sans.
      context.font = `${FONT_PX}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textBaseline = "top";

      for (let i = 0; i < taken; i++) {
        const cell = order[i];
        const x = (cell % columns) * CELL_W;
        const y = Math.floor(cell / columns) * CELL_H;

        // The black is what takes the page, and it is never given back —
        // only the digit on top of it comes and goes.
        context.fillStyle = INK;
        context.fillRect(x, y, CELL_W, CELL_H);

        if (!lit[cell]) continue;

        context.fillStyle =
          cell % 11 === 0
            ? "rgba(214, 255, 233, 0.92)"
            : "rgba(80, 214, 136, 0.9)";
        context.fillText(String(digits[cell]), x + 2, y + 1);
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}

export interface TransmissionProps {
  lines: string[];
  preview?: boolean;
  onDismiss: () => void;
}

/**
 * The full-screen takeover after a successful subscribe.
 *
 * The signal breaks up, then the transmission types itself out over the
 * falling code, and the only thing to do at the end is go and confirm.
 *
 * Reduced motion gets the message whole and immediately — no snow, no
 * typing. The animated copy is hidden from assistive tech and a complete copy
 * sits beside it, so a screen reader is read the message once rather than
 * being told it a character at a time.
 */
export function Transmission({ lines, preview = false, onDismiss }: TransmissionProps) {
  /*
   * Portals need a DOM to portal into, and this renders on the server first.
   * Without the guard `document.body` is read during the server pass and
   * throws — today only reachable if the success state were ever true on a
   * first render, which is a footgun worth removing rather than relying on.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [phase, setPhase] = useState<"beam" | "message">("beam");
  const [typed, setTyped] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const totalChars = lines.reduce((sum, line) => sum + line.length + LINE_PAUSE, 0);
  const fullText = lines.join(" ");
  const done = typed >= totalChars;

  // Everything the takeover does to the page, undone on the way out.
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
        return;
      }
      // Any other key finishes the typing. At a readable speed the whole
      // message runs close to twenty seconds, and someone who has read ahead
      // should not have to wait for the machine to catch up.
      setTyped(totalChars);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      returnTo?.focus?.();
    };
  }, [onDismiss, totalChars]);

  useEffect(() => {
    const wantsMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    // The whoosh marks the arrival. Reduced motion skips the cells, but the
    // takeover is still the beam-up, so the sound still plays once.
    playBeamUp();

    if (!wantsMotion) {
      const skip = window.setTimeout(() => {
        setPhase("message");
        setTyped(totalChars);
      }, 0);
      return () => window.clearTimeout(skip);
    }

    const timer = window.setTimeout(() => setPhase("message"), BEAM_MS);
    return () => window.clearTimeout(timer);
  }, [totalChars]);

  // The terminal arriving: one beep, then the chirps under the characters.
  // The loop is one voice for the whole message, and it ends when the typing
  // does, including when a key or a click skips ahead.
  useEffect(() => {
    if (phase !== "message") return;
    playTerminalOpen();
  }, [phase]);

  useEffect(() => {
    if (phase !== "message" || done) return;
    startTypeInLoop();
    return () => stopTypeInLoop();
  }, [phase, done]);

  useEffect(() => () => stopTransmissionSounds(), []);

  useEffect(() => {
    if (phase !== "message" || done) return;
    const timer = window.setInterval(() => setTyped((n) => n + 1), CHAR_MS);
    return () => window.clearInterval(timer);
  }, [phase, done]);

  /*
   * Keep the newest line in view, the way a terminal does.
   *
   * The message is taller than the panel on a laptop, and the button to go
   * and confirm sits under the end of it — which is the one thing the
   * takeover exists to hand over. Without this the reader is left watching
   * text type itself somewhere below the fold and the button never arrives.
   */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || phase !== "message") return;
    panel.scrollTop = panel.scrollHeight;
  }, [typed, phase, done]);

  // Walk the budget line by line so each one knows how much of itself shows.
  const revealed = lines.reduce<string[]>((visible, line, index) => {
    const used = lines.slice(0, index).reduce((sum, item) => sum + item.length + LINE_PAUSE, 0);
    const shown = Math.max(0, Math.min(line.length, typed - used));
    visible.push(line.slice(0, shown));
    return visible;
  }, []);

  const body = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Transmission received"
      className={
        // Transparent while the beam runs: the canvas dims the page itself,
        // so it fades out under the particles instead of vanishing behind a
        // sheet the instant the overlay mounts.
        phase === "beam"
          ? "fixed inset-0 z-[100] overflow-hidden"
          : "fixed inset-0 z-[100] overflow-hidden bg-[#0B0D0B]"
      }
    >
      {/*
        One field across both phases, rather than the beam handing over to a
        separate backdrop. The cells the beam took are the cells the message
        is read against, so there is nothing to cut between.
      */}
      <Beam />

      {phase === "message" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              ref={panelRef}
              tabIndex={-1}
              onClick={() => setTyped(totalChars)}
              className="max-h-[90vh] w-full max-w-[810px] overflow-y-auto rounded-[12px] border border-[#1f3b29] bg-[rgba(10,15,11,0.93)] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.6)] focus:outline-none sm:p-9"
            >
              <div className="mb-6 flex items-center gap-2.5 border-b border-[#1f3b29] pb-3.5">
                <span className="size-3 rounded-full bg-[#E74B3C]" />
                <span className="size-3 rounded-full bg-[#E8C547]" />
                <span className="size-3 rounded-full bg-[#4ADE80]" />
                <span className="ml-2 font-dm-mono text-[14px] text-[#4ADE80]/70">
                  {preview ? "dev preview — not sent" : "incoming transmission"}
                </span>
              </div>

              <div aria-hidden="true" className="space-y-4">
                {revealed.map((line, index) =>
                  line ? (
                    <p
                      key={`${index}-${lines[index]}`}
                      className="font-dm-mono text-[16px] leading-[1.7] text-[#9BF6C4] sm:text-[18px]"
                    >
                      <span className="text-[#4ADE80]/60">&gt; </span>
                      {line}
                      {!done && line.length < (lines[index]?.length ?? 0) && (
                        <span className="ml-0.5 inline-block w-[9px] animate-pulse bg-[#9BF6C4] align-[-2px]">
                          &nbsp;
                        </span>
                      )}
                    </p>
                  ) : null,
                )}
              </div>

              {/* The whole message, once, for anything that reads rather than
                  watches. */}
              <p className="sr-only">{fullText}</p>

              {done && (
                <div className="mt-8 flex flex-col items-center gap-3.5">
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="rounded-[8px] px-5 py-2.5 font-dm-mono text-[15px] text-[#9BF6C4]/60 transition-colors hover:text-[#9BF6C4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80]"
                  >
                    close transmission
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(body, document.body);
}
