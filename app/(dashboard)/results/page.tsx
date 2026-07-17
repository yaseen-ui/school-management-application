"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, Layers, GraduationCap, FileText, Trophy, Download, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { useExams, useExamSchedules, useScheduleResults } from "@/hooks/use-exams"
import type { ResultStudentEntry } from "@/lib/api/exams"

export default function ResultsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")

  const { data: courses } = useCourses()
  const { data: grades } = useGrades(selectedCourseId || undefined)
  const { data: sections } = useSections(selectedGradeId || undefined, selectedCourseId || undefined)
  const { data: exams } = useExams()
  const { data: schedules } = useExamSchedules(
    selectedSectionId ? { sectionId: selectedSectionId } : {}
  )
  const { data: resultsData, isLoading: resultsLoading } = useScheduleResults(selectedScheduleId || null)

  const schedulesWithPapers = (schedules || []).filter((s) => (s.papers?.length || 0) > 0)

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value)
    setSelectedGradeId("")
    setSelectedSectionId("")
    setSelectedExamId("")
    setSelectedScheduleId("")
  }

  const handleGradeChange = (value: string) => {
    setSelectedGradeId(value)
    setSelectedSectionId("")
    setSelectedExamId("")
    setSelectedScheduleId("")
  }

  const handleSectionChange = (value: string) => {
    setSelectedSectionId(value)
    setSelectedExamId("")
    setSelectedScheduleId("")
  }

  const handleExamChange = (value: string) => {
    setSelectedExamId(value)
    setSelectedScheduleId("")
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
      row.push(String(r.totalMarks), r.percentage != null ? r.percentage.toFixed(2) + "%" : "-", r.isPassed ? "Pass" : "Fail")
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

      {/* Hierarchical Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Course */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                Course
              </Label>
              <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {(courses?.data?.rows || []).map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Grade
              </Label>
              <Select
                value={selectedGradeId}
                onValueChange={handleGradeChange}
                disabled={!selectedCourseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCourseId ? "Select grade" : "Select course first"} />
                </SelectTrigger>
                <SelectContent>
                  {(grades?.rows || []).map((grade: any) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.gradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                Section
              </Label>
              <Select
                value={selectedSectionId}
                onValueChange={handleSectionChange}
                disabled={!selectedGradeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedGradeId ? "Select section" : "Select grade first"} />
                </SelectTrigger>
                <SelectContent>
                  {(sections?.data?.rows || []).map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.sectionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exam */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Exam
              </Label>
              <Select
                value={selectedExamId}
                onValueChange={handleExamChange}
                disabled={!selectedSectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedSectionId ? "Select exam" : "Select section first"} />
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

            {/* Schedule */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Schedule
              </Label>
              <Select
                value={selectedScheduleId}
                onValueChange={setSelectedScheduleId}
                disabled={!selectedExamId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedExamId ? "Select schedule" : "Select exam first"} />
                </SelectTrigger>
                <SelectContent>
                  {schedulesWithPapers.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name} - {new Date(schedule.endDate).toLocaleDateString()}
                    </SelectItem>
                  ))}
                  {schedulesWithPapers.length === 0 && selectedExamId && (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No exam schedules with papers found
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16">Rank</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      {resultsData.papers.map((paper) => (
                        <TableHead key={paper.paperId} className="text-center min-w-[100px]">
                          <div>{paper.subjectName}</div>
                          <div className="text-[10px] text-muted-foreground/60 font-normal">Max: {paper.maxMarks} | Pass: {paper.passMarks}</div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Percentage</TableHead>
                      <TableHead className="text-center">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsData.results.map((student) => (
                      <TableRow key={student.enrollmentId}>
                        <TableCell className="text-center">{getRankBadge(student.rank)}</TableCell>
                        <TableCell className="text-sm">{student.rollNumber}</TableCell>
                        <TableCell className="font-medium">{student.studentName}</TableCell>
                        {resultsData.papers.map((paper) => {
                          const subjectMark = student.subjectMarks.find((sm) => sm.paperId === paper.paperId)
                          const isPassed = subjectMark && !subjectMark.isAbsent && (subjectMark.marksObtained ?? 0) >= paper.passMarks
                          return (
                            <TableCell key={paper.paperId} className="text-center">
                              {subjectMark?.isAbsent ? (
                                <Badge variant="destructive" className="text-[10px]">AB</Badge>
                              ) : subjectMark?.marksObtained != null ? (
                                <span className={isPassed ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                  {subjectMark.marksObtained}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          )
                        })}
                        <TableCell className="text-center font-semibold">{student.totalMarks}</TableCell>
                        <TableCell className="text-center">
                          {student.percentage != null ? (
                            <span className={student.percentage >= 35 ? "text-green-600" : "text-red-600"}>
                              {student.percentage.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.isPassed ? (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Pass</Badge>
                          ) : (
                            <Badge variant="destructive">Fail</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
