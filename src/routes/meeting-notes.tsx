import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Maverick AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into a summary with decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Maverick AI" },
      {
        property: "og:description",
        content: "Decisions, action items and owners extracted from your meeting transcript.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      subtitle="From messy transcript to shareable recap."
    >
      <ToolWorkspace
        outputLabel="Meeting recap (editable)"
        cta="Summarize meeting"
        system="You are Maverick, a meeting analyst. Summarize faithfully and never add facts, owners or dates that are not in the source. Mark anything unclear as 'Unclear — needs confirmation'."
        fields={[
          { name: "title", label: "Meeting title", placeholder: "e.g. Q3 roadmap sync" },
          { name: "attendees", label: "Attendees", placeholder: "e.g. Neo, Priya, Sam" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 10, placeholder: "Paste the transcript or your rough notes…", required: true },
          { name: "style", label: "Summary style", type: "select", options: ["Executive summary", "Detailed minutes", "Action items only"] },
        ]}
        buildPrompt={(v) => `Summarize the following meeting.

Title: ${v.title || "Untitled meeting"}
Attendees: ${v.attendees || "not specified"}
Requested style: ${v.style}

Structure the output with these sections:
1. Summary (3-5 sentences)
2. Key decisions
3. Action items (task — owner — due date)
4. Risks / blockers
5. Open questions

Raw notes:
"""
${v.notes}
"""`}
      />
    </AppShell>
  );
}
