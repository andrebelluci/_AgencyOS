import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type {
  conversations,
  knowledgeDocuments,
  leads,
  messages,
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

export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;

export type Conversation = InferSelectModel<typeof conversations>;
export type NewConversation = InferInsertModel<typeof conversations>;

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

export type KnowledgeDocument = InferSelectModel<typeof knowledgeDocuments>;
export type NewKnowledgeDocument = InferInsertModel<typeof knowledgeDocuments>;
