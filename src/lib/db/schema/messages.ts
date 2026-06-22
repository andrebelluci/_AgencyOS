import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { messageRoleEnum } from "./enums";
import { tenants } from "./tenants";

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("messages_tenant_id_idx").on(table.tenantId),
    index("messages_conversation_id_idx").on(table.conversationId),
  ],
);
