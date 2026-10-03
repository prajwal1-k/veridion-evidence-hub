import { createFileRoute } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/common";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "AI Analysis — Veridion AI" },
      { name: "description", content: "Configure and run automated forensic analysis on evidence." },
      { property: "og:title", content: "AI Analysis — Veridion AI" },
      { property: "og:description", content: "Configure and run automated forensic analysis on evidence." },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="AI Analysis" description="Automated checks produce indicators to support — not replace — investigator judgement." />
      <Panel>
        <EmptyState
          icon={ScanSearch}
          title="Analysis engine not connected"
          description="This preview does not run any models. Analysis pipelines will appear here once a backend is integrated."
        />
      </Panel>
    </>
  ),
});
