// src/server.js
import 'dotenv/config';             // loads .env (or point to prisma/.env if that’s your source)
import logger from "./utils/logger.js";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect DB (Prisma)
    await prisma.$connect();
    // Optional quick health check:
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected successfully.");

    // IMPORTANT: Prisma does NOT auto-sync schemas.
    // Use prisma migrate in dev; prisma migrate deploy in prod.

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    console.log("Database connection closed gracefully.");
  } finally {
    process.exit(0);
  }
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

startServer();
