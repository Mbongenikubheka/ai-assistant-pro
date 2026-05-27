import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Telescope,
  MessagesSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Prestige AI" },
      {
        name: "description",
        content:
          "Your AI workplace copilot. Draft emails, summarize meetings, plan tasks, and research faster.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email",
    description: "Draft polished emails tuned to your audience and tone.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes",
    description: "Extract key points, action items, and deadlines.",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "Task Planner",
    description: "Prioritize and schedule your day with confidence.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "Research Assistant",
    description: "Get a structured briefing on any topic in seconds.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chat",
    description: "Ask anything. Brainstorm, rewrite, and decide faster.",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-emerald p-8 text-primary-foreground shadow-elegant sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Workplace Copilot
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Automate your busywork.{" "}
            <span className="text-gold">Reclaim your focus.</span>
          </h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">
            Prestige AI helps professionals draft, summarize, plan, and research with the
            calm confidence of a senior teammate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/chat">
                Start chatting <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/email">Draft an email</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
              Toolkit
            </div>
            <h2 className="font-display text-xl font-semibold">Five copilots, one workflow</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="group">
              <Card className="h-full p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-accent group-hover:bg-gradient-emerald group-hover:text-primary-foreground transition">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                  Open
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
