import { normalizeEmail } from "@/lib/email";
import { getNewsletter, newsletters } from "@/lib/newsletters";
import { listNames, parseNewsletterSelection, subscribeToSelected } from "@/lib/subscribe/subscribe";

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;

export async function POST(request: Request) {
  const limited = rateLimit(request);
  if (limited) {
    return Response.json({ ok: false, error: "Slow down a moment and try again." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Send a JSON body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ ok: false, error: "Send a JSON body." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const honeypot = typeof body.hp_field === "string" ? body.hp_field.trim() : "";
  if (honeypot) {
    console.info("[platform-rewind] honeypot rejected a signup");
    const selected = parseNewsletterSelection(body.newsletters);
    const names =
      "ids" in selected
        ? selected.ids.map((id) => getNewsletter(id).name)
        : newsletters.map((newsletter) => newsletter.name);
    return Response.json({
      ok: true,
      partial: false,
      mode: "live",
      preview: false,
      lines: ["You're in.", `${listNames(names)} will show up in your inbox.`],
      results: [],
    });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const selected = parseNewsletterSelection(body.newsletters);
  if ("error" in selected) {
    return Response.json({ ok: false, error: selected.error }, { status: 400 });
  }

  const outcome = await subscribeToSelected(email, selected.ids);
  return Response.json(outcome.body, { status: outcome.status });
}

function rateLimit(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "local";
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}
