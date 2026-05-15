import { prisma } from "../lib/prisma.js";
import { getTenantIdFromRequest } from "../utils/requestHelper.js";

export const authenticateTenant = async (req, res, next) => {
  try {
    const tenantIdFromHeader = getTenantIdFromRequest(req);
    if (!tenantIdFromHeader) {
      return res
        .status(400)
        .json({ message: "Tenant ID is required in headers." });
    }

    const userId = req.user?.userId; // set by your JWT middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, userType: true, tenantId: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.userType !== "tenant" || user.tenantId !== tenantIdFromHeader) {
      return res.status(403).json({
        message: "Access restricted to tenant users or invalid tenant ID.",
      });
    }

    req.tenantId = user.tenantId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default authenticateTenant;
