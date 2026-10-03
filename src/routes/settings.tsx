import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel } from "@/components/common";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Veridion AI" },
      { name: "description", content: "Workspace preferences and evidence handling settings." },
      { property: "og:title", content: "Settings — Veridion AI" },
      { property: "og:description", content: "Workspace preferences and evidence handling settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Preferences are stored locally in this preview." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Workspace">
          <div className="grid gap-4 p-4">
            <div className="grid gap-1.5"><Label htmlFor="ws">Workspace name</Label><Input id="ws" defaultValue="Veridion Investigations" /></div>
            <div className="grid gap-1.5"><Label htmlFor="max">Max evidence file size (MB)</Label><Input id="max" type="number" defaultValue={50} /></div>
            <Button className="justify-self-start" onClick={() => toast.success("Settings saved")}>Save changes</Button>
          </div>
        </Panel>
        <Panel title="Notifications">
          <div className="divide-y">
            {["Analysis completed", "Processing failures", "Comments and mentions"].map((l) => (
              <label key={l} className="flex items-center justify-between px-4 py-3 text-sm">
                {l}
                <Switch defaultChecked />
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
