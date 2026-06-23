import { cn } from "@/lib/utils";
import type { ChatUiMessage } from "@/lib/chat/types";

import { TypingIndicator } from "./typing-indicator";

type ChatMessageBubbleProps = {
  message: ChatUiMessage;
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreaming =
    message.role === "assistant" &&
    message.status === "streaming" &&
    !message.content;

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
          message.status === "error" && "border border-destructive/30 bg-destructive/5",
        )}
      >
        {isStreaming ? (
          <TypingIndicator />
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    </div>
  );
}
