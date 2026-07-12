"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import idSequencesApi, {
  IdSequencePattern,
  IdSequenceLog,
} from "@/lib/api/id-sequences";
import { academicYearsApi } from "@/lib/api/academic-years";

export default function IdSequencesPage() {
  const [activeTab, setActiveTab] = useState<"admission" | "employee_code">("admission");
  const [patterns, setPatterns] = useState<IdSequencePattern[]>([]);
  const [logs, setLogs] = useState<IdSequenceLog[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [pattern, setPattern] = useState("");
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const entityLabel = activeTab === "admission" ? "Admission Number" : "Employee Code";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedPatterns, fetchedLogs] = await Promise.all([
        idSequencesApi.getAll(activeTab),
        idSequencesApi.getLogs(activeTab, 20),
      ]);
      setPatterns(fetchedPatterns);
      setLogs(fetchedLogs);

      // Pre-fill form if an active pattern exists
      const activePattern = fetchedPatterns.find((p) => p.isActive);
      if (activePattern) {
        setPattern(activePattern.pattern);
        setAcademicYearId(activePattern.academicYearId);
      } else {
        setPattern(activeTab === "admission" ? "ADM{SEQ:4}" : "EMP{SEQ:4}");
        setAcademicYearId(null);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchAcademicYears = useCallback(async () => {
    try {
      const response = await academicYearsApi.getAll();
      const rows = (response as any)?.data?.rows || [];
      setAcademicYears(Array.isArray(rows) ? rows : []);
    } catch {
      // silently fail — academic years are optional
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchAcademicYears();
  }, [fetchData, fetchAcademicYears]);

  const handleSave = async () => {
    if (!pattern.trim() || !pattern.includes("{SEQ:")) {
      setMessage({ type: "error", text: 'Pattern must include a {SEQ:N} placeholder, e.g., "13091A{SEQ:4}"' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await idSequencesApi.upsert({
        entityType: activeTab,
        academicYearId,
        pattern: pattern.trim(),
        isActive: true,
      });
      setMessage({ type: "success", text: "Pattern saved successfully!" });
      await fetchData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save pattern" });
    } finally {
      setSaving(false);
    }
  };

  const activePattern = patterns.find((p) => p.isActive);

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ID Sequence Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Define auto-increment patterns for admission numbers and employee codes. Use {"{SEQ:N}"} as a placeholder where N is the number of digits.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "admission" | "employee_code")}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="admission" className="flex-1">Student Admission Pattern</TabsTrigger>
          <TabsTrigger value="employee_code" className="flex-1">Employee ID Pattern</TabsTrigger>
        </TabsList>

        <TabsContent value="admission" className="space-y-6 mt-6">
          <PatternForm
            label={entityLabel}
            pattern={pattern}
            setPattern={setPattern}
            academicYearId={academicYearId}
            setAcademicYearId={setAcademicYearId}
            academicYears={academicYears}
            activePattern={activePattern}
            saving={saving}
            message={message}
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="employee_code" className="space-y-6 mt-6">
          <PatternForm
            label={entityLabel}
            pattern={pattern}
            setPattern={setPattern}
            academicYearId={academicYearId}
            setAcademicYearId={setAcademicYearId}
            academicYears={academicYears}
            activePattern={activePattern}
            saving={saving}
            message={message}
            onSave={handleSave}
          />
        </TabsContent>
      </Tabs>

      {/* Recent generations log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generated IDs</CardTitle>
          <CardDescription>Last 20 IDs generated for {entityLabel.toLowerCase()}s</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No IDs generated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium">Generated ID</th>
                    <th className="py-2 pr-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono">{log.generatedValue}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PatternForm({
  label,
  pattern,
  setPattern,
  academicYearId,
  setAcademicYearId,
  academicYears,
  activePattern,
  saving,
  message,
  onSave,
}: {
  label: string;
  pattern: string;
  setPattern: (v: string) => void;
  academicYearId: string | null;
  setAcademicYearId: (v: string | null) => void;
  academicYears: any[];
  activePattern: IdSequencePattern | undefined;
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: () => void;
}) {
  const previewId = (() => {
    if (!pattern || !pattern.includes("{SEQ:")) return "—";
    const match = pattern.match(/\{SEQ:(\d+)\}/);
    const len = match ? parseInt(match[1], 10) : 4;
    const nextSeq = (activePattern?.currentSeq ?? 0) + 1;
    const padded = String(nextSeq).padStart(len, "0");
    return pattern.replace(/{SEQ:\d+}/, padded);
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label} Pattern</CardTitle>
        <CardDescription>
          Configure the auto-increment format for {label.toLowerCase()}s. Changing the pattern only affects future IDs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pattern input */}
        <div className="space-y-2">
          <Label htmlFor="pattern">Pattern</Label>
          <Input
            id="pattern"
            placeholder='e.g., "13091A{SEQ:4}"'
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use {"{SEQ:N}"} where N is the number of digits. Example: "STU-{"{SEQ:5}"}" → STU-00001
          </p>
        </div>

        {/* Academic year selector */}
        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year (optional)</Label>
          <select
            id="academicYear"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={academicYearId || ""}
            onChange={(e) => setAcademicYearId(e.target.value || null)}
          >
            <option value="">All Years (global pattern)</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Associate this pattern with a specific academic year, or leave as global for all years.
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next ID Preview</span>
            <span className="font-mono text-lg font-semibold">{previewId}</span>
          </div>
          {activePattern && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Current Sequence: <span className="font-mono">{activePattern.currentSeq}</span></div>
              {activePattern.nextPreview && (
                <div>Last generated would be: <span className="font-mono">{activePattern.nextPreview}</span></div>
              )}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-md px-4 py-2 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit */}
        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving..." : "Save Pattern"}
        </Button>
      </CardContent>
    </Card>
  );
}