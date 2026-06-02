import AuthService from "./auth.service.js";
import responseHandler from "../../utils/responseHandler.js";
import { prisma } from "../../lib/prisma.js";

// Strip protocol + port, lowercase the host so it can be compared to Tenant.domain.
const extractHostname = (raw) => {
  if (!raw) return null;
  return raw
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0]
    .trim()
    .toLowerCase() || null;
};

// Tenant resolution order:
//   1. Explicit `x-tenant-id` header (API clients, mobile apps).
//   2. Origin/Host header -> Tenant.domain lookup (browser flow on tenant subdomain).
//   3. null -> falls through to company-user login in AuthService.
const resolveTenantId = async (headers) => {
  const explicit = headers["x-tenant-id"];
  if (explicit) return explicit;

  const hostname = extractHostname(headers["origin"]) || extractHostname(headers["host"]);
  if (!hostname) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { domain: hostname },
    select: { id: true },
  });
  return tenant ? tenant.id : null;
};

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const tenantId = await resolveTenantId(req.headers);
      const { token, user } = await AuthService.login(email, password, tenantId);
      return responseHandler(res, "success", { token, user }, "Login successful.");
    } catch (error) {
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return responseHandler(res, "fail", null, "No token provided.");
      }

      await prisma.tokenBlacklist.create({
        data: {
          token,
          expiredAt: new Date(),
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
