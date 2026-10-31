"use client";

import React, { useState } from "react";
import { Transmission } from "@/components/Transmission/Transmission";
import { useSubscriptionForm } from "./SubscriptionFormProvider";

/**
 * Shows the transmission once a subscribe succeeds.
 *
 * Dismissing is remembered for that attempt, so a later success opens it again.
 */
export function SubscriptionFormTakeover() {
  const { confirmationEmailSent, lines, preview, attempt } = useSubscriptionForm();
  const [closedAttempt, setClosedAttempt] = useState(0);

  if (!confirmationEmailSent || lines.length === 0 || closedAttempt === attempt) {
    return null;
  }

  return (
    <Transmission
      key={attempt}
      lines={lines}
      preview={preview}
      onDismiss={() => setClosedAttempt(attempt)}
    />
  );
}
