"use client";

import React from "react";
import { Text } from "@/components/Text/Text";

export interface SubscriptionFormDescriptionProps {
  className?: string;
}

export function SubscriptionFormDescription({
  className = "",
}: SubscriptionFormDescriptionProps) {
  return (
    <div className={`text-center mb-2 px-4 ${className}`}>
      <Text variant="body" className="text-[20px]">
        <span className="font-bold">Join 1,500+ React Native developers.</span>{" "}
        Plus perks like free conference tickets, discounts, and other surprises.
      </Text>
    </div>
  );
}
