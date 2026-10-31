import React from "react";
import classNames from "classnames";

export interface PageWideProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page-width container for card grids — 1440px with 64px desktop gutters.
 *
 * `Page.Content` stays at 650px because article bodies still want the narrow
 * measure; a five-column grid simply cannot live inside it.
 */
export function PageWide({ children, className }: PageWideProps) {
  return (
    <div
      className={classNames(
        "mx-auto w-full max-w-wide px-6 sm:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
