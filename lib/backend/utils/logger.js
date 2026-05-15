import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const customLogFormat = format((info) => {
  return info;
})();

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  customLogFormat,
  format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(logDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "error", // Only log errors
      maxSize: "20m",
      maxFiles: "30d", // Keep error logs for 30 days
    }),
  ],
});

export default logger;
