const TENANT_EXEMPT_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/api/health",
  "/auth",
] as const;

const TENANT_EXEMPT_EXACT = ["/", "/login"] as const;

const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/leads",
  "/conversations",
  "/knowledge",
  "/settings",
] as const;

const TENANT_REQUIRED_PREFIXES = [
  "/dashboard",
  "/leads",
  "/conversations",
  "/knowledge",
  "/settings",
  "/chat",
  "/api/chat",
  "/api/widget",
  "/api/leads",
  "/api/knowledge",
] as const;

export function isTenantExemptPath(pathname: string): boolean {
  if (TENANT_EXEMPT_EXACT.includes(pathname as (typeof TENANT_EXEMPT_EXACT)[number])) {
    return true;
  }

  return TENANT_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function requiresTenant(pathname: string): boolean {
  if (isTenantExemptPath(pathname)) {
    return false;
  }

  return TENANT_REQUIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function requiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
