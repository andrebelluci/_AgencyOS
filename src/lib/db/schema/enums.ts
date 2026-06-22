import { pgEnum } from "drizzle-orm/pg-core";

export const tenantStatusEnum = pgEnum("tenant_status", [
  "active",
  "inactive",
]);

export const userRoleEnum = pgEnum("user_role", ["owner"]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "invited",
]);
