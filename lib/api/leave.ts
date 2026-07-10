import { apiClient } from "./client";
import type { ApiResponse } from "./types";

// ─── Types ──────────────────────────────────────────────────────────────

export interface LeaveCategory {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  applicantType: "student" | "employee";
  isActive: boolean;
  sortOrder: number;
  daysAllocated: number | null;
  isPaid: boolean;
  requiresApproval: boolean;
  allowHalfDay: boolean;
  requireDocuments: boolean;
  requireDocsAfterDays: number | null;
  allowCarryForward: boolean;
  maxCarryForward: number | null;
  allowNegativeBalance: boolean;
  allocationMethod: string;
  studentApprovalMode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  applicantType: "student" | "employee";
  studentId: string | null;
  enrollmentId: string | null;
  employeeId: string | null;
  leaveCategoryId: string;
  startDate: string;
  endDate: string;
  startFraction: string;
  endFraction: string;
  reason: string;
  status: string;
  calculatedDays: number | null;
  supportingDocumentUrl: string | null;
  submittedById: string | null;
  submittedAt: string | null;
  withdrawnAt: string | null;
  withdrawnReason: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  leaveCategory?: LeaveCategory;
  student?: { id: string; firstName: string; lastName: string; admissionNumber?: string };
  enrollment?: { id: string; rollNumber: string; grade?: { id: string; gradeName: string }; section?: { id: string; sectionName: string } };
  employee?: { id: string; fullName: string; employeeCode: string; employeeType?: string };
  approvals?: LeaveApproval[];
  cancellations?: LeaveCancellation[];
  auditLogs?: LeaveAuditLog[];
  _count?: { approvals: number };
}

export interface LeaveApproval {
  id: string;
  tenantId: string;
  leaveRequestId: string;
  level: number;
  approverRole: string;
  approverId: string | null;
  status: string;
  remarks: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveCancellation {
  id: string;
  tenantId: string;
  leaveRequestId: string;
  requestedById: string;
  reason: string;
  status: string;
  approverId: string | null;
  approverRemarks: string | null;
  requestedAt: string;
  decidedAt: string | null;
}

export interface LeaveAuditLog {
  id: string;
  tenantId: string;
  leaveRequestId: string;
  action: string;
  actorId: string | null;
  actorName: string | null;
  actorRole: string | null;
  changes: any;
  remarks: string | null;
  createdAt: string;
}

export interface EmployeeLeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveCategoryId: string;
  academicYearId: string;
  allocated: number;
  carriedForward: number;
  manualAdjustment: number;
  used: number;
  pending: number;
  available?: number;
  leaveCategory?: LeaveCategory;
  employee?: { id: string; fullName: string; employeeCode: string };
  academicYear?: { id: string; name: string };
  transactions?: any[];
}

export interface TenantLeaveConfig {
  id: string;
  tenantId: string;
  workingDays: string[];
  allowSaturdayHalfDay: boolean;
  allowLeaveWithoutApproval: boolean;
  lowBalanceAlertThreshold: number | null;
  enableLowBalanceAlert: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DayCalculationResult {
  calculatedDays: number;
  breakdown: Array<{
    date: string;
    fraction: number;
    isWorkingDay: boolean;
    isHoliday: boolean;
    holidayName: string | null;
  }>;
}

// ─── Leave Categories ───────────────────────────────────────────────────

export async function getLeaveCategories(applicantType?: string): Promise<LeaveCategory[]> {
  const params = applicantType ? `?applicantType=${applicantType}` : "";
  const res = await apiClient.get<ApiResponse<LeaveCategory[]>>(`/leave/categories${params}`);
  return (res as any).data ?? [];
}

export async function getLeaveCategoryById(id: string): Promise<LeaveCategory> {
  const res = await apiClient.get<ApiResponse<LeaveCategory>>(`/leave/categories/${id}`);
  return (res as any).data!;
}

export async function createLeaveCategory(data: Partial<LeaveCategory>): Promise<LeaveCategory> {
  const res = await apiClient.post<ApiResponse<LeaveCategory>>("/leave/categories", data);
  return (res as any).data!;
}

export async function updateLeaveCategory(id: string, data: Partial<LeaveCategory>): Promise<LeaveCategory> {
  const res = await apiClient.put<ApiResponse<LeaveCategory>>(`/leave/categories/${id}`, data);
  return (res as any).data!;
}

export async function deleteLeaveCategory(id: string): Promise<void> {
  await apiClient.delete(`/leave/categories/${id}`);
}

// ─── Leave Requests ─────────────────────────────────────────────────────

export async function getLeaveRequests(filters?: Record<string, string>): Promise<LeaveRequest[]> {
  const params = new URLSearchParams(filters || {}).toString();
  const res = await apiClient.get<ApiResponse<LeaveRequest[]>>(`/leave/requests?${params}`);
  return (res as any).data ?? [];
}

export async function getLeaveRequestById(id: string): Promise<LeaveRequest> {
  const res = await apiClient.get<ApiResponse<LeaveRequest>>(`/leave/requests/${id}`);
  return (res as any).data!;
}

export async function createLeaveRequest(data: {
  applicantType: "student" | "employee";
  studentId?: string;
  enrollmentId?: string;
  employeeId?: string;
  leaveCategoryId: string;
  startDate: string;
  endDate: string;
  startFraction?: string;
  endFraction?: string;
  reason: string;
  supportingDocumentUrl?: string;
  academicYearId?: string;
}): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>("/leave/requests", data);
  return (res as any).data!;
}

