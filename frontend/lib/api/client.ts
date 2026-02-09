import { config } from "@/lib/config"

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private tenantId: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  setTenantId(tenantId: string | null) {
    this.tenantId = tenantId
    if (typeof window !== "undefined") {
      if (tenantId) {
        localStorage.setItem("tenantId", tenantId)
      } else {
        localStorage.removeItem("tenantId")
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  getTenantId(): string | null {
    if (this.tenantId) return this.tenantId
    if (typeof window !== "undefined") {
      return localStorage.getItem("tenantId")
    }
    return null
  }

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders)

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    const token = this.getToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const tenantId = this.getTenantId()
    if (tenantId && config.isTenantHost) {
      headers.set("x-tenant-id", tenantId)
    }

    return headers
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return url.toString()
  }

  async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const { params, headers: customHeaders, ...fetchOptions } = options

    const url = this.buildUrl(endpoint, params)
    const headers = this.getHeaders(customHeaders)

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new ApiError(response.status, error.message || "Request failed", error)
    }

    return response.json()
  }

  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient(config.apiBaseUrl)
