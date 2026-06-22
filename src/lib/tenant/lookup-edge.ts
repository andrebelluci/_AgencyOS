import type { TenantResolution, ResolvedTenant } from "./types";

type SupabaseTenantRow = {
  id: string;
  slug: string;
  name: string;
  public_key: string;
  status: "active" | "inactive";
};

function mapRow(row: SupabaseTenantRow): ResolvedTenant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    publicKey: row.public_key,
    status: row.status,
  };
}

function buildFilter(resolution: TenantResolution): string {
  if (resolution.kind === "slug") {
    return `slug=eq.${encodeURIComponent(resolution.value)}`;
  }

  return `public_key=eq.${encodeURIComponent(resolution.value)}`;
}

/**
 * Busca tenant via Supabase REST (compatível com Edge Runtime do middleware).
 * Retorna null se Supabase não estiver configurado ou tenant não existir.
 */
export async function lookupTenantEdge(
  resolution: TenantResolution,
): Promise<ResolvedTenant | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  const filter = buildFilter(resolution);
  const url = `${supabaseUrl}/rest/v1/tenants?${filter}&status=eq.active&select=id,slug,name,public_key,status&limit=1`;

  const response = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as SupabaseTenantRow[];
  const row = rows[0];

  if (!row) {
    return null;
  }

  return mapRow(row);
}
