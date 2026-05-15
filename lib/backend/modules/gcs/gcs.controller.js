import * as gcsService from "./gcs.service.js";
import responseHandler from "../../utils/responseHandler.js";

// API to update CORS settings for a GCS bucket
export const updateCors = async (req, res) => {
  try {
    const { cors } = req.body;
    if (!cors) {
      return responseHandler(
        res,
        "error",
        null,
        "Missing required parameters."
      );
    }
    const bucketName = process.env.GCS_BUCKET_NAME;
    const result = await gcsService.configureBucketCors(bucketName, cors);
    return responseHandler(
      res,
      "success",
      result,
      "CORS settings updated successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};

export const viewBucketMetadata = async (req, res) => {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      return responseHandler(
        res,
        "error",
        null,
        "Missing required parameters."
      );
    }

    const metadata = await gcsService.getBucketMetadata(bucketName);
    return responseHandler(
      res,
      "success",
      metadata,
      "Bucket metadata retrieved successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};
