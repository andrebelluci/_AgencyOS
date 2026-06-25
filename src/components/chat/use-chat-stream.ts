"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getStoredConversationId,
  storeConversationId,
} from "@/lib/chat/conversation-storage";
import { readChatSSEStream } from "@/lib/chat/sse-client";
import { trackWhatsAppClickClient } from "@/lib/chat/track-whatsapp-click";
import type { ChatUiMessage, ChatWidgetConfig } from "@/lib/chat/types";
import { extractWhatsAppUrlFromToolResult } from "@/lib/chat/whatsapp-from-tool";
import { getOrCreateVisitorId } from "@/lib/chat/visitor-id";

const WELCOME_MESSAGE_ID = "welcome";

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createWelcomeMessage(content: string): ChatUiMessage {
  return {
    id: WELCOME_MESSAGE_ID,
    role: "assistant",
    content,
    status: "complete",
  };
}

type HistoryApiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type UseChatStreamResult = {
  messages: ChatUiMessage[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  dismissError: () => void;
  whatsappUrl: string | null;
  trackWhatsAppClick: () => void;
};

export function useChatStream(config: ChatWidgetConfig): UseChatStreamResult {
  const [messages, setMessages] = useState<ChatUiMessage[]>(() => [
    createWelcomeMessage(config.welcomeMessage),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const conversationIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    const storedConversationId = getStoredConversationId(config.publicKey);
    conversationIdRef.current = storedConversationId;
    visitorIdRef.current = getOrCreateVisitorId(config.publicKey);

    if (!storedConversationId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      if (!cancelled) {
        setIsLoadingHistory(true);
        setError(null);
      }

      try {
        const params = new URLSearchParams({
          public_key: config.publicKey,
          conversation_id: storedConversationId,
        });

        const response = await fetch(`/api/chat/history?${params.toString()}`);

        if (!response.ok) {
          if (response.status === 404) {
            storeConversationId(config.publicKey, "");
            conversationIdRef.current = null;
          }
          return;
        }

        const payload = (await response.json()) as {
          messages?: HistoryApiMessage[];
          whatsapp_url?: string | null;
        };

        if (cancelled) {
          return;
        }

        const restored = (payload.messages ?? []).map(
          (message): ChatUiMessage => ({
            id: message.id,
            role: message.role,
            content: message.content,
            status: "complete",
          }),
        );

        setMessages([createWelcomeMessage(config.welcomeMessage), ...restored]);
        setWhatsappUrl(payload.whatsapp_url ?? null);
      } catch {
        if (!cancelled) {
          setMessages([createWelcomeMessage(config.welcomeMessage)]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [config.publicKey, config.welcomeMessage]);

  const trackWhatsAppClick = useCallback(() => {
    const conversationId = conversationIdRef.current;

    if (!conversationId) {
      return;
    }

    trackWhatsAppClickClient({
      public_key: config.publicKey,
      conversation_id: conversationId,
    });
  }, [config.publicKey]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isLoadingHistory) {
      return;
    }

    const userMessage: ChatUiMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      status: "complete",
    };

    const assistantMessageId = createMessageId();
    const assistantPlaceholder: ChatUiMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      status: "streaming",
    };

    setMessages((current) => [...current, userMessage, assistantPlaceholder]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const visitorId =
        visitorIdRef.current ?? getOrCreateVisitorId(config.publicKey);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_key: config.publicKey,
          message: trimmed,
          conversation_id: conversationIdRef.current ?? undefined,
          visitor_id: visitorId,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Não foi possível enviar a mensagem. Tente novamente.";

        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            errorMessage = payload.error;
          }
        } catch {
          // response body is not JSON
        }

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Resposta inválida do servidor.");
      }

      let assistantContent = "";

      for await (const event of readChatSSEStream(response.body)) {
        if (event.type === "meta") {
          conversationIdRef.current = event.conversationId;
          storeConversationId(config.publicKey, event.conversationId);
          continue;
        }

        if (event.type === "tool_call_end") {
          const url = extractWhatsAppUrlFromToolResult(
            event.name,
            event.result,
            config.whatsapp,
          );

          if (url) {
            setWhatsappUrl(url);
          }
          continue;
        }

        if (event.type === "token") {
          assistantContent += event.content;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: assistantContent }
                : message,
            ),
          );
          continue;
        }

        if (event.type === "done") {
          assistantContent = event.content;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: assistantContent,
                    status: "complete",
                  }
                : message,
            ),
          );
          continue;
        }

        if (event.type === "error") {
          throw new Error(event.message);
        }
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: assistantContent || message.content,
                status: "complete",
              }
            : message,
        ),
      );
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Erro inesperado. Tente novamente.";

      setError(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === assistantMessageId
            ? {
                ...item,
                content: message,
                status: "error",
              }
            : item,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [config.publicKey, config.whatsapp, input, isLoading, isLoadingHistory]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    isLoadingHistory,
    error,
    dismissError: () => setError(null),
    whatsappUrl,
    trackWhatsAppClick,
  };
}
