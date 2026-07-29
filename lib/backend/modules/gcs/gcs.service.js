import { createStorage } from "../../lib/gcs-config.js";

// Load GCS configuration from environment
// Supports both local dev (GCS_SERVICE_ACCOUNT_PATH) and production (GCS_SERVICE_ACCOUNT_JSON)
const storage = createStorage();

// Function to set CORS for a given bucket
export const configureBucketCors = async (bucketName, corsConfig) => {
  try {
    await storage.bucket(bucketName).setCorsConfiguration(corsConfig);
    return { message: `Bucket ${bucketName} updated with CORS settings.` };
  } catch (error) {
    throw new Error(
      `Failed to update CORS for bucket ${bucketName}: ${error.message}`
    );
  }
};

export const getBucketMetadata = async (bucketName) => {
  try {
    const [metadata] = await storage.bucket(bucketName).getMetadata();
    return metadata; // Returning metadata as JSON
  } catch (error) {
    throw new Error(
      `Failed to retrieve metadata for bucket ${bucketName}: ${error.message}`
    );
  }
};
