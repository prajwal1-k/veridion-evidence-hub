import {
  LayoutDashboard,
  FolderSearch,
  Archive,
  FileText,
  ScanSearch,
  ScrollText,
  Users,
  Settings,
} from "lucide-react";

export const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Investigations", url: "/investigations", icon: FolderSearch },
  { title: "Evidence Library", url: "/evidence", icon: Archive },
  { title: "Analysis Reports", url: "/reports", icon: FileText },
  { title: "AI Analysis", url: "/analysis", icon: ScanSearch },
  { title: "Activity & Audit Log", url: "/audit", icon: ScrollText },
  { title: "Team & Access", url: "/team", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export const titleForPath = (path: string) =>
  navItems.find((n) => n.url === path)?.title ?? "Page";

export const formatBytes = (b: number) =>
  b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.round(b / 1000)} KB`;

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
