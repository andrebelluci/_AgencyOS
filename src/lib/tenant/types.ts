export type TenantResolution =
  | { kind: "slug"; value: string }
  | { kind: "public_key"; value: string };

/** Subset de tenant serializado pelo middleware (edge-safe). */
export type ResolvedTenant = {
  id: string;
  slug: string;
  name: string;
  publicKey: string;
  status: "active" | "inactive";
};
