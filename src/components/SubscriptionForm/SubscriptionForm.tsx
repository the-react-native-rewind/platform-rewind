"use client";

import { SubscriptionFormFrame } from "./SubscriptionFormFrame";
import { SubscriptionFormIcon } from "./SubscriptionFormIcon";
import { SubscriptionFormDescription } from "./SubscriptionFormDescription";
import { SubscriptionFormEmail } from "./SubscriptionFormEmail";
import { SubscriptionFormButton } from "./SubscriptionFormButton";
import { SubscriptionFormProvider } from "./SubscriptionFormProvider";
import { SubscriptionFormPicks } from "./SubscriptionFormPicks";
import { SubscriptionFormTakeover } from "./SubscriptionFormTakeover";

export {
  SubscriptionFormFrame,
  SubscriptionFormIcon,
  SubscriptionFormDescription,
  SubscriptionFormEmail,
  SubscriptionFormPicks,
  SubscriptionFormButton,
  SubscriptionFormTakeover,
};
export { SubscriptionFormProvider } from "./SubscriptionFormProvider";
export { useSubscriptionForm } from "./SubscriptionFormProvider";

// Composition pattern: SubscriptionForm.Frame, SubscriptionForm.Icon, etc.
export const SubscriptionForm = {
  Provider: SubscriptionFormProvider,
  Frame: SubscriptionFormFrame,
  Icon: SubscriptionFormIcon,
  Description: SubscriptionFormDescription,
  Email: SubscriptionFormEmail,
  Picks: SubscriptionFormPicks,
  Button: SubscriptionFormButton,
  /** The full-screen transmission after a successful subscribe. */
  Takeover: SubscriptionFormTakeover,
};
