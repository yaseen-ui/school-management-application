import express from "express";
import * as UploadsController from "./uploads.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateCompany from "../../middlewares/authenticateCompany.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
// router.use(authenticateTenant);
router.use(authenticateCompany);

router.post("/presigned-url", UploadsController.getPresignedUrl);
router.post("/", UploadsController.storeFileMetadata);
router.get("/:tenant_id/:category/:entity_id", UploadsController.getFiles);
router.get(
  "/:tenant_id/:category/:entity_id/:document_type",
  UploadsController.getSpecificFile
);
router.delete(
  "/:tenant_id/:category/:entity_id/:file_id",
  UploadsController.deleteFile
);

export default router;
