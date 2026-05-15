import express from "express";
import * as GcsController from "./gcs.controller.js";

import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.patch("/update-cors", GcsController.updateCors);
router.get("/view-metadata", GcsController.viewBucketMetadata);

export default router;
