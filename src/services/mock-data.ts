import type {
  ActivityPoint,
  AnalysisReport,
  AuditEvent,
  EvidenceItem,
  Investigation,
  Notification,
  ProcessingJob,
  TeamMember,
} from "@/types";

// Demonstration data only — not real cases or forensic results.
export const investigations: Investigation[] = [
  { id: "inv-1", caseRef: "VR-2026-0142", title: "Vendor invoice discrepancy — Q3 procurement", owner: "Ananya Rao", status: "in_review", priority: "high", analysisState: "completed", evidenceCount: 14, createdAt: "2026-09-12", updatedAt: "2026-10-02" },
  { id: "inv-2", caseRef: "VR-2026-0139", title: "Insurance claim photo review", owner: "Marcus Lee", status: "open", priority: "medium", analysisState: "processing", evidenceCount: 8, createdAt: "2026-09-08", updatedAt: "2026-10-01" },
  { id: "inv-3", caseRef: "VR-2026-0131", title: "Employment certificate verification", owner: "Ananya Rao", status: "open", priority: "low", analysisState: "queued", evidenceCount: 3, createdAt: "2026-09-01", updatedAt: "2026-09-29" },
  { id: "inv-4", caseRef: "VR-2026-0127", title: "Contract amendment signature check", owner: "Sofia Martins", status: "on_hold", priority: "critical", analysisState: "failed", evidenceCount: 5, createdAt: "2026-08-27", updatedAt: "2026-09-25" },
  { id: "inv-5", caseRef: "VR-2026-0118", title: "KYC identity document batch", owner: "Daniel Okafor", status: "closed", priority: "medium", analysisState: "completed", evidenceCount: 22, createdAt: "2026-08-14", updatedAt: "2026-09-18" },
  { id: "inv-6", caseRef: "VR-2026-0109", title: "Shipping manifest image provenance", owner: "Marcus Lee", status: "in_review", priority: "high", analysisState: "completed", evidenceCount: 11, createdAt: "2026-08-02", updatedAt: "2026-09-12" },
];

export const evidence: EvidenceItem[] = [
  { id: "EV-00981", investigationId: "inv-1", fileName: "invoice_4471_scan.pdf", type: "pdf", sizeBytes: 2_340_000, addedAt: "2026-10-02", analysisState: "completed" },
  { id: "EV-00980", investigationId: "inv-2", fileName: "claim_photo_front.jpeg", type: "jpeg", sizeBytes: 4_120_000, addedAt: "2026-10-01", analysisState: "processing" },
  { id: "EV-00977", investigationId: "inv-2", fileName: "claim_photo_side.png", type: "png", sizeBytes: 3_050_000, addedAt: "2026-10-01", analysisState: "queued" },
  { id: "EV-00962", investigationId: "inv-3", fileName: "certificate_original.tiff", type: "tiff", sizeBytes: 18_400_000, addedAt: "2026-09-29", analysisState: "queued" },
  { id: "EV-00941", investigationId: "inv-4", fileName: "amendment_v2_signed.pdf", type: "pdf", sizeBytes: 980_000, addedAt: "2026-09-25", analysisState: "failed" },
  { id: "EV-00903", investigationId: "inv-6", fileName: "manifest_dock7.jpeg", type: "jpeg", sizeBytes: 5_600_000, addedAt: "2026-09-12", analysisState: "completed" },
];

export const reports: AnalysisReport[] = [
  { id: "RPT-0311", investigationId: "inv-1", title: "Invoice 4471 — document structure review", indicator: "review", author: "Ananya Rao", createdAt: "2026-10-02" },
  { id: "RPT-0305", investigationId: "inv-6", title: "Dock 7 manifest — image metadata summary", indicator: "low", author: "Marcus Lee", createdAt: "2026-09-12" },
  { id: "RPT-0298", investigationId: "inv-5", title: "KYC batch — consolidated findings", indicator: "inconclusive", author: "Daniel Okafor", createdAt: "2026-09-18" },
  { id: "RPT-0290", investigationId: "inv-1", title: "Vendor letterhead comparison", indicator: "elevated", author: "Ananya Rao", createdAt: "2026-09-20" },
];

export const auditEvents: AuditEvent[] = [
  { id: "a1", actor: "Ananya Rao", action: "generated report", target: "RPT-0311", timestamp: "2026-10-02T14:20:00Z" },
  { id: "a2", actor: "Ananya Rao", action: "added evidence", target: "EV-00981", timestamp: "2026-10-02T13:58:00Z" },
  { id: "a3", actor: "Marcus Lee", action: "queued analysis", target: "EV-00980", timestamp: "2026-10-01T09:12:00Z" },
  { id: "a4", actor: "Sofia Martins", action: "placed case on hold", target: "VR-2026-0127", timestamp: "2026-09-25T16:40:00Z" },
  { id: "a5", actor: "Daniel Okafor", action: "closed investigation", target: "VR-2026-0118", timestamp: "2026-09-18T11:05:00Z" },
  { id: "a6", actor: "System", action: "exported audit trail", target: "VR-2026-0109", timestamp: "2026-09-12T08:00:00Z" },
];

export const team: TeamMember[] = [
  { id: "u1", name: "Ananya Rao", email: "ananya.rao@example.com", role: "Lead Investigator", lastActive: "Today" },
  { id: "u2", name: "Marcus Lee", email: "marcus.lee@example.com", role: "Analyst", lastActive: "Yesterday" },
  { id: "u3", name: "Sofia Martins", email: "sofia.martins@example.com", role: "Admin", lastActive: "3 days ago" },
  { id: "u4", name: "Daniel Okafor", email: "daniel.okafor@example.com", role: "Viewer", lastActive: "1 week ago" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Analysis completed for EV-00981", time: "12 min ago", read: false },
  { id: "n2", title: "Marcus Lee commented on VR-2026-0139", time: "2 h ago", read: false },
  { id: "n3", title: "Processing failed for EV-00941", time: "Yesterday", read: true },
];

// 90 days of deterministic demo activity ending 2026-10-04.
export const activitySeries: ActivityPoint[] = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 9, 4) - (89 - i) * 86_400_000);
  const weekday = d.getUTCDay();
  const base = weekday === 0 || weekday === 6 ? 4 : 12;
  return { date: d.toISOString().slice(0, 10), analyses: base + ((i * 7 + 3) % 11) };
});

export const jobs: ProcessingJob[] = [
  { id: "JOB-5521", evidenceId: "EV-00980", fileName: "claim_photo_front.jpeg", caseRef: "VR-2026-0139", state: "processing", progress: 62, submittedAt: "2026-10-04T04:31:00Z" },
  { id: "JOB-5520", evidenceId: "EV-00977", fileName: "claim_photo_side.png", caseRef: "VR-2026-0139", state: "pending", progress: 0, submittedAt: "2026-10-04T04:30:00Z" },
  { id: "JOB-5518", evidenceId: "EV-00962", fileName: "certificate_original.tiff", caseRef: "VR-2026-0131", state: "pending", progress: 0, submittedAt: "2026-10-03T17:02:00Z" },
  { id: "JOB-5512", evidenceId: "EV-00981", fileName: "invoice_4471_scan.pdf", caseRef: "VR-2026-0142", state: "completed", progress: 100, submittedAt: "2026-10-02T13:59:00Z" },
  { id: "JOB-5497", evidenceId: "EV-00941", fileName: "amendment_v2_signed.pdf", caseRef: "VR-2026-0127", state: "failed", progress: 38, submittedAt: "2026-09-25T15:12:00Z" },
];
