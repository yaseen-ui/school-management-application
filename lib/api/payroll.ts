import { apiClient } from "./client"

// ─── Salary Components ──────────────────────────────────────────────────────

export async function listSalaryComponents() {
  const res = await apiClient.get("/payroll/salary-components")
  return res.data
}

export async function getSalaryComponent(id: string) {
  const res = await apiClient.get(`/payroll/salary-components/${id}`)
  return res.data
}

export async function createSalaryComponent(data: {
  name: string
  description?: string
  type: string
  isActive?: boolean
  sortOrder?: number
}) {
  const res = await apiClient.post("/payroll/salary-components", data)
  return res.data
}

export async function updateSalaryComponent(id: string, data: {
  name?: string
  description?: string
  type?: string
  isActive?: boolean
  sortOrder?: number
}) {
  const res = await apiClient.put(`/payroll/salary-components/${id}`, data)
  return res.data
}

export async function deleteSalaryComponent(id: string) {
  const res = await apiClient.delete(`/payroll/salary-components/${id}`)
  return res.data
}

// ─── Employee Compensation ──────────────────────────────────────────────────

export async function listEmployeeCompensations() {
  const res = await apiClient.get("/payroll/compensations")
  return res.data
}

export async function getEmployeeCompensation(employeeId: string) {
  const res = await apiClient.get(`/payroll/compensations/${employeeId}`)
  return res.data
}

export async function upsertEmployeeCompensation(employeeId: string, data: {
  effectiveFrom: string
  components: Array<{ salaryComponentId: string; value: number }>
}) {
  const res = await apiClient.put(`/payroll/compensations/${employeeId}`, data)
  return res.data
}

export async function getCompensationHistory(employeeId: string) {
  const res = await apiClient.get(`/payroll/compensations/${employeeId}/history`)
  return res.data
}

// ─── Payroll Batches ────────────────────────────────────────────────────────

export async function listPayrollBatches() {
  const res = await apiClient.get("/payroll/batches")
  return res.data
}

export async function getPayrollBatch(id: string) {
  const res = await apiClient.get(`/payroll/batches/${id}`)
  return res.data
}

export async function createOrGetPayrollBatch(data: { month: number; year: number }) {
  const res = await apiClient.post("/payroll/batches", data)
  return res.data
}

export async function populatePayrollBatch(id: string) {
  const res = await apiClient.post(`/payroll/batches/${id}/populate`)
  return res.data
}

export async function submitPayrollBatch(id: string) {
  const res = await apiClient.post(`/payroll/batches/${id}/submit`)
  return res.data
}

// ─── Payroll Records ────────────────────────────────────────────────────────

export async function updatePayrollRecord(id: string, data: {
  paidAmount?: number
  status?: string
  paymentMethod?: string
}) {
  const res = await apiClient.put(`/payroll/records/${id}`, data)
  return res.data
}

export async function bulkUpdatePayrollRecords(batchId: string, records: Array<{
  id: string
  paidAmount?: number
  status?: string
  paymentMethod?: string
}>) {
  const res = await apiClient.put(`/payroll/batches/${batchId}/bulk-update`, { records })
  return res.data

}
