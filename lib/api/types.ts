// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
    user: User
  }
}

export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  userType: "tenant" | "company"
  tenantId?: string
  roleId: string
  otp?: string | null
  isFirstLogin: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  role: string
  userType: "tenant" | "company"
  tenantId?: string
  createdAt: string
  updatedAt: string
}

// Tenant Types
export interface Tenant {
  id: string
  schoolName: string
  domain?: string | null
  logo?: string | null
  caption?: string | null
  contactAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  contactPhone: string
  contactEmail: string
  adminFullName?: string
  adminPhone?: string
  adminEmail: string
  subscriptionPlan: "basic" | "standard" | "premium"
  status?: "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  status: string
  data: T
  message: string
}

export interface TenantListData {
  rows: Tenant[]
  columns: {
    field: string
    headerName: string
    type?: string
  }[]
}

export interface CreateTenantRequest {
  schoolName: string
  domain: string
  caption: string
  logo?: string // Added optional logo field for tenant logo URL
  contactAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  contactPhone: string
  contactEmail: string
  adminFullName: string
  adminPhone: string
  adminEmail: string
  subscriptionPlan: "basic" | "standard" | "premium"
}

export interface UpdateTenantRequest {
  schoolName?: string
  domain?: string
  caption?: string
  logo?: string // Added optional logo field for updating tenant logo
  contactAddress?: {
    street: string
    city: string
    state: string
    zip: string
  }
  contactPhone?: string
  contactEmail?: string
  adminFullName?: string
  adminPhone?: string
  adminEmail?: string
  subscriptionPlan?: "basic" | "standard" | "premium"
  status?: "active" | "inactive" | "suspended"
}

// Domain Resolution
export interface DomainResolveRequest {
  domain: string
}

export interface DomainResolveResponse {
  id: string
  schoolName: string
  contactAddress: {
    zip: string
    city: string
    state: string
    street: string
  }
  contactPhone: string
  contactEmail: string
  adminEmail: string
  subscriptionPlan: string
  domain: string | null
  logo: string | null
  caption: string | null
  createdAt: string
  updatedAt: string
}

// User Management Types
export interface CreateUserRequest {
  email: string
  fullName: string
  phone: string
  password: string
  roleId: string
}

export interface CreateCompanyUserRequest {
  fullName: string
  email: string
  password: string
  userType: "company"
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Role & Permission Types
export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: "create" | "read" | "update" | "delete" | "manage"
}

// Student Types
export interface Student {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  admissionNumber: string
  admissionDate: string
  gradeId: string
  sectionId: string
  parentName: string
  parentPhone: string
  parentEmail?: string
  address: string
  status: "active" | "inactive" | "graduated" | "transferred"
  createdAt: string
  updatedAt: string
}

// Course Types
export interface Course {
  id: string
  name: string
  code: string
  description?: string
  credits?: number
  gradeId: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Subject Types
export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  courseId: string
  credits?: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Section Types
export interface Section {
  id: string
  name: string
  gradeId: string
  capacity: number
  classTeacherId?: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Grade Types
export interface Grade {
  id: string
  name: string
  description?: string
  order: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Password Management Types
export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface ForgetPasswordRequest {
  email: string
}

export interface ResetPasswordWithOTPRequest {
  email: string
  otp: string
  newPassword: string
}
