import { apiClient } from "./client"
import type {
  User,
  CreateUserRequest,
  CreateCompanyUserRequest,
  UpdatePasswordRequest,
  ForgetPasswordRequest,
  ResetPasswordWithOTPRequest,
  ApiResponse,
} from "./types"

export const usersApi = {
  // Tenant user management
  getAll: (params?: Record<string, string>) => apiClient.get<ApiResponse<User[]>>("/users", params),

  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: CreateUserRequest) => apiClient.post<ApiResponse<User>>("/users", data),

  update: (id: string, data: Partial<CreateUserRequest>) => apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/users/${id}`),

  updatePassword: (id: string, data: UpdatePasswordRequest) =>
    apiClient.put<ApiResponse<null>>(`/users/${id}/password`, data),

  // Company user management
  getAllCompany: (params?: Record<string, string>) => apiClient.get<ApiResponse<User[]>>("/users/company", params),

  createCompany: (data: CreateCompanyUserRequest) => apiClient.post<ApiResponse<User>>("/users/company", data),
}

export const authApi = {
  forgetPassword: (data: ForgetPasswordRequest) => apiClient.post<ApiResponse<null>>("/auth/forget-password", data),

  resetPasswordWithOTP: (data: ResetPasswordWithOTPRequest) =>
    apiClient.post<ApiResponse<null>>("/auth/reset-password-with-otp", data),
}
