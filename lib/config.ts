// Environment configuration for multi-tenant app
export const config = {
  hostType: (process.env.NEXT_PUBLIC_HOST_TYPE || "tenant") as "company" | "tenant",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  isCompanyHost: process.env.NEXT_PUBLIC_HOST_TYPE === "company",
  isTenantHost: process.env.NEXT_PUBLIC_HOST_TYPE !== "company",
}
