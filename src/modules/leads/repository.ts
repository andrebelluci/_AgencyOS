import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { getDb, leads, type Lead } from "@/lib/db";

import type { CreateLeadInput, UpdateLeadInput } from "./types";

export async function findLeadsByTenant(tenantId: string): Promise<Lead[]> {
  return getDb()
    .select()
    .from(leads)
    .where(eq(leads.tenantId, tenantId))
    .orderBy(desc(leads.createdAt));
}

export async function findLeadById(
  tenantId: string,
  id: string,
): Promise<Lead | undefined> {
  const [row] = await getDb()
    .select()
    .from(leads)
    .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
    .limit(1);

  return row;
}

export async function insertLead(
  tenantId: string,
  input: CreateLeadInput,
): Promise<Lead> {
  const [row] = await getDb()
    .insert(leads)
    .values({
      tenantId,
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      city: input.city ?? null,
      source: input.source ?? null,
      status: input.status,
      score: input.score ?? null,
      notes: input.notes ?? null,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create lead.");
  }

  return row;
}

export async function updateLeadById(
  tenantId: string,
  id: string,
  input: UpdateLeadInput,
): Promise<Lead | undefined> {
  const [row] = await getDb()
    .update(leads)
    .set(input)
    .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
    .returning();

  return row;
}

export async function deleteLeadById(
  tenantId: string,
  id: string,
): Promise<Lead | undefined> {
  const [row] = await getDb()
    .delete(leads)
    .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
    .returning();

  return row;
}
