"use client";

import { AlertTriangle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAcademicYears } from "@/hooks/use-academic-years";
import { useCourses } from "@/hooks/use-courses";

interface PrerequisiteStatus {
  label: string;
  ready: boolean;
  count: number;
  message: string;
  link?: { href: string; text: string };
  critical: boolean; // if true, blocks the wizard entirely
}

/**
 * Checks if all prerequisites for importing students are met.
 * If the active academic year is missing, the wizard is hidden.
 * If courses/grades/sections are missing, warnings are shown above the wizard.
 */
export function ReadinessCheck({ children }: { children: React.ReactNode }) {
  const { data: academicYears, isLoading: loadingYears } = useAcademicYears();
  const { data: courses, isLoading: loadingCourses } = useCourses();

  const academicYearsList: any[] = (academicYears as any)?.data?.rows || [];
  const coursesList: any[] = (courses as any)?.data?.rows || [];

  const activeYears = Array.isArray(academicYearsList)
    ? academicYearsList.filter((y: any) => y.status === "active")
    : [];

  const isLoading = loadingYears || loadingCourses;

  // Build prerequisites status
  const prerequisites: PrerequisiteStatus[] = [
    {
      label: "Active Academic Year",
      ready: activeYears.length > 0,
      count: activeYears.length,
      message: activeYears.length === 0
        ? "No active Academic Year found. You need an active academic year to enroll students."
        : `${activeYears.length} active academic year(s) available.`,
      link: activeYears.length === 0 ? { href: "/academic-years", text: "Manage Academic Years" } : undefined,
      critical: true,
    },
    {
      label: "Courses",
      ready: coursesList.length > 0,
      count: coursesList.length,
      message: coursesList.length === 0
        ? "No Courses found. Create a course to organize grades and sections."
        : `${coursesList.length} course(s) available.`,
      link: coursesList.length === 0 ? { href: "/courses", text: "Manage Courses" } : undefined,
      critical: false,
    },
  ];

  const criticalBlockers = prerequisites.filter((p) => p.critical && !p.ready);
  const warnings = prerequisites.filter((p) => !p.critical && !p.ready);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Checking prerequisites...</span>
      </div>
    );
  }

  // Critical blocker: no active academic year — hide wizard entirely
  if (criticalBlockers.length > 0) {
    return (
      <div className="space-y-4">
        {criticalBlockers.map((blocker) => (
          <div
            key={blocker.label}
            className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/5 p-5"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-destructive">
                Cannot proceed: {blocker.label} missing
              </p>
              <p className="text-sm text-muted-foreground">{blocker.message}</p>
              {blocker.link && (
                <Link
                  href={blocker.link.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {blocker.link.text}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
        {/* Also show non-critical warnings */}
        {warnings.length > 0 && (
          <div className="space-y-3">
            {warnings.map((w) => (
              <div
                key={w.label}
                className="flex items-start gap-4 rounded-lg border border-amber-500/50 bg-amber-500/5 p-4"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-amber-600">
                    {w.label} not found
                  </p>
                  <p className="text-sm text-muted-foreground">{w.message}</p>
                  {w.link && (
                    <Link
                      href={w.link.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {w.link.text}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // All critical prerequisites met — show warnings (if any) + wizard
  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((w) => (
            <div
              key={w.label}
              className="flex items-start gap-4 rounded-lg border border-amber-500/50 bg-amber-500/5 p-4"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-600">
                  Setup Recommended: {w.label}
                </p>
                <p className="text-sm text-muted-foreground">{w.message}</p>
                {w.link && (
                  <Link
                    href={w.link.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {w.link.text}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All clear — show success indicator */}
      {warnings.length === 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-emerald-600">All prerequisites met</p>
            <p className="text-xs text-muted-foreground">
              You can now import students into any section.
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}