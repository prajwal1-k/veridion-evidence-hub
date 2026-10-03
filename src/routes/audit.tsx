import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DemoBadge, ErrorState, PageHeader, Panel, TableSkeleton } from "@/components/common";
import { auditService } from "@/services";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Activity & Audit Log — Veridion AI" },
      { name: "description", content: "Chronological record of actions taken in the workspace." },
      { property: "og:title", content: "Activity & Audit Log — Veridion AI" },
      { property: "og:description", content: "Chronological record of actions taken in the workspace." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const q = useQuery({ queryKey: ["audit"], queryFn: auditService.list });
  return (
    <>
      <PageHeader title="Activity & Audit Log" description="Every action on cases and evidence is recorded for chain-of-custody review." />
      <Panel title="Events" action={<DemoBadge />}>
        {q.isLoading ? <TableSkeleton /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
          <ol className="relative space-y-5 p-5">
            {q.data!.map((e) => (
              <li key={e.id} className="relative border-l pl-5">
                <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-card bg-primary" />
                <p className="text-sm"><span className="font-medium">{e.actor}</span> {e.action} <span className="font-mono text-xs">{e.target}</span></p>
                <time className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</time>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </>
  );
}
