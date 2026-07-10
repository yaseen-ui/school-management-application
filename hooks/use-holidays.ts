"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import {
  getHolidayCategories,
  getHolidayCategoryById,
  createHolidayCategory,
  updateHolidayCategory,
  deleteHolidayCategory,
  getHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayRules,
  createHolidayRule,
  updateHolidayRule,
  deleteHolidayRule,
} from "@/lib/api/holidays";

// ─── Holiday Categories ───────────────────────────────────────────────────────

export function useHolidayCategories() {
  return useQuery({
    queryKey: ["holiday-categories"],
    queryFn: getHolidayCategories,
  });
}

export function useHolidayCategory(id: string | null) {
  return useQuery({
    queryKey: ["holiday-categories", id],
    queryFn: () => getHolidayCategoryById(id!),
    enabled: !!id,
  });
}

export function useCreateHolidayCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHolidayCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-categories"] });
      toast.success("Category created successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create category"),
  });
}

export function useUpdateHolidayCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateHolidayCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update category"),
  });
}

export function useDeleteHolidayCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHolidayCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete category"),
  });
}

// ─── Holidays ─────────────────────────────────────────────────────────────────

export function useHolidays(filters?: {
  academicYearId?: string;
  categoryId?: string;
  type?: string;
  isMandatory?: boolean;
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: ["holidays", filters],
    queryFn: () => getHolidays(filters),
  });
}

export function useHoliday(id: string | null) {
  return useQuery({
    queryKey: ["holidays", id],
    queryFn: () => getHolidayById(id!),
    enabled: !!id,
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success("Holiday created successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create holiday"),
  });
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateHoliday(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success("Holiday updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update holiday"),
  });
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success("Holiday deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete holiday"),
  });
}

// ─── Holiday Rules ────────────────────────────────────────────────────────────

export function useHolidayRules(filters?: { academicYearId?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["holiday-rules", filters],
    queryFn: () => getHolidayRules(filters),
  });
}

export function useCreateHolidayRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHolidayRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-rules"] });
      toast.success("Rule created successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create rule"),
  });
}

export function useUpdateHolidayRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateHolidayRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-rules"] });
      toast.success("Rule updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update rule"),
  });
}

export function useDeleteHolidayRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHolidayRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-rules"] });
      toast.success("Rule deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete rule"),
  });
}