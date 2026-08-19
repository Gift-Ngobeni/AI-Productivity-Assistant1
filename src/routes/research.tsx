import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Maverick AI" },
      {
        name: "description",
        content:
          "Generate structured research briefs with key findings, comparisons, risks and open questions for any work topic.",
      },
      { property: "og:title", content: "AI Research Assistant — Maverick AI" },
      {
        property: "og:description",
        content: "Structured research briefs: findings, trade-offs, risks and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell title="AI Research Assistant" subtitle="Structured briefs, not walls of text.">
      <ToolWorkspace
        outputLabel="Research brief (editable)"
        cta="Run research brief"
        system="You are Maverick, a research analyst. You have no live web access, so rely on general knowledge, state your confidence, and clearly label anything that must be verified from a primary source. Never fabricate citations, statistics or URLs."
        fields={[
          { name: "topic", label: "Research topic or question", type: "textarea", rows: 4, placeholder: "e.g. Best practices for async standups in hybrid teams", required: true },
          { name: "audience", label: "Audience", placeholder: "e.g. exec leadership team" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick overview", "Standard brief", "Deep dive"] },
          { name: "angle", label: "Angle to emphasize", type: "select", options: ["Balanced", "Opportunities", "Risks", "Cost", "Implementation"] },
        ]}
        buildPrompt={(v) => `Produce a research brief.

Topic: ${v.topic}
Audience: ${v.audience || "internal team"}
Depth: ${v.depth}
Emphasis: ${v.angle}

Output:
1. Executive summary
2. Key findings (with confidence: high/medium/low)
3. Options or approaches compared with trade-offs
4. Risks and considerations
5. Recommended next steps
6. "Verify before relying on this" — list the claims that need a primary source`}
      />
    </AppShell>
  );
}
