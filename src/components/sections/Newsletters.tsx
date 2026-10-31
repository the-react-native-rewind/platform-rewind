import React from "react";
import Image from "next/image";
import { Text } from "@/components/Text/Text";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { Reveal } from "@/components/Reveal/Reveal";
import { newsletters } from "@/lib/newsletters";

/**
 * The card row where TRNR lists press. Two newsletters, each with its own
 * mark, a line of what it is, and a link out to the site that publishes it.
 */
export function Newsletters() {
  return (
    <div className="flex flex-col gap-6" id="newsletters">
      <SectionHeading variant="section" level={2}>
        The newsletters
      </SectionHeading>
      <Text variant="mono" className="-mt-2 max-w-xl">
        Two today. The list grows when a new platform is worth a rewind.
      </Text>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
        {newsletters.map((newsletter, index) => (
          <Reveal key={newsletter.id} delay={index * 60} className="h-full">
            <a
              href={newsletter.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-paper group/card relative flex h-full flex-col rounded-[10px] border border-border-paper-light bg-surface-paper-light p-5 hover:border-mark-light dark:border-border-paper-dark dark:bg-surface-paper-dark dark:hover:border-mark-dark sm:p-6"
            >
              <div
                className="relative h-[112px] max-w-full self-start sm:h-32"
                style={{ aspectRatio: `${newsletter.logo.width} / ${newsletter.logo.height}` }}
              >
                <Image
                  src={newsletter.logo.src}
                  alt=""
                  fill
                  sizes="320px"
                  unoptimized={newsletter.id === "agentic"}
                  className="object-contain object-left"
                />
              </div>
              <Text variant="card-title" as="h3" className="mt-5">
                {newsletter.name}
              </Text>
              <Text variant="card-description" as="span" className="mt-2 block">
                {newsletter.description}
              </Text>
              <Text variant="meta" as="span" tone="mark" className="mt-4 uppercase underline underline-offset-4">
                Visit the site
              </Text>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
