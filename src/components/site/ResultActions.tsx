import { Copy, Share2, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ExternalLink } from "./ExternalLink";

export function ResultActions({ text, title = "My Calculation Result", onReset }: { text: string; title?: string; onReset?: () => void }) {
  const [copied, setCopied] = useState(false);
  // Read the URL only after mount so server and client render the same HTML on
  // first paint — reading window.location.href directly during render causes
  // a hydration mismatch (server has no window; client does).
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => setPageUrl(window.location.href), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  async function share() {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url: typeof window !== "undefined" ? window.location.href : undefined });
        return;
      } catch {}
    }
    copy();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy result"}
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      >
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          aria-label="Reset calculator"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      )}
      <ExternalLink
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        label="Share result on WhatsApp"
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      >
        WhatsApp
      </ExternalLink>
      <ExternalLink
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
        label="Share result on Twitter"
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      >
        Twitter
      </ExternalLink>
      <ExternalLink
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
        label="Share result on LinkedIn"
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
      >
        LinkedIn
      </ExternalLink>
    </div>
  );
}
