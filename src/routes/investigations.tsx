import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FolderSearch, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AnalysisBadge, EmptyState, ErrorState, PageHeader, Panel, PriorityBadge, StatusBadge, TableSkeleton } from "@/components/common";
import { investigationService } from "@/services";
import { formatDate } from "@/lib/nav";

export const Route = createFileRoute("/investigations")({
  head: () => ({
    meta: [
      { title: "Investigations — Veridion AI" },
      { name: "description", content: "Browse and manage forensic investigation cases." },
      { property: "og:title", content: "Investigations — Veridion AI" },
      { property: "og:description", content: "Browse and manage forensic investigation cases." },
    ],
  }),
  component: InvestigationsPage,
});

function InvestigationsPage() {
  const q = useQuery({ queryKey: ["investigations"], queryFn: investigationService.list });
  const [search, setSearch] = useState("");
  const rows = (q.data ?? []).filter((i) =>
    `${i.caseRef} ${i.title} ${i.owner}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Investigations"
        description="Cases group related evidence, analyses, and reports."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" /> New investigation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New investigation</DialogTitle>
                <DialogDescription>Case creation is a preview — nothing is saved yet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5"><Label htmlFor="t">Title</Label><Input id="t" placeholder="e.g. Vendor invoice review" /></div>
                <div className="grid gap-1.5"><Label htmlFor="r">Case reference</Label><Input id="r" placeholder="VR-2026-0150" /></div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("Draft created (preview only)")}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Panel>
        <div className="border-b p-3">
          <Input aria-label="Filter investigations" placeholder="Filter by case, title, owner…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorState onRetry={() => q.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState icon={FolderSearch} title="No investigations match" description="Try a different search term." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Analysis</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Evidence</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.caseRef}</TableCell>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{i.owner}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><PriorityBadge priority={i.priority} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><AnalysisBadge state={i.analysisState} /></TableCell>
                  <TableCell className="hidden sm:table-cell text-right font-mono">{i.evidenceCount}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(i.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
