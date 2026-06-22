import "server-only";

import { and, desc, eq } from "drizzle-orm";

import {
  conversations,
  getDb,
  messages,
  type Conversation,
  type Message,
} from "@/lib/db";

import type {
  CreateConversationInput,
  CreateMessageInput,
  UpdateConversationInput,
  UpdateMessageInput,
} from "./types";

export async function findConversationsByTenant(
  tenantId: string,
): Promise<Conversation[]> {
  return getDb()
    .select()
    .from(conversations)
    .where(eq(conversations.tenantId, tenantId))
    .orderBy(desc(conversations.createdAt));
}

export async function findConversationById(
  tenantId: string,
  id: string,
): Promise<Conversation | undefined> {
  const [row] = await getDb()
    .select()
    .from(conversations)
    .where(
      and(eq(conversations.id, id), eq(conversations.tenantId, tenantId)),
    )
    .limit(1);

  return row;
}

export async function insertConversation(
  tenantId: string,
  input: CreateConversationInput,
): Promise<Conversation> {
  const [row] = await getDb()
    .insert(conversations)
    .values({
      tenantId,
      visitorId: input.visitorId,
      leadId: input.leadId ?? null,
      status: input.status,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create conversation.");
  }

  return row;
}

export async function updateConversationById(
  tenantId: string,
  id: string,
  input: UpdateConversationInput,
): Promise<Conversation | undefined> {
  const [row] = await getDb()
    .update(conversations)
    .set(input)
    .where(
      and(eq(conversations.id, id), eq(conversations.tenantId, tenantId)),
    )
    .returning();

  return row;
}

export async function deleteConversationById(
  tenantId: string,
  id: string,
): Promise<Conversation | undefined> {
  const [row] = await getDb()
    .delete(conversations)
    .where(
      and(eq(conversations.id, id), eq(conversations.tenantId, tenantId)),
    )
    .returning();

  return row;
}

export async function findMessagesByConversation(
  tenantId: string,
  conversationId: string,
): Promise<Message[]> {
  return getDb()
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.tenantId, tenantId),
        eq(messages.conversationId, conversationId),
      ),
    )
    .orderBy(messages.createdAt);
}

export async function findMessageById(
  tenantId: string,
  id: string,
): Promise<Message | undefined> {
  const [row] = await getDb()
    .select()
    .from(messages)
    .where(and(eq(messages.id, id), eq(messages.tenantId, tenantId)))
    .limit(1);

  return row;
}

export async function insertMessage(
  tenantId: string,
  input: CreateMessageInput,
): Promise<Message> {
  const [row] = await getDb()
    .insert(messages)
    .values({
      tenantId,
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create message.");
  }

  return row;
}

export async function updateMessageById(
  tenantId: string,
  id: string,
  input: UpdateMessageInput,
): Promise<Message | undefined> {
  const [row] = await getDb()
    .update(messages)
    .set(input)
    .where(and(eq(messages.id, id), eq(messages.tenantId, tenantId)))
    .returning();

  return row;
}

export async function deleteMessageById(
  tenantId: string,
  id: string,
): Promise<Message | undefined> {
  const [row] = await getDb()
    .delete(messages)
    .where(and(eq(messages.id, id), eq(messages.tenantId, tenantId)))
    .returning();

  return row;
}
