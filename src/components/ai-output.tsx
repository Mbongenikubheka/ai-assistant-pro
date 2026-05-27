import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shimmer } from "@/components/ai-elements/shimmer";

export function AiOutput({
  loading,
  text,
  emptyHint,
}: {
  loading: boolean;
  text: string;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="flex items-center justify-between border-b bg-secondary/50 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-gold" />
          AI Output
        </div>
        {text && !loading && (
          <Button variant="ghost" size="sm" onClick={copy} className="h-7 gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>

      <div className="min-h-[280px] px-5 py-4">
        {loading ? (
          <div className="space-y-2">
            <Shimmer>Thinking through your request…</Shimmer>
            <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        ) : text ? (
          <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-p:my-2 prose-li:my-0.5 prose-strong:text-foreground">
            <ReactMarkdown>{text}</ReactMarkdown>
          </article>
        ) : (
          <div className="flex h-full min-h-[240px] items-center justify-center text-center text-sm text-muted-foreground">
            {emptyHint}
          </div>
        )}
      </div>

      <div className="border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
        AI-generated content may require human review.
      </div>
    </Card>
  );
}
