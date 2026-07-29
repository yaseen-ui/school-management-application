import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve a writable log directory.
 *
 * On serverless platforms (Vercel, AWS Lambda, etc.) the filesystem is
 * read-only except for /tmp.  We detect that case and fall back to
 * /tmp/logs so that the file transports can still initialise.
 *
 * If even /tmp is not writable we return null, which causes the logger
 * to use Console-only transport (the application will *not* crash).
 */
function resolveLogDir() {
  const primary = path.join(__dirname, "../../logs");

  // Try the primary location first
  try {
    if (!fs.existsSync(primary)) {
      fs.mkdirSync(primary, { recursive: true });
    }
    // Double-check it's actually writable
    fs.accessSync(primary, fs.constants.W_OK);
    return primary;
  } catch {
    // Primary location is not usable – fall back to /tmp/logs
  }

  const tmpDir = "/tmp/logs";
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.accessSync(tmpDir, fs.constants.W_OK);
    console.warn(
      `[logger] Primary log directory not writable; using ${tmpDir} instead.`
    );
    return tmpDir;
  } catch {
    // Even /tmp is not writable – file logging will be disabled
  }

  console.warn(
    "[logger] No writable log directory found; file logging disabled. " +
      "Logs will only be written to the console."
  );
  return null;
}

const logDir = resolveLogDir();

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

/** @type {import("winston").transport[]} */
const transportList = [new transports.Console()];

// Add file transports only when a writable directory was resolved
if (logDir) {
  try {
    transportList.push(
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
        level: "error",
        maxSize: "20m",
        maxFiles: "30d",
      })
    );
  } catch (error) {
    console.warn(
      `[logger] Failed to create file transports: ${error.message}. ` +
        "Falling back to console-only logging."
    );
  }
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: transportList,
});

export default logger;
