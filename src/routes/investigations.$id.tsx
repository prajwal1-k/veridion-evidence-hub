import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisBadge, DemoBadge, EmptyState, IndicatorBadge, PageHeader, Panel, PriorityBadge, StatusBadge } from "@/components/common";
import { evidenceService, investigationService, reportService } from "@/services";
import { formatBytes, formatDate } from "@/lib/nav";

export const Route = createFileRoute("/investigations/$id")({
  head: () => ({
    meta: [
      { title: "Investigation details — Veridion AI" },
      { name: "description", content: "Case summary, linked evidence, and analysis reports." },
      { property: "og:title", content: "Investigation details — Veridion AI" },
      { property: "og:description", content: "Case summary, linked evidence, and analysis reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InvestigationDetail,
});

function InvestigationDetail() {
  const { id } = Route.useParams();
  const inv = useQuery({ queryKey: ["investigations", id], queryFn: () => investigationService.get(id) });
  const ev = useQuery({ queryKey: ["evidence"], queryFn: evidenceService.list });
  const rep = useQuery({ queryKey: ["reports"], queryFn: reportService.list });

  const back = <Button variant="outline" asChild><Link to="/investigations"><ArrowLeft className="size-4" /> All investigations</Link></Button>;

  if (inv.isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-1/2" /><Skeleton className="h-40" /></div>;
  if (!inv.data) return <Panel><EmptyState icon={FolderSearch} title="Investigation not found" description="It may have been created in a previous session." action={back} /></Panel>;

  const i = inv.data;
  const evidence = (ev.data ?? []).filter((e) => e.investigationId === i.id);
  const reports = (rep.data ?? []).filter((r) => r.investigationId === i.id);

  return (
    <>
      <PageHeader title={i.title} description={`${i.caseRef} · Owner ${i.owner} · Created ${formatDate(i.createdAt)}`} actions={back} />
      <div className="mb-6 flex flex-wrap gap-2"><StatusBadge status={i.status} /><PriorityBadge priority={i.priority} /><AnalysisBadge state={i.analysisState} /></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Linked evidence" action={<DemoBadge />}>
          {evidence.length === 0 ? <EmptyState title="No evidence linked yet" description="Evidence uploads arrive in a later stage." /> : (
            <ul className="divide-y">{evidence.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
                <span className="min-w-0 flex-1 truncate">{e.fileName}</span>
                <span className="text-xs text-muted-foreground">{formatBytes(e.sizeBytes)}</span>
                <AnalysisBadge state={e.analysisState} />
              </li>))}</ul>
          )}
        </Panel>
        <Panel title="Analysis reports" action={<DemoBadge />}>
          {reports.length === 0 ? <EmptyState title="No reports yet" description="Reports summarise indicators for human review; none exist for this case." /> : (
            <ul className="divide-y">{reports.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                <span className="min-w-0 flex-1 truncate">{r.title}</span>
                <IndicatorBadge level={r.indicator} />
              </li>))}</ul>
          )}
        </Panel>
      </div>
    </>
  );
}
