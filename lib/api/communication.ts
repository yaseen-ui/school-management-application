import { apiClient } from "./client";
import type { ApiResponse } from "./types";

// ─── Types ──────────────────────────────────────────────────────────────

export type CommunicationType = "notification" | "alert" | "reminder" | "action_required" | "emergency";
export type PublicationType = "circular" | "announcement" | "notice_board" | "holiday_notice" | "event_notice" | "academic_notice";
export type CommunicationStatus = "draft" | "sent" | "scheduled" | "cancelled";
export type PublicationStatus = "draft" | "pending_approval" | "approved" | "rejected" | "published" | "expired" | "archived" | "withdrawn";
export type CommunicationChannel = "in_app" | "email" | "sms" | "push";
export type DeliveryStatus = "pending" | "sent" | "delivered" | "failed" | "viewed" | "acknowledged";
export type SenderType = "user" | "system";

export interface Communication {
  id: string;
  tenantId: string;
  type: CommunicationType;
  senderType: SenderType;
  senderId: string | null;
  title: string;
  message: string;
  priority: number;
  actionButton: { label: string; link: string } | null;
  scheduledAt: string | null;
  expiresAt: string | null;
  status: CommunicationStatus;
  targetUserIds: { userId: string }[] | null;
  targetRoles: { roleId: string }[] | null;
  targetGroups: { groupId: string }[] | null;
  targetGrades: { gradeId: string }[] | null;
  targetSections: { sectionId: string }[] | null;
  targetEmployeeTypes: string[] | null;
  targetAudience: string[] | null;
  automationRuleId: string | null;
  sourceModule: string | null;
  sourceEvent: string | null;
  sourceReference: any | null;
  createdAt: string;
  updatedAt: string;
  _count?: { recipients: number };
}

export interface CommunicationRecipient {
  id: string;
  tenantId: string;
  communicationId: string;
  userId: string;
  channel: CommunicationChannel;
  deliveryStatus: DeliveryStatus;
  viewedAt: string | null;
  acknowledgedAt: string | null;
  retryCount: number;
  lastError: string | null;
  deliveredAt: string | null;
  providerMessageId: string | null;
  createdAt: string;
  updatedAt: string;
  communication?: Pick<Communication, "id" | "type" | "senderType" | "senderId" | "title" | "message" | "priority" | "actionButton" | "createdAt">;
  user?: { id: string; fullName: string; email: string | null; phone: string | null };
}

export interface CommunicationSendPayload {
  type: CommunicationType;
  senderType?: SenderType;
  senderId?: string;
  title: string;
  message: string;
  priority?: number;
  actionButton?: { label: string; link: string };
  scheduledAt?: string;
  expiresAt?: string;
  audience?: {
    targetUserIds?: { userId: string }[];
    targetRoles?: { roleId: string }[];
    targetGroups?: { groupId: string }[];
    targetGrades?: { gradeId: string }[];
    targetSections?: { sectionId: string }[];
    targetEmployeeTypes?: string[];
    targetAudience?: string[];
  };
  channels?: CommunicationChannel[];
  automationRuleId?: string;
  sourceModule?: string;
  sourceEvent?: string;
  sourceReference?: any;
}

export interface CommunicationSendResult {
  communicationId: string;
  totalRecipients: number;
  delivered: number;
  failed: number;
  skipped: number;
  status?: string;
  scheduledAt?: string;
}

export interface DeliveryReport {
  communication: {
    id: string;
    title: string;
    type: CommunicationType;
    status: CommunicationStatus;
  };
  summary: {
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
    viewed: number;
    acknowledged: number;
  };
  recipients: CommunicationRecipient[];
}

