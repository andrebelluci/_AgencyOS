"use server";

import { revalidatePath } from "next/cache";

import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { updateLeadStatusSchema } from "@/modules/leads/schema";
import { updateLead } from "@/modules/leads/service";

export type LeadStatusActionState = {
  error?: string;
  success?: boolean;
};

export async function updateLeadStatusAction(
  leadId: string,
  status: string,
): Promise<LeadStatusActionState> {
  const parsed = updateLeadStatusSchema.safeParse({ leadId, status });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const { tenant } = await requireOwnerTenant();

    const updated = await updateLead(tenant.id, parsed.data.leadId, {
      status: parsed.data.status,
    });

    if (!updated) {
      return { error: "Lead não encontrado." };
    }

    revalidatePath("/leads");
    return { success: true };
  } catch {
    return { error: "Não foi possível atualizar o status." };
  }
}
