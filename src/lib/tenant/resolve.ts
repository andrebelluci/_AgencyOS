import type { NextRequest } from "next/server";

import {
  DEFAULT_PLATFORM_DOMAIN,
  DEV_TENANT_SLUG,
  PUBLIC_KEY_HEADER,
  PUBLIC_KEY_QUERY_PARAM,
} from "./constants";
import type { TenantResolution } from "./types";

export function getPlatformDomain(): string {
  return process.env.PLATFORM_DOMAIN?.trim() || DEFAULT_PLATFORM_DOMAIN;
}

function getHostname(request: NextRequest): string {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  return host.split(":")[0] ?? "";
}

const WIDGET_KEY_QUERY_PARAM = "key";

function getPublicKeyFromRequest(request: NextRequest): string | null {
  const fromHeader = request.headers.get(PUBLIC_KEY_HEADER)?.trim();
  if (fromHeader) {
    return fromHeader;
  }

  const fromWidgetKey = request.nextUrl.searchParams
    .get(WIDGET_KEY_QUERY_PARAM)
    ?.trim();
  if (fromWidgetKey) {
    return fromWidgetKey;
  }

  const fromQuery = request.nextUrl.searchParams.get(PUBLIC_KEY_QUERY_PARAM)?.trim();
  return fromQuery || null;
}

function resolveFromHostname(hostname: string): TenantResolution | null {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { kind: "slug", value: DEV_TENANT_SLUG };
  }

  const platformDomain = getPlatformDomain();

  if (hostname === platformDomain || hostname === `www.${platformDomain}`) {
    return null;
  }

  const suffix = `.${platformDomain}`;
  if (hostname.endsWith(suffix)) {
    const slug = hostname.slice(0, -suffix.length);
    if (slug && !slug.includes(".")) {
      return { kind: "slug", value: slug };
    }
  }

  return null;
}

/**
 * Extrai identificador de tenant da requisição (sem acesso ao banco).
 * Ordem: public_key (header/query) → subdomínio → localhost (development).
 */
export function resolveTenantFromRequest(
  request: NextRequest,
): TenantResolution | null {
  const publicKey = getPublicKeyFromRequest(request);
  if (publicKey) {
    return { kind: "public_key", value: publicKey };
  }

  return resolveFromHostname(getHostname(request));
}
