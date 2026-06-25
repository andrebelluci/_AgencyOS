import {
  DEFAULT_PLATFORM_DOMAIN,
  DEV_TENANT_SLUG,
} from "./constants";

function getApexTenantSlug(): string | undefined {
  const slug = process.env.PLATFORM_APEX_TENANT_SLUG?.trim();
  return slug || undefined;
}

/**
 * Resolves tenant slug from hostname (no DB).
 * localhost / 127.0.0.1 → development slug.
 * {slug}.agencyos.com.br → slug.
 * apex / Vercel URL → PLATFORM_APEX_TENANT_SLUG (or development on *.vercel.app).
 */
export function resolveSlugFromHostname(hostname: string): string | null {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DEV_TENANT_SLUG;
  }

  const platformDomain =
    process.env.PLATFORM_DOMAIN?.trim() || DEFAULT_PLATFORM_DOMAIN;
  const apexSlug = getApexTenantSlug();

  if (hostname === platformDomain || hostname === `www.${platformDomain}`) {
    return apexSlug ?? null;
  }

  const suffix = `.${platformDomain}`;
  if (hostname.endsWith(suffix)) {
    const slug = hostname.slice(0, -suffix.length);
    if (slug && !slug.includes(".")) {
      return slug;
    }
  }

  if (hostname.endsWith(".vercel.app")) {
    return apexSlug ?? DEV_TENANT_SLUG;
  }

  return null;
}
