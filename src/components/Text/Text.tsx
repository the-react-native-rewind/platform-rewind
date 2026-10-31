import React from "react";
import classNames from "classnames";

/**
 * The single gateway for type.
 *
 * Every size, weight, family and tracking in the redesign lives here. Pages
 * and sections pick a role; they never set a font class themselves. If a
 * `className` with a font or a size shows up in `app/**` or a feature section,
 * the role it wants is missing from this list and belongs here instead.
 *
 * A long variant list is usually a smell, but not here — this list *is* the
 * type scale, and collapsing it would just push the decisions back out into
 * the pages.
 *
 * Three families, three jobs:
 * - **Permanent Marker** — headlines, labels, nav, CTAs, chips. One weight,
 *   no italic: never ask it for either, the browser synthesises and it shows.
 * - **DM Sans** — card titles, article body, article headings.
 * - **DM Mono** — metadata, dates, captions, eyebrows, placeholders.
 */
export type TextVariant =
  // Permanent Marker
  | "hero" // homepage H1
  | "page-heading" // The Vault, Guides, About
  | "section-label" // inline marker labels: hero sublines, footer links
  | "section-heading" // the heading above a section, via SectionHeading
  | "band-heading" // the subscribe band headline
  | "eyebrow" // above a headline
  | "nav" // navigation links
  | "cta" // button labels
  | "chip" // badges, filter pills
  // DM Sans
  | "article-h1"
  | "article-h2"
  | "body" // article body copy
  | "card-title"
  // DM Mono
  | "mono" // body copy on mono surfaces (About, descriptions)
  | "card-description"
  | "meta"; // dates, issue numbers, read time

/**
 * Colour roles. Omitted means the variant's own default, which is what you
 * want almost everywhere.
 */
export type TextTone =
  | "ink"
  | "strong"
  | "muted"
  | "soft"
  | "faint"
  | "dim"
  | "mark"
  | "invert"
  | "inherit";

type TextElement =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "figcaption"
  | "time";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  /**
   * The element to render. Defaults to `p`.
   *
   * Headings are not inferred from the variant on purpose — `article-h2` is a
   * size, not a promise about document structure. Pass the level you mean, or
   * use `SectionHeading`, which handles headings properly.
   */
  as?: TextElement;
  tone?: TextTone;
  children: React.ReactNode;
  className?: string;
}

// Marker above ~40px needs line-height >= 1.15. The font's glyphs overflow a
// tight line box, and at display sizes the descenders of the last line print
// on top of whatever follows.
/*
 * Every size is `base + --type-bump`, so one variable moves the whole scale.
 *
 * The homepage runs at the bump's default of 0 and every other page sets it,
 * because a card grid and an article want more than a hero does. Additive
 * rather than a multiplier on purpose: asked for two points, the small print
 * should gain two points, not the eight that scaling the hero by the same
 * ratio would hand it.
 */
