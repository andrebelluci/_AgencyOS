import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type {
  tenantSettings,
  tenants,
  users,
} from "./schema";

export type Tenant = InferSelectModel<typeof tenants>;
export type NewTenant = InferInsertModel<typeof tenants>;

export type TenantSettings = InferSelectModel<typeof tenantSettings>;
export type NewTenantSettings = InferInsertModel<typeof tenantSettings>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
