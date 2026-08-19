import { ShieldCheck } from "lucide-react";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> Maverick generates
        drafts, not decisions. Outputs may be inaccurate or incomplete — review and edit before
        use, avoid entering confidential or personal data, and keep a human accountable for any
        action taken.
      </p>
    </div>
  );
}
