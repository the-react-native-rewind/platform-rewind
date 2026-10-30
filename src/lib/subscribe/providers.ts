import { providerRequest, ProviderRequestError, readProviderMessage } from "@/lib/subscribe/http";
import type { AdapterOutcome } from "@/lib/subscribe/types";

function bearer(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function failure(error: unknown, fallback: string): AdapterOutcome {
  if (error instanceof ProviderRequestError) {
    return { configured: true, ok: false, error: error.message };
  }
  return { configured: true, ok: false, error: fallback };
}

/**
 * The Agentic Rewind sends through Resend.
 * DNS on theagenticrewind.com points `links` at resend-dns.com and `send` at Amazon SES,
 * which is Resend's mail path. Their public form posts to `/api/subscribe` and expects
 * `{ delivery: "sent" | "demo" }`. The private repo was not readable from here, so the
 * adapter calls Resend's Contacts API directly: a segment id uses the current API, and
 * an audience id uses the legacy audiences endpoint.
 */
export async function subscribeAgentic(email: string): Promise<AdapterOutcome> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const segmentId = process.env.RESEND_AGENTIC_SEGMENT_ID?.trim();
  const audienceId = process.env.RESEND_AGENTIC_AUDIENCE_ID?.trim();

  if (!apiKey || (!segmentId && !audienceId)) {
    return { configured: false };
  }

  try {
    if (segmentId) {
      return await createResendContact(apiKey, email, segmentId);
    }
    if (audienceId) {
      return await createLegacyAudienceContact(apiKey, email, audienceId);
    }
    return { configured: false };
  } catch (error) {
    return failure(error, "Resend could not add this address.");
  }
}

async function createResendContact(
  apiKey: string,
  email: string,
  segmentId: string,
): Promise<AdapterOutcome> {
  const created = await providerRequest("https://api.resend.com/contacts", {
    method: "POST",
    headers: bearer(apiKey),
    body: JSON.stringify({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    }),
  });

  if (created.status >= 200 && created.status < 300) {
    return { configured: true, ok: true };
  }

  if (created.status === 409) {
    const added = await providerRequest(
      `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
      { method: "POST", headers: bearer(apiKey) },
    );
    if (added.status >= 200 && added.status < 300) {
      return { configured: true, ok: true };
    }
    return {
      configured: true,
      ok: false,
      error: readProviderMessage(added.text, "Resend could not add this address to the segment."),
    };
  }

  return {
    configured: true,
    ok: false,
    error: readProviderMessage(created.text, "Resend could not add this address."),
  };
}

async function createLegacyAudienceContact(
  apiKey: string,
  email: string,
  audienceId: string,
): Promise<AdapterOutcome> {
  const created = await providerRequest(
    `https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`,
    {
      method: "POST",
      headers: bearer(apiKey),
      body: JSON.stringify({ email, unsubscribed: false }),
    },
  );

  if ((created.status >= 200 && created.status < 300) || created.status === 409) {
    return { configured: true, ok: true };
  }

  return {
    configured: true,
    ok: false,
    error: readProviderMessage(created.text, "Resend could not add this address."),
  };
}

/**
 * The React Native Rewind site is a Next.js app in front of Strapi Cloud
 * (`studio.thereactnativerewind.com`). Issues and events are public Strapi
 * collections. Subscriber-shaped routes are not: the names we probed return 404,
 * so the list itself is not a public Strapi collection.
 *
 * The mailing domain is MailerLite (`_spf.mlsend.com` and a MailerLite site
 * verification on thereactnativerewind.com). The public form posts to
 * `/api/subscribe` and, on a bad address, answers "Error subscribing to mailing list".
 * MailerLite is the adapter that actually puts someone on the list.
 *
 * If MailerLite credentials are absent and Strapi credentials are present, we write
 * a subscriber document instead. That path is for a collection you know exists.
 */
export async function subscribeReactNative(email: string): Promise<AdapterOutcome> {
  const mailerLiteKey = process.env.MAILERLITE_API_KEY?.trim();
  if (mailerLiteKey) {
    try {
      return await createMailerLiteSubscriber(mailerLiteKey, email);
    } catch (error) {
      return failure(error, "MailerLite could not add this address.");
    }
  }

  const strapiUrl = process.env.STRAPI_URL?.trim();
  const strapiToken = process.env.STRAPI_API_TOKEN?.trim();
  if (strapiUrl && strapiToken) {
    try {
      return await createStrapiSubscriber(strapiUrl, strapiToken, email);
    } catch (error) {
      return failure(error, "Strapi could not store this address.");
    }
  }

  return { configured: false };
}

async function createMailerLiteSubscriber(apiKey: string, email: string): Promise<AdapterOutcome> {
  const groupId = process.env.MAILERLITE_GROUP_ID?.trim();
  const status = process.env.MAILERLITE_STATUS?.trim();
  const payload: Record<string, unknown> = { email };
  if (groupId) {
    payload.groups = [groupId];
  }
  if (status) {
    payload.status = status;
  }

  const created = await providerRequest("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: bearer(apiKey),
    body: JSON.stringify(payload),
  });

  if (created.status >= 200 && created.status < 300) {
    return { configured: true, ok: true };
  }

  return {
    configured: true,
    ok: false,
    error: readProviderMessage(created.text, "MailerLite could not add this address."),
  };
}

async function createStrapiSubscriber(
  baseUrl: string,
  token: string,
  email: string,
): Promise<AdapterOutcome> {
  const path = process.env.STRAPI_SUBSCRIBERS_PATH?.trim() || "/api/subscribers";
  const field = process.env.STRAPI_EMAIL_FIELD?.trim() || "email";
  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const created = await providerRequest(url, {
    method: "POST",
    headers: bearer(token),
    body: JSON.stringify({
      data: {
        [field]: email,
        source: "platform-rewind",
      },
    }),
  });

  if (created.status >= 200 && created.status < 300) {
    return { configured: true, ok: true };
  }

  return {
    configured: true,
    ok: false,
    error: readProviderMessage(created.text, "Strapi could not store this address."),
  };
}
