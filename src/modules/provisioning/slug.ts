const SLUG_MAX_LENGTH = 48;

/**
 * Normalizes a company name into a URL-safe tenant slug.
 */
export function slugFromCompanyName(companyName: string): string {
  const normalized = companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);

  if (!normalized) {
    throw new Error("Company name must produce a valid slug.");
  }

  return normalized;
}

export function normalizeSlug(slug: string): string {
  const normalized = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);

  if (!normalized) {
    throw new Error("Slug is invalid.");
  }

  return normalized;
}
