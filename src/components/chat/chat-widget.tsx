"use client";

import type { CSSProperties } from "react";

import type { ChatWidgetConfig } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { QuickActionsBar } from "./quick-actions-bar";
import { useChatStream } from "./use-chat-stream";
import { useWidgetTheme } from "./use-widget-theme";
import { WhatsAppCta } from "./whatsapp-cta";

type ChatWidgetProps = {
  config: ChatWidgetConfig;
};

export function ChatWidget({ config }: ChatWidgetProps) {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    isLoadingHistory,
    error,
    dismissError,
    whatsappUrl,
    trackWhatsAppClick,
  } = useChatStream(config);

  const isDark = useWidgetTheme(config.theme);
  const primaryColor = config.primaryColor ?? undefined;

  const brandingStyle = primaryColor
    ? ({
        "--primary": primaryColor,
        "--primary-foreground": "#ffffff",
        "--ring": primaryColor,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={cn("flex h-dvh flex-col bg-background text-foreground", {
        dark: isDark,
      })}
      style={brandingStyle}
      data-theme={isDark ? "dark" : "light"}
    >
      <header
        className="flex shrink-0 items-center border-b px-4 py-3"
        style={
          primaryColor
            ? { borderBottomColor: primaryColor, borderBottomWidth: 2 }
            : undefined
        }
      >
        <div className="mx-auto w-full max-w-md">
          <h1
            className="text-sm font-semibold tracking-tight"
            style={primaryColor ? { color: primaryColor } : undefined}
          >
            {config.companyName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {config.assistantLabel}
          </p>
        </div>
      </header>

      <ChatMessageList messages={messages} />

      {error ? (
        <div
          className="mx-auto mb-2 flex w-full max-w-md items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={dismissError}
            className="shrink-0 text-xs underline underline-offset-2"
          >
            Fechar
          </button>
        </div>
      ) : null}

      <QuickActionsBar
        actions={config.quickActions ?? []}
        primaryColor={primaryColor}
      />

      {whatsappUrl ? (
        <WhatsAppCta
          url={whatsappUrl}
          onClick={trackWhatsAppClick}
          primaryColor={primaryColor}
        />
      ) : null}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        isLoading={isLoading || isLoadingHistory}
        disabled={isLoadingHistory}
        primaryColor={primaryColor}
      />
    </div>
  );
}
