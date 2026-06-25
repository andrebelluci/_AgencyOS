import "server-only";

import { createAdminClient } from "@/lib/supabase/admin-client";
import { KNOWLEDGE_BUCKET } from "@/lib/supabase/constants";
import { ensureKnowledgeBucket } from "@/lib/supabase/check-connection";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;

export function getKnowledgeStoragePath(
  tenantId: string,
  documentId: string,
): string {
  return `${tenantId}/documents/${documentId}.pdf`;
}

export async function uploadPdfToStorage(
  storagePath: string,
  buffer: Buffer,
): Promise<void> {
  await ensureKnowledgeBucket();

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(KNOWLEDGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }
}

export async function downloadPdfFromStorage(
  storagePath: string,
): Promise<Buffer> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(KNOWLEDGE_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new Error(
      `Failed to download PDF: ${error?.message ?? "empty response"}`,
    );
  }

  return Buffer.from(await data.arrayBuffer());
}
