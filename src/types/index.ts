export type InvestigationStatus = "open" | "in_review" | "on_hold" | "closed";
export type AnalysisState = "not_started" | "queued" | "processing" | "completed" | "failed";
export type IndicatorLevel = "low" | "review" | "elevated" | "inconclusive";
export type Priority = "low" | "medium" | "high" | "critical";
export type EvidenceType = "pdf" | "png" | "jpeg" | "tiff";

export interface Investigation {
  id: string;
  caseRef: string;
  title: string;
  owner: string;
  status: InvestigationStatus;
  priority: Priority;
  analysisState: AnalysisState;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceItem {
  id: string;
  investigationId: string;
  fileName: string;
  type: EvidenceType;
  sizeBytes: number;
  addedAt: string;
  analysisState: AnalysisState;
}

export interface AnalysisReport {
  id: string;
  investigationId: string;
  title: string;
  indicator: IndicatorLevel;
  author: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Lead Investigator" | "Analyst" | "Viewer";
  lastActive: string;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export type JobState = "pending" | "processing" | "completed" | "failed";

export interface ProcessingJob {
  id: string;
  evidenceId: string;
  fileName: string;
  caseRef: string;
  state: JobState;
  progress: number;
  submittedAt: string;
}

export interface ActivityPoint {
  date: string; // ISO yyyy-mm-dd
  analyses: number;
}

export interface NewInvestigationInput {
  title: string;
  caseRef: string;
  owner: string;
  priority: Priority;
}
