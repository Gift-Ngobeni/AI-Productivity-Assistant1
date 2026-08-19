import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { generateAi } from "@/lib/ai.functions";
import { Disclaimer } from "@/components/Disclaimer";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  rows?: number;
  required?: boolean;
};

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  cta = "Generate with AI",
  outputLabel = "AI draft (editable)",
  intro,
}: {
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  cta?: string;
  outputLabel?: string;
  intro?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.options?.[0] ?? ""])),
  );
  const [output, setOutput] = useState("");
  const run = useServerFn(generateAi);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await run({
        data: {
          system,
          messages: [{ role: "user" as const, content: buildPrompt(values) }],
        },
      });
      return res.text;
    },
    onSuccess: (text) => setOutput(text),
  });

  const set = (name: string, v: string) => setValues((p) => ({ ...p, [name]: v }));
  const missing = fields.some((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        {intro ? <p className="mb-4 text-sm text-muted-foreground">{intro}</p> : null}
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label htmlFor={f.name} className="text-sm font-medium">
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={f.name}
                  rows={f.rows ?? 5}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
                />
              ) : f.type === "select" ? (
                <select
                  id={f.name}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
                >
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={f.name}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || missing}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-hero-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {mutation.isPending ? "Generating…" : cta}
        </button>

        {mutation.isError ? (
          <p className="mt-3 text-sm text-destructive">{(mutation.error as Error).message}</p>
        ) : null}

        <Disclaimer className="mt-5" />
      </section>

      <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-base font-semibold">{outputLabel}</h2>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-secondary disabled:opacity-40"
            >
              <Copy className="size-3.5" /> Copy
            </button>
            <button
              onClick={() => setOutput("")}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-secondary disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" /> Clear
            </button>
          </div>
        </div>
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your AI draft appears here — fully editable before you use it."
          className="min-h-[340px] flex-1 resize-y rounded-xl border border-input bg-background p-4 font-mono text-sm leading-relaxed outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
        />
      </section>
    </div>
  );
}
