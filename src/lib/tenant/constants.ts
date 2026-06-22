/** Slug do tenant usado em localhost durante desenvolvimento. */
export const DEV_TENANT_SLUG = "development";

/** public_key fixa do tenant dev — usada no widget local (npm run db:seed). */
export const DEV_PUBLIC_KEY = "pk_dev_local";

/** Domínio base da plataforma (subdomínios: `{slug}.agencyos.com.br`). */
export const DEFAULT_PLATFORM_DOMAIN = "agencyos.com.br";

export const TENANT_HEADER_ID = "x-tenant-id";
export const TENANT_HEADER_SLUG = "x-tenant-slug";
export const TENANT_HEADER_PUBLIC_KEY = "x-public-key";

export const PUBLIC_KEY_QUERY_PARAM = "public_key";
export const PUBLIC_KEY_HEADER = "x-public-key";
