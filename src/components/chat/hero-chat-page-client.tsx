"use client";

import type { HeroChatConfig } from "@/lib/chat/types";

import { HeroChatWidget } from "./hero-chat-widget";

type HeroChatPageClientProps = {
  config: HeroChatConfig;
  inline?: boolean;
};

export function HeroChatPageClient({
  config,
  inline = false,
}: HeroChatPageClientProps) {
  return <HeroChatWidget config={config} inline={inline} />;
}
