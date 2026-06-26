"use client";

import type { ResolvedQuickAction } from "@/lib/widget/quick-actions";
import { cn } from "@/lib/utils";

type QuickActionsBarProps = {
  actions: ResolvedQuickAction[];
  primaryColor?: string | null;
  onActionClick?: (action: ResolvedQuickAction) => void;
};

export function QuickActionsBar({
  actions,
  primaryColor,
  onActionClick,
}: QuickActionsBarProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-wrap gap-2 px-4 pb-2">
      {actions.map((action) => (
        <a
          key={`${action.type}-${action.label}-${action.url}`}
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onActionClick?.(action)}
          className={cn(
            "inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors",
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
          {action.label}
        </a>
      ))}
    </div>
  );
}
