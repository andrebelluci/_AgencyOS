import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listFaqs } from "@/modules/knowledge/service";

import { FaqManager } from "./faq-manager";

export default async function KnowledgePage() {
  const { tenant } = await requireOwnerTenant();
  const faqs = await listFaqs(tenant.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Conhecimento</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie perguntas frequentes usadas pelo assistente virtual.
        </p>
      </div>

      <FaqManager faqs={faqs} />
    </div>
  );
}
