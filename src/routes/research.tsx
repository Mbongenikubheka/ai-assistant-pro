import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Telescope, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Prestige AI" },
      { name: "description", content: "Get structured, professional briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim().length < 3) return;
    setLoading(true);
    setOutput("");
    try {
      const { text } = await run({ data: { topic, depth: depth as never } });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={Telescope}
        eyebrow="Tool 04"
        title="AI Research Assistant"
        description="Brief yourself on any topic — insights, opportunities, risks, and next steps."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-soft">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. State of vertical AI agents for legal teams"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger className="w-full sm:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brief">Brief</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Build briefing
                </>
              )}
            </Button>
          </form>
        </Card>

        <AiOutput
          loading={loading}
          text={output}
          emptyHint="Your briefing will appear here."
        />
      </div>
    </div>
  );
}
