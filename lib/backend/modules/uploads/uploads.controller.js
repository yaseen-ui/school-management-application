import * as uploadService from "./uploads.service.js";
import responseHandler from "../../utils/responseHandler.js";

export const getPresignedUrl = async (req, res) => {
  try {
    const { uploadFor, tenantId, category, path, mimeType } = req.body;
    if ((!uploadFor && !tenantId) || !category || !path || !mimeType) {
      return responseHandler(res, "error", null, "uploadFor or tenantId is required, along with category, path, and mimeType.");
    }

    const urlData = await uploadService.getPresignedUrl(
      uploadFor,
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
    const { uploadFor, tenantId, category, entityId, documentType, gcsUrl } = req.body;
    if ((!uploadFor && !tenantId) || !category || !entityId || !documentType || !gcsUrl) {
      return responseHandler(res, "error", null, "uploadFor or tenantId is required, along with category, entityId, documentType, and gcsUrl.");
    }

    const storedFile = await uploadService.storeFileMetadata(
      uploadFor,
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
    const { uploadFor, tenantId, category, entityId } = { ...req.params, ...req.query };
    if ((!uploadFor && !tenantId) || !category || !entityId) {
      return responseHandler(
        res,
        "error",
        null,
        "uploadFor or tenantId is required, along with category and entityId."
      );
    }

    const files = await uploadService.getFiles(uploadFor, tenantId, category, entityId);
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
    const { uploadFor, tenantId, category, entityId, documentType } = { ...req.params, ...req.query };
    if ((!uploadFor && !tenantId) || !category || !entityId || !documentType) {
      return responseHandler(
        res,
        "error",
        null,
        "uploadFor or tenantId is required, along with category, entityId, and documentType."
      );
    }

    const file = await uploadService.getSpecificFile(
      uploadFor,
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
    const { uploadFor, tenantId, category, entityId, fileId } = { ...req.params, ...req.query };
    if ((!uploadFor && !tenantId) || !category || !entityId || !fileId) {
      return responseHandler(
        res,
        "error",
        null,
        "uploadFor or tenantId is required, along with category, entityId, and fileId."
      );
    }

    await uploadService.deleteFile(uploadFor, tenantId, category, entityId, fileId);
    return responseHandler(res, "success", null, "File deleted successfully.");
  } catch (error) {
    return responseHandler(res, "error", null, error.message);
  }
};
