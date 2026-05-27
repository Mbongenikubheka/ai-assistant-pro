import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getLovableModel } from "./ai-gateway.server";

/* ---------------- Smart Email ---------------- */

const EmailInput = z.object({
  topic: z.string().min(2).max(2000),
  audience: z.string().min(1).max(200),
  tone: z.enum(["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Enthusiastic"]),
  keyPoints: z.string().max(2000).optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const model = getLovableModel();
    const { text } = await generateText({
      model,
      system:
        "You are an expert business writing assistant. Produce polished, ready-to-send emails. Always include a Subject line on the first line as 'Subject: ...'. Never invent specific facts; use bracketed placeholders like [Date] when needed.",
      prompt: `Write an email with the following parameters:
- Audience: ${data.audience}
- Tone: ${data.tone}
- Topic / purpose: ${data.topic}
${data.keyPoints ? `- Key points to include:\n${data.keyPoints}` : ""}

Format:
Subject: <subject>

<greeting>
<body in 2-4 short paragraphs>
<sign-off>`,
    });
    return { text };
  });

/* ---------------- Meeting Notes Summarizer ---------------- */

const NotesInput = z.object({
  transcript: z.string().min(20).max(20000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const model = getLovableModel();
    const { text } = await generateText({
      model,
      system:
        "You convert raw meeting notes or transcripts into a structured executive summary. Be concise, neutral, and faithful to the source.",
      prompt: `Summarize the following meeting notes using EXACTLY these markdown sections:

## Summary
2-4 sentences capturing the outcome and context.

## Key Points
- bullet points of important decisions and discussion items

## Action Items
- [ ] **Owner** — Task (Deadline: YYYY-MM-DD or "TBD")

## Deadlines
- Date — Item

## Open Questions
- bullets, or "None" if there are none

---
NOTES:
${data.transcript}`,
    });
    return { text };
  });

/* ---------------- AI Task Planner ---------------- */

const TasksInput = z.object({
  tasks: z.string().min(5).max(8000),
  horizon: z.enum(["Today", "This Week", "This Sprint"]).default("This Week"),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TasksInput.parse(d))
  .handler(async ({ data }) => {
    const model = getLovableModel();
    const { text } = await generateText({
      model,
      system:
        "You are a productivity coach. Prioritize tasks using the Eisenhower matrix (Urgent/Important) and propose a realistic schedule. Be specific and pragmatic.",
      prompt: `Plan the following tasks for horizon: ${data.horizon}.

Return markdown with these sections:

## Prioritized List
A numbered list ordered by priority. For each task include: **priority label** (P1/P2/P3), estimated time, and a one-line rationale.

## Suggested Schedule
A simple time-blocked plan (use day + time blocks appropriate for the horizon).

## Quick Wins
1-3 items that can be done in under 15 minutes.

## Watch Out For
Risks, dependencies, or items that may slip.

---
TASKS:
${data.tasks}`,
    });
    return { text };
  });

/* ---------------- AI Research Assistant ---------------- */

const ResearchInput = z.object({
  topic: z.string().min(3).max(500),
  depth: z.enum(["Brief", "Standard", "Deep"]).default("Standard"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const model = getLovableModel();
    const { text } = await generateText({
      model,
      system:
        "You are a senior analyst. Produce structured, professional briefings. Be balanced and explicit about uncertainty. Do not fabricate citations or statistics; if uncertain, say so.",
      prompt: `Research topic: "${data.topic}"
Depth: ${data.depth}

Return markdown with these sections:

## TL;DR
3-5 sentence executive summary.

## Key Insights
- bullets, each starting with a bolded insight followed by 1-2 sentences of detail

## Background
Concise context.

## Opportunities & Risks
Two short subsections.

## Suggested Next Steps
A short, actionable list.

## Things to Verify
What a human should fact-check before acting on this.`,
    });
    return { text };
  });
