import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";
import { generateAi, type ChatMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Maverick AI" },
      {
        name: "description",
        content:
          "Chat with Maverick, your workplace AI assistant, for drafting, planning and problem solving with full conversation context.",
      },
      { property: "og:title", content: "AI Chatbot — Maverick AI" },
      {
        property: "og:description",
        content: "A workplace AI chatbot that keeps context across the whole conversation.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM =
  "You are Maverick, a workplace productivity assistant for professionals. Be concise, practical and professional. Use markdown with short sections and bullet points. Ask a clarifying question when the request is ambiguous. Never invent facts, figures or sources; say when you are unsure.";

const SUGGESTIONS = [
  "Rewrite this update so it's clearer for execs",
  "Help me prep an agenda for a 30-minute 1:1",
  "Draft a polite follow-up on an overdue deliverable",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const run = useServerFn(generateAi);

  const mutation = useMutation({
    mutationFn: async (history: ChatMessage[]) => {
      const res = await run({ data: { system: SYSTEM, messages: history } });
      return res.text;
    },
    onSuccess: (text) => setMessages((m) => [...m, { role: "assistant", content: text }]),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell title="AI Chatbot" subtitle="Your always-on workplace assistant.">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex min-h-[55vh] flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          {messages.length === 0 ? (
            <div className="m-auto max-w-md text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-hero-gradient text-primary-foreground">
                <Sparkles className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">How can I help, Neo?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask anything about your work — drafting, planning or thinking it through.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border px-3 py-2 text-sm transition hover:border-primary/50 hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-hero-gradient text-primary-foreground"
                    : "mr-auto border border-border bg-surface"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="space-y-2 [&_a]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            ))
          )}

          {mutation.isPending ? (
            <div className="mr-auto flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Maverick is thinking…
            </div>
          ) : null}

          {mutation.isError ? (
            <p className="mr-auto text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-border bg-card p-3 shadow-card"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder="Message Maverick… (Enter to send, Shift+Enter for a new line)"
            className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="inline-flex size-10 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground transition hover:opacity-95 disabled:opacity-40"
            aria-label="Send message"
          >
            <SendHorizonal className="size-4" />
          </button>
        </form>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
