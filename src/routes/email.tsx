import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Prestige AI" },
      { name: "description", content: "Draft polished emails tuned to audience and tone." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Enthusiastic"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Engineering hiring manager");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const { text } = await run({
        data: { topic, audience, tone: tone as never, keyPoints },
      });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={Mail}
        eyebrow="Tool 01"
        title="Smart Email Generator"
        description="Describe what you need to say. Pick an audience and tone. Get a ready-to-send draft."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-soft">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">What is this email about?</Label>
              <Textarea
                id="topic"
                placeholder="e.g. Follow up on Tuesday's product review and request a decision on the launch date."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. CTO, new customer, recruiter"
                />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kp">Key points (optional)</Label>
              <Textarea
                id="kp"
                placeholder="One per line — anything that must appear in the email."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate email
                </>
              )}
            </Button>
          </form>
        </Card>

        <AiOutput
          loading={loading}
          text={output}
          emptyHint="Your drafted email will appear here."
        />
      </div>
    </div>
  );
}
