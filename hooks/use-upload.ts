import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { uploadsApi } from "@/lib/api/uploads"
import { toast } from "@/components/ui/sonner"
import { useAuthStore } from "@/stores/auth-store"

export function useUpload() {
  const queryClient = useQueryClient()
  const tenantInfo = useAuthStore((state) => state.tenantInfo)
  const user = useAuthStore((state) => state.user)

  const uploadFile = useMutation({
    mutationFn: async ({
      file,
      category,
      entityId,
      documentType,
      uploadFor,
      onProgress,
    }: {
      file: File
      category: string
      entityId: string
      documentType: string
      uploadFor?: "company"
      onProgress?: (progress: number) => void
    }) => {
      // Determine the upload context:
      // 1. Explicit uploadFor="company" — company-level upload
      // 2. user.userType === "company" — auto-detect company user (no tenant)
      // 3. Otherwise — tenant upload, requires tenantInfo.id
      const isCompanyUpload = uploadFor === "company" || user?.userType === "company"
      const tenantId = isCompanyUpload ? undefined : tenantInfo?.id

      if (!isCompanyUpload && !tenantId) {
        throw new Error("Tenant ID not found. Provide uploadFor='company' for company-level uploads.")
      }

      console.log("[v0] Starting upload process:", { category, entityId, documentType, uploadFor, isCompanyUpload })

      // Step 1: Get presigned URL
      onProgress?.(10)
      const { data: urlData } = await uploadsApi.getPresignedUrl({
        uploadFor: isCompanyUpload ? "company" : undefined,
        tenantId: tenantId ?? undefined,
        category,
        path: file.name,
        mimeType: file.type,
      })

      console.log("[v0] Got presigned URL:", urlData.fileUrl)

      // Step 2: Upload to GCS
      onProgress?.(30)
      await uploadsApi.uploadToGCS(urlData.uploadUrl, file)
      console.log("[v0] Uploaded to GCS successfully")

      onProgress?.(70)

      // Step 3: Store metadata
      const { data: metadata } = await uploadsApi.storeMetadata({
        uploadFor: isCompanyUpload ? "company" : undefined,
        tenantId: tenantId ?? undefined,
        category,
        entityId,
        documentType,
        gcsUrl: urlData.fileUrl,
      })

      console.log("[v0] Stored metadata:", metadata)
      onProgress?.(100)

      return metadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] })
      toast.success("File uploaded successfully")
    },
    onError: (error: Error) => {
      console.error("[v0] Upload error:", error)
      toast.error(error.message || "Failed to upload file")
    },
  })

  return { uploadFile }
}

export function useGetUploads(category: string, entityId: string, uploadFor?: "company") {
  const tenantInfo = useAuthStore((state) => state.tenantInfo)
  const user = useAuthStore((state) => state.user)
  const isCompanyUpload = uploadFor === "company" || user?.userType === "company"
  const tenantId: string | null = isCompanyUpload ? null : (tenantInfo?.id ?? null)

  return useQuery({
    queryKey: ["uploads", uploadFor || tenantId, category, entityId],
    queryFn: async () => {
      if (!isCompanyUpload && !tenantId) throw new Error("Tenant ID not found")
      const response = await uploadsApi.getUploads(tenantId, category, entityId, uploadFor || (isCompanyUpload ? "company" : undefined))
      return response.data
    },
    enabled: (!!isCompanyUpload || !!tenantId) && !!category && !!entityId,
  })
}

export function useGetUpload(category: string, entityId: string, documentType: string, uploadFor?: "company") {
  const tenantInfo = useAuthStore((state) => state.tenantInfo)
  const user = useAuthStore((state) => state.user)
  const isCompanyUpload = uploadFor === "company" || user?.userType === "company"
  const tenantId: string | null = isCompanyUpload ? null : (tenantInfo?.id ?? null)

  return useQuery({
    queryKey: ["upload", uploadFor || tenantId, category, entityId, documentType],
    queryFn: async () => {
      if (!isCompanyUpload && !tenantId) throw new Error("Tenant ID not found")
      const response = await uploadsApi.getUpload(tenantId, category, entityId, documentType, uploadFor || (isCompanyUpload ? "company" : undefined))
      return response.data
    },
    enabled: (!!isCompanyUpload || !!tenantId) && !!category && !!entityId && !!documentType,
  })
}

export function useDeleteUpload() {
  const queryClient = useQueryClient()
  const tenantInfo = useAuthStore((state) => state.tenantInfo)
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: async ({
      category,
      entityId,
      fileId,
      uploadFor,
    }: {
      category: string
      entityId: string
      fileId: string
      uploadFor?: "company"
    }) => {
      const isCompanyUpload = uploadFor === "company" || user?.userType === "company"
      const tenantId: string | null = isCompanyUpload ? null : (tenantInfo?.id ?? null)
      if (!isCompanyUpload && !tenantId) throw new Error("Tenant ID not found")
      await uploadsApi.deleteUpload(tenantId, category, entityId, fileId, uploadFor || (isCompanyUpload ? "company" : undefined))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] })
      queryClient.invalidateQueries({ queryKey: ["upload"] })
      toast.success("File deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete file")
    },
  })
}