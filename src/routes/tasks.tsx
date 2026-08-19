import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Maverick AI" },
      {
        name: "description",
        content:
          "Break any work goal into a sequenced, prioritized and time-boxed task plan you can edit and share.",
      },
      { property: "og:title", content: "AI Task Planner — Maverick AI" },
      {
        property: "og:description",
        content: "Turn goals into prioritized, time-boxed task plans with dependencies.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <AppShell title="AI Task Planner" subtitle="Goals in, an executable plan out.">
      <ToolWorkspace
        outputLabel="Task plan (editable)"
        cta="Build task plan"
        system="You are Maverick, a pragmatic project planner. Produce realistic, specific and sequenced plans. Flag assumptions explicitly rather than presenting them as facts."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", rows: 4, placeholder: "e.g. Launch the new onboarding flow", required: true },
          { name: "deadline", label: "Deadline / timeframe", placeholder: "e.g. 3 weeks" },
          { name: "capacity", label: "Time available", placeholder: "e.g. 6 hours per week" },
          { name: "team", label: "People involved", placeholder: "e.g. Neo (design), Sam (dev)" },
          { name: "priority", label: "Optimize for", type: "select", options: ["Speed", "Quality", "Low risk", "Low effort"] },
        ]}
        buildPrompt={(v) => `Create a task plan.

Goal: ${v.goal}
Deadline: ${v.deadline || "not specified"}
Capacity: ${v.capacity || "not specified"}
People: ${v.team || "not specified"}
Optimize for: ${v.priority}

Output:
1. Plan overview (2-3 sentences)
2. Milestones with target dates
3. Task table: Task | Owner | Priority (High/Med/Low) | Estimate | Depends on
4. Suggested weekly schedule
5. Assumptions and risks`}
      />
    </AppShell>
  );
}
