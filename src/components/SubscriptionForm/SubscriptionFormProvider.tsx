"use client";

import React, { createContext, useContext, useState } from "react";
import { showToast } from "@/components/CustomToast/CustomToast";
import { newsletters, type NewsletterId } from "@/lib/newsletters";
import { unlockTransmissionSound } from "@/utils/transmissionSound/transmissionSound";

interface SubscriptionFormContextValue {
  email: string;
  loading: boolean;
  confirmationEmailSent: boolean;
  attempt: number;
  source: string;
  picksOpen: boolean;
  selected: NewsletterId[];
  lines: string[];
  preview: boolean;
  honeypot: string;
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusEmail: () => void;
  onChangeHoneypot: (value: string) => void;
  onToggleNewsletter: (id: NewsletterId) => void;
  onSubscribe: () => void;
}

const SubscriptionFormContext = createContext<SubscriptionFormContextValue | undefined>(undefined);

export function useSubscriptionForm() {
  const context = useContext(SubscriptionFormContext);
  if (!context) {
    throw new Error("useSubscriptionForm must be used within SubscriptionFormProvider");
  }
  return context;
}

interface SubscriptionFormProviderProps {
  children: React.ReactNode;
  source?: string;
}

export function SubscriptionFormProvider({ children, source = "unknown" }: SubscriptionFormProviderProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [picksOpen, setPicksOpen] = useState(false);
  const [selected, setSelected] = useState<NewsletterId[]>(newsletters.map((item) => item.id));
  const [lines, setLines] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const revealPicks = () => setPicksOpen(true);

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationEmailSent(false);
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      revealPicks();
    }
  };

  const onToggleNewsletter = (id: NewsletterId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const onSubscribe = () => {
    unlockTransmissionSound();

    if (!email || email.trim() === "") {
      showToast("Oops!", "Please enter your email address to subscribe.", "error", 8000);
      return;
    }
    if (selected.length === 0) {
      showToast("Pick a newsletter", "Choose at least one list before subscribing.", "error", 8000);
      return;
    }

    setLoading(true);

    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        newsletters: selected,
        hp_field: honeypot,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          lines?: string[];
          preview?: boolean;
          ok?: boolean;
        };
        return { ok: res.ok, data };
      })
      .then(({ ok, data }) => {
        if (!ok || data.error || !data.lines?.length) {
          showToast(
            "Well, this is embarrassing.",
            data.error || "Could not subscribe. Try again in a moment.",
            "error",
            8000,
          );
          return;
        }

        setLines(data.lines);
        setPreview(Boolean(data.preview));
        setAttempt((current) => current + 1);
        setConfirmationEmailSent(true);
        setEmail("");
      })
      .catch(() => {
        showToast("Well, this is embarrassing.", "Could not subscribe. Try again in a moment.", "error", 8000);
      })
      .finally(() => setLoading(false));
  };

  const value: SubscriptionFormContextValue = {
    email,
    loading,
    confirmationEmailSent,
    attempt,
    source,
    picksOpen,
    selected,
    lines,
    preview,
    honeypot,
    onChangeEmail,
    onFocusEmail: revealPicks,
    onChangeHoneypot: setHoneypot,
    onToggleNewsletter,
    onSubscribe,
  };

  return (
    <SubscriptionFormContext.Provider value={value}>
      <div className="contents">
        {children}
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${source}-hp`}>Company</label>
          <input
            id={`${source}-hp`}
            name="hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>
      </div>
    </SubscriptionFormContext.Provider>
  );
}
