"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAcademicYears } from "@/hooks/use-academic-years";
import { useCourses } from "@/hooks/use-courses";
import { useGrades } from "@/hooks/use-grades";
import { useSections } from "@/hooks/use-sections";
import type { ImportError, ImportResponse } from "@/lib/api/imports";
import { importStudents, importFaculty } from "@/lib/api/imports";
import { GraduationCap, Users } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportMode = "students" | "faculty";

interface SelectionState {
  academicYearId: string;
  courseId: string;
  gradeId: string;
  sectionId: string;
  academicYearName: string;
  courseName: string;
  gradeName: string;
  sectionName: string;
}

type WizardStep = "select" | "upload" | "result";

// ─── Excel Template Columns ───────────────────────────────────────────────────

const STUDENT_TEMPLATE_COLUMNS = [
  "firstName", "middleName", "lastName", "dateOfBirth", "gender",
  "admissionNumber", "pen", "apaarId", "aadhaarNumber",
  "casteCategory", "subCaste", "religion", "motherTongue", "bloodGroup", "nationality",
  "fatherName", "fatherPhone", "fatherOccupation",
  "motherName", "motherPhone", "motherOccupation",
  "guardianName", "guardianRelation", "guardianContact",
  "permanentAddress", "state", "pincode",
  "mediumOfInstruction", "previousSchoolName",
  "transferCertificateNo", "dateOfIssueTC",
  "modeOfTransport", "feePaymentMode", "midDayMealEligibility",
];