export interface Publication {
  id: string;
  tenantId: string;
  type: PublicationType;
  title: string;
  content: string;
  circularNumber: string | null;
  attachments: { name: string; url: string; size: number; type: string }[] | null;
  targetUserIds: { userId: string }[] | null;
  targetRoles: { roleId: string }[] | null;
  targetGroups: { groupId: string }[] | null;
  targetGrades: { gradeId: string }[] | null;
  targetSections: { sectionId: string }[] | null;
  targetEmployeeTypes: string[] | null;
  targetAudience: string[] | null;
  publishDate: string | null;
  expiryDate: string | null;
  priority: number;
  isPinned: boolean;
  requireAcknowledgement: boolean;
  sendNotification: boolean;
  status: PublicationStatus;
  submittedAt: string | null;
  submittedById: string | null;
  approvedAt: string | null;
  approvedById: string | null;
  approvalRemarks: string | null;
  rejectedAt: string | null;
  rejectedById: string | null;
  rejectionReason: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  withdrawnAt: string | null;
  revision: number;
  createdAt: string;
  updatedAt: string;
  submittedBy?: { id: string; fullName: string } | null;
  approvedBy?: { id: string; fullName: string } | null;
  rejectedBy?: { id: string; fullName: string } | null;
  _count?: { revisions: number };
}

export interface PublicationCreatePayload {
  type: PublicationType;
  title: string;
  content?: string;
  circularNumber?: string;
  attachments?: { name: string; url: string; size: number; type: string }[];
  targetUserIds?: { userId: string }[];
  targetRoles?: { roleId: string }[];
  targetGroups?: { groupId: string }[];
  targetGrades?: { gradeId: string }[];
  targetSections?: { sectionId: string }[];
  targetEmployeeTypes?: string[];
  targetAudience?: string[];
  publishDate?: string;
  expiryDate?: string;
  priority?: number;
  isPinned?: boolean;
  requireAcknowledgement?: boolean;
  sendNotification?: boolean;
}

export interface PublicationUpdatePayload extends Partial<PublicationCreatePayload> {
  changeSummary?: string;
}

export interface PublicationRevision {
  id: string;
  tenantId: string;
  publicationId: string;
  revision: number;
  title: string;
  content: string;
  changedById: string | null;
  changeSummary: string | null;
  createdAt: string;
  changedBy?: { id: string; fullName: string } | null;
}

export interface NotificationTemplate {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  type: CommunicationType;
  subject: string;
  body: string;
  defaultChannel: CommunicationChannel;
  defaultPriority: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  automationRules?: { id: string; name: string; sourceModule: string; event: string; isEnabled: boolean }[];
  _count?: { automationRules: number };
}

export interface TemplateCreatePayload {
  name: string;
  description?: string;
  type: CommunicationType;
  subject: string;
  body: string;
  defaultChannel?: CommunicationChannel;
  defaultPriority?: number;
  isSystem?: boolean;
  isActive?: boolean;
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  sourceModule: string;
  event: string;
  templateId: string;
  channels: CommunicationChannel[];
  isEnabled: boolean;
  cooldownMinutes: number | null;
  filterCriteria: any | null;
  createdAt: string;
  updatedAt: string;
  template?: { id: string; name: string; subject: string };
}

export interface AutomationRuleCreatePayload {
  name: string;
  description?: string;
  sourceModule: string;
  event: string;
  templateId: string;
  channels?: CommunicationChannel[];
  isEnabled?: boolean;
  cooldownMinutes?: number;
  filterCriteria?: any;
}

