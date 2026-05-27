import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { MessagesSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Prestige AI" },
      { name: "description", content: "Conversational AI copilot for your workday." },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "prestige-ai:chat:v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

const SUGGESTIONS = [
  "Rewrite this Slack message to sound more diplomatic.",
  "Draft a 3-bullet status update for my manager.",
  "Plan a 60-minute focus session for shipping a feature.",
  "Compare two project management tools for a 12-person team.",
];

function ChatPage() {
  const [initial] = useState<UIMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "main",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Focus textarea on mount and after stream completion
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (msg: PromptInputMessage, e: React.FormEvent) => {
    e.preventDefault();
    const text = (msg.text ?? input).trim();
    if (!text || isBusy) return;
    void sendMessage({ text });
    setInput("");
  };

  const sendSuggestion = (text: string) => {
    if (isBusy) return;
    void sendMessage({ text });
  };

  const resetChat = () => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          icon={MessagesSquare}
          eyebrow="Tool 05"
          title="AI Chat"
          description="Conversational copilot for everyday work — saved in this browser."
        />
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetChat} className="mt-2 gap-2">
            <RotateCcw className="h-3.5 w-3.5" />
            New chat
          </Button>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-6 sm:px-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-soft">
                    <img src={logo} alt="" className="h-9 w-9" />
                  </div>
                }
                title="How can I help you today?"
                description="Ask anything, or pick a starter prompt below."
              >
                <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendSuggestion(s)}
                      className="rounded-xl border bg-background px-4 py-3 text-left text-sm text-foreground transition hover:border-accent hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              <>
                {messages.map((m) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  return (
                    <Message key={m.id} from={m.role as "user" | "assistant"}>
                      {m.role === "assistant" ? (
                        <MessageResponse>{text}</MessageResponse>
                      ) : (
                        <MessageContent>{text}</MessageContent>
                      )}
                    </Message>
                  );
                })}
                {status === "submitted" && (
                  <div className="px-2 pt-1">
                    <Shimmer>Thinking…</Shimmer>
                  </div>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background/60 p-3 sm:p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Prestige AI anything…"
              disabled={isBusy}
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isBusy && !input.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI-generated content may require human review.
            {error ? <span className="ml-2 text-destructive">· {error.message}</span> : null}
          </p>
        </div>
      </div>
    </div>
  );
}
