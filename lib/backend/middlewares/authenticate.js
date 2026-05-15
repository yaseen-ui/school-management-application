// src/middleware/authenticate.js (Prisma version)

import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { prisma } from "../lib/prisma.js"; // <<< Prisma client singleton

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Authorization: Bearer <token>
  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Unauthorized: No token provided." });
  }

  try {
    // Check blacklist (token is UNIQUE in schema; use findUnique)
    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });

    if (blacklistedToken) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized: Token has expired. Please log in again.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    if (!decoded.userId || !decoded.userType) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid token: Missing required fields.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: Invalid or expired token.",
    });
  }
};

// Cleanup expired tokens periodically (Prisma)
const cleanupExpiredTokens = async () => {
  try {
    await prisma.tokenBlacklist.deleteMany({
      where: { expiredAt: { lt: new Date() } },
    });
    console.log("✅ Expired tokens cleaned up.");
  } catch (error) {
    logger.error("❌ Error while cleaning up tokens:", error);
  }
};

// Run cleanup every 24 hours
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);

export default authenticate;