export interface ChannelConfiguration {
  id: string;
  tenantId: string;
  channel: CommunicationChannel;
  provider: string | null;
  config: any;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelConfigUpdatePayload {
  channel: CommunicationChannel;
  provider?: string;
  config?: any;
  isEnabled?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// ─── Communications ─────────────────────────────────────────────────────

export async function sendCommunication(data: CommunicationSendPayload): Promise<CommunicationSendResult> {
  const res = await apiClient.post<ApiResponse<CommunicationSendResult>>("/communications", data);
  return (res as any).data!;
}

export async function getCommunications(filters?: Record<string, string>): Promise<PaginatedResult<Communication>> {
  const params = new URLSearchParams(filters || {}).toString();
  const res = await apiClient.get<ApiResponse<PaginatedResult<Communication>>>(`/communications?${params}`);
  return (res as any).data!;
}

export async function getCommunicationById(id: string): Promise<Communication> {
  const res = await apiClient.get<ApiResponse<Communication>>(`/communications/${id}`);
  return (res as any).data!;
}

export async function updateCommunication(id: string, data: Partial<CommunicationSendPayload>): Promise<Communication> {
  const res = await apiClient.patch<ApiResponse<Communication>>(`/communications/${id}`, data);
  return (res as any).data!;
}

export async function deleteCommunication(id: string): Promise<void> {
  await apiClient.delete(`/communications/${id}`);
}

export async function getInbox(params?: { isRead?: boolean; limit?: number; offset?: number }): Promise<PaginatedResult<CommunicationRecipient>> {
  const searchParams = new URLSearchParams();
  if (params?.isRead !== undefined) searchParams.set("isRead", String(params.isRead));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const res = await apiClient.get<ApiResponse<PaginatedResult<CommunicationRecipient>>>(`/communications/inbox?${searchParams.toString()}`);
  return (res as any).data!;
}

export async function acknowledgeCommunication(communicationId: string, action?: "viewed" | "acknowledged"): Promise<CommunicationRecipient> {
  const res = await apiClient.post<ApiResponse<CommunicationRecipient>>("/communications/acknowledge", { communicationId, action });
  return (res as any).data!;
}

export async function getDeliveryReport(communicationId: string): Promise<DeliveryReport> {
  const res = await apiClient.get<ApiResponse<DeliveryReport>>(`/communications/recipients?communicationId=${communicationId}`);
  return (res as any).data!;
}

// ─── Publications ───────────────────────────────────────────────────────

export async function createPublication(data: PublicationCreatePayload): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>("/publications", data);
  return (res as any).data!;
}

export async function getPublications(filters?: { type?: string; status?: string; published?: boolean; limit?: number; offset?: number }): Promise<PaginatedResult<Publication>> {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.published) params.set("published", "true");
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));
  const res = await apiClient.get<ApiResponse<PaginatedResult<Publication>>>(`/publications?${params.toString()}`);
  return (res as any).data!;
}

export async function getPublicationById(id: string): Promise<Publication> {
  const res = await apiClient.get<ApiResponse<Publication>>(`/publications/${id}`);
  return (res as any).data!;
}

export async function updatePublication(id: string, data: PublicationUpdatePayload): Promise<Publication> {
  const res = await apiClient.patch<ApiResponse<Publication>>(`/publications/${id}`, data);
  return (res as any).data!;
}

export async function deletePublication(id: string): Promise<void> {
  await apiClient.delete(`/publications/${id}`);
}

export async function submitPublication(id: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/submit/${id}`);
  return (res as any).data!;
}

export async function approvePublication(id: string, remarks?: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/approve/${id}`, { remarks });
  return (res as any).data!;
}

export async function rejectPublication(id: string, reason?: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/reject/${id}`, { reason });
  return (res as any).data!;
}

export async function publishPublication(id: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/publish/${id}`);
  return (res as any).data!;
}

