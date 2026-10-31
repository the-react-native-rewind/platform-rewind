import React from "react";
import classNames from "classnames";

interface PageHeadProps {
  children: React.ReactNode;
  className?: string;
  /** When false, width/padding come from the parent column (e.g. guide article layout). */
  contained?: boolean;
}

export function PageHead({
  children,
  className,
  contained = true,
}: PageHeadProps) {
  return (
    <div
      className={classNames(
        "flex flex-col items-center md:pt-20 pt-8 mb-8",
        contained && "max-w-lg px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
