"use client";

import { useEffect, useRef, useState } from "react";

type MatrixTakeoverProps = {
  lines: string[];
  preview: boolean;
  onDismiss: () => void;
};

const BEAM_MS = 3450;
const TYPE_MS = 29;
const LINE_GAP = 22;

export function MatrixTakeover({ lines, preview, onDismiss }: MatrixTakeoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"beam" | "message">("beam");
  const [count, setCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const total = lines.reduce((sum, line) => sum + line.length + LINE_GAP, 0);
  const finished = count >= total;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        setPhase("message");
        setCount(total);
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [total]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
        return;
      }
      setCount(total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onDismiss, total]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const timer = window.setTimeout(() => setPhase("message"), BEAM_MS);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (phase !== "message" || finished) {
      return;
    }
    const timer = window.setInterval(() => {
      setCount((current) => (current >= total ? current : current + 1));
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [finished, phase, total]);

  const shown = lines.reduce<string[]>((visible, line, index) => {
    const used = lines.slice(0, index).reduce((sum, item) => sum + item.length + LINE_GAP, 0);
    const take = Math.max(0, Math.min(line.length, count - used));
    visible.push(line.slice(0, take));
    return visible;
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={preview ? "Signup preview" : "Subscription confirmed"}
      tabIndex={-1}
      className={phase === "beam" ? "matrix-layer" : "matrix-layer matrix-layer-message"}
    >
      <MatrixCanvas />
      <button type="button" className="matrix-dismiss" onClick={onDismiss}>
        close
      </button>
      {phase === "message" ? (
        <div className="matrix-stage">
          <div className="matrix-terminal" onClick={() => setCount(total)}>
            <div className="matrix-chrome">
              <span className="matrix-dot matrix-dot-red" />
              <span className="matrix-dot matrix-dot-yellow" />
              <span className="matrix-dot matrix-dot-green" />
              <span className="matrix-chrome-label">
                {preview ? "dev preview — not sent" : "incoming transmission"}
              </span>
            </div>
            <div className="matrix-lines">
              {shown.map((line, index) =>
                line ? (
                  <p key={`${index}-${lines[index]}`} className="matrix-line">
                    <span className="matrix-prompt">&gt; </span>
                    {line}
                    {!finished && line.length < (lines[index]?.length ?? 0) ? (
                      <span className="matrix-cursor" aria-hidden="true">
                        {" "}
                      </span>
                    ) : null}
                  </p>
                ) : null,
              )}
            </div>
            <p className="sr-only">{lines.join(" ")}</p>
            {finished ? (
              <button type="button" className="matrix-close" onClick={onDismiss}>
                close transmission
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let total = 0;
    let order: number[] = [];
    let on: Uint8Array = new Uint8Array();
    let glyphs: number[] = [];
    let revealed = 0;
    let lit = 0;
    let started = 0;
    let lastGlyph = 0;
    let lastFlicker = 0;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / 14);
      const rows = Math.ceil(height / 18);
      total = columns * rows;
      order = Array.from({ length: total }, (_, index) => index);
      for (let index = total - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        const current = order[index] ?? index;
        order[index] = order[swap] ?? swap;
        order[swap] = current;
      }
      on = new Uint8Array(total);
      glyphs = order.map(() => Math.floor(Math.random() * 10));
      revealed = 0;
      lit = 0;
      started = performance.now();
      lastGlyph = started;
      lastFlicker = started;
      context.fillStyle = "#0B0D0B";
      context.fillRect(0, 0, width, height);
    };

    const flip = (count: number, value: 0 | 1) => {
      let left = count;
      let guard = Math.max(2 * revealed, 1);
      while (left > 0 && guard > 0) {
        guard -= 1;
        const index = order[Math.floor(Math.random() * Math.max(revealed, 1))] ?? 0;
        if (on[index] !== value) {
          on[index] = value;
          lit += value === 1 ? 1 : -1;
          left -= 1;
        }
      }
    };

    const paint = (now: number) => {
      const reduced = media.matches;
      if (!reduced && now - lastGlyph > 70) {
        lastGlyph = now;
        const updates = Math.ceil(total * 0.04);
        for (let index = 0; index < updates; index += 1) {
          glyphs[Math.floor(Math.random() * total)] = Math.floor(Math.random() * 10);
        }
      }

      const elapsed = now - started;
      const target = reduced ? total : Math.floor(Math.min(elapsed / 2400, 1) * total);
      while (revealed < target) {
        const index = order[revealed] ?? 0;
        on[index] = 1;
        lit += 1;
        revealed += 1;
      }

      if (!reduced && target > 0 && now - lastFlicker > 90) {
        lastFlicker = now;
        const desired = Math.round(target * (1 - 0.7 * Math.min(Math.max(elapsed - 2400, 0) / 800, 1)));
        if (lit > desired) {
          flip(lit - desired, 0);
        } else if (lit < desired) {
          flip(desired - lit, 1);
        }
        const jitter = Math.round(target * 0.02);
        flip(jitter, 0);
        flip(jitter, 1);
      }

      context.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textBaseline = "top";
      for (let index = 0; index < revealed; index += 1) {
        const cell = order[index] ?? 0;
        const x = (cell % columns) * 14;
        const y = Math.floor(cell / columns) * 18;
        context.fillStyle = "#0B0D0B";
        context.fillRect(x, y, 14, 18);
        if (on[cell]) {
          context.fillStyle = cell % 11 === 0 ? "rgba(214, 255, 233, 0.92)" : "rgba(80, 214, 136, 0.9)";
          context.fillText(String(glyphs[cell] ?? 0), x + 2, y + 1);
        }
      }
    };

    layout();
    if (media.matches) {
      paint(performance.now());
      return;
    }

    const loop = (now: number) => {
      paint(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="matrix-canvas" />;
}
