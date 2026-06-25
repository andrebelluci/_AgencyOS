import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listPdfDocuments } from "@/modules/knowledge/pdf-pipeline";
import { listFaqs } from "@/modules/knowledge/service";

import { FaqManager } from "./faq-manager";
import { PdfUpload } from "./pdf-upload";

export default async function KnowledgePage() {
  const { tenant } = await requireOwnerTenant();
  const [faqs, pdfDocuments] = await Promise.all([
    listFaqs(tenant.id),
    listPdfDocuments(tenant.id),
  ]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Conhecimento</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie FAQs e documentos PDF usados pelo assistente virtual.
        </p>
      </div>

      <PdfUpload documents={pdfDocuments} />
      <FaqManager faqs={faqs} />
    </div>
  );
}
