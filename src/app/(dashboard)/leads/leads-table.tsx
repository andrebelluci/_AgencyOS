"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  LEAD_SCORE_LABELS,
  LEAD_STATUS_OPTIONS,
} from "@/modules/leads/constants";
import type { LeadListItem } from "@/modules/leads/types";

import { updateLeadStatusAction } from "./actions";

type LeadsTableProps = {
  leads: LeadListItem[];
};

function formatEmpty(value: string | null | undefined): string {
  return value?.trim() ? value : "—";
}

const statusSelectClassName = cn(
  "h-7 min-w-32 rounded-[min(var(--radius-md),12px)] border border-input bg-transparent px-2 text-sm",
  "outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
);

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (leadId: string, status: string) => {
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, status);

      if (!result.error) {
        router.refresh();
      }
    });
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">Nenhum lead ainda</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Os leads capturados pelo assistente virtual aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {formatEmpty(lead.name)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5 text-sm">
                  <span>{formatEmpty(lead.email)}</span>
                  <span className="text-muted-foreground">
                    {formatEmpty(lead.phone)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatEmpty(lead.city)}</TableCell>
              <TableCell>
                {lead.score ? (
                  <Badge variant="secondary">
                    {LEAD_SCORE_LABELS[lead.score]}
                  </Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                <select
                  value={lead.status}
                  onChange={(event) =>
                    handleStatusChange(lead.id, event.target.value)
                  }
                  disabled={isPending}
                  aria-label={`Status do lead ${formatEmpty(lead.name)}`}
                  className={statusSelectClassName}
                >
                  {LEAD_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {lead.createdAtLabel}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
