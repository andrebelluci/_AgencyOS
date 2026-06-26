import Link from "next/link";

import { TenantsTable } from "@/components/admin/tenants-table";
import { buttonVariants } from "@/components/ui/button";
import { listTenantsForAdmin } from "@/modules/platform-admin/service";
import { cn } from "@/lib/utils";

export default async function AdminTenantsPage() {
  const tenants = await listTenantsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie clientes da plataforma e o status de cada tenant.
          </p>
        </div>
        <Link href="/admin/tenants/new" className={cn(buttonVariants())}>
          Novo tenant
        </Link>
      </div>

      <TenantsTable tenants={tenants} />
    </div>
  );
}
