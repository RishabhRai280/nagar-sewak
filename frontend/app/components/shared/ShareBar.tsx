"use client";

import { useCallback, useMemo, useState } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";

interface ShareBarProps {
  title: string;
  url?: string;
  summary?: string;
}

const networks = [
  { id: "twitter", label: "X / Twitter" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "whatsapp", label: "WhatsApp" },
];

export default function ShareBar({ title, url, summary }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => url ?? (typeof window !== "undefined" ? window.location.href : ""), [url]);

  const handleWebShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: summary ?? title, url: shareUrl });
      } catch {
        // ignore
      }
    }
  }, [title, summary, shareUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const encode = (v: string) => encodeURIComponent(v || "");

  const linkFor = (network: string) => {
    const u = encode(shareUrl);
    const t = encode(title);
    const d = encode(summary ?? "");
    switch (network) {
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
      case "linkedin":
        return `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${t}&summary=${d}`;
      case "whatsapp":
        return `https://wa.me/?text=${t}%20${u}`;
      default:
        return u;
    }
  };

  const canWebShare = typeof navigator !== "undefined" && !!(navigator as any).share;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canWebShare && (
        <button
          onClick={handleWebShare}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          <Share2 size={16} /> Share
        </button>
      )}
      {networks.map((n) => (
        <a
          key={n.id}
          href={linkFor(n.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition"
        >
          {n.label}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition"
      >
        <LinkIcon size={16} />
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

