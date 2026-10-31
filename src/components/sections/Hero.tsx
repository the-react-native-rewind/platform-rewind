"use client";

import React, { Suspense } from "react";
import { Text } from "@/components/Text/Text";
import { Graffiti } from "@/components/Graffiti/Graffiti";
import { SubscriptionForm } from "@/components/SubscriptionForm/SubscriptionForm";
import { Reveal } from "@/components/Reveal/Reveal";
import { useReveal } from "@/components/Reveal/useReveal";
import { HeroNotes } from "@/components/sections/HeroNotes";

/**
 * Homepage hero. Same two-column measure as The React Native Rewind:
 * the pitch and the form on the left, the pasted notes on the right.
 */
export function Hero() {
  const { ref: heroRef, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={heroRef}
      className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_57.5%] lg:items-stretch lg:gap-10"
    >
      <div className="flex min-w-0 flex-col">
        <HeroNotes variant="strip" />

        <Reveal variant="rise" delay={120}>
          <h1 className="relative w-fit">
            <Text variant="hero" as="span" className="block text-pretty">
              Platform{" "}
              <span className="relative inline-block text-[62px] leading-[0.95] text-mark-light sm:text-[78px] lg:text-[96px] xl:text-[108px] dark:text-mark-dark">
                REWIND.
                <Graffiti.Underline
                  tone="mark"
                  weight={8}
                  draw
                  data-revealed={revealed ? "" : undefined}
                  style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
                  className="-bottom-2 -left-1 h-3 w-[calc(100%+8px)] sm:h-4"
                />
              </span>
            </Text>
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <Text variant="section-label" as="p" className="mt-5">
            The <span className="glitch">new era</span> of AI is already here.
          </Text>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-3 w-fit text-balance -rotate-2">
            <Text
              variant="section-label"
              as="span"
              tone="inherit"
              className="marker-swipe box-decoration-clone text-ink-light dark:text-white"
            >
              Watch where the wave is breaking
            </Text>
          </p>
        </Reveal>

        <Reveal delay={380}>
          <Text variant="mono" className="mt-7 max-w-xl">
            Developers have always adapted. We keep watching which skills still hold, and how fast the work is moving.
          </Text>
        </Reveal>

        <Suspense fallback={null}>
          <SubscriptionForm.Provider source="homepage">
            <Reveal delay={460} className="relative mt-8 flex w-full max-w-lg flex-col gap-3">
              <div className="flex flex-col">
                <SubscriptionForm.Email variant="outlined" placeholder="you@company.com" />
                <SubscriptionForm.Picks />
              </div>
              <SubscriptionForm.Button variant="marker" />
            </Reveal>
            <SubscriptionForm.Takeover />
          </SubscriptionForm.Provider>
        </Suspense>

        <Reveal delay={540}>
          <Text variant="eyebrow" as="p" className="mt-5 lg:whitespace-nowrap">
            The Agentic Rewind and The React Native Rewind
          </Text>
        </Reveal>
      </div>

      <div className="relative hidden items-center lg:flex lg:self-stretch">
        <HeroNotes variant="cluster" />
      </div>
    </div>
  );
}
