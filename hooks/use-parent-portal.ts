"use client"

import { useQuery } from "@tanstack/react-query"
import { parentsApi } from "@/lib/api/parents"
import { apiClient } from "@/lib/api/client"
import type { ApiResponse } from "@/lib/api/types"

export function useParentProfile() {
  return useQuery({
    queryKey: ["parent-profile"],
    queryFn: async () => {
      const response = await parentsApi.getMyProfile()
      return response.data ?? null
    },
    staleTime: 5 * 60 * 1000,
  })
}

export interface ChildAttendanceRecord {
  date: string
  status: string
}

export interface ChildAttendance {
  studentId: string
  studentName: string
  gradeName?: string
  sectionName?: string
  records: ChildAttendanceRecord[]
  summary: {
    present: number
    absent: number
    late: number
  }
}

export function useChildrenAttendance(month: number, year: number) {
  return useQuery({
    queryKey: ["parent-children-attendance", month, year],
    queryFn: async () => {
      const response = await parentsApi.getMyChildrenAttendance(month, year)
      return (response.data ?? []) as ChildAttendance[]
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!month && !!year,
  })
}

// --- Results types ---

export interface SubjectResult {
  subjectName: string
  maxMarks: number
  passMarks: number
  marksObtained: number | null
  isAbsent: boolean
  gradeLabel?: string | null
}

export interface ChildResult {
  studentId: string
  studentName: string
  gradeName?: string
  sectionName?: string
  rollNumber: string
  scheduleId: string
  scheduleName: string
  subjects: SubjectResult[]
  totalMarks: number
  totalMaxMarks: number
  percentage: number | null
  gradeLabel: string
  isPassed: boolean | null
}

export interface ExamResult {
  examId: string
  examName: string
  examType: string
  children: ChildResult[]
}

// --- Fees types ---

export interface FeeHeadDetail {
  feeHeadId: string
  feeHeadName: string
  actualAmount: number
  negotiatedAmount: number
}

export interface PaymentRefund {
  amount: number
  reason: string
  refundDate: string
}

export interface FeePaymentEntry {
  id: string
  amountPaid: number
  paymentDate: string
  paymentMethod: string
  status: string
  transactionId?: string | null
  feeHeadName: string | null
  termName: string | null
  refunds: PaymentRefund[]
}

export interface ChildFee {
  studentId: string
  studentName: string
  gradeName?: string
  sectionName?: string
  rollNumber: string
  totalNegotiatedFee: number
  totalActualFee: number
  totalPaid: number
  totalRefunded: number
  balance: number
  nextDueDate: string | null
  feeHeads: FeeHeadDetail[]
  payments: FeePaymentEntry[]
  isEmpty: boolean
}

// --- Leave types ---

export interface LeaveApprovalStep {
  id: string
  status: string
  level: number
  remarks?: string | null
  decidedAt?: string | null
}

export interface ChildLeaveRequest {
  id: string
  studentId: string
  studentName: string
  gradeName?: string
  sectionName?: string
  leaveCategoryName: string
  startDate: string
  endDate: string
  startFraction: string
  endFraction: string
  reason: string
  status: string
  calculatedDays: number
  approvals: LeaveApprovalStep[]
  createdAt: string
}

export function useChildrenLeave() {
  return useQuery({
    queryKey: ["parent-children-leave"],
    queryFn: async () => {
      const response = await parentsApi.getMyChildrenLeave()
      return (response.data ?? []) as ChildLeaveRequest[]
    },
    staleTime: 2 * 60 * 1000,
  })
}

export interface LeaveCategory {
  id: string
  name: string
  applicantType: string
  maxDaysPerYear?: number
}

export function useLeaveCategories() {
  return useQuery({
    queryKey: ["leave-categories", "student"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<LeaveCategory[]>>("/leave/categories?applicantType=student")
      return response.data ?? []
    },
    staleTime: 10 * 60 * 1000,
  })
}

// --- Store types ---

export interface StoreOrderItem {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
}

export interface ChildStoreOrder {
  id: string
  studentId: string
  studentName: string
  gradeName?: string
  sectionName?: string
  orderNumber: string
  status: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  dueAmount: number
  items: StoreOrderItem[]
  createdAt: string
}

export function useChildrenStoreOrders() {
  return useQuery({
    queryKey: ["parent-children-store-orders"],
    queryFn: async () => {
      const response = await parentsApi.getMyChildrenStoreOrders()
      return (response.data ?? []) as ChildStoreOrder[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

export function useChildrenFees() {
  return useQuery({
    queryKey: ["parent-children-fees"],
    queryFn: async () => {
      const response = await parentsApi.getMyChildrenFees()
      return (response.data ?? []) as ChildFee[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

export function useChildrenResults(examId?: string) {
  return useQuery({
    queryKey: ["parent-children-results", examId ?? "all"],
    queryFn: async () => {
      const response = await parentsApi.getMyChildrenResults(examId)
      return (response.data ?? []) as ExamResult[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
