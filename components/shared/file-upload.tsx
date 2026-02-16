"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useUpload, useDeleteUpload } from "@/hooks/use-upload"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
  /**
   * Category for organizing uploads (e.g., "students", "teachers", "tenants")
   */
  category: string

  /**
   * Entity ID (e.g., student ID, teacher ID)
   */
  entityId: string

  /**
   * Document type (e.g., "profile_picture", "birth_certificate")
   */
  documentType: string

  /**
   * Existing file URL if already uploaded
   */
  value?: string

  /**
   * Existing file ID for deletion
   */
  fileId?: string

  /**
   * Callback when upload completes successfully
   */
  onUploadComplete?: (url: string) => void

  /**
   * Callback when file is deleted
   */
  onDelete?: () => void

  /**
   * Accepted file types (e.g., "image/*", "application/pdf")
   */
  accept?: string

  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxSize?: number

  /**
   * Custom className for styling
   */
  className?: string

  /**
   * Show as compact mode (smaller upload area)
   */
  compact?: boolean

  /**
   * Disable upload functionality
   */
  disabled?: boolean
}

export function FileUpload({
  category,
  entityId,
  documentType,
  value,
  fileId,
  onUploadComplete,
  onDelete,
  accept = "image/*,application/pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  compact = false,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { uploadFile } = useUpload()
  const deleteUpload = useDeleteUpload()

  const isImage = value?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPDF = value?.match(/\.pdf$/i)
  const isUploading = uploadFile.isPending
  const isDeleting = deleteUpload.isPending

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      alert(`File size must be less than ${sizeMB}MB`)
      return
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map((t) => t.trim())
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const prefix = type.split("/")[0]
        return file.type.startsWith(prefix + "/")
      }
      return file.type === type
    })

    if (!isValidType) {
      alert("File type not supported")
      return
    }

    // Upload file
    uploadFile.mutate(
      {
        file,
        category,
        entityId,
        documentType,
        onProgress: setUploadProgress,
      },
      {
        onSuccess: (data) => {
          onUploadComplete?.(data.s3Url)
          setUploadProgress(0)
        },
      },
    )
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDelete = () => {
    if (!fileId) return

    if (confirm("Are you sure you want to delete this file?")) {
      deleteUpload.mutate(
        { category, entityId, fileId },
        {
          onSuccess: () => {
            onDelete?.()
          },
        },
      )
    }
  }

  const handleView = () => {
    if (value) {
      window.open(value, "_blank")
    }
  }

  if (value && !isUploading) {
    // Show uploaded file preview
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative rounded-lg border-2 border-border bg-muted/30 overflow-hidden",
          compact ? "h-24 w-24" : "h-40 w-full",
          className,
        )}
      >
        {/* Preview */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          {isImage ? (
            <img src={value || "/placeholder.svg"} alt="Uploaded file" className="h-full w-full object-cover" />
          ) : isPDF ? (
            <FileText className="h-12 w-12 text-muted-foreground" />
          ) : (
            <FileText className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button type="button" size="icon" variant="secondary" onClick={handleView} disabled={isDeleting}>
            <Eye className="h-4 w-4" />
          </Button>
          {!disabled && (
            <Button type="button" size="icon" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/30",
          compact ? "h-24 w-24" : "h-40",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "pointer-events-none",
        )}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium">Uploading...</p>
              <Progress value={uploadProgress} className="w-full mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
            >
              {isDragging ? (
                <>
                  <Upload className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-medium">Drop file here</p>
                </>
              ) : (
                <>
                  {accept.includes("image") ? (
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  )}
                  {!compact && (
                    <>
                      <p className="text-sm font-medium">Click or drag file to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                      </p>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
