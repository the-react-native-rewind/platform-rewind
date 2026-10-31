"use client";

import React from "react";
import {
  PrimaryButton,
  type PrimaryButtonVariant,
} from "@/components/PrimaryButton/PrimaryButton";
import { useSubscriptionForm } from "./SubscriptionFormProvider";
import { preloadTransmissionSounds } from "@/utils/transmissionSound/transmissionSound";
import classNames from "classnames";

export interface SubscriptionFormButtonProps {
  variant?: PrimaryButtonVariant;
  className?: string;
}

/**
 * The subscribe CTA.
 *
 * It stays itself after a successful subscribe. It used to turn into a
 * "Go to confirmation email" link, which was the only way to reach the
 * confirmation step back when the form answered in place — now the
 * transmission takes the screen over and hands that link out itself, so the
 * swap left the page with two of them and made the button the reader had
 * just pressed the less prominent one.
 *
 * This is also why nothing here talks to Gmail any more. That logic lives in
 * `utils/gmailLink`, which the transmission uses.
 */
export function SubscriptionFormButton({
  variant = "primary",
  className = "",
}: SubscriptionFormButtonProps) {
  const { loading, onSubscribe, source } = useSubscriptionForm();

  return (
    <div
      className={classNames(`w-full ${className}`)}
      onMouseEnter={preloadTransmissionSounds}
      onFocus={preloadTransmissionSounds}
    >
      <PrimaryButton
        label="Beam me up, Scotty!"
        onClick={onSubscribe}
        loading={loading}
        variant={variant}
        dataPh="cta"
        dataLocation={source}
      />
    </div>
  );
}
