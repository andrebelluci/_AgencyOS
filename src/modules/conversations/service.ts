import "server-only";

import type { Conversation, Message } from "@/lib/db";
import { findLeadById } from "@/modules/leads/repository";

import {
  deleteConversationById,
  deleteMessageById,
  findConversationById,
  findConversationsByTenant,
  findConversationsByTenantFiltered,
  findMessageById,
  findMessagesByConversation,
  insertConversation,
  insertMessage,
  updateConversationById,
  updateMessageById,
} from "./repository";
import type {
  ConversationSearchFilters,
  CreateConversationInput,
  CreateMessageInput,
  UpdateConversationInput,
  UpdateMessageInput,
} from "./types";

async function assertLeadInTenant(
  tenantId: string,
  leadId: string,
): Promise<void> {
  const lead = await findLeadById(tenantId, leadId);
  if (!lead) {
    throw new Error("Lead not found in tenant.");
  }
}

export async function listConversations(
  tenantId: string,
  filters?: ConversationSearchFilters,
): Promise<Conversation[]> {
  if (filters && hasConversationFilters(filters)) {
    return findConversationsByTenantFiltered(tenantId, filters);
  }

  return findConversationsByTenant(tenantId);
}

function hasConversationFilters(filters: ConversationSearchFilters): boolean {
  return Boolean(
    filters.query?.trim() || filters.startedFrom || filters.startedTo,
  );
}

export async function getConversation(
  tenantId: string,
  id: string,
): Promise<Conversation | null> {
  const row = await findConversationById(tenantId, id);
  return row ?? null;
}

export async function createConversation(
  tenantId: string,
  input: CreateConversationInput,
): Promise<Conversation> {
  if (input.leadId) {
    await assertLeadInTenant(tenantId, input.leadId);
  }

  return insertConversation(tenantId, input);
}

export async function updateConversation(
  tenantId: string,
  id: string,
  input: UpdateConversationInput,
): Promise<Conversation | null> {
  const existing = await findConversationById(tenantId, id);
  if (!existing) {
    return null;
  }

  if (input.leadId) {
    await assertLeadInTenant(tenantId, input.leadId);
  }

  const row = await updateConversationById(tenantId, id, input);
  return row ?? null;
}

export async function deleteConversation(
  tenantId: string,
  id: string,
): Promise<boolean> {
  const row = await deleteConversationById(tenantId, id);
  return row !== undefined;
}

export async function listMessages(
  tenantId: string,
  conversationId: string,
): Promise<Message[]> {
  const conversation = await findConversationById(tenantId, conversationId);
  if (!conversation) {
    return [];
  }

  return findMessagesByConversation(tenantId, conversationId);
}

export async function getMessage(
  tenantId: string,
  id: string,
): Promise<Message | null> {
  const row = await findMessageById(tenantId, id);
  return row ?? null;
}

export async function createMessage(
  tenantId: string,
  input: CreateMessageInput,
): Promise<Message> {
  const conversation = await findConversationById(
    tenantId,
    input.conversationId,
  );
  if (!conversation) {
    throw new Error("Conversation not found in tenant.");
  }

  return insertMessage(tenantId, input);
}

export async function updateMessage(
  tenantId: string,
  id: string,
  input: UpdateMessageInput,
): Promise<Message | null> {
  const existing = await findMessageById(tenantId, id);
  if (!existing) {
    return null;
  }

  const row = await updateMessageById(tenantId, id, input);
  return row ?? null;
}

export async function deleteMessage(
  tenantId: string,
  id: string,
): Promise<boolean> {
  const row = await deleteMessageById(tenantId, id);
  return row !== undefined;
}
