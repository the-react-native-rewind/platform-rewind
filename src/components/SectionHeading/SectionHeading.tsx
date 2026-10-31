"use client";

import React from "react";
import classNames from "classnames";
import { Text } from "@/components/Text/Text";
import { Graffiti } from "@/components/Graffiti/Graffiti";
import type { GraffitiDoodleName } from "@/components/Graffiti/Graffiti";
import type { GraffitiTone } from "@/components/Graffiti/Graffiti";
import { useReveal } from "@/components/Reveal/useReveal";

export type SectionHeadingVariant = "page" | "section" | "eyebrow";

export interface SectionHeadingProps {
  children: React.ReactNode;
  variant?: SectionHeadingVariant;
  /**
   * Heading level. **Always pass this deliberately.**
   *
   * The variant is a size, not a position in the document outline — a `page`
   * heading is not automatically an `h1`. Getting this wrong silently breaks
   * the outline on every page that uses it, which is why it is explicit.
   *
   * Pass `null` for a label that is decorative rather than structural; it
   * renders a `div` and stays out of the outline entirely.
   */
  level: 1 | 2 | 3 | 4 | 5 | 6 | null;
  /** Hand-drawn underline beneath the text. `false` to omit. */
  underline?: GraffitiTone | false;
  /** A single doodle trailing the text. Keep this rare. */
  doodle?: GraffitiDoodleName;
  /** Milliseconds before the stroke starts drawing. */
  delay?: number;
  className?: string;
}

const VARIANT = {
  page: {
    text: "page-heading",
    underlineWeight: 4,
    underline: "-bottom-1 left-0 h-3 w-full",
    doodle: "h-[26px] w-[26px]",
  },
  section: {
    text: "section-heading",
    underlineWeight: 3,
    underline: "-bottom-1.5 left-0 h-2 w-full",
    doodle: "h-[18px] w-[18px]",
  },
  eyebrow: {
    text: "eyebrow",
    underlineWeight: 3,
    underline: "-bottom-1.5 left-0 h-2 w-full",
    doodle: "h-[16px] w-[16px]",
  },
} as const;

/**
 * A marker heading with an optional hand-drawn underline and one trailing
 * doodle. Every section label on every page goes through this, so the
 * treatment stays consistent without any page knowing how it is drawn.
 *
 * The underline draws itself on scroll into view. That one gesture is what
 * ties the site together — it is the same move on the hero, on every section
 * label and on the navigation hover.
 */
export function SectionHeading({
  children,
  variant = "section",
  level,
  underline = "mark",
  doodle,
  delay = 0,
  className,
}: SectionHeadingProps) {
  const spec = VARIANT[variant];
  const element = level === null ? "div" : (`h${level}` as const);
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={classNames("flex w-fit items-end gap-3", className)}
    >
      <div className="relative w-fit">
        <Text variant={spec.text} as={element}>
          {children}
        </Text>
        {underline !== false && (
          <Graffiti.Underline
            tone={underline}
            weight={spec.underlineWeight}
            draw
            data-revealed={revealed ? "" : undefined}
            className={spec.underline}
            style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
          />
        )}
      </div>
      {doodle && (
        <Graffiti.Doodle
          name={doodle}
          draw
          data-revealed={revealed ? "" : undefined}
          style={
            { "--reveal-delay": `${delay + 260}ms` } as React.CSSProperties
          }
          className={classNames("hidden shrink-0 lg:block", spec.doodle)}
        />
      )}
    </div>
  );
}
