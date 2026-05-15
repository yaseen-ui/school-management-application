import * as uploadService from "./uploads.service.js";
import responseHandler from "../../utils/responseHandler.js";

export const getPresignedUrl = async (req, res) => {
  try {
    const { tenantId, category, path, mimeType } = req.body;
    if (!tenantId || !category || !path || !mimeType) {
      return responseHandler(res, "error", null, "Missing required fields.");
    }

    const urlData = await uploadService.getPresignedUrl(
      tenantId,
      category,
      path,
      mimeType
    );

    return responseHandler(
      res,
      "success",
      urlData,
      "Pre-signed URL generated successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};

export const storeFileMetadata = async (req, res) => {
  try {
    const { tenantId, category, entityId, documentType, gcsUrl } = req.body;
    if (!tenantId || !category || !entityId || !documentType || !gcsUrl) {
      return responseHandler(res, "error", null, "Missing required fields.");
    }

    const storedFile = await uploadService.storeFileMetadata(
      tenantId,
      category,
      entityId,
      documentType,
      gcsUrl
    );

    return responseHandler(
      res,
      "success",
      storedFile,
      "File metadata stored successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};

export const getFiles = async (req, res) => {
  try {
    const { tenantId, category, entityId } = req.params;
    if (!tenantId || !category || !entityId) {
      return responseHandler(
        res,
        "error",
        null,
        "Missing required parameters."
      );
    }

    const files = await uploadService.getFiles(tenantId, category, entityId);
    return responseHandler(
      res,
      "success",
      files,
      "Files retrieved successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};

export const getSpecificFile = async (req, res) => {
  try {
    const { tenantId, category, entityId, documentType } = req.params;
    if (!tenantId || !category || !entityId || !documentType) {
      return responseHandler(
        res,
        "error",
        null,
        "Missing required parameters."
      );
    }

    const file = await uploadService.getSpecificFile(
      tenantId,
      category,
      entityId,
      documentType
    );

    if (!file) {
      return responseHandler(res, "error", null, "File not found.");
    }

    return responseHandler(
      res,
      "success",
      file,
      "File retrieved successfully."
    );
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { tenantId, category, entityId, fileId } = req.params;
    if (!tenantId || !category || !entityId || !fileId) {
      return responseHandler(
        res,
        "error",
        null,
        "Missing required parameters."
      );
    }

    await uploadService.deleteFile(tenantId, category, entityId, fileId);
    return responseHandler(res, "success", null, "File deleted successfully.");
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};
