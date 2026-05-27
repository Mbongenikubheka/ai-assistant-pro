import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Prestige AI" },
      { name: "description", content: "Prioritize and schedule your tasks with AI guidance." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("This Week");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.trim().length < 5) return;
    setLoading(true);
    setOutput("");
    try {
      const { text } = await run({
        data: { tasks, horizon: horizon as never },
      });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={ListChecks}
        eyebrow="Tool 03"
        title="AI Task Planner"
        description="Dump everything on your plate. Get a prioritized plan and time blocks."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-soft">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">Your tasks</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={12}
                placeholder={`One task per line, e.g.
- Finish Q4 budget draft
- Reply to investor update
- Review Priya's PR
- Plan offsite agenda`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Planning horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger className="w-full sm:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Sprint">This Sprint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate plan
                </>
              )}
            </Button>
          </form>
        </Card>

        <AiOutput
          loading={loading}
          text={output}
          emptyHint="Your prioritized plan will appear here."
        />
      </div>
    </div>
  );
}
