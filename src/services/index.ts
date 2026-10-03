/**
 * Service layer. UI code depends only on these interfaces.
 * Swap the mock implementations for HTTP clients when a backend exists.
 */
import type {
  AnalysisReport,
  AuditEvent,
  EvidenceItem,
  Investigation,
  Notification,
  TeamMember,
} from "@/types";
import * as mock from "./mock-data";

export interface InvestigationService {
  list(): Promise<Investigation[]>;
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
  activity(): Promise<{ day: string; analyses: number }[]>;
}

const delay = <T,>(value: T, ms = 450) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

export const investigationService: InvestigationService = { list: () => delay(mock.investigations) };
export const evidenceService: EvidenceService = { list: () => delay(mock.evidence) };
export const reportService: ReportService = { list: () => delay(mock.reports) };
export const auditService: AuditService = { list: () => delay(mock.auditEvents) };
export const teamService: TeamService = { list: () => delay(mock.team) };
export const notificationService: NotificationService = { list: () => delay(mock.notifications, 150) };
export const metricsService: MetricsService = { activity: () => delay(mock.activitySeries) };
