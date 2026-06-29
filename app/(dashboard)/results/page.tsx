"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Loader2, Trophy, Download, Search } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useExams, useExamSchedules, useScheduleResults } from "@/hooks/use-exams"
import type { ResultStudentEntry } from "@/lib/api/exams"

export default function ResultsPage() {
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")

  const { data: exams } = useExams()
  const { data: schedules } = useExamSchedules(selectedExamId ? { examId: selectedExamId } : {})
  const { data: resultsData, isLoading: resultsLoading } = useScheduleResults(selectedScheduleId || null)

  const schedulesWithPapers = (schedules || []).filter((s) => (s._count?.papers || 0) > 0)

  const handleExamChange = (value: string) => {
    setSelectedExamId(value)
    setSelectedScheduleId("")
  }

  const handleViewResults = () => {
    // Triggered by schedule selection change
  }

  const handleExportCSV = () => {
    if (!resultsData?.results) return

    const headers = ["Rank", "Roll No", "Student Name"]
    for (const paper of resultsData.papers) {
      headers.push(`${paper.subjectName} (${paper.maxMarks})`)
    }
    headers.push("Total", "Percentage", "Result")

    const rows = resultsData.results.map((r) => {
      const row = [String(r.rank), r.rollNumber, r.studentName]
      for (const paper of resultsData.papers) {
        const subjectMark = r.subjectMarks.find((sm) => sm.paperId === paper.paperId)
        row.push(subjectMark?.isAbsent ? "AB" : (subjectMark?.marksObtained?.toString() ?? "-"))
      }
      row.push(String(r.totalMarks), r.percentage.toFixed(2) + "%", r.isPassed ? "Pass" : "Fail")
      return row
    })

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `results-${resultsData.schedule.name.replace(/\s+/g, "-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 hover:bg-yellow-600">1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400 hover:bg-gray-500">2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-700 hover:bg-amber-800">3rd</Badge>
    return <span className="text-sm text-muted-foreground">#{rank}</span>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Results"
        description="View section-wise exam results with subject-wise marks, totals, and rankings"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Results
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
                onValueChange={setSelectedScheduleId}
                disabled={!selectedExamId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedExamId ? "Select a schedule" : "Select exam first"} />
                </SelectTrigger>
                <SelectContent>
                  {schedulesWithPapers.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name} - {schedule.section?.sectionName || "N/A"}
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

      {/* Results Table */}
      {selectedScheduleId && (
        <>
          {resultsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : resultsData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {resultsData.schedule.name} - Results
                  </span>
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground w-16">Rank</th>
                        <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">Roll No</th>
                        <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">Student Name</th>
                        {resultsData.papers.map((paper) => (
                          <th key={paper.paperId} className="text-center py-3 px-3 text-sm font-medium text-muted-foreground min-w-[100px]">
                            <div>{paper.subjectName}</div>
                            <div className="text-[10px] text-muted-foreground/60">Max: {paper.maxMarks} | Pass: {paper.passMarks}</div>
                          </th>
                        ))}
                        <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground">Percentage</th>
                        <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsData.results.map((student) => (
                        <tr
                          key={student.enrollmentId}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="text-center py-3 px-3">{getRankBadge(student.rank)}</td>
                          <td className="py-3 px-3 text-sm">{student.rollNumber}</td>
                          <td className="py-3 px-3 font-medium">{student.studentName}</td>
                          {resultsData.papers.map((paper) => {
                            const subjectMark = student.subjectMarks.find((sm) => sm.paperId === paper.paperId)
                            const isPassed = subjectMark && !subjectMark.isAbsent && (subjectMark.marksObtained ?? 0) >= paper.passMarks
                            return (
                              <td key={paper.paperId} className="text-center py-3 px-3">
                                {subjectMark?.isAbsent ? (
                                  <Badge variant="destructive" className="text-[10px]">AB</Badge>
                                ) : subjectMark?.marksObtained != null ? (
                                  <span className={isPassed ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                    {subjectMark.marksObtained}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            )
                          })}
                          <td className="text-center py-3 px-3 font-semibold">{student.totalMarks}</td>
                          <td className="text-center py-3 px-3">
                            <span className={student.percentage >= 35 ? "text-green-600" : "text-red-600"}>
                              {student.percentage.toFixed(2)}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-3">
                            {student.isPassed ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">Pass</Badge>
                            ) : (
                              <Badge variant="destructive">Fail</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="border-t p-4 flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Students: </span>
                    <span className="font-medium">{resultsData.results.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Passed: </span>
                    <span className="font-medium text-green-600">
                      {resultsData.results.filter((r) => r.isPassed).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Failed: </span>
                    <span className="font-medium text-red-600">
                      {resultsData.results.filter((r) => !r.isPassed).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pass %: </span>
                    <span className="font-medium">
                      {resultsData.results.length > 0
                        ? ((resultsData.results.filter((r) => r.isPassed).length / resultsData.results.length) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No results available for this schedule</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
