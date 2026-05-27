import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getLovableModel } from "@/lib/ai-gateway.server";

type ChatBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const model = getLovableModel();
        const result = streamText({
          model,
          system:
            "You are the AI Workplace Productivity Assistant — a friendly, concise, professional copilot for busy knowledge workers. Help with email drafting, summarizing meetings, planning tasks, research, and general workplace questions. Use clean markdown, short paragraphs, and bullet lists. When asked for outputs, be specific and ready-to-use. Always remind the user when a task may require human review.",
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
