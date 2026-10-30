import type { NewsletterId } from "@/lib/newsletters";

export type SubscribeMode = "live" | "mock";

export type NewsletterResult = {
  id: NewsletterId;
  name: string;
  ok: boolean;
  mode: SubscribeMode;
  error?: string;
};

export type SubscribeSuccess = {
  ok: true;
  partial: boolean;
  mode: SubscribeMode | "mixed";
  preview: boolean;
  lines: string[];
  results: NewsletterResult[];
};

export type SubscribeFailure = {
  ok: false;
  error: string;
  results?: NewsletterResult[];
};

export type AdapterOutcome =
  | { configured: false }
  | { configured: true; ok: true }
  | { configured: true; ok: false; error: string };
