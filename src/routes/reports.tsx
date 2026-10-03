import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { DemoBadge, ErrorState, IndicatorBadge, PageHeader, Panel, TableSkeleton } from "@/components/common";
import { reportService } from "@/services";
import { formatDate } from "@/lib/nav";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Analysis Reports — Veridion AI" },
      { name: "description", content: "Explainable reports summarizing forensic indicators for review." },
      { property: "og:title", content: "Analysis Reports — Veridion AI" },
      { property: "og:description", content: "Explainable reports summarizing forensic indicators for review." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const q = useQuery({ queryKey: ["reports"], queryFn: reportService.list });
  return (
    <>
      <PageHeader title="Analysis Reports" description="Reports describe indicators that warrant human review. They are not determinations of fraud." />
      <div className="mb-4 flex items-start gap-2 rounded-lg border bg-info-soft p-3 text-sm text-accent-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        Indicator levels reflect automated signals only. Final conclusions require an investigator's assessment.
      </div>
      <Panel title="All reports" action={<DemoBadge />}>
        {q.isLoading ? <TableSkeleton rows={4} /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
          <ul className="divide-y">
            {q.data!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                <span className="min-w-0 flex-1 font-medium">{r.title}</span>
                <IndicatorBadge level={r.indicator} />
                <span className="text-xs text-muted-foreground">{r.author} · {formatDate(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
