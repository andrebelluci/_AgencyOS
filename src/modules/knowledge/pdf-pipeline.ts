import "server-only";

import { createDocumentEmbeddings } from "@/ai/embeddings";
import { hasOpenAIConfig } from "@/env";

import { chunkText } from "./chunking";
import { extractPdfText } from "./pdf-extract";
import {
  deleteChunksByDocumentId,
  deletePdfDocumentById,
  findPdfDocumentById,
  insertChunks,
  insertPdfDocument,
  updateDocumentStatus,
} from "./repository";
import {
  deletePdfFromStorage,
  downloadPdfFromStorage,
  getKnowledgeStoragePath,
  MAX_PDF_BYTES,
  uploadPdfToStorage,
} from "./storage";
import type { PdfDocumentItem, UploadPdfInput } from "./types";

export { MAX_PDF_BYTES };

export async function listPdfDocuments(
  tenantId: string,
): Promise<PdfDocumentItem[]> {
  const { listPdfDocuments: list } = await import("./pdf-documents");
  return list(tenantId);
}

export async function getPdfDocument(
  tenantId: string,
  id: string,
): Promise<PdfDocumentItem | null> {
  const row = await findPdfDocumentById(tenantId, id);
  return row ?? null;
}

export async function processPdfBuffer(
  tenantId: string,
  documentId: string,
  buffer: Buffer,
): Promise<number> {
  const text = await extractPdfText(buffer);

  if (!text) {
    throw new Error("PDF sem texto extraível.");
  }

  const chunks = chunkText(text);

  if (chunks.length === 0) {
    throw new Error("Nenhum trecho gerado a partir do PDF.");
  }

  let embeddings: number[][] = [];

  if (hasOpenAIConfig()) {
    embeddings = await createDocumentEmbeddings(chunks);
  }

  await deleteChunksByDocumentId(tenantId, documentId);
  await insertChunks(
    tenantId,
    documentId,
    chunks.map((content, position) => ({
      content,
      position,
      embedding: embeddings[position],
    })),
  );

  return chunks.length;
}

export async function uploadAndProcessPdf(
  tenantId: string,
  input: UploadPdfInput,
): Promise<PdfDocumentItem> {
  if (input.buffer.byteLength === 0) {
    throw new Error("Arquivo PDF vazio.");
  }

  if (input.buffer.byteLength > MAX_PDF_BYTES) {
    throw new Error("Arquivo PDF excede o limite de 10 MB.");
  }

  const title =
    input.filename.replace(/\.pdf$/i, "").trim() || "Documento PDF";
  const document = await insertPdfDocument(tenantId, title);
  const storagePath = getKnowledgeStoragePath(tenantId, document.id);

  try {
    await uploadPdfToStorage(storagePath, input.buffer);
    await updateDocumentStatus(tenantId, document.id, "processing", storagePath);
    await processPdfBuffer(tenantId, document.id, input.buffer);

    const ready = await updateDocumentStatus(
      tenantId,
      document.id,
      "ready",
      storagePath,
    );

    if (!ready) {
      throw new Error("Documento PDF não encontrado após processamento.");
    }

    return ready;
  } catch (error) {
    await updateDocumentStatus(tenantId, document.id, "failed", storagePath);
    throw error;
  }
}

export async function deletePdfDocument(
  tenantId: string,
  documentId: string,
): Promise<boolean> {
  const document = await findPdfDocumentById(tenantId, documentId);

  if (!document) {
    return false;
  }

  if (document.fileUrl) {
    try {
      await deletePdfFromStorage(document.fileUrl);
    } catch {
      // Storage file may already be missing; continue with DB cleanup.
    }
  }

  const deleted = await deletePdfDocumentById(tenantId, documentId);
  return deleted !== undefined;
}

export async function reprocessPdfDocument(
  tenantId: string,
  documentId: string,
): Promise<PdfDocumentItem> {
  const document = await findPdfDocumentById(tenantId, documentId);

  if (!document?.fileUrl) {
    throw new Error("Documento PDF não encontrado ou sem arquivo.");
  }

  await updateDocumentStatus(tenantId, documentId, "processing");

  try {
    const buffer = await downloadPdfFromStorage(document.fileUrl);
    await processPdfBuffer(tenantId, documentId, buffer);

    const ready = await updateDocumentStatus(tenantId, documentId, "ready");

    if (!ready) {
      throw new Error("Documento PDF não encontrado após reprocessamento.");
    }

    return ready;
  } catch (error) {
    await updateDocumentStatus(tenantId, documentId, "failed", document.fileUrl);
    throw error;
  }
}
