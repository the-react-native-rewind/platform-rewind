/**
 * Decoration renders in one of two inks and inverts for free, because both
 * tones are { light, dark } token pairs:
 *
 * - `ink`  — pen on paper in light, chalk on a wall in dark
 * - `mark` — the marker/highlight colour: orange in light, cyan in dark
 *
 * Every Graffiti component paints with `currentColor`, so the tone is set
 * once here as a text colour and the SVG inherits it.
 */
export type GraffitiTone = "ink" | "mark";

export const TONE_CLASS: Record<GraffitiTone, string> = {
  ink: "text-ink-light dark:text-ink-dark",
  mark: "text-mark-light dark:text-mark-dark",
};
