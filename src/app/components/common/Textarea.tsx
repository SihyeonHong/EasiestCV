import * as React from "react";

import { cn } from "@/utils/classname";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, onInput, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    // ref 합치기 (forwardRef + 내부 ref 둘 다)
    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement,
    );

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize && innerRef.current) {
        innerRef.current.style.height = "auto";
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
      }
      if (onInput) onInput(e);
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 md:text-sm",
          autoResize && "resize-none overflow-hidden",
          className,
        )}
        ref={innerRef}
        onInput={handleInput}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
