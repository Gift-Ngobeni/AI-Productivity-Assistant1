import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Maverick AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from bullet points, with control over tone, audience and length.",
      },
      { property: "og:title", content: "Smart Email Generator — Maverick AI" },
      {
        property: "og:description",
        content: "Draft on-tone professional emails in seconds and edit them before sending.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Structured prompts in, send-ready drafts out."
    >
      <ToolWorkspace
        outputLabel="Email draft (editable)"
        cta="Generate email"
        system="You are Maverick, an expert workplace communication assistant. Write clear, concise, professional emails. Use a subject line, greeting, well-structured body and sign-off. Never invent facts, names, figures or commitments that were not provided; use [bracketed placeholders] instead."
        fields={[
          { name: "recipient", label: "Recipient & relationship", placeholder: "e.g. Priya, client stakeholder", required: true },
          { name: "purpose", label: "Purpose / key points", type: "textarea", rows: 5, placeholder: "Bullet the points the email must cover…", required: true },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Apologetic", "Persuasive", "Formal"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
          { name: "cta", label: "Desired outcome / call to action", placeholder: "e.g. confirm the Friday deadline" },
        ]}
        buildPrompt={(v) => `Write a workplace email.

Recipient: ${v["recipient"]}
Tone: ${v["tone"]}
Length: ${v["length"]}
Desired outcome: ${v["cta"] || "not specified"}

Key points to cover:
${v["purpose"]}

Return: "Subject: ..." on the first line, then the email body. Plain text only.`}
      />
    </AppShell>
  );
}
