"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getStoredHeroConversationId,
  storeHeroConversationId,
} from "@/lib/chat/hero-conversation-storage";
import { trackWhatsAppClickClient } from "@/lib/chat/track-whatsapp-click";
import type { ChatUiMessage, HeroChatConfig } from "@/lib/chat/types";
import { getOrCreateVisitorId } from "@/lib/chat/visitor-id";
import type { HeroFlowRuntimeStep } from "@/lib/widget/hero-flow";

type HeroApiResponse = {
  conversationId: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }>;
  step: HeroFlowRuntimeStep | null;
  whatsappUrl: string | null;
  done: boolean;
  error?: string;
};

type UseHeroChatResult = {
  messages: ChatUiMessage[];
  step: HeroFlowRuntimeStep | null;
  input: string;
  setInput: (value: string) => void;
  submitAnswer: (value?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  dismissError: () => void;
  whatsappUrl: string | null;
  trackWhatsAppClick: () => void;
  done: boolean;
};

function mapMessages(
  messages: HeroApiResponse["messages"],
): ChatUiMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    status: "complete",
  }));
}

export function useHeroChat(config: HeroChatConfig): UseHeroChatResult {
  const [messages, setMessages] = useState<ChatUiMessage[]>([]);
  const [step, setStep] = useState<HeroFlowRuntimeStep | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const conversationIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  const applyResponse = useCallback((payload: HeroApiResponse) => {
    conversationIdRef.current = payload.conversationId;
    storeHeroConversationId(config.publicKey, payload.conversationId);
    setMessages(mapMessages(payload.messages));
    setStep(payload.step);
    setWhatsappUrl(payload.whatsappUrl);
    setDone(payload.done);
  }, [config.publicKey]);

  const callHeroApi = useCallback(
    async (body: Record<string, string | undefined>) => {
      const visitorId =
        visitorIdRef.current ?? getOrCreateVisitorId(config.publicKey);

      const response = await fetch("/api/chat/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_key: config.publicKey,
          visitor_id: visitorId,
          conversation_id: conversationIdRef.current ?? undefined,
          ...body,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Não foi possível continuar. Tente novamente.";

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

      return (await response.json()) as HeroApiResponse;
    },
    [config.publicKey],
  );

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    visitorIdRef.current = getOrCreateVisitorId(config.publicKey);
    const storedConversationId = getStoredHeroConversationId(config.publicKey);
    conversationIdRef.current = storedConversationId;

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (storedConversationId) {
          const params = new URLSearchParams({
            public_key: config.publicKey,
            conversation_id: storedConversationId,
          });

          const response = await fetch(`/api/chat/hero?${params.toString()}`);

          if (response.ok) {
            const payload = (await response.json()) as HeroApiResponse;
            if (!cancelled) {
              applyResponse(payload);
              return;
            }
          } else if (response.status === 404) {
            storeHeroConversationId(config.publicKey, "");
            conversationIdRef.current = null;
          }
        }

        const payload = await callHeroApi({ action: "start" });
        if (!cancelled) {
          applyResponse(payload);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Erro inesperado. Tente novamente.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyResponse, callHeroApi, config.publicKey]);

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

  const submitAnswer = useCallback(
    async (value?: string) => {
      const answer = (value ?? input).trim();
      if (!answer || isLoading || done) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const payload = await callHeroApi({
          action: "answer",
          value: answer,
        });
        applyResponse(payload);
        setInput("");
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Erro inesperado. Tente novamente.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [applyResponse, callHeroApi, done, input, isLoading],
  );

  return {
    messages,
    step,
    input,
    setInput,
    submitAnswer,
    isLoading,
    error,
    dismissError: () => setError(null),
    whatsappUrl,
    trackWhatsAppClick,
    done,
  };
}
