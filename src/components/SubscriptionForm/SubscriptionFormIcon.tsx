import React from "react";
import Image from "next/image";

export interface SubscriptionFormIconProps {
  className?: string;
}

export function SubscriptionFormIcon({
  className = "",
}: SubscriptionFormIconProps) {
  return (
    <div className={`flex justify-center mb-4 ${className}`}>
      <Image
        src="/giftbox.png"
        alt="Gift box"
        width={120}
        height={120}
        className="object-contain"
      />
    </div>
  );
}
