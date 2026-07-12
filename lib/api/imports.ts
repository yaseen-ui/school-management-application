import { apiClient, ApiError } from "./client";

export interface ImportError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface ImportSummary {
  totalRows: number;
  successful: number;
  failed: number;
}

export interface ImportResponse {
  success: boolean;
  summary: ImportSummary;
  errors: ImportError[];
  enrollmentIds?: string[];
}

/**
 * Upload an Excel/CSV file and import students for a specific section.
 */
export async function importStudents(
  file: File,
  academicYearId: string,
  gradeId: string,
  sectionId: string
): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("academicYearId", academicYearId);
  formData.append("gradeId", gradeId);
  formData.append("sectionId", sectionId);

  const token = apiClient.getToken();
  const tenantId = apiClient.getTenantId();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }

  const baseUrl = apiClient["baseUrl"] || "/api";
  const url = `${baseUrl}/imports/students`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data: ImportResponse = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.errors?.[0]?.error || "Import failed",
      data
    );
  }

  return data;
}