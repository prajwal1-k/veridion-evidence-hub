import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { investigationService, nextCaseRef } from "@/services";
import type { Priority } from "@/types";

export function NewInvestigationDialog({ trigger }: { trigger?: ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [caseRef, setCaseRef] = useState("");
  const [owner, setOwner] = useState("Ananya Rao");
  const [priority, setPriority] = useState<Priority>("medium");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setCaseRef(nextCaseRef());
    setOwner("Ananya Rao");
    setPriority("medium");
    setError(null);
  };

  const m = useMutation({
    mutationFn: investigationService.create,
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: ["investigations"] });
      toast.success(`${inv.caseRef} added for this session`);
      setOpen(false);
    },
    onError: (e: Error) => setError(e.message),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) return setError("Title must be at least 3 characters.");
    if (!/^VR-\d{4}-\d{4}$/.test(caseRef.trim())) return setError("Case reference must look like VR-2026-0150.");
    if (!owner.trim()) return setError("Owner is required.");
    setError(null);
    m.mutate({ title: title.trim(), caseRef: caseRef.trim(), owner: owner.trim(), priority });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) reset(); }}>
      <DialogTrigger asChild>
        {trigger ?? <Button><Plus className="size-4" /> New investigation</Button>}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>New investigation</DialogTitle>
            <DialogDescription>Cases are kept for this session only and are cleared when the page reloads.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label htmlFor="ni-title">Title</Label><Input id="ni-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vendor invoice review" autoFocus /></div>
            <div className="grid gap-1.5"><Label htmlFor="ni-ref">Case reference</Label><Input id="ni-ref" value={caseRef} onChange={(e) => setCaseRef(e.target.value)} className="font-mono" /></div>
            <div className="grid gap-1.5"><Label htmlFor="ni-owner">Owner</Label><Input id="ni-owner" value={owner} onChange={(e) => setOwner(e.target.value)} /></div>
            <div className="grid gap-1.5">
              <Label htmlFor="ni-priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="ni-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high", "critical"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={m.isPending}>{m.isPending ? "Creating…" : "Create investigation"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
