import React from "react";

export interface PageFrameProps {
  children: React.ReactNode;
  /**
   * How big the type runs on this page.
   *
   * `large` adds two points to every variant at once, through the
   * `--type-bump` custom property the scale is built on. It is the default
   * because every page except one wants it: the homepage is a hero and a form
   * and already sets its own sizes, while the rest are grids and articles
   * that were reading small.
   */
  typeScale?: "base" | "large";
}

export function PageFrame({ children, typeScale = "large" }: PageFrameProps) {
  return (
    <div
      style={
        {
          "--type-bump": typeScale === "large" ? "2px" : "0px",
        } as React.CSSProperties
      }
      className="bg-paper-grain flex min-h-screen w-full flex-col items-center space-y-8 bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark"
    >
      {children}
    </div>
  );
}
