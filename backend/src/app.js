import express from "express";
import cors from "cors";

import tenantRoutes from "./modules/tenants/tenant.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import roleRoutes from "./modules/roles/roles.routes.js";
import logger from "./utils/logger.js";
import courseRoutes from "./modules/courses/courses.routes.js";
import gradeRoutes from "./modules/grades/grades.routes.js";
import sectionRoutes from "./modules/sections/sections.routes.js";
import subjectRoutes from "./modules/subjects/subjects.routes.js";
import inventoryRoutes from "./modules/inventory-management/inventory.routes.js";
import uploadsRoutes from "./modules/uploads/uploads.routes.js";
import gcsRoutes from "./modules/gcs/gcs.route.js";
import publicRoutes from "./modules/public/public.routes.js";
import studentsRoutes from "./modules/students/students.route.js";
import teachersRoutes from "./modules/teachers/teachers.routes.js";
import academicYearRoutes from "./modules/academic-years/academicYear.routes.js";
import resolveAcademicYear from "./middlewares/resolveAcademicYear.js";

const app = express();

app.use(express.json());

// Allow all domains for CORS
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"],
  })
);

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/public", publicRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/gcs", gcsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/teachers", teachersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
