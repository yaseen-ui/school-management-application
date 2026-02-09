import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { uploadsApi } from "@/lib/api/uploads"
import { toast } from "@/components/ui/sonner"
import { useAuthStore } from "@/stores/auth-store"

export function useUpload() {
  const queryClient = useQueryClient()
  const tenantInfo = useAuthStore((state) => state.tenantInfo)

  const uploadFile = useMutation({
    mutationFn: async ({
      file,
      category,
      entityId,
      documentType,
      onProgress,
    }: {
      file: File
      category: string
      entityId: string
      documentType: string
      onProgress?: (progress: number) => void
    }) => {
      if (!tenantInfo?.id) {
        throw new Error("Tenant ID not found")
      }

      console.log("[v0] Starting upload process:", { category, entityId, documentType })

      // Step 1: Get presigned URL
      onProgress?.(10)
      const { data: urlData } = await uploadsApi.getPresignedUrl({
        tenantId: tenantInfo.id,
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
        tenantId: tenantInfo.id,
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

export function useGetUploads(category: string, entityId: string) {
  const tenantInfo = useAuthStore((state) => state.tenantInfo)

  return useQuery({
    queryKey: ["uploads", tenantInfo?.id, category, entityId],
    queryFn: async () => {
      if (!tenantInfo?.id) throw new Error("Tenant ID not found")
      const response = await uploadsApi.getUploads(tenantInfo.id, category, entityId)
      return response.data
    },
    enabled: !!tenantInfo?.id && !!category && !!entityId,
  })
}

export function useGetUpload(category: string, entityId: string, documentType: string) {
  const tenantInfo = useAuthStore((state) => state.tenantInfo)

  return useQuery({
    queryKey: ["upload", tenantInfo?.id, category, entityId, documentType],
    queryFn: async () => {
      if (!tenantInfo?.id) throw new Error("Tenant ID not found")
      const response = await uploadsApi.getUpload(tenantInfo.id, category, entityId, documentType)
      return response.data
    },
    enabled: !!tenantInfo?.id && !!category && !!entityId && !!documentType,
  })
}

export function useDeleteUpload() {
  const queryClient = useQueryClient()
  const tenantInfo = useAuthStore((state) => state.tenantInfo)

  return useMutation({
    mutationFn: async ({
      category,
      entityId,
      fileId,
    }: {
      category: string
      entityId: string
      fileId: string
    }) => {
      if (!tenantInfo?.id) throw new Error("Tenant ID not found")
      await uploadsApi.deleteUpload(tenantInfo.id, category, entityId, fileId)
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
