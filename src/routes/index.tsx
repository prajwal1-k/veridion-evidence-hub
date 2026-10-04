import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { Archive, FileText, FolderSearch, Plus, ScanSearch, Upload } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DemoBadge, EmptyState, ErrorState, PageHeader, Panel, Pill, StatCard, TableSkeleton } from "@/components/common";
import { NewInvestigationDialog } from "@/components/investigations/new-investigation-dialog";
import { InvestigationTable } from "@/components/investigations/investigation-table";
import { auditService, evidenceService, investigationService, jobService, metricsService, reportService } from "@/services";
import type { IndicatorLevel, JobState } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Veridion AI" },
      { name: "description", content: "Workspace overview of investigations, evidence, and analysis activity." },
      { property: "og:title", content: "Overview — Veridion AI" },
      { property: "og:description", content: "Workspace overview of investigations, evidence, and analysis activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

const RANGES = { "7": 7, "30": 30, "90": 90 } as const;
type Range = keyof typeof RANGES;
// Demo data is anchored to this date so ranges stay meaningful.
const ANCHOR = Date.UTC(2026, 9, 4);
const inRange = (iso: string, days: number) => ANCHOR - new Date(iso).getTime() <= days * 86_400_000;

const indicatorMeta: { key: IndicatorLevel; label: string; color: string }[] = [
  { key: "low", label: "Low Indicators", color: "var(--color-success)" },
  { key: "review", label: "Review Recommended", color: "var(--color-warning)" },
  { key: "elevated", label: "Elevated Indicators", color: "var(--color-destructive)" },
  { key: "inconclusive", label: "Inconclusive", color: "var(--color-muted-foreground)" },
];
const jobTone: Record<JobState, ["neutral" | "info" | "success" | "danger", string]> = {
  pending: ["neutral", "Pending"],
  processing: ["info", "Processing"],
  completed: ["success", "Completed"],
  failed: ["danger", "Failed"],
};
const tooltipStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 };

