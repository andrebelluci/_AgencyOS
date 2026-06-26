import "server-only";

import { findPdfDocumentsByTenant } from "./repository";
import type { PdfDocumentItem } from "./types";

/** List PDFs without loading pdf-parse (safe for /knowledge page SSR). */
export async function listPdfDocuments(
  tenantId: string,
): Promise<PdfDocumentItem[]> {
  return findPdfDocumentsByTenant(tenantId);
}
