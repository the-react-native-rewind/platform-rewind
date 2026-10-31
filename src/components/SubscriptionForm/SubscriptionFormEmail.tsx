"use client";

import React from "react";
import {
  TextField,
  type TextFieldVariant,
} from "@/components/TextField/TextField";
import { useSubscriptionForm } from "./SubscriptionFormProvider";

export interface SubscriptionFormEmailProps {
  variant?: TextFieldVariant;
  placeholder?: string;
  className?: string;
}

export function SubscriptionFormEmail({
  variant = "default",
  placeholder = "john.doe@gmail.com",
  className = "",
}: SubscriptionFormEmailProps) {
  const { email, onChangeEmail, onFocusEmail } = useSubscriptionForm();

  return (
    <TextField
      value={email || ""}
      name="email"
      autoComplete="email"
      inputMode="email"
      placeholder={placeholder}
      variant={variant}
      className={className}
      onChange={onChangeEmail}
      onFocus={onFocusEmail}
    />
  );
}
