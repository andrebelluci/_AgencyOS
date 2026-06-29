"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ConversationsFilterValues = {
  q: string;
  from: string;
  to: string;
};

type ConversationsFiltersProps = {
  defaultValues: ConversationsFilterValues;
};

export function ConversationsFilters({
  defaultValues,
}: ConversationsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = Boolean(
    defaultValues.q.trim() || defaultValues.from || defaultValues.to,
  );

  const applyFilters = (formData: FormData) => {
    const params = new URLSearchParams(searchParams.toString());
    const q = String(formData.get("q") ?? "").trim();
    const from = String(formData.get("from") ?? "").trim();
    const to = String(formData.get("to") ?? "").trim();

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    if (from) {
      params.set("from", from);
    } else {
      params.delete("from");
    }

    if (to) {
      params.set("to", to);
    } else {
      params.delete("to");
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/conversations?${query}` : "/conversations");
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/conversations");
    });
  };

  return (
    <form
      className="flex flex-col gap-4 rounded-lg border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(new FormData(event.currentTarget));
      }}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor="conversations-search">Buscar</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="conversations-search"
              name="q"
              type="search"
              defaultValue={defaultValues.q}
              placeholder="Texto em mensagens ou ID do visitante"
              className="pl-8"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conversations-from">De</Label>
          <Input
            id="conversations-from"
            name="from"
            type="date"
            defaultValue={defaultValues.from}
            disabled={isPending}
            className={cn("min-w-36")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conversations-to">Até</Label>
          <Input
            id="conversations-to"
            name="to"
            type="date"
            defaultValue={defaultValues.to}
            disabled={isPending}
            className={cn("min-w-36")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Filtrando…" : "Filtrar"}
          </Button>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={isPending}
            >
              <X className="size-4" />
              Limpar
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
