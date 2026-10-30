export class ProviderRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderRequestError";
  }
}

export async function providerRequest(
  url: string,
  init: RequestInit,
): Promise<{ status: number; text: string }> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(12_000),
    });
    const text = await response.text();
    return { status: response.status, text };
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ProviderRequestError("The list did not respond in time.");
    }
    throw new ProviderRequestError("Could not reach the list.");
  }
}

export function readProviderMessage(text: string, fallback: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      const message = record.message ?? record.error ?? record.name;
      if (typeof message === "string" && message.trim()) {
        return cleanMessage(message);
      }
      const nested = record.error;
      if (nested && typeof nested === "object") {
        const nestedMessage = (nested as Record<string, unknown>).message;
        if (typeof nestedMessage === "string" && nestedMessage.trim()) {
          return cleanMessage(nestedMessage);
        }
      }
    }
  } catch {
    // Not JSON. Fall through to a generic message so HTML error pages stay private.
  }

  return fallback;
}

function cleanMessage(message: string): string {
  const compact = message.replace(/\s+/g, " ").trim();
  if (compact.length <= 180) {
    return compact;
  }
  return `${compact.slice(0, 177)}...`;
}
