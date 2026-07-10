"use client";

import { useState, useCallback } from "react";
import type { LeaveRequest, LeaveCategory, EmployeeLeaveBalance, TenantLeaveConfig, DayCalculationResult } from "@/lib/api/leave";
import * as leaveApi from "@/lib/api/leave";

export function useLeaveCategories(applicantType?: string) {
  const [categories, setCategories] = useState<LeaveCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getLeaveCategories(applicantType);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [applicantType]);

  return { categories, loading, error, refetch: fetch };
}

export function useLeaveRequests(filters?: Record<string, string>) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getLeaveRequests(filters);
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  return { requests, loading, error, refetch: fetch };
}

export function useLeaveRequest(id: string | null) {
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getLeaveRequestById(id);
      setRequest(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { request, loading, error, refetch: fetch };
}

export function useLeaveBalances(employeeId: string | null, academicYearId?: string) {
  const [balances, setBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getEmployeeBalances(employeeId, academicYearId);
      setBalances(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId, academicYearId]);

  return { balances, loading, error, refetch: fetch };
}

export function useLeaveDayCalculation() {
  const [result, setResult] = useState<DayCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (data: {
    startDate: string;
    endDate: string;
    startFraction?: string;
    endFraction?: string;
    academicYearId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.calculateLeaveDays(data);
      setResult(res);
      return res;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, calculate };
}

export function useLeaveSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await leaveApi.submitLeaveRequest(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}

export function useLeaveAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (id: string, level?: number, remarks?: string) => {
    setLoading(true);
    setError(null);
    try {
      return await leaveApi.approveLeaveRequest(id, level, remarks);
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);

  const reject = useCallback(async (id: string, level?: number, remarks?: string) => {
    setLoading(true);
    setError(null);
    try {
      return await leaveApi.rejectLeaveRequest(id, level, remarks);
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);

  const withdraw = useCallback(async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      return await leaveApi.withdrawLeaveRequest(id, reason);
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);

  const cancel = useCallback(async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      return await leaveApi.cancelLeaveRequest(id, reason);
    } catch (err: any) { setError(err.message); return null; } finally { setLoading(false); }
  }, []);

  return { approve, reject, withdraw, cancel, loading, error };
}