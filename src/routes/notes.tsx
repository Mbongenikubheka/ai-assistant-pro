import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Prestige AI" },
      { name: "description", content: "Turn raw meeting notes into key points, actions, and deadlines." },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Standup — Oct 14
- Alex: shipped the new onboarding flow; metrics look good but signup drop on step 3
- Priya: blocked on API rate limits, needs review from infra by Friday
- Sam will draft the customer email about the maintenance window for Saturday 9pm
- Decision: postpone the pricing experiment until Q4
- Open question: who owns the partner integration kickoff?`;

function NotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim().length < 20) {
      toast.error("Add a few more lines of notes (20+ characters).");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const { text } = await run({ data: { transcript } });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={FileText}
        eyebrow="Tool 02"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a clean recap with action items and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-soft">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="t">Raw notes or transcript</Label>
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() => setTranscript(SAMPLE)}
                >
                  Try a sample
                </button>
              </div>
              <Textarea
                id="t"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={14}
                placeholder="Paste the meeting transcript or your notes here…"
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Summarize meeting
                </>
              )}
            </Button>
          </form>
        </Card>

        <AiOutput
          loading={loading}
          text={output}
          emptyHint="Your structured summary will appear here."
        />
      </div>
    </div>
  );
}