function Overview() {
  const [range, setRange] = useState<Range>("30");
  const days = RANGES[range];
  const inv = useQuery({ queryKey: ["investigations"], queryFn: investigationService.list });
  const ev = useQuery({ queryKey: ["evidence"], queryFn: evidenceService.list });
  const rep = useQuery({ queryKey: ["reports"], queryFn: reportService.list });
  const act = useQuery({ queryKey: ["activity"], queryFn: metricsService.activity });
  const audit = useQuery({ queryKey: ["audit"], queryFn: auditService.list });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: jobService.list });

  const f = useMemo(() => {
    const invs = (inv.data ?? []).filter((i) => inRange(i.updatedAt, days));
    const evs = (ev.data ?? []).filter((e) => inRange(e.addedAt, days));
    const reps = (rep.data ?? []).filter((r) => inRange(r.createdAt, days));
    const series = (act.data ?? []).slice(-days).map((p) => ({
      ...p,
      label: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    }));
    const risk = indicatorMeta.map((m) => ({ ...m, count: reps.filter((r) => r.indicator === m.key).length }));
    const events = (audit.data ?? []).filter((a) => inRange(a.timestamp, days));
    return { invs, evs, reps, series, risk, events };
  }, [inv.data, ev.data, rep.data, act.data, audit.data, days]);

  const statsLoading = inv.isLoading || ev.isLoading || rep.isLoading;

  return (
    <>
      <PageHeader
        title="Good morning, Ananya"
        description="A summary of your workspace. Every figure here is demonstration data and does not reflect real analysis results."
        actions={<NewInvestigationDialog />}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><DemoBadge /> Showing activity up to Oct 4, 2026</div>
        <ToggleGroup type="single" variant="outline" size="sm" value={range} onValueChange={(v) => v && setRange(v as Range)} aria-label="Date range">
          <ToggleGroupItem value="7">7 days</ToggleGroupItem>
          <ToggleGroupItem value="30">30 days</ToggleGroupItem>
          <ToggleGroupItem value="90">90 days</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px]" />)
        ) : (
          <>
            <CardLink to="/investigations"><StatCard label="Total investigations" value={f.invs.length} icon={FolderSearch} hint={`Updated in last ${days} days`} /></CardLink>
            <CardLink to="/evidence"><StatCard label="Evidence items" value={f.evs.length} icon={Archive} hint={`Added in last ${days} days`} /></CardLink>
            <CardLink to="/analysis"><StatCard label="Analyses completed" value={f.evs.filter((e) => e.analysisState === "completed").length} icon={ScanSearch} hint="Demo data" /></CardLink>
            <CardLink to="/reports"><StatCard label="Reports generated" value={f.reps.length} icon={FileText} hint="Demo data" /></CardLink>
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title={`Analysis activity — last ${days} days`} action={<DemoBadge />} className="lg:col-span-2">
          <div className="h-64 p-4">
            {act.isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={f.series}>
                  <defs>
                    <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" minTickGap={24} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="analyses" name="Analyses" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#fillA)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
        <Panel title="Indicator distribution" action={<DemoBadge />}>
          <div className="h-64 p-4">
            {rep.isLoading ? <Skeleton className="h-full w-full" /> : f.reps.length === 0 ? (
              <EmptyState title="No reports in this range" description="Widen the date range to see indicator categories." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={f.risk} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis type="category" dataKey="label" width={130} tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" name="Reports" radius={4}>
                    {f.risk.map((r) => <Cell key={r.key} fill={r.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="border-t px-4 py-2 text-xs text-muted-foreground">Indicators flag items for human review; they are not verdicts.</p>
        </Panel>
      </div>

      <Panel title="Recent investigations" className="mt-6" action={<Link to="/investigations" className="text-xs font-medium text-primary hover:underline">View all</Link>}>
        {inv.isLoading ? <TableSkeleton rows={4} /> : inv.isError ? <ErrorState onRetry={() => inv.refetch()} /> : <InvestigationTable rows={f.invs} limit={6} compact />}
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Recent activity">
          {audit.isLoading ? <TableSkeleton rows={4} /> : f.events.length === 0 ? <EmptyState title="No activity in this range" /> : (
            <ol className="relative space-y-4 p-4 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:w-px before:bg-border">
              {f.events.map((a) => (
                <li key={a.id} className="relative flex gap-3 pl-6 text-sm">
                  <span className="absolute left-[2px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-card" />
                  <div>
                    <p><span className="font-medium">{a.actor}</span> {a.action} <span className="font-mono text-xs">{a.target}</span></p>
                    <p className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Panel>
        <Panel title="Processing queue" action={<DemoBadge />}>
          {jobs.isLoading ? <TableSkeleton rows={4} /> : (jobs.data ?? []).length === 0 ? <EmptyState title="Queue is empty" /> : (
            <ul className="divide-y">
              {jobs.data!.map((j) => (
                <li key={j.id} className="space-y-2 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate font-medium">{j.fileName}</span>
                    <Pill tone={jobTone[j.state][0]}>{jobTone[j.state][1]}</Pill>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{j.caseRef}</span>
                    {j.state === "processing" && <Progress value={j.progress} className="h-1.5 flex-1" aria-label={`${j.progress}% processed`} />}
                    {j.state === "failed" && <span className="text-destructive">Processing stopped — retry available later</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Quick actions">
          <div className="grid gap-2 p-4">
            <NewInvestigationDialog trigger={<Button variant="outline" className="justify-start"><Plus className="size-4" /> Create investigation</Button>} />
            <Button variant="outline" className="justify-start" asChild><Link to="/evidence"><Upload className="size-4" /> Upload evidence</Link></Button>
            <Button variant="outline" className="justify-start" asChild><Link to="/reports"><FileText className="size-4" /> View reports</Link></Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

function CardLink({ to, children }: { to: "/investigations" | "/evidence" | "/analysis" | "/reports"; children: ReactNode }) {
  return (
    <Link to={to} className="block rounded-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </Link>
  );
}
