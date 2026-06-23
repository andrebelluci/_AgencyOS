"use client";

import { useEffect, useRef } from "react";

import type { ChatUiMessage } from "@/lib/chat/types";

import { ChatMessageBubble } from "./chat-message-bubble";

type ChatMessageListProps = {
  messages: ChatUiMessage[];
};

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} aria-hidden />
      </div>
    </div>
  );
}
