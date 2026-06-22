import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { leadScoreEnum, leadStatusEnum } from "./enums";
import { tenants } from "./tenants";

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    city: text("city"),
    source: text("source"),
    status: leadStatusEnum("status").notNull().default("novo"),
    score: leadScoreEnum("score"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("leads_tenant_id_idx").on(table.tenantId),
    index("leads_status_idx").on(table.status),
  ],
);
