import { prisma } from "../lib/prisma.js";

const authenticateCompany = async (req, res, next) => {
  try {
    // req.user is set by your JWT middleware
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, userType: true }, // minimal fetch
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.userType !== "company" && user.userType !== "tenant") {
      return res
        .status(403)
        .json({ message: "Access restricted to company and tenant users." });
    }

    // If you later add super_admin to your enum:
    // if (user.userType !== "super_admin") {
    //   return res.status(403).json({ message: "You are not authorised to do this operation" });
    // }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default authenticateCompany;
