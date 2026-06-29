"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { FileText, Save, Loader2, User, X, Check, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useExams, useExamSchedules, useScheduleMarksGrid, useUpsertStudentScheduleMarks } from "@/hooks/use-exams"
import { toast } from "@/components/ui/sonner"
import type { MarksGridData, MarksGridStudent } from "@/lib/api/exams"

export default function MarksEntryPage() {
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<MarksGridStudent | null>(null)
  const [marksInput, setMarksInput] = useState<Record<string, { marksObtained: string; isAbsent: boolean; breakup: string }>>({})
  const [saving, setSaving] = useState(false)

  const { data: exams } = useExams()
  const { data: schedules } = useExamSchedules(selectedExamId ? { examId: selectedExamId } : {})
  const { data: marksGrid, isLoading: gridLoading } = useScheduleMarksGrid(selectedScheduleId || null)
  const upsertMarks = useUpsertStudentScheduleMarks()

  // Filter schedules that have papers (subjects configured)
  const schedulesWithPapers = (schedules || []).filter((s) => (s._count?.papers || 0) > 0)

  const handleExamChange = (value: string) => {
    setSelectedExamId(value)
    setSelectedScheduleId("")
    setSelectedStudent(null)
    setMarksInput({})
  }

  const handleScheduleChange = (value: string) => {
    setSelectedScheduleId(value)
    setSelectedStudent(null)
    setMarksInput({})
  }

  const handleSelectStudent = (student: MarksGridStudent) => {
    setSelectedStudent(student)
    // Initialize marks input from existing data
    const initial: Record<string, { marksObtained: string; isAbsent: boolean; breakup: string }> = {}
    for (const paper of marksGrid?.papers || []) {
      const existingMark = student.marks.find((m) => m.paperId === paper.paperId)
      initial[paper.paperId] = {
        marksObtained: existingMark?.marksObtained?.toString() ?? "",
        isAbsent: existingMark?.isAbsent ?? false,
        breakup: existingMark?.breakup ? JSON.stringify(existingMark.breakup, null, 2) : "",
      }
    }
    setMarksInput(initial)
  }

  const handleMarksChange = (paperId: string, value: string) => {
    setMarksInput((prev) => ({
      ...prev,
      [paperId]: { ...prev[paperId], marksObtained: value },
    }))
  }

  const handleAbsentToggle = (paperId: string) => {
    setMarksInput((prev) => ({
      ...prev,
      [paperId]: { ...prev[paperId], isAbsent: !prev[paperId]?.isAbsent },
    }))
  }

  const handleBreakupChange = (paperId: string, value: string) => {
    setMarksInput((prev) => ({
      ...prev,
      [paperId]: { ...prev[paperId], breakup: value },
    }))
  }

  const handleSaveMarks = useCallback(async () => {
    if (!selectedScheduleId || !selectedStudent) return

    setSaving(true)
    try {
      const marks = (marksGrid?.papers || []).map((paper) => {
        const input = marksInput[paper.paperId]
        let breakupObj: Record<string, unknown> | null = null
        if (input?.breakup?.trim()) {
          try {
            breakupObj = JSON.parse(input.breakup)
          } catch {
            // If invalid JSON, store as raw text
            breakupObj = { raw: input.breakup }
          }
        }

        return {
          paperId: paper.paperId,
          marksObtained: input?.marksObtained ? Number(input.marksObtained) : null,
          isAbsent: input?.isAbsent ?? false,
          breakup: breakupObj,
        }
      })

      await upsertMarks.mutateAsync({
        scheduleId: selectedScheduleId,
        enrollmentId: selectedStudent.enrollmentId,
        data: { marks },
      })

      toast.success("Marks saved successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to save marks")
    } finally {
      setSaving(false)
    }
  }, [selectedScheduleId, selectedStudent, marksInput, marksGrid, upsertMarks])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Marks Entry"
        description="Select exam, section, and student to enter marks"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Exam & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam</Label>
              <Select value={selectedExamId} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {(exams || []).map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name} ({exam.examType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule (Section)</Label>
              <Select
                value={selectedScheduleId}
                onValueChange={handleScheduleChange}
                disabled={!selectedExamId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedExamId ? "Select a schedule" : "Select exam first"} />
                </SelectTrigger>
                <SelectContent>
                  {schedulesWithPapers.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name} - {schedule.section?.sectionName || "N/A"} ({schedule._count?.papers || 0} papers)
                    </SelectItem>
                  ))}
                  {schedulesWithPapers.length === 0 && selectedExamId && (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No schedules with papers found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Selection & Marks Grid */}
      {selectedScheduleId && (
        <>
          {gridLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : marksGrid ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Student List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Students ({marksGrid.students.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {marksGrid.students.map((student) => (
                      <button
                        key={student.enrollmentId}
                        onClick={() => handleSelectStudent(student)}
                        className={`w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition-colors ${
                          selectedStudent?.enrollmentId === student.enrollmentId
                            ? "bg-primary/10 border-l-2 border-l-primary"
                            : ""
                        }`}
                      >
                        <div className="font-medium text-sm">{student.studentName}</div>
                        <div className="text-xs text-muted-foreground">Roll: {student.rollNumber}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {student.marks.map((m) => {
                            const paper = marksGrid.papers.find((p) => p.paperId === m.paperId)
                            return (
                              <Badge
                                key={m.paperId}
                                variant={m.marksObtained != null ? "default" : "outline"}
                                className="text-[10px] px-1.5 py-0"
                              >
                                {paper?.subjectName?.slice(0, 3)}: {m.marksObtained ?? "-"}
                              </Badge>
                            )
                          })}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Marks Entry Form */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {selectedStudent ? (
                        <>Marks for {selectedStudent.studentName} (Roll: {selectedStudent.rollNumber})</>
                      ) : (
                        "Select a student"
                      )}
                    </span>
                    {selectedStudent && (
                      <Button onClick={handleSaveMarks} disabled={saving} size="sm">
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Marks
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedStudent ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a student from the list to enter marks</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Max Marks</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Pass Marks</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Marks Obtained</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Absent</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Breakup (JSON)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marksGrid.papers.map((paper) => {
                            const input = marksInput[paper.paperId] || { marksObtained: "", isAbsent: false, breakup: "" }
                            return (
                              <tr key={paper.paperId} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-4 font-medium">{paper.subjectName}</td>
                                <td className="py-3 px-4 text-center">{paper.maxMarks}</td>
                                <td className="py-3 px-4 text-center">{paper.passMarks}</td>
                                <td className="py-3 px-4 text-center">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={paper.maxMarks}
                                    value={input.marksObtained}
                                    onChange={(e) => handleMarksChange(paper.paperId, e.target.value)}
                                    disabled={input.isAbsent}
                                    className="w-24 text-center mx-auto"
                                    placeholder="Score"
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Button
                                    variant={input.isAbsent ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => handleAbsentToggle(paper.paperId)}
                                    className="w-20"
                                  >
                                    {input.isAbsent ? (
                                      <><X className="h-3 w-3 mr-1" /> Absent</>
                                    ) : (
                                      <><Check className="h-3 w-3 mr-1" /> Present</>
                                    )}
                                  </Button>
                                </td>
                                <td className="py-3 px-4">
                                  <textarea
                                    className="w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                                    placeholder='{"topics":[{"topic":"Algebra","marks":15}]}'
                                    value={input.breakup}
                                    onChange={(e) => handleBreakupChange(paper.paperId, e.target.value)}
                                    rows={2}
                                  />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No marks grid data available for this schedule</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
