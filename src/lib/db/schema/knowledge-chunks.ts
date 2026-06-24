import { index, integer, pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";

import { knowledgeDocuments } from "./knowledge-documents";
import { tenants } from "./tenants";

/** OpenAI text-embedding-3-small default dimensions */
export const EMBEDDING_DIMENSIONS = 1536;

export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => knowledgeDocuments.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    position: integer("position").notNull().default(0),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("knowledge_chunks_tenant_id_idx").on(table.tenantId),
    index("knowledge_chunks_document_id_idx").on(table.documentId),
  ],
);
