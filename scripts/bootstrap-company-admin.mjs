/**
 * Bootstrap the first platform (company) user after an empty DB.
 *
 * Usage:
 *   node scripts/bootstrap-company-admin.mjs
 *   npm run bootstrap:company
 *
 * Credentials are hardcoded below for local/dev bootstrap.
 * Company users get implicit platform admin:super — no roles needed.
 *
 * Safety: aborts if any company user already exists (use --force to add another).
 */

import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// ── Hardcoded bootstrap credentials (edit as needed) ─────────────────
const BOOTSTRAP = {
  email: "admin@platform.com",
  password: "Admin@123",
  fullName: "Platform Admin",
  phone: "+910000000000",
};

const force = process.argv.includes("--force");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set (check .env)");
    process.exit(1);
  }

  const { prisma } = await import("../lib/backend/lib/prisma.js");

  try {
    const existingCompanyUsers = await prisma.user.count({
      where: { userType: "company", tenantId: null },
    });

    if (existingCompanyUsers > 0 && !force) {
      console.error(
        `❌ ${existingCompanyUsers} company user(s) already exist. Aborting.`
      );
      console.error("   Re-run with --force to create another company user.");
      process.exit(1);
    }

    const emailTaken = await prisma.user.findFirst({
      where: { email: BOOTSTRAP.email, userType: "company" },
      select: { id: true },
    });
    if (emailTaken) {
      console.error(`❌ Company user with email ${BOOTSTRAP.email} already exists.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(BOOTSTRAP.password, 10);

    const user = await prisma.user.create({
      data: {
        email: BOOTSTRAP.email,
        fullName: BOOTSTRAP.fullName,
        phone: BOOTSTRAP.phone,
        password: hashedPassword,
        userType: "company",
        tenantId: null,
        isFirstLogin: false,
        status: "active",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        tenantId: true,
        createdAt: true,
      },
    });

    console.log("✅ Company user created");
    console.log("   id:      ", user.id);
    console.log("   email:   ", user.email);
    console.log("   name:    ", user.fullName);
    console.log("   password:", BOOTSTRAP.password);
    console.log("");
    console.log("Next: log in on the company host with this email/password.");
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

main().catch((err) => {
  console.error("❌ Bootstrap failed:", err.message || err);
  process.exit(1);
});
