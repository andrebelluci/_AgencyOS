import { cn } from "@/lib/utils";
import { MESSAGE_ROLE_LABELS } from "@/modules/conversations/constants";
import type { MessageListItem } from "@/modules/conversations/types";

type ConversationMessageProps = {
  message: MessageListItem;
};

export function ConversationMessage({ message }: ConversationMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center py-1">
        <p className="max-w-[90%] text-center text-xs text-muted-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-1", isUser ? "items-end" : "items-start")}
    >
      <span className="px-1 text-xs text-muted-foreground">
        {MESSAGE_ROLE_LABELS[message.role]} · {message.createdAtLabel}
      </span>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
