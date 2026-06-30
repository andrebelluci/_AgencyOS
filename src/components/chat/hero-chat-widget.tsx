"use client";

import type { CSSProperties } from "react";

import type { HeroChatConfig } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { HeroOptionChips } from "./hero-option-chips";
import { TypingIndicator } from "./typing-indicator";
import { useHeroChat } from "./use-hero-chat";
import { useWidgetTheme } from "./use-widget-theme";
import { WhatsAppCta } from "./whatsapp-cta";

type HeroChatWidgetProps = {
  config: HeroChatConfig;
  inline?: boolean;
};

export function HeroChatWidget({ config, inline = false }: HeroChatWidgetProps) {
  const {
    messages,
    step,
    input,
    setInput,
    submitAnswer,
    isLoading,
    error,
    dismissError,
    whatsappUrl,
    trackWhatsAppClick,
    done,
  } = useHeroChat(config);

  const isDark = useWidgetTheme(config.theme);
  const primaryColor = config.primaryColor ?? undefined;

  const brandingStyle = primaryColor
    ? ({
        "--primary": primaryColor,
        "--primary-foreground": "#ffffff",
        "--ring": primaryColor,
      } as CSSProperties)
    : undefined;

  const showChoiceStep = step?.type === "choice" && !done;
  const showTextStep = step?.type === "text" && !done;

  return (
    <div
      className={cn(
        "flex flex-col bg-background text-foreground",
        inline ? "h-[min(520px,70vh)] rounded-xl border shadow-sm" : "h-dvh",
        { dark: isDark },
      )}
      style={brandingStyle}
      data-theme={isDark ? "dark" : "light"}
      data-mode="hero"
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

      {isLoading && messages.length === 0 ? <TypingIndicator /> : null}

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

      {showChoiceStep && step.options ? (
        <HeroOptionChips
          options={step.options}
          primaryColor={primaryColor}
          disabled={isLoading}
          onSelect={(value) => {
            void submitAnswer(value);
          }}
        />
      ) : null}

      {whatsappUrl ? (
        <WhatsAppCta
          url={whatsappUrl}
          onClick={trackWhatsAppClick}
          primaryColor={primaryColor}
        />
      ) : null}

      {showTextStep ? (
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => submitAnswer()}
          isLoading={isLoading}
          disabled={isLoading}
          primaryColor={primaryColor}
          placeholder={step.placeholder}
        />
      ) : null}
    </div>
  );
}
