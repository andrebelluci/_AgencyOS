import type { CSSProperties } from "react";

import type { ChatWidgetConfig } from "@/lib/chat/types";

type ChatWidgetSkeletonProps = {
  config: ChatWidgetConfig;
};

export function ChatWidgetSkeleton({ config }: ChatWidgetSkeletonProps) {
  const brandingStyle = config.primaryColor
    ? ({
        "--primary": config.primaryColor,
        "--primary-foreground": "#ffffff",
      } as CSSProperties)
    : undefined;

  return (
    <div
      className="flex h-dvh flex-col bg-background"
      style={brandingStyle}
    >
      <header className="flex shrink-0 items-center border-b border-border px-4 py-3">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            {config.companyName}
          </h1>
          <p className="text-xs text-muted-foreground">Funcionário Digital</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
              <p className="whitespace-pre-wrap">{config.welcomeMessage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background px-4 py-3">
        <div className="mx-auto h-10 w-full max-w-md rounded-lg border border-input bg-muted/40" />
      </div>
    </div>
  );
}
