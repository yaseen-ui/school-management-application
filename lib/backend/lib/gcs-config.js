/**
 * Shared Google Cloud Storage configuration helper.
 *
 * Supports two modes for providing service account credentials:
 * 1. Production (Vercel/serverless): GCS_SERVICE_ACCOUNT_JSON env var (base64-encoded JSON key)
 * 2. Local development: GCS_SERVICE_ACCOUNT_PATH env var (file path to JSON key)
 *
 * The base64 approach avoids committing the secret key file to Git and works
 * on read-only filesystems like Vercel.
 */

import { Storage } from "@google-cloud/storage";

/**
 * Resolve GCS service account credentials from environment.
 * Tries GCS_SERVICE_ACCOUNT_JSON (base64) first, then falls back to
 * GCS_SERVICE_ACCOUNT_PATH (file).
 *
 * @returns {Storage} Configured Storage instance
 */
export function createStorage() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT_ID environment variable is not set"
    );
  }

  // Production: base64-encoded JSON key stored as env var
  if (process.env.GCS_SERVICE_ACCOUNT_JSON) {
    try {
      const decoded = Buffer.from(
        process.env.GCS_SERVICE_ACCOUNT_JSON,
        "base64"
      ).toString("utf-8");
      const credentials = JSON.parse(decoded);

      return new Storage({
        projectId,
        credentials,
      });
    } catch (error) {
      throw new Error(
        `Failed to parse GCS_SERVICE_ACCOUNT_JSON: ${error.message}`
      );
    }
  }

  // Local dev: file path to JSON key
  if (process.env.GCS_SERVICE_ACCOUNT_PATH) {
    return new Storage({
      projectId,
      keyFilename: process.env.GCS_SERVICE_ACCOUNT_PATH,
    });
  }

  throw new Error(
    "No GCS credentials found. Set either GCS_SERVICE_ACCOUNT_JSON (base64, for production) " +
      "or GCS_SERVICE_ACCOUNT_PATH (file path, for local dev)."
  );
}