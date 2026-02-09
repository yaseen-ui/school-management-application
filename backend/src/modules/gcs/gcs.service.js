import { Storage } from "@google-cloud/storage";

// Load GCS configuration from .env
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GCS_SERVICE_ACCOUNT_PATH,
});

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
