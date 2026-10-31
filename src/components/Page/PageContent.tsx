"use client";

import React from "react";
import classNames from "classnames";

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  const combinedClassName = classNames(
    "flex flex-col max-w-lg px-6 md:px-0",
    className,
  );
  return <div className={combinedClassName}>{children}</div>;
}
