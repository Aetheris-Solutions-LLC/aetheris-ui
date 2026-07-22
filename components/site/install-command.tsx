"use client";

import { useState } from "react";

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (unsupported browser / no permission) — no-op
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-full border py-2 pl-5 pr-2"
      style={{ background: "var(--aui-surface)", boxShadow: "var(--aui-elev)" }}
    >
      <code
        className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm"
        style={{ fontFamily: "var(--font-geist-mono)", color: "var(--aui-fg)" }}
      >
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors hover:bg-[var(--aui-hover)]"
        style={{ color: copied ? "var(--aui-accent-strong)" : "var(--aui-fg)" }}
      >
        {copied ? (
          <>
            <CheckIcon /> Copied
          </>
        ) : (
          <>
            <CopyIcon /> Copy
          </>
        )}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="5" width="8" height="8" rx="1.5" />
      <path d="M3 9V3.5A1.5 1.5 0 0 1 4.5 2H9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
