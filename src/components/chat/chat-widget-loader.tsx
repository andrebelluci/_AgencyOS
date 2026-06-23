"use client";

import { useSyncExternalStore } from "react";

import type { ChatWidgetConfig } from "@/lib/chat/types";

import { ChatWidget } from "./chat-widget";
import { ChatWidgetSkeleton } from "./chat-widget-skeleton";

type ChatWidgetLoaderProps = {
  config: ChatWidgetConfig;
};

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ChatWidgetLoader({ config }: ChatWidgetLoaderProps) {
  const mounted = useIsClient();

  if (!mounted) {
    return <ChatWidgetSkeleton config={config} />;
  }

  return <ChatWidget config={config} />;
}
