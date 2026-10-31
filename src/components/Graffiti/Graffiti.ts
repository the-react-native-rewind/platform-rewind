import { GraffitiUnderline } from "./GraffitiUnderline";
import { GraffitiArrow } from "./GraffitiArrow";
import { GraffitiSplash } from "./GraffitiSplash";
import { GraffitiSticker } from "./GraffitiSticker";
import { GraffitiTape } from "./GraffitiTape";
import { GraffitiDoodle } from "./GraffitiDoodle";
import { GraffitiHighlight } from "./GraffitiHighlight";

export {
  GraffitiUnderline,
  GraffitiArrow,
  GraffitiSplash,
  GraffitiSticker,
  GraffitiTape,
  GraffitiDoodle,
  GraffitiHighlight,
};

export type { GraffitiTone } from "./graffitiTone";
export type { GraffitiDoodleName } from "./GraffitiDoodle";
export type { GraffitiArrowVariant } from "./GraffitiArrow";

/**
 * The decoration vocabulary. Presentational only — these never own layout,
 * interaction or content.
 *
 * Three rules hold for every instance:
 *
 * 1. `aria-hidden` and `pointer-events-none`, no exceptions. Decoration must
 *    never intercept a click on a card or an input.
 * 2. Positioned relative to its own section, never the page. Anything that
 *    bleeds off an edge needs `overflow-hidden` on that section.
 * 3. `hidden lg:block` by default. Most decoration should simply not exist on
 *    mobile — it is the cheapest way to keep small screens clean.
 */
export const Graffiti = {
  Underline: GraffitiUnderline,
  Arrow: GraffitiArrow,
  Splash: GraffitiSplash,
  Sticker: GraffitiSticker,
  Tape: GraffitiTape,
  Doodle: GraffitiDoodle,
  Highlight: GraffitiHighlight,
};
