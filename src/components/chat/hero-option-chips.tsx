"use client";

import type { HeroFlowOption } from "@/lib/widget/hero-flow";
import { cn } from "@/lib/utils";

type HeroOptionChipsProps = {
  options: HeroFlowOption[];
  primaryColor?: string | null;
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function HeroOptionChips({
  options,
  primaryColor,
  disabled = false,
  onSelect,
}: HeroOptionChipsProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-wrap gap-2 px-4 pb-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.value)}
          className={cn(
            "inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !primaryColor &&
              "border-primary bg-primary/10 text-primary hover:bg-primary/15",
          )}
          style={
            primaryColor
              ? {
                  borderColor: primaryColor,
                  color: primaryColor,
                  backgroundColor: `${primaryColor}14`,
                }
              : undefined
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
