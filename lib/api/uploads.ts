import { apiClient } from "./client"

export interface PresignedUrlRequest {
  tenantId: string
  category: string
  path: string
  mimeType: string
}

export interface PresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
}

export interface StoreMetadataRequest {
  tenantId: string
  category: string
  entityId: string
  documentType: string
  gcsUrl: string
}

export interface Upload {
  id: string
  tenantId: string
  category: string
  entityId: string
  documentType: string
  s3Url: string
  uploadedAt: string
}

export interface GetUploadsResponse {
  success: boolean
  data: Upload[]
  message: string
}

export interface GetUploadResponse {
  success: boolean
  data: Upload
  message: string
}

export const uploadsApi = {
  // Get presigned URL for direct GCS upload
  getPresignedUrl: async (data: PresignedUrlRequest) => {
    return apiClient.post<{ data: PresignedUrlResponse }>("/uploads/presigned-url", data)
  },

  // Upload file directly to GCS using presigned URL
  uploadToGCS: async (uploadUrl: string, file: File) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    })

    if (!response.ok) {
      throw new Error("Upload to GCS failed")
    }

    return response
  },

  // Store file metadata in database
  storeMetadata: async (data: StoreMetadataRequest) => {
    return apiClient.post<{ data: Upload }>("/uploads/", data)
  },

  // Get all uploads for an entity
  getUploads: async (tenantId: string, category: string, entityId: string) => {
    return apiClient.get<GetUploadsResponse>(`/uploads/${tenantId}/${category}/${entityId}`)
  },

  // Get specific upload by document type
  getUpload: async (tenantId: string, category: string, entityId: string, documentType: string) => {
    return apiClient.get<GetUploadResponse>(`/uploads/${tenantId}/${category}/${entityId}/${documentType}`)
  },

  // Delete upload
  deleteUpload: async (tenantId: string, category: string, entityId: string, fileId: string) => {
    return apiClient.delete(`/uploads/${tenantId}/${category}/${entityId}/${fileId}`)
  },
}
