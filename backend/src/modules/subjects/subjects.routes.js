/**
 * @fileoverview Subjects API Routes
 * @description Defines all REST API endpoints for managing subjects in the school management system.
 * All routes require authentication and tenant validation.
 * 
 * @module subjects.routes
 * @requires express
 * @requires ./subjects.controller.js
 * @requires ../../middlewares/authenticate.js
 * @requires ../../middlewares/authenticateTenant.js
 */

/**
 * POST /api/subjects
 * @description Create a new subject
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Subject name
 * @param {string} req.body.code - Subject code
 * @param {string} req.body.description - Subject description
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Object} Created subject object with id
 * @example
 * POST /api/subjects
 * Content-Type: application/json
 * Authorization: Bearer <token>
 * 
 * {
 *   "name": "Mathematics",
 *   "code": "MATH101",
 *   "description": "Basic Mathematics"
 * }
 */

/**
 * GET /api/subjects
 * @description Retrieve all subjects for the authenticated tenant
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Array} Array of subject objects
 * @example
 * GET /api/subjects
 * Authorization: Bearer <token>
 */

/**
 * GET /api/subjects/:id
 * @description Retrieve a specific subject by ID
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Subject ID
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Object} Subject object
 * @example
 * GET /api/subjects/123
 * Authorization: Bearer <token>
 */

/**
 * PUT /api/subjects/:id
 * @description Update an existing subject
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Subject ID
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Subject name
 * @param {string} [req.body.code] - Subject code
 * @param {string} [req.body.description] - Subject description
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Object} Updated subject object
 * @example
 * PUT /api/subjects/123
 * Content-Type: application/json
 * Authorization: Bearer <token>
 * 
 * {
 *   "name": "Advanced Mathematics"
 * }
 */

/**
 * DELETE /api/subjects/:id
 * @description Delete a subject
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Subject ID
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Object} Success message or deleted subject confirmation
 * @example
 * DELETE /api/subjects/123
 * Authorization: Bearer <token>
 */

/**
 * GET /api/subjects/course/:courseId
 * @description Retrieve all subjects associated with a specific course
 * @access Private - Requires authentication and valid tenant
 * @param {Object} req - Express request object
 * @param {string} req.params.courseId - Course ID
 * @param {string} req.user - Authenticated user from token
 * @param {string} req.tenant - Tenant information
 * @returns {Array} Array of subject objects for the course
 * @example
 * GET /api/subjects/course/456
 * Authorization: Bearer <token>
 */
import express from "express";
import SubjectsController from "./subjects.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

router.post("/", SubjectsController.createSubject);
router.get("/", SubjectsController.getSubjects);
router.put("/:id", SubjectsController.updateSubject);
router.get("/:id", SubjectsController.getSubjectById);
router.delete("/:id", SubjectsController.deleteSubject);

router.get("/course/:courseId", SubjectsController.getSubjectsByCourse);

export default router;
