"use client";

import React, { Suspense } from "react";
import classNames from "classnames";
import { Text } from "@/components/Text/Text";
import { Graffiti } from "@/components/Graffiti/Graffiti";
import { SubscriptionForm } from "@/components/SubscriptionForm/SubscriptionForm";
import { MatrixBackdrop } from "@/components/MatrixBackdrop/MatrixBackdrop";
import { Parallax } from "@/components/Parallax/Parallax";
import Image from "next/image";

export interface SubscribeBandProps {
  /**
   * Attribution for the funnel. **Every instance needs a distinct value** or
   * the source data becomes mush.
   */
  source: string;
  /** `close` sits above the footer; `feature` sits mid-article. */
  variant?: "close" | "feature";
  headline?: string;
  perks?: string;
  /**
   * Take the whole screen over with the transmission on success. On by
   * default: subscribing is the one thing every one of these blocks is for,
   * so it is the one moment where interrupting the page is the point.
   */
  takeover?: boolean;
}

/**
 * The subscribe block: falling code, a marker headline, the perks line, and
 * the field and CTA centred over it.
 *
 * No longer a `Band`. That component paints a paper surface and hard rules,
 * which is the opposite of what this wants — the block is dark in both
 * schemes now, because the texture behind it is, and it dissolves into the
 * page at the top and bottom instead of being ruled off from it.
 *
 * Everything on top is pinned to light for the same reason. The ink tokens
 * flip with the scheme, and half of them would disappear against a backdrop
 * that does not.
 */
export function SubscribeBand({
  source,
  variant = "close",
  headline = "Subscribe to the Rewind newsletters",
  perks = "The Agentic Rewind and The React Native Rewind. Pick either, or both.",
  takeover = true,
}: SubscribeBandProps) {
  return (
    <section
      className={classNames(
        // No mask. The edge is chipped in the canvas instead: a gradient
        // fade read as the block being out of focus rather than deliberate.
        "relative w-full overflow-hidden bg-[#0B0D0B]",
        variant === "close" ? "py-16" : "py-14",
      )}
    >
      <MatrixBackdrop />

      {/*
        Sits in the gutter beside the copy, which only exists from `lg` —
        the measure is 660px and below that there is no room to the left of
        it. Desktop-only and lazy for the same reason as the footer alien: a
        phone never fetches what it is never shown.

        One asset in both schemes. The band is dark either way, and this is
        pale line work drawn for it.
      */}
      <Parallax
        distance={64}
        className="pointer-events-none absolute bottom-0 left-4 hidden select-none lg:block xl:left-10"
      >
        <Image
          src="/alien-simulation.webp"
          alt=""
          aria-hidden="true"
          width={560}
          height={413}
          sizes="(min-width: 1280px) 200px, (min-width: 1024px) 150px, 0px"
          className="h-auto w-[150px] xl:w-[200px]"
        />
      </Parallax>

      {/* Drifts less than the alien does — the gap between the two is what
          reads as depth. */}
      <Parallax distance={30} className="relative">
        <div className="mx-auto flex w-full max-w-[660px] flex-col items-center gap-4 px-6 text-center">
          <div className="relative w-fit max-w-full">
            <Text
              variant="band-heading"
              tone="inherit"
              className="text-paper-light"
            >
              {headline}
            </Text>
            <Graffiti.Underline
              tone="mark"
              className="-bottom-1.5 left-0 h-2 w-full"
            />
          </div>

          <Text
            variant="card-description"
            tone="inherit"
            className="text-[13px] text-paper-light/75"
          >
            {perks}
          </Text>

          <Suspense fallback={null}>
            <SubscriptionForm.Provider source={source}>
              {/*
              Stacked at every width rather than side by side above `sm`.
              The two only ever fit on one row by giving the field a fixed
              320px and letting the button take whatever was left, which
              made the field narrower than the address it holds and the
              button a different width on every page. One column is the
              same shape everywhere.
            */}
              <div className="mt-2 flex w-full max-w-[420px] flex-col items-stretch gap-3">
                <div className="flex flex-col">
                  <SubscriptionForm.Email variant="solid" placeholder="you@company.com" />
                  <SubscriptionForm.Picks surface="dark" />
                </div>
                <SubscriptionForm.Button variant="marker" />
              </div>
              {takeover && <SubscriptionForm.Takeover />}
            </SubscriptionForm.Provider>
          </Suspense>
        </div>
      </Parallax>
    </section>
  );
}
