import "server-only";

import type { Lead } from "@/lib/db";

import {
  deleteLeadById,
  findLeadById,
  findLeadsByTenant,
  insertLead,
  updateLeadById,
} from "./repository";
import type { CreateLeadInput, UpdateLeadInput } from "./types";

export async function listLeads(tenantId: string): Promise<Lead[]> {
  return findLeadsByTenant(tenantId);
}

export async function getLead(
  tenantId: string,
  id: string,
): Promise<Lead | null> {
  const row = await findLeadById(tenantId, id);
  return row ?? null;
}

export async function createLead(
  tenantId: string,
  input: CreateLeadInput,
): Promise<Lead> {
  return insertLead(tenantId, input);
}

export async function updateLead(
  tenantId: string,
  id: string,
  input: UpdateLeadInput,
): Promise<Lead | null> {
  const existing = await findLeadById(tenantId, id);
  if (!existing) {
    return null;
  }

  const row = await updateLeadById(tenantId, id, input);
  return row ?? null;
}

export async function deleteLead(
  tenantId: string,
  id: string,
): Promise<boolean> {
  const row = await deleteLeadById(tenantId, id);
  return row !== undefined;
}
