import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { QuickActionConfig } from "@/lib/widget/quick-actions";

import { tenants } from "./tenants";

export const tenantSettings = pgTable("tenant_settings", {
  tenantId: uuid("tenant_id")
    .primaryKey()
    .references(() => tenants.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  services: jsonb("services").$type<string[]>().default([]).notNull(),
  systemPrompt: text("system_prompt"),
  welcomeMessage: text("welcome_message"),
  initialMessage: text("initial_message"),
  quickActions: jsonb("quick_actions")
    .$type<QuickActionConfig[]>()
    .default([])
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
