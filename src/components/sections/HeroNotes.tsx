import React from "react";
import classNames from "classnames";
import { GraffitiTape } from "@/components/Graffiti/GraffitiTape";

/**
 * The pasted stack beside the form. Same geometry as the TRNR tweet pile:
 * three rotated cards, tape on two of them, a faded strip above the
 * headline on a phone. The notes are the content; the paste is the chrome.
 */
const NOTES = [
  {
    kicker: "Skills that stay",
    body: "Taste, debugging, and the nerve to ship. New tools do not retire those.",
    tape: { rotate: -18, className: "-top-3 left-[18%] z-10" },
  },
  {
    kicker: "Adapt faster",
    body: "Developers have always adapted. This stretch just asks for it sooner.",
    tape: null,
  },
  {
    kicker: "What platforms mean",
    body: "A platform is wherever the work moves next. We watch where the wave is breaking.",
    tape: { rotate: 16, className: "-top-2.5 right-[12%] z-10" },
  },
] as const;

const CLUSTER = [
  { rotate: -6.5, className: "right-0 top-0 z-10 w-[78%]" },
  { rotate: 3.5, className: "left-0 top-[178px] z-20 w-[80%]" },
  { rotate: -2.5, className: "right-[1%] top-[340px] z-30 w-[78%]" },
] as const;

const STRIP = [
  { note: NOTES[1], rotate: -3, className: "left-0 top-0 z-10 w-[82%]" },
  { note: NOTES[2], rotate: 2.5, className: "right-0 top-[6.5rem] z-20 w-[84%]" },
] as const;

function NoteCard({
  note,
  rotate,
  className,
}: {
  note: (typeof NOTES)[number];
  rotate: number;
  className: string;
}) {
  return (
    <div
      className={classNames("pointer-events-none absolute", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {note.tape && <GraffitiTape rotate={note.tape.rotate} className={note.tape.className} />}
      <div className="min-h-[220px] rounded-2xl bg-surface-paper-light px-5 py-5 shadow-[0_14px_30px_rgba(28,25,23,0.28)] ring-1 ring-black/10 dark:bg-surface-paper-dark dark:shadow-[0_16px_34px_rgba(0,0,0,0.55)] dark:ring-white/10">
        <p className="font-permanent-marker text-[18px] uppercase leading-tight tracking-[0.03em] text-mark-light dark:text-mark-dark">
          {note.kicker}
        </p>
        <p className="mt-3 font-dm-mono text-[13px] leading-relaxed text-ink-soft-light dark:text-ink-soft-dark">
          {note.body}
        </p>
      </div>
    </div>
  );
}

export function HeroNotes({ variant }: { variant: "cluster" | "strip" }) {
  if (variant === "strip") {
    return (
      <div className="hero-tweet-strip relative mb-6 h-[16.5rem] w-full overflow-hidden lg:hidden">
        {STRIP.map((card) => (
          <NoteCard key={card.note.kicker} note={card.note} rotate={card.rotate} className={card.className} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[710px] w-full max-w-[540px]">
      {NOTES.map((note, index) => (
        <NoteCard
          key={note.kicker}
          note={note}
          rotate={CLUSTER[index].rotate}
          className={CLUSTER[index].className}
        />
      ))}
    </div>
  );
}
