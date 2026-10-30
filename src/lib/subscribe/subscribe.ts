import { redactEmail } from "@/lib/email";
import { getNewsletter, isNewsletterId, type NewsletterId } from "@/lib/newsletters";
import { subscribeAgentic, subscribeReactNative } from "@/lib/subscribe/providers";
import type { AdapterOutcome, NewsletterResult, SubscribeSuccess } from "@/lib/subscribe/types";

const adapters: Record<NewsletterId, (email: string) => Promise<AdapterOutcome>> = {
  agentic: subscribeAgentic,
  "react-native": subscribeReactNative,
};

export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function listNames(names: string[]): string {
  if (names.length === 0) {
    return "";
  }
  if (names.length === 1) {
    return names[0] ?? "";
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function buildSuccess(results: NewsletterResult[]): SubscribeSuccess {
  const succeeded = results.filter((result) => result.ok);
  const failed = results.filter((result) => !result.ok);
  const mocked = succeeded.filter((result) => result.mode === "mock");
  const live = succeeded.filter((result) => result.mode === "live");
  const previewOnly = mocked.length > 0 && live.length === 0;
  const names = (items: NewsletterResult[]) => items.map((result) => result.name);

  const lines: string[] = [];
  if (previewOnly) {
    lines.push("Preview only. Nothing was sent.");
    lines.push(`${listNames(names(mocked))} would be confirmed.`);
  } else if (live.length > 0 && failed.length === 0 && mocked.length === 0) {
    lines.push("You're in.");
    lines.push(`${listNames(names(live))} will show up in your inbox.`);
  } else {
    if (live.length > 0) {
      lines.push(`${listNames(names(live))} ${live.length === 1 ? "is" : "are"} confirmed.`);
    }
    if (mocked.length > 0) {
      lines.push(`Preview only for ${listNames(names(mocked))}. Nothing was sent there.`);
    }
    for (const result of failed) {
      lines.push(`${result.name} did not go through. ${result.error ?? "Try it again in a moment."}`);
    }
  }

  return {
    ok: true,
    partial: failed.length > 0,
    mode: mocked.length > 0 && live.length > 0 ? "mixed" : previewOnly ? "mock" : "live",
    preview: previewOnly,
    lines,
    results,
  };
}

export async function subscribeToSelected(
  email: string,
  ids: NewsletterId[],
): Promise<{ status: number; body: SubscribeSuccess | { ok: false; error: string; results?: NewsletterResult[] } }> {
  const production = isProductionDeployment();
  const results = await Promise.all(ids.map((id) => subscribeOne(email, id, production)));
  const succeeded = results.filter((result) => result.ok);

  if (succeeded.length === 0) {
    const unconfigured = results.every((result) => result.error === unconfiguredMessage);
    if (production && unconfigured) {
      return {
        status: 503,
        body: {
          ok: false,
          error: "Subscriptions are not configured on this server yet.",
          results,
        },
      };
    }

    return {
      status: 502,
      body: {
        ok: false,
        error: results.map((result) => `${result.name}: ${result.error ?? "Could not subscribe."}`).join(" "),
        results,
      },
    };
  }

  const success = buildSuccess(results);
  return { status: success.partial ? 207 : 200, body: success };
}

const unconfiguredMessage = "This newsletter is not configured yet.";

async function subscribeOne(
  email: string,
  id: NewsletterId,
  production: boolean,
): Promise<NewsletterResult> {
  const newsletter = getNewsletter(id);
  const outcome = await adapters[id](email);

  if (!outcome.configured) {
    if (production) {
      console.error(`[platform-rewind] ${id} is not configured`);
      return {
        id,
        name: newsletter.name,
        ok: false,
        mode: "live",
        error: unconfiguredMessage,
      };
    }

    console.info("[platform-rewind] mock subscribe", {
      email,
      newsletter: id,
      note: "Missing provider credentials. Nothing was sent.",
    });
    return { id, name: newsletter.name, ok: true, mode: "mock" };
  }

  if (!outcome.ok) {
    console.error(`[platform-rewind] ${id} failed for ${redactEmail(email)}: ${outcome.error}`);
    return { id, name: newsletter.name, ok: false, mode: "live", error: outcome.error };
  }

  console.info(`[platform-rewind] subscribed ${redactEmail(email)} to ${id}`);
  return { id, name: newsletter.name, ok: true, mode: "live" };
}

export function parseNewsletterSelection(value: unknown): { ids: NewsletterId[] } | { error: string } {
  if (!Array.isArray(value) || value.length === 0) {
    return { error: "Pick at least one newsletter." };
  }

  const ids: NewsletterId[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !isNewsletterId(item)) {
      return { error: "Unknown newsletter." };
    }
    if (!ids.includes(item)) {
      ids.push(item);
    }
  }

  return { ids };
}
