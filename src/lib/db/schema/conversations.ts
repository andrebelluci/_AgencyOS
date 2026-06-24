import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { ConversationMetadata } from "@/lib/db/conversation-metadata";

import { conversationStatusEnum } from "./enums";
import { leads } from "./leads";
import { tenants } from "./tenants";

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    visitorId: text("visitor_id").notNull(),
    status: conversationStatusEnum("status").notNull().default("active"),
    metadata: jsonb("metadata")
      .$type<ConversationMetadata>()
      .default({})
      .notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("conversations_tenant_id_idx").on(table.tenantId),
    index("conversations_lead_id_idx").on(table.leadId),
    index("conversations_visitor_id_idx").on(table.visitorId),
  ],
);
