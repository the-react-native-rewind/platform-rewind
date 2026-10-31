"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@/components/Text/Text";
import { Graffiti } from "@/components/Graffiti/Graffiti";

interface NavItem {
  href: string;
  label: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/#newsletters",
    label: "Newsletters",
    description: "The Agentic Rewind and The React Native Rewind.",
  },
  {
    href: "/#sponsors",
    label: "Sponsors",
    description: "Sponsorship for every Rewind newsletter.",
  },
  {
    href: "https://theagenticrewind.com",
    label: "Agentic",
    description: "The AI newsletter. Opens theagenticrewind.com.",
  },
  {
    href: "https://thereactnativerewind.com",
    label: "React Native",
    description: "The weekly React Native newsletter.",
  },
];

interface NavigationButtonsProps {
  vertical?: boolean;
  onLinkClick?: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  vertical = false,
  onLinkClick,
}) => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  if (vertical) {
    // Mobile drawer: full-width rows with description and big tap targets.
    return (
      <div className="flex w-full flex-col">
        {NAV_ITEMS.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <hr className="my-0 border-0 border-t border-current opacity-20" />
            )}
            <Link
              href={item.href}
              onClick={onLinkClick}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="block w-full py-4"
              {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Text
                variant="nav"
                as="span"
                tone={isActive(item.href) ? "mark" : "ink"}
                className="block"
              >
                {item.label}
              </Text>
              <Text variant="card-description" as="span" className="mt-1 block">
                {item.description}
              </Text>
            </Link>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Desktop: marker type with no permanent underline. The underline fades in
  // on hover, and the active page simply renders in that same state.
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-4 lg:flex-nowrap lg:justify-start lg:gap-[34px]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);

        return (
          <div key={item.href} className="group relative pb-0.5">
            <Link
              href={item.href}
              onClick={onLinkClick}
              aria-current={active ? "page" : undefined}
              className="relative block after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
              {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Text
                variant="nav"
                as="span"
                tone={active ? "mark" : "ink"}
                className="transition-colors duration-[180ms] group-hover:text-mark-light dark:group-hover:text-mark-dark"
              >
                {item.label}
              </Text>
            </Link>
            <Graffiti.Underline
              strokes={2}
              draw
              data-active={active ? "" : undefined}
              className="nav-draw -bottom-[11px] -left-1 h-[11px] w-[calc(100%+10px)]"
            />
          </div>
        );
      })}
    </div>
  );
};
