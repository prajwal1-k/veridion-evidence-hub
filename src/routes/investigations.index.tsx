import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ErrorState, PageHeader, Panel, TableSkeleton } from "@/components/common";
import { NewInvestigationDialog } from "@/components/investigations/new-investigation-dialog";
import { InvestigationTable } from "@/components/investigations/investigation-table";
import { investigationService } from "@/services";

export const Route = createFileRoute("/investigations/")({
  head: () => ({
    meta: [
      { title: "Investigations — Veridion AI" },
      { name: "description", content: "Browse and manage forensic investigation cases." },
      { property: "og:title", content: "Investigations — Veridion AI" },
      { property: "og:description", content: "Browse and manage forensic investigation cases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InvestigationsPage,
});

function InvestigationsPage() {
  const q = useQuery({ queryKey: ["investigations"], queryFn: investigationService.list });
  return (
    <>
      <PageHeader title="Investigations" description="Cases group related evidence, analyses, and reports." actions={<NewInvestigationDialog />} />
      <Panel>
        {q.isLoading ? <TableSkeleton /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : <InvestigationTable rows={q.data!} />}
      </Panel>
    </>
  );
}
