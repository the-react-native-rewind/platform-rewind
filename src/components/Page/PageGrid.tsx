import React from "react";
import classNames from "classnames";

export interface PageGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The card grid. Four columns at desktop, stepping down to two on a phone.
 *
 * `items-stretch` plus full-height cards is what lets titles run to as many
 * lines as they need while a row still shares one height.
 */
export function PageGrid({ children, className }: PageGridProps) {
  return (
    <div
      className={classNames(
        "grid grid-cols-2 items-stretch gap-x-[18px] gap-y-7 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
