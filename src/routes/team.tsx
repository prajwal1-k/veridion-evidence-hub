import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorState, PageHeader, Panel, Pill, TableSkeleton } from "@/components/common";
import { teamService } from "@/services";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team & Access — Veridion AI" },
      { name: "description", content: "Manage workspace members and their roles." },
      { property: "og:title", content: "Team & Access — Veridion AI" },
      { property: "og:description", content: "Manage workspace members and their roles." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const q = useQuery({ queryKey: ["team"], queryFn: teamService.list });
  return (
    <>
      <PageHeader title="Team & Access" description="Role-based access controls who can view, analyze, and export evidence." />
      <Panel>
        {q.isLoading ? <TableSkeleton rows={4} /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.data!.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8"><AvatarFallback className="bg-accent text-xs text-accent-foreground">{m.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                      <div><div className="font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell><Pill tone={m.role === "Admin" ? "violet" : "info"}>{m.role}</Pill></TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{m.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
