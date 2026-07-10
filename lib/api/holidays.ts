import { apiClient } from "./client";
import type { ApiResponse } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HolidayCategory {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  tenantId: string;
  academicYearId: string | null;
  categoryId: string | null;
  categoryName: string | null;
  date: string;
  name: string;
  type: string;
  isMandatory: boolean;
  fullDay: boolean;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HolidayRule {
  id: string;
  tenantId: string;
  academicYearId: string | null;
  name: string;
  ruleType: "all_weekday" | "nth_weekday_of_month";
  dayOfWeek: string;
  weekOfMonth: number | null;
  isActive: boolean;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Holiday Categories ───────────────────────────────────────────────────────

export async function getHolidayCategories(): Promise<HolidayCategory[]> {
  const res = await apiClient.get<ApiResponse<HolidayCategory[]>>("/holiday-categories");
  return (res as any).data ?? [];
}

export async function getHolidayCategoryById(id: string): Promise<HolidayCategory> {
  const res = await apiClient.get<ApiResponse<HolidayCategory>>(`/holiday-categories/${id}`);
  return (res as any).data!;
}

export async function createHolidayCategory(data: {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}): Promise<HolidayCategory> {
  const res = await apiClient.post<ApiResponse<HolidayCategory>>("/holiday-categories", data);
  return (res as any).data!;
}

export async function updateHolidayCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
): Promise<HolidayCategory> {
  const res = await apiClient.put<ApiResponse<HolidayCategory>>(`/holiday-categories/${id}`, data);
  return (res as any).data!;
}

export async function deleteHolidayCategory(id: string): Promise<void> {
  await apiClient.delete(`/holiday-categories/${id}`);
}

// ─── Holidays ─────────────────────────────────────────────────────────────────

export async function getHolidays(filters?: {
  academicYearId?: string;
  categoryId?: string;
  type?: string;
  isMandatory?: boolean;
  fromDate?: string;
  toDate?: string;
}): Promise<Holiday[]> {
  const params = new URLSearchParams();
  if (filters?.academicYearId) params.set("academicYearId", filters.academicYearId);
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.isMandatory !== undefined) params.set("isMandatory", String(filters.isMandatory));
  if (filters?.fromDate) params.set("fromDate", filters.fromDate);
  if (filters?.toDate) params.set("toDate", filters.toDate);
  const res = await apiClient.get<ApiResponse<Holiday[]>>(`/holidays?${params.toString()}`);
  return (res as any).data ?? [];
}

export async function getHolidayById(id: string): Promise<Holiday> {
  const res = await apiClient.get<ApiResponse<Holiday>>(`/holidays/${id}`);
  return (res as any).data!;
}

export async function createHoliday(data: {
  name: string;
  date: string;
  academicYearId?: string | null;
  categoryId?: string | null;
  type?: string;
  isMandatory?: boolean;
  fullDay?: boolean;
  remarks?: string;
}): Promise<Holiday> {
  const res = await apiClient.post<ApiResponse<Holiday>>("/holidays", data);
  return (res as any).data!;
}

export async function updateHoliday(
  id: string,
  data: {
    name?: string;
    date?: string;
    academicYearId?: string | null;
    categoryId?: string | null;
    type?: string;
    isMandatory?: boolean;
    fullDay?: boolean;
    remarks?: string;
  }
): Promise<Holiday> {
  const res = await apiClient.put<ApiResponse<Holiday>>(`/holidays/${id}`, data);
  return (res as any).data!;
}

export async function deleteHoliday(id: string): Promise<void> {
  await apiClient.delete(`/holidays/${id}`);
}

// ─── Holiday Rules ────────────────────────────────────────────────────────────

export async function getHolidayRules(filters?: {
  academicYearId?: string;
  isActive?: boolean;
}): Promise<HolidayRule[]> {
  const params = new URLSearchParams();
  if (filters?.academicYearId) params.set("academicYearId", filters.academicYearId);
  if (filters?.isActive !== undefined) params.set("isActive", String(filters.isActive));
  const res = await apiClient.get<ApiResponse<HolidayRule[]>>(`/holiday-rules?${params.toString()}`);
  return (res as any).data ?? [];
}

export async function getHolidayRuleById(id: string): Promise<HolidayRule> {
  const res = await apiClient.get<ApiResponse<HolidayRule>>(`/holiday-rules/${id}`);
  return (res as any).data!;
}

export async function createHolidayRule(data: {
  name: string;
  ruleType: "all_weekday" | "nth_weekday_of_month";
  dayOfWeek: string;
  academicYearId?: string | null;
  weekOfMonth?: number;
  isActive?: boolean;
  remarks?: string;
}): Promise<HolidayRule> {
  const res = await apiClient.post<ApiResponse<HolidayRule>>("/holiday-rules", data);
  return (res as any).data!;
}

export async function updateHolidayRule(
  id: string,
  data: {
    name?: string;
    ruleType?: "all_weekday" | "nth_weekday_of_month";
    dayOfWeek?: string;
    academicYearId?: string | null;
    weekOfMonth?: number;
    isActive?: boolean;
    remarks?: string;
  }
): Promise<HolidayRule> {
  const res = await apiClient.put<ApiResponse<HolidayRule>>(`/holiday-rules/${id}`, data);
  return (res as any).data!;
}

export async function deleteHolidayRule(id: string): Promise<void> {
  await apiClient.delete(`/holiday-rules/${id}`);
}