const VARIANT_CLASS: Record<TextVariant, string> = {
  hero: "font-permanent-marker text-[length:calc(44px_+_var(--type-bump,0px))] leading-[1.16] tracking-[0.015em] sm:text-[length:calc(56px_+_var(--type-bump,0px))] lg:text-[length:calc(68px_+_var(--type-bump,0px))]",
  "page-heading":
    "font-permanent-marker text-[length:calc(34px_+_var(--type-bump,0px))] leading-[1.15] tracking-[0.02em] sm:text-[length:calc(40px_+_var(--type-bump,0px))] lg:text-[length:calc(46px_+_var(--type-bump,0px))]",
  "section-label":
    "font-permanent-marker text-[length:calc(19px_+_var(--type-bump,0px))] uppercase leading-[1.25] tracking-[0.03em]",
  // Two points up on `section-label`. They were one variant, but a heading
  // announcing a section and a label sitting inside a paragraph want
  // different weights, and sharing a size meant neither could move.
  "section-heading":
    "font-permanent-marker text-[length:calc(21px_+_var(--type-bump,0px))] uppercase leading-[1.25] tracking-[0.03em]",
  "band-heading":
    "font-permanent-marker text-[length:calc(19px_+_var(--type-bump,0px))] uppercase leading-[1.34] tracking-[0.02em] sm:text-[length:calc(22px_+_var(--type-bump,0px))]",
  eyebrow:
    "font-permanent-marker text-[length:calc(18px_+_var(--type-bump,0px))] uppercase leading-[1.3] tracking-[0.03em]",
  nav: "font-permanent-marker text-[length:calc(19px_+_var(--type-bump,0px))] leading-[1.3] tracking-[0.02em]",
  // The one variant that sits out the bump. It is a control, not something
  // to read: the extra two points made "Beam me up, Scotty!" wider than
  // the button on a phone, and it wrapped to two lines on every page but
  // the homepage. A button label is sized by its job, not by reading
  // comfort.
  cta: "font-permanent-marker text-[19px] uppercase leading-[1.3] tracking-[0.05em]",
  chip: "font-permanent-marker text-[length:calc(12px_+_var(--type-bump,0px))] leading-[1.3] tracking-[0.02em]",

  "article-h1":
    "font-dm-sans text-[length:calc(32px_+_var(--type-bump,0px))] font-bold leading-[1.16] tracking-[-0.02em] sm:text-[length:calc(40px_+_var(--type-bump,0px))]",
  "article-h2":
    "font-dm-sans text-[length:calc(24px_+_var(--type-bump,0px))] font-bold leading-[1.2] tracking-[-0.015em] sm:text-[length:calc(30px_+_var(--type-bump,0px))]",
  body: "font-dm-sans text-[length:calc(17px_+_var(--type-bump,0px))] font-normal leading-[1.72]",
  "card-title":
    "font-dm-sans text-[length:calc(14.5px_+_var(--type-bump,0px))] font-bold leading-[1.3]",

  mono: "font-dm-mono text-[length:calc(15px_+_var(--type-bump,0px))] font-normal leading-[1.7] sm:text-[length:calc(17px_+_var(--type-bump,0px))] sm:leading-[1.78]",
  "card-description":
    "font-dm-mono text-[length:calc(13px_+_var(--type-bump,0px))] font-normal leading-[1.55]",
  meta: "font-dm-mono text-[length:calc(12px_+_var(--type-bump,0px))] font-normal leading-[1.5]",
};

/** Where a variant reads best when no tone is passed. */
const DEFAULT_TONE: Record<TextVariant, TextTone> = {
  hero: "ink",
  "page-heading": "ink",
  "section-label": "ink",
  "section-heading": "ink",
  "band-heading": "ink",
  eyebrow: "ink",
  nav: "ink",
  cta: "inherit",
  chip: "inherit",
  "article-h1": "ink",
  "article-h2": "ink",
  body: "strong",
  "card-title": "ink",
  mono: "muted",
  "card-description": "soft",
  meta: "faint",
};

const TONE_CLASS: Record<TextTone, string> = {
  ink: "text-ink-light dark:text-ink-dark",
  strong: "text-ink-strong-light dark:text-ink-strong-dark",
  muted: "text-ink-muted-light dark:text-ink-muted-dark",
  soft: "text-ink-soft-light dark:text-ink-soft-dark",
  faint: "text-ink-faint-light dark:text-ink-faint-dark",
  dim: "text-ink-dim-light dark:text-ink-dim-dark",
  mark: "text-mark-light dark:text-mark-dark",
  invert: "text-invert-ink",
  inherit: "",
};

export function Text({
  variant,
  as: Component = "p",
  tone,
  children,
  className,
  ...rest
}: TextProps) {
  return (
    <Component
      className={classNames(
        VARIANT_CLASS[variant],
        TONE_CLASS[tone ?? DEFAULT_TONE[variant]],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
