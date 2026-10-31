"use client";

import React from "react";
import classNames from "classnames";
import { newsletters } from "@/lib/newsletters";
import { useSubscriptionForm } from "./SubscriptionFormProvider";

/**
 * Fine print under the email field. Hidden until the field is focused or
 * typed in, then it slides open and stays open so the boxes can be changed.
 */
export function SubscriptionFormPicks({ surface = "paper" }: { surface?: "paper" | "dark" }) {
  const { picksOpen, selected, onToggleNewsletter } = useSubscriptionForm();

  return (
    <div
      className={classNames(
        "grid transition-[grid-template-rows,opacity,transform,margin] duration-300 ease-out",
        picksOpen
          ? "mt-2 grid-rows-[1fr] translate-y-0 opacity-100"
          : "mt-0 grid-rows-[0fr] -translate-y-1 opacity-0",
      )}
    >
      <fieldset
        disabled={!picksOpen}
        className="min-h-0 overflow-hidden border-0 p-0"
        aria-hidden={picksOpen ? undefined : true}
      >
        <legend className="sr-only">Newsletters</legend>
        <div className="flex flex-col gap-1 pb-0.5">
          {newsletters.map((newsletter) => (
            <label
              key={newsletter.id}
              className={classNames(
                "flex cursor-pointer items-center gap-2 font-dm-mono text-[11px] leading-tight tracking-[0.01em]",
                surface === "dark" ? "text-paper-light/70" : "text-ink-faint-light dark:text-ink-faint-dark",
              )}
            >
              <input
                type="checkbox"
                name={newsletter.id}
                checked={selected.includes(newsletter.id)}
                onChange={() => onToggleNewsletter(newsletter.id)}
                className="size-3.5 shrink-0 accent-primary"
              />
              <span>{newsletter.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
