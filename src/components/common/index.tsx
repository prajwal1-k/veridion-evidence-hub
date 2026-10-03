import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AnalysisState, IndicatorLevel, InvestigationStatus, Priority } from "@/types";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border bg-card shadow-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded border border-dashed border-violet/40 bg-violet-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet">
      Demo data
    </span>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: { icon?: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Couldn't load this data"
      description="The service did not respond. Your work is unaffected."
      action={onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RefreshCw className="size-4" /> Retry</Button>}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "violet";
const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-info-soft text-primary border-primary/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-destructive-soft text-destructive border-destructive/20",
  violet: "bg-violet-soft text-violet border-violet/20",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium", toneClass[tone])}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

const analysisMap: Record<AnalysisState, [Tone, string]> = {
  not_started: ["neutral", "Not started"],
  queued: ["neutral", "Queued"],
  processing: ["info", "Processing"],
  completed: ["success", "Completed"],
  failed: ["danger", "Failed"],
};
export const AnalysisBadge = ({ state }: { state: AnalysisState }) => <Pill tone={analysisMap[state][0]}>{analysisMap[state][1]}</Pill>;

const statusMap: Record<InvestigationStatus, [Tone, string]> = {
  open: ["info", "Open"],
  in_review: ["violet", "In review"],
  on_hold: ["warning", "On hold"],
  closed: ["neutral", "Closed"],
};
export const StatusBadge = ({ status }: { status: InvestigationStatus }) => <Pill tone={statusMap[status][0]}>{statusMap[status][1]}</Pill>;

const indicatorMap: Record<IndicatorLevel, [Tone, string]> = {
  low: ["success", "Low indicators"],
  review: ["warning", "Review recommended"],
  elevated: ["danger", "Elevated indicators"],
  inconclusive: ["neutral", "Inconclusive"],
};
export const IndicatorBadge = ({ level }: { level: IndicatorLevel }) => <Pill tone={indicatorMap[level][0]}>{indicatorMap[level][1]}</Pill>;

const priorityMap: Record<Priority, Tone> = { low: "neutral", medium: "info", high: "warning", critical: "danger" };
export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Pill tone={priorityMap[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Pill>
);