export async function updateLeaveRequest(id: string, data: any): Promise<LeaveRequest> {
  const res = await apiClient.put<ApiResponse<LeaveRequest>>(`/leave/requests/${id}`, data);
  return (res as any).data!;
}

export async function submitLeaveRequest(id: string): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>(`/leave/requests/${id}/submit`);
  return (res as any).data!;
}

export async function withdrawLeaveRequest(id: string, reason: string): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>(`/leave/requests/${id}/withdraw`, { reason });
  return (res as any).data!;
}

export async function approveLeaveRequest(id: string, level?: number, remarks?: string): Promise<any> {
  const res = await apiClient.post<ApiResponse<any>>(`/leave/requests/${id}/approve`, { level, remarks });
  return (res as any).data!;
}

export async function rejectLeaveRequest(id: string, level?: number, remarks?: string): Promise<any> {
  const res = await apiClient.post<ApiResponse<any>>(`/leave/requests/${id}/reject`, { level, remarks });
  return (res as any).data!;
}

export async function cancelLeaveRequest(id: string, reason: string): Promise<LeaveRequest> {
  const res = await apiClient.post<ApiResponse<LeaveRequest>>(`/leave/requests/${id}/cancel`, { reason });
  return (res as any).data!;
}

// ─── Balances ───────────────────────────────────────────────────────────

export async function getEmployeeBalances(employeeId: string, academicYearId?: string): Promise<EmployeeLeaveBalance[]> {
  const params = academicYearId ? `?academicYearId=${academicYearId}` : "";
  const res = await apiClient.get<ApiResponse<EmployeeLeaveBalance[]>>(`/leave/balances/${employeeId}${params}`);
  return (res as any).data ?? [];
}

export async function getAllBalances(): Promise<EmployeeLeaveBalance[]> {
  const res = await apiClient.get<ApiResponse<EmployeeLeaveBalance[]>>("/leave/balances");
  return (res as any).data ?? [];
}

export async function adjustBalance(employeeId: string, data: {
  leaveCategoryId: string;
  academicYearId: string;
  amount: number;
  reason?: string;
}): Promise<EmployeeLeaveBalance> {
  const res = await apiClient.post<ApiResponse<EmployeeLeaveBalance>>(`/leave/balances/${employeeId}/adjust`, data);
  return (res as any).data!;
}

// ─── Tenant Configuration ───────────────────────────────────────────────

export async function getTenantLeaveConfig(): Promise<TenantLeaveConfig> {
  const res = await apiClient.get<ApiResponse<TenantLeaveConfig>>("/leave/tenant-config");
  return (res as any).data!;
}

export async function updateTenantLeaveConfig(data: Partial<TenantLeaveConfig>): Promise<TenantLeaveConfig> {
  const res = await apiClient.put<ApiResponse<TenantLeaveConfig>>("/leave/tenant-config", data);
  return (res as any).data!;
}

// ─── Reports ────────────────────────────────────────────────────────────

export async function getLeaveSummary(): Promise<any> {
  const res = await apiClient.get<ApiResponse<any>>("/leave/reports/summary");
  return (res as any).data!;
}

export async function getLeaveCalendar(dateFrom?: string, dateTo?: string): Promise<LeaveRequest[]> {
  const params = new URLSearchParams();
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);
  const res = await apiClient.get<ApiResponse<LeaveRequest[]>>(`/leave/reports/calendar?${params.toString()}`);
  return (res as any).data ?? [];
}

// ─── Pending Approvals ─────────────────────────────────────────────────

export async function getPendingApprovals(): Promise<any[]> {
  const res = await apiClient.get<ApiResponse<any[]>>("/leave/approvals-pending");
  return (res as any).data ?? [];
}

// ─── Day Calculation ────────────────────────────────────────────────────

export async function calculateLeaveDays(data: {
  startDate: string;
  endDate: string;
  startFraction?: string;
  endFraction?: string;
  academicYearId?: string;
}): Promise<DayCalculationResult> {
  const res = await apiClient.post<ApiResponse<DayCalculationResult>>("/leave/calculate-days", data);
  return (res as any).data!;
}