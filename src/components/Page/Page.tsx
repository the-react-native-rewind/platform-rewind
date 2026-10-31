import { PageFrame } from "./PageFrame";
import { PageHead } from "./PageHead";
import { PageContent } from "./PageContent";
import { PageWide } from "./PageWide";
import { PageGrid } from "./PageGrid";

export { PageFrame, PageHead, PageContent, PageWide, PageGrid };

// Composition pattern: Page.Frame, Page.Head, Page.Content (650px, articles),
// Page.Wide (1440px, card grids), Page.Grid.
//
// Headings go through SectionHeading now, which owns the marker treatment and
// takes an explicit heading level.
export const Page = {
  Frame: PageFrame,
  Head: PageHead,
  Content: PageContent,
  Wide: PageWide,
  Grid: PageGrid,
};
