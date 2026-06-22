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

export const leadStatusEnum = pgEnum("lead_status", [
  "novo",
  "qualificado",
  "proposta",
  "fechado",
  "perdido",
]);

export const leadScoreEnum = pgEnum("lead_score", ["baixo", "médio", "alto"]);

export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "closed",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);
