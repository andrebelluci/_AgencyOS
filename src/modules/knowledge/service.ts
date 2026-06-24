import "server-only";

import {
  deleteFaqById,
  findFaqById,
  findFaqsByTenant,
  insertFaq,
  updateFaqById,
} from "./repository";
import type { CreateFaqInput, FaqItem, UpdateFaqInput } from "./types";

export async function listFaqs(tenantId: string): Promise<FaqItem[]> {
  return findFaqsByTenant(tenantId);
}

export async function getFaq(
  tenantId: string,
  id: string,
): Promise<FaqItem | null> {
  const row = await findFaqById(tenantId, id);
  return row ?? null;
}

export async function createFaq(
  tenantId: string,
  input: CreateFaqInput,
): Promise<FaqItem> {
  return insertFaq(tenantId, input);
}

export async function updateFaq(
  tenantId: string,
  id: string,
  input: UpdateFaqInput,
): Promise<FaqItem | null> {
  const row = await updateFaqById(tenantId, id, input);
  return row ?? null;
}

export async function deleteFaq(
  tenantId: string,
  id: string,
): Promise<boolean> {
  return deleteFaqById(tenantId, id);
}
