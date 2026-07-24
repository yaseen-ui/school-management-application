import publicationService from "./publication.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

/**
 * PublicationController — Request handlers for the publications API.
 */
class PublicationController {
  /**
   * POST /api/publications — Create a new publication (draft).
   */
  static async create(req, res) {
    try {
      const publication = await publicationService.create(
        req.body,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication created successfully."
      );
    } catch (error) {
      logger.error(`Error creating publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/publications — List publications with optional filters.
   */
  static async list(req, res) {
    try {
      const { type, status, limit, offset, published } = req.query;

      let result;
      if (published === "true") {
        result = await publicationService.getPublished({
          tenantId: req.tenantId,
          type,
          limit: limit ? parseInt(limit) : 50,
          offset: offset ? parseInt(offset) : 0,
        });
      } else {
        result = await publicationService.list({
          tenantId: req.tenantId,
          type,
          status,
          limit: limit ? parseInt(limit) : 50,
          offset: offset ? parseInt(offset) : 0,
        });
      }

      return responseHandler(
        res,
        "success",
        result,
        "Publications retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error listing publications: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/publications/[id] — Get a single publication by ID.
   */
  static async getById(req, res) {
    try {
      const publication = await publicationService.getById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * PATCH /api/publications/[id] — Update a draft publication.
   */
  static async update(req, res) {
    try {
      const publication = await publicationService.update(
        req.params.id,
        req.body,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * DELETE /api/publications/[id] — Delete a draft publication.
   */
  static async delete(req, res) {
    try {
      const result = await publicationService.delete(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        result,
        "Publication deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/submit/[id] — Submit for approval.
   */
  static async submit(req, res) {
    try {
      const publication = await publicationService.submit(
        req.params.id,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication submitted for approval."
      );
    } catch (error) {
      logger.error(`Error submitting publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/approve/[id] — Approve a publication.
   */
  static async approve(req, res) {
    try {
      const publication = await publicationService.approve(
        req.params.id,
        { remarks: req.body.remarks },
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication approved successfully."
      );
    } catch (error) {
      logger.error(`Error approving publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/reject/[id] — Reject a publication.
   */
  static async reject(req, res) {
    try {
      const publication = await publicationService.reject(
        req.params.id,
        { reason: req.body.reason },
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication rejected."
      );
    } catch (error) {
      logger.error(`Error rejecting publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/publish/[id] — Publish an approved publication.
   */
  static async publish(req, res) {
    try {
      const publication = await publicationService.publish(
        req.params.id,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication published successfully."
      );
    } catch (error) {
      logger.error(`Error publishing publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/archive/[id] — Archive a publication.
   */
  static async archive(req, res) {
    try {
      const publication = await publicationService.archive(
        req.params.id,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication archived successfully."
      );
    } catch (error) {
      logger.error(`Error archiving publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/publications/withdraw/[id] — Withdraw a publication.
   */
  static async withdraw(req, res) {
    try {
      const publication = await publicationService.withdraw(
        req.params.id,
        req.tenantId,
        req.userId
      );
      return responseHandler(
        res,
        "success",
        publication,
        "Publication withdrawn successfully."
      );
    } catch (error) {
      logger.error(`Error withdrawing publication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/publications/revisions/[publicationId] — Get revision history.
   */
  static async getRevisions(req, res) {
    try {
      const result = await publicationService.getRevisions(
        req.params.publicationId,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        result,
        "Revisions retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving revisions: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default PublicationController;