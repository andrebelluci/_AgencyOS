"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toggleTenantStatusAction } from "@/app/(admin)/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TenantListItem } from "@/modules/platform-admin/types";

type TenantsTableProps = {
  tenants: TenantListItem[];
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export function TenantsTable({ tenants }: TenantsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (tenant: TenantListItem) => {
    const nextStatus = tenant.status === "active" ? "inactive" : "active";

    startTransition(async () => {
      const result = await toggleTenantStatusAction(tenant.id, nextStatus);

      if (!result.error) {
        router.refresh();
      }
    });
  };

  if (tenants.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">Nenhum tenant cadastrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie o primeiro tenant pela opção &quot;Novo tenant&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Public key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.slug}</TableCell>
              <TableCell className="font-mono text-xs">{tenant.publicKey}</TableCell>
              <TableCell>
                <Badge
                  variant={tenant.status === "active" ? "default" : "secondary"}
                >
                  {tenant.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(tenant.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleToggle(tenant)}
                >
                  {tenant.status === "active" ? "Desativar" : "Ativar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
