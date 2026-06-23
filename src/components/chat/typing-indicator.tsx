import { cn } from "@/lib/utils";

type TypingIndicatorProps = {
  className?: string;
};

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-1 px-1 py-0.5", className)}
      aria-label="Assistente digitando"
      role="status"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  );
}
