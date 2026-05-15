import express from "express";
import UserController from "./user.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";
import authenticateCompany from "../../middlewares/authenticateCompany.js";

const router = express.Router();

// Company-related routes
router.post(
  "/company",
  // authenticate,
  // authenticateCompany,
  UserController.createCompanyUser
);
router.get(
  "/company",
  // authenticate,
  // authenticateCompany,
  UserController.getAllCompanyUsers
);

// Tenant-specific user routes
router.post("/", authenticate, authenticateTenant, UserController.createUser);
router.get("/", authenticate, authenticateTenant, UserController.getAllUsers);
router.get(
  "/:id",
  authenticate,
  authenticateTenant,
  UserController.getUserById
);
router.put("/:id", authenticate, authenticateTenant, UserController.updateUser);
router.delete(
  "/:id",
  authenticate,
  authenticateTenant,
  UserController.deleteUser
);

// Actions related to the currently authenticated user
router.put("/me/update-password", authenticate, UserController.updatePassword); // Update password
router.post("/me/forget-password", UserController.forgetPassword); // Send OTP for forget password
router.post("/me/reset-password", UserController.resetPasswordWithOTP); // Reset password using OTP

export default router;
