"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConversionPeriod } from "@/modules/dashboard/types";

type ConversionPeriodSelectorProps = {
  currentPeriod: ConversionPeriod;
};

export function ConversionPeriodSelector({
  currentPeriod,
}: ConversionPeriodSelectorProps) {
  const pathname = usePathname();

  return (
    <div
      className="inline-flex rounded-lg border bg-muted/40 p-1"
      role="group"
      aria-label="Período das métricas"
    >
      {(["7d", "30d"] as const).map((period) => {
        const isActive = currentPeriod === period;
        const label = period === "7d" ? "7 dias" : "30 dias";

        if (isActive) {
          return (
            <span
              key={period}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-8 px-3",
              )}
              aria-pressed
            >
              {label}
            </span>
          );
        }

        return (
          <Link
            key={period}
            href={`${pathname}?period=${period}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 px-3",
            )}
            aria-pressed={false}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
