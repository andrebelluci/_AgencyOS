import Link from "next/link";

import { CreateTenantForm } from "@/components/admin/create-tenant-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NewTenantPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Novo tenant</h1>
        <p className="text-sm text-muted-foreground">
          Cria tenant, settings padrão e usuário owner em um único fluxo.
        </p>
      </div>

      <CreateTenantForm />

      <Link
        href="/admin/tenants"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Voltar para lista
      </Link>
    </div>
  );
}
