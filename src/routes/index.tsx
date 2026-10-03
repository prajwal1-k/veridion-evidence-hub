import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Archive, FileText, FolderSearch, Plus, ScanSearch } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisBadge, DemoBadge, ErrorState, PageHeader, Panel, StatCard, StatusBadge, TableSkeleton } from "@/components/common";
import { investigationService, metricsService, reportService, evidenceService } from "@/services";
import { formatDate } from "@/lib/nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Veridion AI" },
      { name: "description", content: "Workspace overview of investigations, evidence, and analysis activity." },
      { property: "og:title", content: "Overview — Veridion AI" },
      { property: "og:description", content: "Workspace overview of investigations, evidence, and analysis activity." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const inv = useQuery({ queryKey: ["investigations"], queryFn: investigationService.list });
  const ev = useQuery({ queryKey: ["evidence"], queryFn: evidenceService.list });
  const rep = useQuery({ queryKey: ["reports"], queryFn: reportService.list });
  const act = useQuery({ queryKey: ["activity"], queryFn: metricsService.activity });

  return (
    <>
      <PageHeader
        title="Good evening, Ananya"
        description="Here is the state of your workspace. All figures below are demonstration data."
        actions={
          <Button asChild>
            <Link to="/investigations"><Plus className="size-4" /> New investigation</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inv.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px]" />)
        ) : (
          <>
            <StatCard label="Investigations" value={inv.data?.length ?? 0} icon={FolderSearch} hint="Demo data" />
            <StatCard label="Evidence items" value={ev.data?.length ?? 0} icon={Archive} hint="Demo data" />
            <StatCard label="Analyses completed" value={ev.data?.filter((e) => e.analysisState === "completed").length ?? 0} icon={ScanSearch} hint="Demo data" />
            <StatCard label="Reports" value={rep.data?.length ?? 0} icon={FileText} hint="Demo data" />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Analysis activity — last 7 days" action={<DemoBadge />} className="lg:col-span-2">
          <div className="h-64 p-4">
            {act.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={act.data}>
                  <defs>
                    <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                  <Area type="monotone" dataKey="analyses" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#fillA)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
        <Panel title="Quick actions">
          <div className="grid gap-2 p-4">
            <Button variant="outline" className="justify-start" asChild><Link to="/investigations"><FolderSearch className="size-4" /> Create investigation</Link></Button>
            <Button variant="outline" className="justify-start" asChild><Link to="/evidence"><Archive className="size-4" /> Open evidence library</Link></Button>
            <Button variant="outline" className="justify-start" asChild><Link to="/reports"><FileText className="size-4" /> View reports</Link></Button>
          </div>
        </Panel>
      </div>

      <Panel title="Recent investigations" className="mt-6" action={<Link to="/investigations" className="text-xs font-medium text-primary hover:underline">View all</Link>}>
        {inv.isLoading ? (
          <TableSkeleton rows={4} />
        ) : inv.isError ? (
          <ErrorState onRetry={() => inv.refetch()} />
        ) : (
          <ul className="divide-y">
            {inv.data!.slice(0, 4).map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{i.caseRef}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{i.title}</span>
                <StatusBadge status={i.status} />
                <AnalysisBadge state={i.analysisState} />
                <span className="w-24 text-right text-xs text-muted-foreground">{formatDate(i.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
