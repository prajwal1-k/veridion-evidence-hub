/**
 * Service layer. UI code depends only on these interfaces.
 * Swap the mock implementations for HTTP clients when a backend exists.
 */
import type {
  ActivityPoint,
  AnalysisReport,
  AuditEvent,
  EvidenceItem,
  Investigation,
  NewInvestigationInput,
  Notification,
  ProcessingJob,
  TeamMember,
} from "@/types";
import * as mock from "./mock-data";

export interface InvestigationService {
  list(): Promise<Investigation[]>;
  get(id: string): Promise<Investigation | null>;
  create(input: NewInvestigationInput): Promise<Investigation>;
}
export interface EvidenceService {
  list(): Promise<EvidenceItem[]>;
}
export interface ReportService {
  list(): Promise<AnalysisReport[]>;
}
export interface AuditService {
  list(): Promise<AuditEvent[]>;
}
export interface TeamService {
  list(): Promise<TeamMember[]>;
}
export interface NotificationService {
  list(): Promise<Notification[]>;
}
export interface MetricsService {
  activity(): Promise<ActivityPoint[]>;
}
export interface JobService {
  list(): Promise<ProcessingJob[]>;
}

const delay = <T,>(value: T, ms = 450) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

// Session-only store: new cases live in memory until the page is reloaded.
const sessionInvestigations: Investigation[] = [...mock.investigations];

export const investigationService: InvestigationService = {
  list: () => delay(sessionInvestigations),
  get: (id) => delay(sessionInvestigations.find((i) => i.id === id) ?? null, 250),
  create: (input) => {
    if (sessionInvestigations.some((i) => i.caseRef.toLowerCase() === input.caseRef.toLowerCase())) {
      return Promise.reject(new Error(`Case reference ${input.caseRef} already exists.`));
    }
    const today = new Date().toISOString().slice(0, 10);
    const created: Investigation = {
      id: `inv-${Date.now()}`,
      caseRef: input.caseRef,
      title: input.title,
      owner: input.owner,
      priority: input.priority,
      status: "open",
      analysisState: "not_started",
      evidenceCount: 0,
      createdAt: today,
      updatedAt: today,
    };
    sessionInvestigations.unshift(created);
    return delay(created, 300);
  },
};
export const evidenceService: EvidenceService = { list: () => delay(mock.evidence) };
export const reportService: ReportService = { list: () => delay(mock.reports) };
export const auditService: AuditService = { list: () => delay(mock.auditEvents) };
export const teamService: TeamService = { list: () => delay(mock.team) };
export const notificationService: NotificationService = { list: () => delay(mock.notifications, 150) };
export const metricsService: MetricsService = { activity: () => delay(mock.activitySeries) };
export const jobService: JobService = { list: () => delay(mock.jobs) };

export const nextCaseRef = () => {
  const max = sessionInvestigations.reduce((m, i) => Math.max(m, Number(i.caseRef.split("-").pop()) || 0), 0);
  return `VR-2026-${String(max + 1).padStart(4, "0")}`;
};
