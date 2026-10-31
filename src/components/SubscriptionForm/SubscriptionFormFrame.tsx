"use client";

import React from "react";

export interface SubscriptionFormFrameProps {
  children: React.ReactNode;
  fixed?: boolean;
  className?: string;
}

export function SubscriptionFormFrame({
  children,
  className = "",
}: SubscriptionFormFrameProps) {
  const baseClasses = "flex flex-col items-center max-w-sm w-full px-6 md:px-0";

  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}
