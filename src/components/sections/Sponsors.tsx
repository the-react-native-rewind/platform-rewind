import React from "react";
import { Text } from "@/components/Text/Text";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { sponsorMailto } from "@/lib/sponsors";

const OPEN_SLOTS = ["Lead", "Lead", "Lead", "Supporting", "Supporting", "Supporting", "Supporting"] as const;

function Slot({ tier }: { tier: string }) {
  return (
    <div
      aria-label={`Open ${tier.toLowerCase()} sponsor slot`}
      className="flex h-[104px] w-full items-center justify-center rounded-[12px] border border-dashed border-border-strong-light bg-surface-paper-light px-[26px] dark:border-border-strong-dark dark:bg-surface-paper-dark"
    >
      <Text variant="meta" as="span">
        {tier}
      </Text>
    </div>
  );
}

/**
 * Same tile row as the TRNR sponsor strip. The slots are open: sponsorship
 * for every Rewind newsletter lives on this page.
 */
export function Sponsors() {
  return (
    <div className="flex flex-col gap-5" id="sponsors">
      <SectionHeading variant="section" level={2}>
        Our sponsors
      </SectionHeading>
      <Text variant="mono" className="-mt-1 max-w-xl">
        Sponsorship for every Rewind newsletter lives here.
      </Text>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {OPEN_SLOTS.filter((tier) => tier === "Lead").map((tier, index) => (
            <Slot key={`${tier}-${index}`} tier={tier} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {OPEN_SLOTS.filter((tier) => tier === "Supporting").map((tier, index) => (
            <Slot key={`${tier}-${index}`} tier={tier} />
          ))}
        </div>
      </div>
      <Text variant="body" className="max-w-xl">
        Lead and supporting placements are open. Tell us about the product and we will find where the logo sits.
      </Text>
      <a
        href={sponsorMailto}
        className="cta-matrix cta-glitch press-sticker inline-flex w-full max-w-lg items-center justify-center rounded-[10px] bg-primary px-5 py-[17px] text-white shadow-[0_2px_0_rgba(150,55,35,0.5),0_1px_2px_rgba(28,25,23,0.2)] transition-[background-color,transform,box-shadow,color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-[34px]"
      >
        <Text variant="cta" as="span" tone="inherit">
          Sponsor us
        </Text>
      </a>
    </div>
  );
}
