"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  clampDateInputValue,
  getTodayDateInputValue,
} from "./search-params";

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
  const [values, setValues] = useState(defaultValues);
  const maxDate = getTodayDateInputValue();

  const handleDateChange = (field: "from" | "to", rawValue: string) => {
    setValues((current) => ({
      ...current,
      [field]: clampDateInputValue(rawValue),
    }));
  };

  const hasActiveFilters = Boolean(
    defaultValues.q.trim() || defaultValues.from || defaultValues.to,
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const q = values.q.trim();
    const from = clampDateInputValue(values.from);
    const to = clampDateInputValue(values.to);

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
        applyFilters();
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
              value={values.q}
              onChange={(event) =>
                setValues((current) => ({ ...current, q: event.target.value }))
              }
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
            value={values.from}
            max={maxDate}
            onChange={(event) => handleDateChange("from", event.target.value)}
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
            value={values.to}
            max={maxDate}
            onChange={(event) => handleDateChange("to", event.target.value)}
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
