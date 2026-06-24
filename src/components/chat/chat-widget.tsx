"use client";

import type { CSSProperties } from "react";

import type { ChatWidgetConfig } from "@/lib/chat/types";

import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { useChatStream } from "./use-chat-stream";
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
    error,
    dismissError,
    whatsappUrl,
    trackWhatsAppClick,
  } = useChatStream(config);

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
          <p className="text-xs text-muted-foreground">
            Funcionário Digital
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

      {whatsappUrl ? (
        <WhatsAppCta url={whatsappUrl} onClick={trackWhatsAppClick} />
      ) : null}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