const FACULTY_TEMPLATE_COLUMNS = [
  "fullName", "email", "phone", "gender", "employeeCode", "employeeType",
  "dateOfBirth", "dateOfJoining", "yearsOfExperience",
  "governmentIdType", "governmentIdNumber",
  "drivingLicenseNumber", "drivingExperienceYears", "vehicleType", "licenseExpiryDate",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function downloadStudentTemplate(selection: SelectionState) {
  const header = STUDENT_TEMPLATE_COLUMNS.join(",");
  const sampleRow = STUDENT_TEMPLATE_COLUMNS.map((col) => {
    if (col === "firstName") return "John";
    if (col === "lastName") return "Doe";
    if (col === "dateOfBirth") return "01/01/2015";
    if (col === "gender") return "Male";
    if (col === "admissionNumber") return "ADM-2024-001";
    if (col === "nationality") return "Indian";
    return "";
  });
  const csv = [header, sampleRow.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `student-import-${selection.sectionName || "template"}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadFacultyTemplate() {
  const header = FACULTY_TEMPLATE_COLUMNS.join(",");
  const sampleRow = FACULTY_TEMPLATE_COLUMNS.map((col) => {
    if (col === "fullName") return "John Doe";
    if (col === "email") return "john.doe@school.in";
    if (col === "phone") return "+919876543210";
    if (col === "employeeCode") return "EMP-001";
    if (col === "employeeType") return "teacher";
    if (col === "gender") return "Male";
    return "";
  });
  const csv = [header, sampleRow.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "faculty-import-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Step 1: Section Selector ─────────────────────────────────────────────────

function SectionSelector({
  selection,
  setSelection,
  onNext,
}: {
  selection: SelectionState;
  setSelection: (s: SelectionState) => void;
  onNext: () => void;
}) {
  const { data: academicYears, isLoading: loadingYears } = useAcademicYears();
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: grades, isLoading: loadingGrades } = useGrades(
    selection.courseId || undefined
  );
  const { data: sections, isLoading: loadingSections } = useSections(
    selection.gradeId || undefined
  );

  // Each hook has a different response shape — normalize them all:
  const academicYearsList: any[] = (academicYears as any)?.data?.rows || [];
  const coursesList: any[] = (courses as any)?.data?.rows || [];
  const gradesList: any[] = (grades as any)?.rows || (grades as any)?.data?.rows || [];
  const sectionsList: any[] = (sections as any)?.data?.rows || [];

  const activeYears = Array.isArray(academicYearsList)
    ? academicYearsList.filter((y: any) => y.status === "active")
    : [];

  const canProceed =
    selection.academicYearId &&
    selection.gradeId &&
    selection.sectionId;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileSpreadsheet className="mx-auto h-12 w-12 text-primary mb-3" />
        <h2 className="text-xl font-semibold">Select Destination Section</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose where the imported students will be placed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Academic Year */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Academic Year <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selection.academicYearId}
            onChange={(e) => {
              const year: any = activeYears.find((y: any) => y.id === e.target.value);
              setSelection({
                ...selection,
                academicYearId: e.target.value,
                academicYearName: year?.name || "",
                gradeId: "",
                gradeName: "",
                sectionId: "",
                sectionName: "",
                courseId: "",
                courseName: "",
              });
            }}
            disabled={loadingYears}
          >
            <option value="">Select academic year...</option>
            {(activeYears as any[]).map((year: any) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Course</label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selection.courseId}
            onChange={(e) => {
              const course: any = coursesList.find((c: any) => c.id === e.target.value);
              setSelection({
                ...selection,
                courseId: e.target.value,
                courseName: course?.courseName || "",
                gradeId: "",
                gradeName: "",
                sectionId: "",
                sectionName: "",
              });
            }}
            disabled={loadingCourses || !selection.academicYearId}
          >
            <option value="">Select course (optional filter)...</option>
            {coursesList.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Grade <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selection.gradeId}
            onChange={(e) => {
              const grade: any = gradesList.find((g: any) => g.id === e.target.value);
              setSelection({
                ...selection,
                gradeId: e.target.value,
                gradeName: grade?.gradeName || "",
                sectionId: "",
                sectionName: "",
              });
            }}
            disabled={loadingGrades || !selection.academicYearId}
          >
            <option value="">Select grade...</option>
            {gradesList.map((grade: any) => (
              <option key={grade.id} value={grade.id}>
                {grade.gradeName}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Section <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selection.sectionId}
            onChange={(e) => {
              const section: any = sectionsList.find((s: any) => s.id === e.target.value);
              setSelection({
                ...selection,
                sectionId: e.target.value,
                sectionName: section?.sectionName || "",
              });
            }}
            disabled={loadingSections || !selection.gradeId}
          >
            <option value="">Select section...</option>
            {sectionsList.map((section: any) => (
              <option key={section.id} value={section.id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection summary */}
      {canProceed && (
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <span className="font-medium">Selected: </span>
          {selection.academicYearName} &rarr;{" "}
          {selection.gradeName} &rarr;{" "}
          <Badge variant="secondary" className="ml-1">
            {selection.sectionName}
          </Badge>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: File Upload ───────────────────────────────────────────────────────

function FileUpload({
  selection,
  mode,
  onBack,
  onResult,
}: {
  selection: SelectionState;
  mode: ImportMode;
  onBack?: () => void;
  onResult: (result: ImportResponse) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isFaculty = mode === "faculty";

  const handleFile = (f: File | null) => {
    if (f) {
      const validExtensions = [".xlsx", ".xls", ".csv"];
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      if (!validExtensions.includes(ext)) {
        toast.error("Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10 MB.");
        return;
      }
      setFile(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const result = isFaculty
        ? await importFaculty(file)
        : await importStudents(
            file,
            selection.academicYearId,
            selection.gradeId,
            selection.sectionId
          );
      onResult(result);
    } catch (err: any) {
      if (err.data) {
        onResult(err.data);
      } else {
        toast.error(err.message || "Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-primary mb-3" />
        <h2 className="text-xl font-semibold">
          Upload {isFaculty ? "Faculty" : "Student"} Data
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isFaculty
            ? "Upload an Excel or CSV file with faculty/staff information."
            : `Upload an Excel or CSV file with student information for `}
          {!isFaculty && (
            <Badge variant="secondary">{selection.sectionName}</Badge>
          )}
          {!isFaculty && "."}
        </p>
      </div>

      {/* Download template */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            isFaculty
              ? downloadFacultyTemplate()
              : downloadStudentTemplate(selection)
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Download Template CSV
        </Button>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${file ? "bg-muted/30" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0] || null);
        }}
      >
        {file ? (
          <div className="space-y-2">
            <FileSpreadsheet className="mx-auto h-10 w-10 text-primary" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <FileSpreadsheet className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Drag & drop your file here, or{" "}
              <label className="cursor-pointer text-primary hover:underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground/60">
              Supports .xlsx, .xls, .csv (max 10 MB)
            </p>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack || (() => {})} disabled={isUploading}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Start Import
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Result ────────────────────────────────────────────────────────────

function ImportResult({
  result,
  onReset,
  entity = "records",
}: {
  result: ImportResponse;
  onReset: () => void;
  entity?: string;
}) {
  const isSuccess = result.success;
  const errors = result.errors || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        {isSuccess ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
        ) : (
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
        )}
        <h2 className="text-xl font-semibold">
          {isSuccess ? "Import Complete!" : "Import Failed"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isSuccess
            ? `${result.summary.successful} of ${result.summary.totalRows} ${entity} imported successfully.`
            : `${errors.length} error(s) found. No ${entity} were imported.`}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{result.summary.totalRows}</CardTitle>
            <CardDescription>Total Rows</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-emerald-600">
              {isSuccess ? result.summary.successful : 0}
            </CardTitle>
            <CardDescription>Imported</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-destructive">
              {errors.length}
            </CardTitle>
            <CardDescription>Errors</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Error list */}
      {errors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-destructive" />
            Error Details
          </h3>
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="px-4 py-2 font-medium">Row</th>
                      <th className="px-4 py-2 font-medium">Field</th>
                      <th className="px-4 py-2 font-medium">Value</th>
                      <th className="px-4 py-2 font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((err, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-4 py-2 text-muted-foreground">{err.row}</td>
                        <td className="px-4 py-2 font-mono text-xs">{err.field}</td>
                        <td className="px-4 py-2 max-w-[150px] truncate text-muted-foreground">
                          {err.value || <span className="italic">empty</span>}
                        </td>
                        <td className="px-4 py-2 text-destructive">{err.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {!isSuccess && (
          <Button variant="outline" onClick={onReset}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        <Button onClick={onReset} variant={isSuccess ? "default" : "outline"}>
          {isSuccess ? "Import Another" : "Start Over"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Wizard ───────────────────────────────────────────────────────────────

export function ImportWizard() {
  const [mode, setMode] = useState<ImportMode>("students");
  const [step, setStep] = useState<WizardStep>("select");
  const [selection, setSelection] = useState<SelectionState>({
    academicYearId: "",
    courseId: "",
    gradeId: "",
    sectionId: "",
    academicYearName: "",
    courseName: "",
    gradeName: "",
    sectionName: "",
  });
  const [result, setResult] = useState<ImportResponse | null>(null);

  const isFaculty = mode === "faculty";

  const handleReset = () => {
    setStep(isFaculty ? "upload" : "select");
    setResult(null);
  };

  const handleModeChange = (newMode: ImportMode) => {
    setMode(newMode);
    setResult(null);
    setStep(newMode === "faculty" ? "upload" : "select");
    setSelection({
      academicYearId: "",
      courseId: "",
      gradeId: "",
      sectionId: "",
      academicYearName: "",
      courseName: "",
      gradeName: "",
      sectionName: "",
    });
  };

  const studentSteps = [
    { key: "select" as WizardStep, label: "Select Section" },
    { key: "upload" as WizardStep, label: "Upload File" },
    { key: "result" as WizardStep, label: "Result" },
  ];

  const facultySteps = [
    { key: "upload" as WizardStep, label: "Upload File" },
    { key: "result" as WizardStep, label: "Result" },
  ];

  const steps = isFaculty ? facultySteps : studentSteps;
  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Bulk import students or faculty from Excel/CSV files.
            </CardDescription>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 mt-3">
          <button
            onClick={() => handleModeChange("students")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "students"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Students
          </button>
          <button
            onClick={() => handleModeChange("faculty")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "faculty"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Faculty
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 pt-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i <= currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs ${
                  i <= currentIndex
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 ${
                    i < currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {step === "select" && !isFaculty && (
              <SectionSelector
                selection={selection}
                setSelection={setSelection}
                onNext={() => setStep("upload")}
              />
            )}
            {step === "upload" && (
              <FileUpload
                selection={selection}
                mode={mode}
                onBack={
                  isFaculty ? undefined : () => setStep("select")
                }
                onResult={(res) => {
                  setResult(res);
                  setStep("result");
                }}
              />
            )}
            {step === "result" && result && (
              <ImportResult
                result={result}
                onReset={handleReset}
                entity={isFaculty ? "faculty" : "students"}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
