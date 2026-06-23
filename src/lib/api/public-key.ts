import {
  PUBLIC_KEY_HEADER,
  PUBLIC_KEY_QUERY_PARAM,
} from "@/lib/tenant/constants";

const WIDGET_KEY_QUERY_PARAM = "key";

/**
 * Extracts public_key from a public API request (header or query).
 * Supports `key` (widget/embed) and `public_key` query params.
 */
export function getPublicKeyFromApiRequest(request: Request): string | null {
  const fromHeader = request.headers.get(PUBLIC_KEY_HEADER)?.trim();
  if (fromHeader) {
    return fromHeader;
  }

  const url = new URL(request.url);

  const fromKey = url.searchParams.get(WIDGET_KEY_QUERY_PARAM)?.trim();
  if (fromKey) {
    return fromKey;
  }

  const fromPublicKey = url.searchParams.get(PUBLIC_KEY_QUERY_PARAM)?.trim();
  return fromPublicKey || null;
}
