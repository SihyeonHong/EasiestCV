"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyableCredentialProps {
  label: string;
  value: string;
  copyText: string;
  copiedText: string;
}

export function CopyableCredential({
  label,
  value,
  copyText,
  copiedText,
}: CopyableCredentialProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-sm text-foreground">{label}</span>
      <span className="rounded-md border border-none bg-bg-code px-1.5 py-0.5 font-mono text-sm text-foreground">
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="rounded-md border border-none p-0.5 transition-colors hover:bg-gray-100"
        aria-label={copied ? copiedText : copyText}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
    </div>
  );
}
