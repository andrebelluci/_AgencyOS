import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listPdfDocuments } from "@/modules/knowledge/pdf-documents";
import { listFaqs } from "@/modules/knowledge/service";
import type { PdfDocumentListItem } from "@/modules/knowledge/types";

import { FaqManager } from "./faq-manager";
import { PdfUpload } from "./pdf-upload";

function formatDocumentDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function KnowledgePage() {
  const { tenant } = await requireOwnerTenant();
  const [faqs, pdfDocuments] = await Promise.all([
    listFaqs(tenant.id),
    listPdfDocuments(tenant.id),
  ]);

  const pdfDocumentItems: PdfDocumentListItem[] = pdfDocuments.map(
    (document) => ({
      ...document,
      createdAtLabel: formatDocumentDate(document.createdAt),
    }),
  );

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Conhecimento</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie FAQs e documentos PDF usados pelo assistente virtual.
        </p>
      </div>

      <PdfUpload documents={pdfDocumentItems} />
      <FaqManager faqs={faqs} />
    </div>
  );
}
