"use client";

import { useState } from "react";
import { newsletters } from "@/lib/newsletters";
import { MatrixTakeover } from "@/components/matrix-takeover";

type Effect = {
  lines: string[];
  preview: boolean;
};

export function SubscribeForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [effect, setEffect] = useState<Effect | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const selected = newsletters
      .map((newsletter) => newsletter.id)
      .filter((id) => data.get(id) === "on");

    setError(null);
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (selected.length === 0) {
      setError("Pick at least one newsletter.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newsletters: selected,
          hp_field: String(data.get("hp_field") ?? ""),
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        lines?: string[];
        preview?: boolean;
        partial?: boolean;
      } | null;

      if (!response.ok && response.status !== 207) {
        setError(body?.error || "Could not subscribe. Try again in a moment.");
        return;
      }

      if (!body?.lines?.length) {
        setError(body?.error || "Could not subscribe. Try again in a moment.");
        return;
      }

      setEffect({ lines: body.lines, preview: Boolean(body.preview) });
      if (body.partial) {
        setError(null);
      }
      form.reset();
    } catch {
      setError("Could not subscribe. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="signup" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="email-input"
          disabled={submitting}
        />

        <fieldset className="newsletter-picks" disabled={submitting}>
          <legend className="sr-only">Newsletters</legend>
          {newsletters.map((newsletter) => (
            <label key={newsletter.id} className="check">
              <input type="checkbox" name={newsletter.id} defaultChecked />
              <span>{newsletter.name}</span>
            </label>
          ))}
        </fieldset>

        <div className="hp-field" aria-hidden="true">
          <label htmlFor="hp_field">Company</label>
          <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" className="subscribe-button cta-matrix cta-glitch press-sticker" disabled={submitting}>
          <span>{submitting ? "Sending" : "Subscribe"}</span>
        </button>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
      {effect ? (
        <MatrixTakeover lines={effect.lines} preview={effect.preview} onDismiss={() => setEffect(null)} />
      ) : null}
    </>
  );
}
