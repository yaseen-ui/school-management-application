// src/modules/uploads/upload.service.js  (Prisma version)
import { Storage } from "@google-cloud/storage";
import { prisma } from "../../lib/prisma.js";
import { v4 as uuidv4 } from "uuid";

// Initialize GCS
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GCS_SERVICE_ACCOUNT_PATH,
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

/**
 * Resolve the GCS folder path prefix based on upload context.
 * For company uploads, returns "company". For tenant uploads, returns tenantId.
 */
const resolveGcsPrefix = (uploadFor, tenantId) => {
  if (uploadFor === "company") return "company";
  if (tenantId) return tenantId;
  throw new Error("uploadFor or tenantId is required");
};

/**
 * Resolve the DB tenantId value.
 * For company uploads (no tenant FK), returns null.
 * For tenant uploads, returns the tenantId UUID.
 */
const resolveDbTenantId = (uploadFor, tenantId) => {
  if (uploadFor === "company") return null;
  if (tenantId) return tenantId;
  throw new Error("uploadFor or tenantId is required");
};

/**
 * Generate a signed URL for file upload to Google Cloud Storage.
 */
export const getPresignedUrl = async (uploadFor, tenantId, category, filePath, mimeType) => {
  const fileParts = filePath.split(".");
  const extension = fileParts.pop();
  const filename = fileParts.join(".");
  const timestamp = Date.now();

  const prefix = resolveGcsPrefix(uploadFor, tenantId);
  const fullPath = `${prefix}/${category}/${fileParts.join(".")}_${timestamp}.${extension}`;

  const file = bucket.file(fullPath);

  const [url] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 10 * 60 * 1000,
    contentType: mimeType,
  });

  return {
    uploadUrl: url,
    fileUrl: `https://storage.googleapis.com/${bucketName}/${fullPath}`,
  };
};

/**
 * Store file metadata in the database after successful upload.
 */
export const storeFileMetadata = async (
  uploadFor,
  tenantId,
  category,
  entityId,
  documentType,
  gcsUrl
) => {
  return prisma.upload.create({
    data: {
      tenantId: resolveDbTenantId(uploadFor, tenantId),
      entityType: category,
      entityId: entityId,
      documentType: documentType,
      fileUrl: gcsUrl,
    },
  });
};

/**
 * Get all files for an entity.
 */
export const getFiles = async (uploadFor, tenantId, category, entityId) => {
  const dbTenantId = resolveDbTenantId(uploadFor, tenantId);
  return prisma.upload.findMany({
    where: { tenantId: dbTenantId, entityType: category, entityId: entityId },
    orderBy: { uploadedAt: "desc" },
  });
};

/**
 * Get a specific file by document type.
 */
export const getSpecificFile = async (
  uploadFor,
  tenantId,
  category,
  entityId,
  documentType
) => {
  const dbTenantId = resolveDbTenantId(uploadFor, tenantId);
  return prisma.upload.findFirst({
    where: { tenantId: dbTenantId, entityType: category, entityId: entityId, documentType: documentType },
  });
};

/**
 * Delete a file from Google Cloud Storage and remove its record from the database.
 */
export const deleteFile = async (uploadFor, tenantId, category, entityId, fileId) => {
  const dbTenantId = resolveDbTenantId(uploadFor, tenantId);
  const fileRecord = await prisma.upload.findFirst({
    where: { tenantId: dbTenantId, entityType: category, entityId: entityId, id: fileId },
    select: { id: true, fileUrl: true },
  });
  if (!fileRecord) throw new Error("File not found");

  const prefix = `https://storage.googleapis.com/${bucketName}/`;
  const gcsKey = fileRecord.fileUrl.startsWith(prefix)
    ? fileRecord.fileUrl.slice(prefix.length)
    : null;

  if (!gcsKey) {
    throw new Error("Stored file URL is invalid");
  }

  await bucket.file(gcsKey).delete();
  await prisma.upload.delete({ where: { id: fileRecord.id } });

  return { success: true };
};