import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { importStudentsFromExcel } from "@/lib/backend/modules/imports/imports.service.js";

export async function POST(req: NextRequest) {
  try {
    // ── Auth: Decode JWT and extract tenantId ────────────────────────────
    const authHeader = req.headers.get("authorization") || "";
    let tenantId: string | null = null;

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your_jwt_secret"
        ) as any;
        tenantId = decoded?.tenantId || null;
      } catch {
        // Invalid token — handled below
      }
    }

    // Fallback: x-tenant-id header
    if (!tenantId) {
      tenantId = req.headers.get("x-tenant-id");
    }

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          summary: { totalRows: 0, successful: 0, failed: 0 },
          errors: [{ row: 0, field: "_auth", value: "", error: "Authentication required. Missing tenant context." }],
        },
        { status: 401 }
      );
    }

    // ── Parse multipart form data ─────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const academicYearId = formData.get("academicYearId") as string | null;
    const gradeId = formData.get("gradeId") as string | null;
    const sectionId = formData.get("sectionId") as string | null;

    // Validate required form fields
    const missingFields: string[] = [];
    if (!file) missingFields.push("file");
    if (!academicYearId) missingFields.push("academicYearId");
    if (!gradeId) missingFields.push("gradeId");
    if (!sectionId) missingFields.push("sectionId");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          summary: { totalRows: 0, successful: 0, failed: 0 },
          errors: [
            {
              row: 0,
              field: "_form",
              value: "",
              error: `Missing required fields: ${missingFields.join(", ")}`,
            },
          ],
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];
    if (!validTypes.includes(file!.type) && !file!.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        {
          success: false,
          summary: { totalRows: 0, successful: 0, failed: 0 },
          errors: [
            {
              row: 0,
              field: "file",
              value: file!.name,
              error: "Invalid file type. Only .xlsx, .xls, and .csv files are supported.",
            },
          ],
        },
        { status: 400 }
      );
    }

    // ── Read file buffer ──────────────────────────────────────────────────
    const arrayBuffer = await file!.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Import ────────────────────────────────────────────────────────────
    const result = await importStudentsFromExcel(buffer, {
      tenantId,
      academicYearId: academicYearId!,
      gradeId: gradeId!,
      sectionId: sectionId!,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      // Validation errors — return 422
      return NextResponse.json(result, { status: 422 });
    }
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        summary: { totalRows: 0, successful: 0, failed: 0 },
        errors: [
          {
            row: 0,
            field: "_system",
            value: "",
            error: error.message || "An unexpected error occurred during import.",
          },
        ],
      },
      { status: 500 }
    );
  }
}