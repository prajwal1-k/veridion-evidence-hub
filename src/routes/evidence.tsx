import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileImage, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalysisBadge, ErrorState, PageHeader, Panel, TableSkeleton } from "@/components/common";
import { evidenceService } from "@/services";
import { formatBytes, formatDate } from "@/lib/nav";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Library — Veridion AI" },
      { name: "description", content: "All evidence items across investigations." },
      { property: "og:title", content: "Evidence Library — Veridion AI" },
      { property: "og:description", content: "All evidence items across investigations." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const q = useQuery({ queryKey: ["evidence"], queryFn: evidenceService.list });
  return (
    <>
      <PageHeader title="Evidence Library" description="Supported in this preview: PDF, PNG, JPEG, TIFF. Uploading arrives in a later stage." />
      <Panel>
        {q.isLoading ? <TableSkeleton /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence ID</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="hidden sm:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">Added</TableHead>
                <TableHead>Processing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.data!.map((e) => {
                const Icon = e.type === "pdf" ? FileText : FileImage;
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.id}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2"><Icon className="size-4 text-muted-foreground" />{e.fileName}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs">{formatBytes(e.sizeBytes)}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(e.addedAt)}</TableCell>
                    <TableCell><AnalysisBadge state={e.analysisState} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