export async function archivePublication(id: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/archive/${id}`);
  return (res as any).data!;
}

export async function withdrawPublication(id: string): Promise<Publication> {
  const res = await apiClient.post<ApiResponse<Publication>>(`/publications/withdraw/${id}`);
  return (res as any).data!;
}

export async function getPublicationRevisions(publicationId: string): Promise<{ publication: { id: string; title: string }; revisions: PublicationRevision[] }> {
  const res = await apiClient.get<ApiResponse<{ publication: { id: string; title: string }; revisions: PublicationRevision[] }>>(`/publications/revisions/${publicationId}`);
  return (res as any).data!;
}

// ─── Notification Templates ─────────────────────────────────────────────

export async function getTemplates(filters?: { type?: string; isActive?: boolean; isSystem?: boolean; limit?: number; offset?: number }): Promise<PaginatedResult<NotificationTemplate>> {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.isActive !== undefined) params.set("isActive", String(filters.isActive));
  if (filters?.isSystem !== undefined) params.set("isSystem", String(filters.isSystem));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));
  const res = await apiClient.get<ApiResponse<PaginatedResult<NotificationTemplate>>>(`/communication/templates?${params.toString()}`);
  return (res as any).data!;
}

export async function getTemplateById(id: string): Promise<NotificationTemplate> {
  const res = await apiClient.get<ApiResponse<NotificationTemplate>>(`/communication/templates/${id}`);
  return (res as any).data!;
}

export async function createTemplate(data: TemplateCreatePayload): Promise<NotificationTemplate> {
  const res = await apiClient.post<ApiResponse<NotificationTemplate>>("/communication/templates", data);
  return (res as any).data!;
}

export async function updateTemplate(id: string, data: Partial<TemplateCreatePayload>): Promise<NotificationTemplate> {
  const res = await apiClient.patch<ApiResponse<NotificationTemplate>>(`/communication/templates/${id}`, data);
  return (res as any).data!;
}

export async function deleteTemplate(id: string): Promise<void> {
  await apiClient.delete(`/communication/templates/${id}`);
}

export async function previewTemplate(id: string, payload: Record<string, any>): Promise<{ subject: string; body: string }> {
  const res = await apiClient.post<ApiResponse<{ subject: string; body: string }>>(`/communication/templates/${id}/preview`, { payload });
  return (res as any).data!;
}

// ─── Automation Rules ───────────────────────────────────────────────────

export async function getAutomationRules(filters?: { sourceModule?: string; isEnabled?: boolean; limit?: number; offset?: number }): Promise<PaginatedResult<AutomationRule>> {
  const params = new URLSearchParams();
  if (filters?.sourceModule) params.set("sourceModule", filters.sourceModule);
  if (filters?.isEnabled !== undefined) params.set("isEnabled", String(filters.isEnabled));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));
  const res = await apiClient.get<ApiResponse<PaginatedResult<AutomationRule>>>(`/communication/rules?${params.toString()}`);
  return (res as any).data!;
}

export async function getAutomationRuleById(id: string): Promise<AutomationRule> {
  const res = await apiClient.get<ApiResponse<AutomationRule>>(`/communication/rules/${id}`);
  return (res as any).data!;
}

export async function createAutomationRule(data: AutomationRuleCreatePayload): Promise<AutomationRule> {
  const res = await apiClient.post<ApiResponse<AutomationRule>>("/communication/rules", data);
  return (res as any).data!;
}

export async function updateAutomationRule(id: string, data: Partial<AutomationRuleCreatePayload>): Promise<AutomationRule> {
  const res = await apiClient.patch<ApiResponse<AutomationRule>>(`/communication/rules/${id}`, data);
  return (res as any).data!;
}

export async function deleteAutomationRule(id: string): Promise<void> {
  await apiClient.delete(`/communication/rules/${id}`);
}

export async function toggleAutomationRule(id: string, isEnabled?: boolean): Promise<AutomationRule> {
  const res = await apiClient.post<ApiResponse<AutomationRule>>(`/communication/rules/${id}/toggle`, { isEnabled });
  return (res as any).data!;
}

// ─── Channel Configuration ──────────────────────────────────────────────

export async function getChannelConfigurations(): Promise<ChannelConfiguration[]> {
  const res = await apiClient.get<ApiResponse<ChannelConfiguration[]>>("/communication/channels");
  return (res as any).data ?? [];
}

export async function updateChannelConfigurations(channels: ChannelConfigUpdatePayload[]): Promise<ChannelConfiguration[]> {
  const res = await apiClient.patch<ApiResponse<ChannelConfiguration[]>>("/communication/channels", { channels });
  return (res as any).data!;
}