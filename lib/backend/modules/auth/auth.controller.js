import AuthService from "./auth.service.js";
import responseHandler from "../../utils/responseHandler.js";
import { prisma } from "../../lib/prisma.js";

class AuthController {
  /**
   * Login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      return responseHandler(res, "success", { token, user }, "Login successful.");
    } catch (error) {
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Logout — blacklist JWT
   */
  static async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return responseHandler(res, "fail", null, "No token provided.");
      }

      // Add token to blacklist (token is UNIQUE in schema)
      await prisma.tokenBlacklist.create({
        data: {
          token,
          expiredAt: new Date(), // maps to DB column `expired_at`
        },
      });

      return responseHandler(res, "success", null, "Logout successful.");
    } catch (error) {
      console.log(error);
      return responseHandler(res, "fail", null, "Error logging out.");
    }
  }
}

export default AuthController;
