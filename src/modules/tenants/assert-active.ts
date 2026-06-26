import type { Tenant } from "@/lib/db";

type TenantAccessError = new (message: string, status: number) => Error;

export function assertActiveTenantForApi<T extends TenantAccessError>(
  tenant: Tenant | undefined,
  ErrorClass: T,
): Tenant {
  if (!tenant) {
    throw new ErrorClass("Tenant not found.", 404);
  }

  if (tenant.status !== "active") {
    throw new ErrorClass("Tenant is inactive.", 403);
  }

  return tenant;
}
