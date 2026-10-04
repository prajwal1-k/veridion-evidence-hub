import { useMemo, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ArrowUpDown, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalysisBadge, EmptyState, PriorityBadge, StatusBadge } from "@/components/common";
import { formatDate } from "@/lib/nav";
import type { Investigation, InvestigationStatus } from "@/types";

type SortKey = "caseRef" | "title" | "evidenceCount" | "updatedAt";

export function InvestigationTable({ rows, limit, compact }: { rows: Investigation[]; limit?: number; compact?: boolean }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvestigationStatus | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "updatedAt", dir: "desc" });

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const out = rows
      .filter((i) => (status === "all" || i.status === status) && `${i.caseRef} ${i.title} ${i.owner}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        const c = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sort.dir === "asc" ? c : -c;
      });
    return limit ? out.slice(0, limit) : out;
  }, [rows, search, status, sort, limit]);

  const head = (key: SortKey, label: string, className?: string) => {
    const active = sort.key === key;
    const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <TableHead className={className} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground"
          onClick={() => setSort({ key, dir: active && sort.dir === "desc" ? "asc" : "desc" })}
        >
          {label} <Icon className="size-3" />
        </button>
      </TableHead>
    );
  };

  const go = (id: string) => navigate({ to: "/investigations/$id", params: { id } });

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b p-3">
        <Input aria-label="Search investigations" placeholder="Search case, title, owner…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={(v) => setStatus(v as InvestigationStatus | "all")}>
          <SelectTrigger className="w-40" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In review</SelectItem>
            <SelectItem value="on_hold">On hold</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {visible.length === 0 ? (
        <EmptyState icon={FolderSearch} title="No investigations match" description="Adjust the search, status, or date range." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {head("caseRef", "Case ID")}
              {head("title", "Investigation")}
              {!compact && <TableHead className="hidden md:table-cell">Owner</TableHead>}
              {!compact && <TableHead className="hidden lg:table-cell">Status</TableHead>}
              {!compact && <TableHead className="hidden lg:table-cell">Priority</TableHead>}
              {head("evidenceCount", "Evidence", "hidden sm:table-cell")}
              <TableHead>Latest analysis</TableHead>
              {head("updatedAt", "Updated", "hidden md:table-cell")}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((i) => (
              <TableRow
                key={i.id}
                tabIndex={0}
                className="cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none"
                onClick={() => go(i.id)}
                onKeyDown={(e) => e.key === "Enter" && go(i.id)}
              >
                <TableCell className="font-mono text-xs">{i.caseRef}</TableCell>
                <TableCell className="max-w-[280px] truncate font-medium">{i.title}</TableCell>
                {!compact && <TableCell className="hidden md:table-cell">{i.owner}</TableCell>}
                {!compact && <TableCell className="hidden lg:table-cell"><StatusBadge status={i.status} /></TableCell>}
                {!compact && <TableCell className="hidden lg:table-cell"><PriorityBadge priority={i.priority} /></TableCell>}
                <TableCell className="hidden sm:table-cell font-mono">{i.evidenceCount}</TableCell>
                <TableCell><AnalysisBadge state={i.analysisState} /></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(i.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <Link to="/investigations/$id" params={{ id: i.id }}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
