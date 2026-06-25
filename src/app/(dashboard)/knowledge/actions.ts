"use server";

import { revalidatePath } from "next/cache";

import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { faqFormSchema, type FaqFormValues } from "@/modules/knowledge/schema";
import {
  createFaq,
  deleteFaq,
  updateFaq,
} from "@/modules/knowledge/service";
import {
  MAX_PDF_BYTES,
  uploadAndProcessPdf,
} from "@/modules/knowledge/pdf-pipeline";

export type FaqActionState = {
  error?: string;
  success?: boolean;
};

export type PdfUploadActionState = {
  error?: string;
  success?: boolean;
  documentId?: string;
};

export async function createFaqAction(
  input: FaqFormValues,
): Promise<FaqActionState> {
  const parsed = faqFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const { tenant } = await requireOwnerTenant();

    await createFaq(tenant.id, {
      question: parsed.data.question,
      answer: parsed.data.answer,
    });

    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Não foi possível cadastrar a FAQ." };
  }
}

export async function updateFaqAction(
  id: string,
  input: FaqFormValues,
): Promise<FaqActionState> {
  const parsed = faqFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const { tenant } = await requireOwnerTenant();

    const updated = await updateFaq(tenant.id, id, {
      question: parsed.data.question,
      answer: parsed.data.answer,
    });

    if (!updated) {
      return { error: "FAQ não encontrada." };
    }

    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Não foi possível atualizar a FAQ." };
  }
}

export async function deleteFaqAction(id: string): Promise<FaqActionState> {
  try {
    const { tenant } = await requireOwnerTenant();

    const deleted = await deleteFaq(tenant.id, id);

    if (!deleted) {
      return { error: "FAQ não encontrada." };
    }

    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Não foi possível excluir a FAQ." };
  }
}

export async function uploadPdfAction(
  formData: FormData,
): Promise<PdfUploadActionState> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Selecione um arquivo PDF." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Apenas arquivos PDF são aceitos." };
  }

  if (file.size > MAX_PDF_BYTES) {
    return { error: "Arquivo muito grande (máx. 10 MB)." };
  }

  try {
    const { tenant } = await requireOwnerTenant();
    const buffer = Buffer.from(await file.arrayBuffer());
    const document = await uploadAndProcessPdf(tenant.id, {
      buffer,
      filename: file.name,
    });

    revalidatePath("/knowledge");
    return { success: true, documentId: document.id };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível processar o PDF.";
    return { error: message };
  }
}
