"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePlatformAdmin } from "@/lib/auth/platform-admin";
import { withProvisioningDeps } from "@/modules/provisioning/deps";
import {
  ProvisioningError,
  provisionTenant,
} from "@/modules/provisioning";
import { updateTenantStatus } from "@/modules/tenants/admin-repository";

export type AdminActionState = {
  error?: string;
  success?: boolean;
  result?: {
    tenantId: string;
    slug: string;
    publicKey: string;
    ownerEmail: string;
    created: boolean;
  };
};

const createTenantSchema = z.object({
  companyName: z.string().trim().min(2, "Informe o nome da empresa."),
  slug: z.string().trim().optional(),
  ownerEmail: z.string().trim().email("E-mail do owner inválido."),
  ownerPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
  ownerName: z.string().trim().optional(),
});

const toggleStatusSchema = z.object({
  tenantId: z.string().uuid("Tenant inválido."),
  status: z.enum(["active", "inactive"]),
});

export async function createTenantAction(
  input: z.infer<typeof createTenantSchema>,
): Promise<AdminActionState> {
  const parsed = createTenantSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    await requirePlatformAdmin();

    const result = await withProvisioningDeps((deps) =>
      provisionTenant(
        {
          companyName: parsed.data.companyName,
          slug: parsed.data.slug || undefined,
          ownerEmail: parsed.data.ownerEmail,
          ownerPassword: parsed.data.ownerPassword,
          ownerName: parsed.data.ownerName || undefined,
        },
        deps,
      ),
    );

    revalidatePath("/admin");
    revalidatePath("/admin/tenants");

    return {
      success: true,
      result: {
        tenantId: result.tenantId,
        slug: result.slug,
        publicKey: result.publicKey,
        ownerEmail: result.ownerEmail,
        created: result.created,
      },
    };
  } catch (error) {
    if (error instanceof ProvisioningError) {
      return { error: error.message };
    }

    return { error: "Não foi possível criar o tenant." };
  }
}

export async function toggleTenantStatusAction(
  tenantId: string,
  status: "active" | "inactive",
): Promise<AdminActionState> {
  const parsed = toggleStatusSchema.safeParse({ tenantId, status });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    await requirePlatformAdmin();

    const updated = await updateTenantStatus(
      parsed.data.tenantId,
      parsed.data.status,
    );

    if (!updated) {
      return { error: "Tenant não encontrado." };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/tenants");

    return { success: true };
  } catch {
    return { error: "Não foi possível atualizar o status." };
  }
}
