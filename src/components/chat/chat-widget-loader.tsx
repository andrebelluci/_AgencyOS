"use client";

import { useEffect, useState } from "react";

import type { ChatWidgetConfig } from "@/lib/chat/types";

import { ChatWidget } from "./chat-widget";
import { ChatWidgetSkeleton } from "./chat-widget-skeleton";

type ChatWidgetLoaderProps = {
  config: ChatWidgetConfig;
};

export function ChatWidgetLoader({ config }: ChatWidgetLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChatWidgetSkeleton config={config} />;
  }

  return <ChatWidget config={config} />;
}
