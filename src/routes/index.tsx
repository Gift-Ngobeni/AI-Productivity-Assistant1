import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maverick AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Maverick AI helps professionals draft emails, summarize meetings, plan tasks and research faster with structured AI prompts and editable outputs.",
      },
      { property: "og:title", content: "Maverick AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate everyday workplace tasks: smart emails, meeting summaries, task plans, research briefs and an AI chatbot.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    desc: "Turn a few bullet points into a polished, on-tone email in seconds.",
  },
  {
    to: "/meeting-notes",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    desc: "Condense transcripts into decisions, action items and owners.",
  },
  {
    to: "/tasks",
    label: "AI Task Planner",
    icon: ListChecks,
    desc: "Break goals into sequenced, time-boxed tasks with priorities.",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Search,
    desc: "Get structured briefs with key points, risks and open questions.",
  },
  {
    to: "/chat",
    label: "AI Chatbot",
    icon: MessageSquare,
    desc: "Ask anything, iterate on drafts, and keep full conversation context.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell title="Welcome Neo" subtitle="Here's your AI workspace for today.">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl bg-hero-gradient p-6 text-primary-foreground shadow-float sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Maverick AI Workplace
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-4xl">
            Welcome Neo — let's clear the busywork.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
            Five AI assistants built around structured prompts, so every draft comes back
            consistent, professional and ready to edit.
          </p>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map(({ to, label, icon: Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
