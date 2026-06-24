import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import {
  knowledgeDocumentStatusEnum,
  knowledgeDocumentTypeEnum,
} from "./enums";
import { tenants } from "./tenants";

export const knowledgeDocuments = pgTable(
  "knowledge_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: knowledgeDocumentTypeEnum("type").notNull(),
    fileUrl: text("file_url"),
    status: knowledgeDocumentStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("knowledge_documents_tenant_id_idx").on(table.tenantId),
    index("knowledge_documents_status_idx").on(table.status),
  ],
);
