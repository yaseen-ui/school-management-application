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
 * Generate a signed URL for file upload to Google Cloud Storage.
 */
export const getPresignedUrl = async (tenantId, category, filePath, mimeType) => {
  const fileParts = filePath.split(".");
  const extension = fileParts.pop();
  const filename = fileParts.join(".");
  const timestamp = Date.now();

  // Construct the new file path
  const newFilename = `${filename}_${timestamp}.${extension}`;
  const fullPath = `${tenantId}/${category}/${newFilename}`;

  const file = bucket.file(fullPath);

  // Generate a signed URL for PUT operation
  const [url] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
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
  tenantId,
  category,
  entityId,
  documentType,
  gcsUrl
) => {
  // If you later add a filename column, we can parse & store it here.
  return prisma.upload.create({
    data: {
      tenantId: tenantId,
      category,
      entityId: entityId,
      documentType: documentType,
      s3Url: gcsUrl, // maps to DB column s3_url
      // uploadedAt defaults to now() in schema
    },
  });
};

/**
 * Get all files for an entity.
 */
export const getFiles = async (tenantId, category, entityId) => {
  return prisma.upload.findMany({
    where: { tenantId: tenantId, category, entityId: entityId },
    orderBy: { uploadedAt: "desc" },
  });
};

/**
 * Get a specific file by document type.
 */
export const getSpecificFile = async (
  tenantId,
  category,
  entityId,
  documentType
) => {
  return prisma.upload.findFirst({
    where: { tenantId: tenantId, category, entityId: entityId, documentType: documentType },
  });
};

/**
 * Delete a file from Google Cloud Storage and remove its record from the database.
 */
export const deleteFile = async (tenantId, category, entityId, fileId) => {
  const fileRecord = await prisma.upload.findFirst({
    where: { tenantId: tenantId, category, entityId: entityId, id: fileId },
    select: { id: true, s3Url: true },
  });
  if (!fileRecord) throw new Error("File not found");

  const prefix = `https://storage.googleapis.com/${bucketName}/`;
  const gcsKey = fileRecord.s3Url.startsWith(prefix)
    ? fileRecord.s3Url.slice(prefix.length)
    : null;

  if (!gcsKey) {
    // Defensive: if URL wasn't in expected format, avoid accidental deletes
    throw new Error("Stored file URL is invalid");
  }

  // Delete from GCS
  await bucket.file(gcsKey).delete();

  // Delete DB record
  await prisma.upload.delete({ where: { id: fileRecord.id } });

  return { success: true };
};
