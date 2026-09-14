import { cn } from "@/lib/utils";

interface AssistantTypingIndicatorProps {
  className?: string;
}

export function AssistantTypingIndicator({
  className,
}: AssistantTypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-start gap-2 text-sm", className)}
      role="status"
      aria-live="polite"
      aria-label="AI sedang menyiapkan respons"
    >
      <span className="font-semibold text-pink-600">AI</span>
      <div className="flex rounded-2xl bg-pink-50 px-3 py-2 text-pink-600">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
        </span>
      </div>
    </div>
  );
}
