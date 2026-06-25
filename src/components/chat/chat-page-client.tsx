"use client";

import type { ChatWidgetConfig } from "@/lib/chat/types";

import { ChatWidget } from "./chat-widget";

type ChatPageClientProps = {
  config: ChatWidgetConfig;
};

export function ChatPageClient({ config }: ChatPageClientProps) {
  return <ChatWidget config={config} />;
}
