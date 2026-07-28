"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  AlertCircle,
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { useExamSchedules, useScheduleMarksGrid, useUpsertStudentScheduleMarks } from "@/hooks/use-exams"
import { toast } from "@/components/ui/sonner"
import type { MarksGridStudent } from "@/lib/api/exams"

interface TopicMark {
  id: string
  topic: string
  marks: string
}

interface MarksInputEntry {
  marksObtained: string
  isAbsent: boolean
  topics: TopicMark[]
  breakupBase: Record<string, unknown>
}

const SUBJECT_TOPIC_SUGGESTIONS: Array<{ matches: string[]; topics: string[] }> = [
  {
    matches: ["math"],
    topics: ["Algebra", "Geometry", "Statistics", "Arithmetic"],
  },
  {
    matches: ["science", "general science"],
    topics: ["Physics", "Chemistry", "Biology"],
  },
  {
    matches: ["social", "social studies"],
    topics: ["History", "Geography", "Civics", "Economics"],
  },
  {
    matches: ["english"],
    topics: ["Literature", "Grammar", "Writing", "Reading"],
  },
  {
    matches: ["hindi", "telugu", "language", "sanskrit", "urdu"],
    topics: ["Prose", "Poetry", "Grammar", "Writing"],
  },
  {
    matches: ["computer", "information technology"],
    topics: ["Theory", "Practical", "Programming"],
  },
]

function topicId(paperId: string, index?: number) {
  return `${paperId}-${index ?? Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getSuggestedTopics(subjectName: string) {
  const normalized = subjectName.toLowerCase()
  return (
    SUBJECT_TOPIC_SUGGESTIONS.find(({ matches }) =>
      matches.some((match) => normalized.includes(match)),
    )?.topics ?? ["Theory", "Practical"]
  )
}

function normalizeBreakup(
  paperId: string,
  breakup: Record<string, unknown> | null | undefined,
): Pick<MarksInputEntry, "topics" | "breakupBase"> {
  const source =
    breakup && typeof breakup === "object" && !Array.isArray(breakup)
      ? breakup
      : {}
  const rawTopics = Array.isArray(source.topics) ? source.topics : []
  const breakupBase = { ...source }
  delete breakupBase.topics

  return {
    breakupBase,
    topics: rawTopics
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map((item, index) => ({
        id: topicId(paperId, index),
        topic: typeof item.topic === "string" ? item.topic : "",
        marks:
          typeof item.marks === "number" || typeof item.marks === "string"
            ? String(item.marks)
            : "",
      })),
  }
}

function calculateTopicTotal(topics: TopicMark[]) {
  return topics.reduce((total, topic) => {
    if (topic.marks.trim() === "") return total
    const value = Number(topic.marks)
    return Number.isFinite(value) ? total + value : total
  }, 0)
}

function hasEnteredTopicMarks(topics: TopicMark[]) {
  return topics.some((topic) => topic.marks.trim() !== "")
}

export default function MarksEntryPage() {
  // Hierarchical filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")

  // Marks entry state
  const [selectedStudent, setSelectedStudent] = useState<MarksGridStudent | null>(null)
  const [marksInput, setMarksInput] = useState<Record<string, MarksInputEntry>>({})
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Data fetching
  const { data: courses } = useCourses()
  const { data: grades } = useGrades(selectedCourseId || undefined)
  const { data: sections } = useSections(selectedGradeId || undefined, selectedCourseId || undefined)
  const { data: schedules } = useExamSchedules(
    selectedSectionId ? { sectionId: selectedSectionId } : {}
  )
  const { data: marksGrid, isLoading: gridLoading } = useScheduleMarksGrid(selectedScheduleId || null)
  const upsertMarks = useUpsertStudentScheduleMarks()

  // Filter schedules that have papers (subjects configured)
  const schedulesWithPapers = (schedules || []).filter((s) => (s.papers?.length || 0) > 0)

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value)
    setSelectedGradeId("")
    setSelectedSectionId("")
    setSelectedScheduleId("")
    setSelectedStudent(null)
    setMarksInput({})
    setExpandedPaperId(null)
  }

  const handleGradeChange = (value: string) => {
    setSelectedGradeId(value)
    setSelectedSectionId("")
    setSelectedScheduleId("")
    setSelectedStudent(null)
    setMarksInput({})
    setExpandedPaperId(null)
  }

  const handleSectionChange = (value: string) => {
    setSelectedSectionId(value)
    setSelectedScheduleId("")
    setSelectedStudent(null)
    setMarksInput({})
    setExpandedPaperId(null)
  }

  const handleScheduleChange = (value: string) => {
    setSelectedScheduleId(value)
    setSelectedStudent(null)
    setMarksInput({})
    setExpandedPaperId(null)
  }

  const handleSelectStudent = (student: MarksGridStudent) => {
    setSelectedStudent(student)
    // Initialize marks input from existing data
    const initial: Record<string, MarksInputEntry> = {}
    for (const paper of marksGrid?.papers || []) {
      const existingMark = student.marks.find((m) => m.paperId === paper.paperId)
      const normalizedBreakup = normalizeBreakup(paper.paperId, existingMark?.breakup)
      initial[paper.paperId] = {
        marksObtained: hasEnteredTopicMarks(normalizedBreakup.topics)
          ? String(calculateTopicTotal(normalizedBreakup.topics))
          : existingMark?.marksObtained?.toString() ?? "",
        isAbsent: existingMark?.isAbsent ?? false,
        ...normalizedBreakup,
      }
    }
    setMarksInput(initial)
    setExpandedPaperId(marksGrid?.papers[0]?.paperId ?? null)
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

  const addTopic = (paperId: string, topic = "") => {
    setMarksInput((previous) => {
      const current = previous[paperId]
      if (!current) return previous

      const alreadyAdded = current.topics.some(
        (item) => item.topic.trim().toLowerCase() === topic.trim().toLowerCase(),
      )
      if (topic && alreadyAdded) return previous

      return {
        ...previous,
        [paperId]: {
          ...current,
          topics: [...current.topics, { id: topicId(paperId), topic, marks: "" }],
        },
      }
    })
  }

  const updateTopic = (
    paperId: string,
    topicEntryId: string,
    field: "topic" | "marks",
    value: string,
  ) => {
    setMarksInput((previous) => {
      const current = previous[paperId]
      if (!current) return previous

      const topics = current.topics.map((topic) =>
        topic.id === topicEntryId ? { ...topic, [field]: value } : topic,
      )

      return {
        ...previous,
        [paperId]: {
          ...current,
          topics,
          marksObtained: hasEnteredTopicMarks(topics)
            ? String(calculateTopicTotal(topics))
            : current.marksObtained,
        },
      }
    })
  }

  const removeTopic = (paperId: string, topicEntryId: string) => {
    setMarksInput((previous) => {
      const current = previous[paperId]
      if (!current) return previous

      const topics = current.topics.filter((topic) => topic.id !== topicEntryId)
      return {
        ...previous,
        [paperId]: {
          ...current,
          topics,
          marksObtained: hasEnteredTopicMarks(topics)
            ? String(calculateTopicTotal(topics))
            : current.marksObtained,
        },
      }
    })
  }

  const handleSaveMarks = useCallback(async () => {
    if (!selectedScheduleId || !selectedStudent) return

    for (const paper of marksGrid?.papers || []) {
      const input = marksInput[paper.paperId]
      if (!input || input.isAbsent) continue

      const invalidTopic = input.topics.find(
        (topic) =>
          (topic.topic.trim() && topic.marks.trim() === "") ||
          (!topic.topic.trim() && topic.marks.trim() !== "") ||
          (topic.marks.trim() !== "" && (!Number.isFinite(Number(topic.marks)) || Number(topic.marks) < 0)),
      )
      if (invalidTopic) {
        toast.error(`Complete the topic name and valid marks for ${paper.subjectName}`)
        return
      }

      const obtained = input.marksObtained === "" ? null : Number(input.marksObtained)
      if (obtained !== null && (!Number.isFinite(obtained) || obtained < 0 || obtained > paper.maxMarks)) {
        toast.error(`${paper.subjectName} marks must be between 0 and ${paper.maxMarks}`)
        return
      }
    }

    setSaving(true)
    try {
      const marks = (marksGrid?.papers || []).map((paper) => {
        const input = marksInput[paper.paperId]
        const completedTopics = (input?.topics || [])
          .filter((topic) => topic.topic.trim() && topic.marks.trim() !== "")
          .map((topic) => ({
            topic: topic.topic.trim(),
            marks: Number(topic.marks),
          }))
        const breakupObj =
          completedTopics.length > 0 || Object.keys(input?.breakupBase || {}).length > 0
            ? {
                ...(input?.breakupBase || {}),
                topics: completedTopics,
              }
            : null

        return {
          paperId: paper.paperId,
          marksObtained:
            input?.isAbsent || !input?.marksObtained
              ? null
              : Number(input.marksObtained),
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <PageHeader
        title="Marks Entry"
        description="Select course, grade, section, and exam to enter marks"
      />

      {/* Hierarchical Filters */}
      <Card className="gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Select Section & Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Course */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
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
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
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
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
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

            {/* Exam Schedule */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Exam Schedule
              </Label>
              <Select
                value={selectedScheduleId}
                onValueChange={handleScheduleChange}
                disabled={!selectedSectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedSectionId ? "Select exam" : "Select section first"} />
                </SelectTrigger>
                <SelectContent>
                  {schedulesWithPapers.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.exam?.name || schedule.name} - {new Date(schedule.endDate).toLocaleDateString()}
                    </SelectItem>
                  ))}
                  {schedulesWithPapers.length === 0 && selectedSectionId && (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No exam schedules found for this section
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Student List */}
              <Card className="gap-0 overflow-hidden py-0 lg:col-span-1">
                <CardHeader className="border-b border-border/60 px-4 py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    Students ({marksGrid.students.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-22rem)] overflow-y-auto scrollbar-thin">
                    {marksGrid.students.map((student) => (
                      <button
                        key={student.enrollmentId}
                        onClick={() => handleSelectStudent(student)}
                        className={`w-full border-b px-3.5 py-2.5 text-left transition-colors hover:bg-muted/50 ${
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
              <Card className="gap-0 overflow-hidden py-0 lg:col-span-3">
                <CardHeader className="border-b border-border/60 bg-gradient-to-r from-blue-50/70 via-transparent to-violet-50/60 px-5 py-4 dark:from-blue-950/20 dark:to-violet-950/20">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-400 dark:ring-blue-800/50">
                        <FileText className="h-[18px] w-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="break-words text-base leading-5">
                          {selectedStudent ? (
                            <>Marks for {selectedStudent.studentName}</>
                          ) : (
                            "Select a student"
                          )}
                        </CardTitle>
                        {selectedStudent && (
                          <CardDescription className="mt-1 text-xs">
                            Roll: {selectedStudent.rollNumber} · Enter a total or divide it into subject topics
                          </CardDescription>
                        )}
                      </div>
                    </div>
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
                  </div>
                </CardHeader>
                <CardContent className="max-h-[calc(100vh-22rem)] overflow-y-auto px-3.5 py-3.5 scrollbar-thin sm:px-4">
                  {!selectedStudent ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a student from the list to enter marks</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {marksGrid.papers.map((paper) => {
                        const input = marksInput[paper.paperId] || {
                          marksObtained: "",
                          isAbsent: false,
                          topics: [],
                          breakupBase: {},
                        }
                        const topicTotal = calculateTopicTotal(input.topics)
                        const isCalculated = hasEnteredTopicMarks(input.topics)
                        const score = input.marksObtained === "" ? null : Number(input.marksObtained)
                        const scoreTooHigh = score !== null && score > paper.maxMarks
                        const suggestions = getSuggestedTopics(paper.subjectName)
                        const isExpanded = expandedPaperId === paper.paperId
                        const addedTopics = new Set(
                          input.topics.map((topic) => topic.topic.trim().toLowerCase()),
                        )

                        return (
                          <section
                            key={paper.paperId}
                            className={`overflow-hidden rounded-xl border transition-colors ${
                              input.isAbsent
                                ? "border-rose-200/80 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/10"
                                : "border-border/70 bg-gradient-to-br from-white to-slate-50/60 dark:from-card dark:to-slate-950/20"
                            }`}
                          >
                            <div
                              className={`flex flex-wrap items-center justify-between gap-2.5 px-3 py-2.5 ${
                                isExpanded ? "border-b border-border/60" : ""
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPaperId((current) =>
                                    current === paper.paperId ? null : paper.paperId,
                                  )
                                }
                                className="group/subject flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-expanded={isExpanded}
                                aria-controls={`paper-details-${paper.paperId}`}
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-violet-500/10 text-primary ring-1 ring-primary/15 transition-transform group-hover/subject:scale-105">
                                  <BookOpen className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="break-words text-sm font-semibold">{paper.subjectName}</h3>
                                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                                    Max {paper.maxMarks} · Pass {paper.passMarks}
                                  </p>
                                </div>
                              </button>

                              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                                <Badge
                                  variant={scoreTooHigh ? "destructive" : "secondary"}
                                  className="text-[10px] font-medium"
                                >
                                  {input.isAbsent ? "No score" : `${input.marksObtained || "—"} / ${paper.maxMarks}`}
                                </Badge>
                                {input.topics.length > 0 && (
                                  <Badge variant="outline" className="text-[10px] font-normal">
                                    {input.topics.length} {input.topics.length === 1 ? "topic" : "topics"}
                                  </Badge>
                                )}
                                <Button
                                  type="button"
                                  variant={input.isAbsent ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => handleAbsentToggle(paper.paperId)}
                                  className="h-7 min-w-[72px] px-2 text-xs"
                                >
                                  {input.isAbsent ? (
                                    <><X className="mr-1 h-3 w-3" /> Absent</>
                                  ) : (
                                    <><Check className="mr-1 h-3 w-3" /> Present</>
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setExpandedPaperId((current) =>
                                      current === paper.paperId ? null : paper.paperId,
                                    )
                                  }
                                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${paper.subjectName}`}
                                  className="h-7 w-7 text-muted-foreground"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {isExpanded && (input.isAbsent ? (
                              <div
                                id={`paper-details-${paper.paperId}`}
                                className="flex items-center gap-2 px-3.5 py-3 text-xs text-muted-foreground"
                              >
                                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                                This student is marked absent. Marks are not required for this subject.
                              </div>
                            ) : (
                              <div
                                id={`paper-details-${paper.paperId}`}
                                className="grid gap-3 p-3 xl:grid-cols-[155px_minmax(0,1fr)]"
                              >
                                <div className="rounded-lg border border-primary/15 bg-primary/[0.035] p-3">
                                  <Label
                                    htmlFor={`marks-${paper.paperId}`}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                                  >
                                    <Calculator className="h-3.5 w-3.5" />
                                    Marks obtained
                                  </Label>
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <Input
                                      id={`marks-${paper.paperId}`}
                                      type="number"
                                      min={0}
                                      max={paper.maxMarks}
                                      value={input.marksObtained}
                                      onChange={(event) => handleMarksChange(paper.paperId, event.target.value)}
                                      readOnly={isCalculated}
                                      className={`h-9 min-w-0 text-center text-sm font-semibold ${
                                        scoreTooHigh ? "border-destructive text-destructive" : ""
                                      } ${isCalculated ? "bg-muted/50" : ""}`}
                                      placeholder="Score"
                                    />
                                    <span className="shrink-0 text-sm text-muted-foreground">
                                      / {paper.maxMarks}
                                    </span>
                                  </div>
                                  {isCalculated ? (
                                    <p className="mt-1.5 text-[10px] leading-4 text-primary">
                                      Calculated from topics.
                                    </p>
                                  ) : (
                                    <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">
                                      Enter directly or add topics.
                                    </p>
                                  )}
                                  {scoreTooHigh && (
                                    <p className="mt-1.5 text-[10px] text-destructive">
                                      Total cannot exceed {paper.maxMarks}.
                                    </p>
                                  )}
                                </div>

                                <div className="min-w-0 rounded-lg border border-border/60 bg-background/70 p-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                      <h4 className="text-sm font-medium">Topic breakup</h4>
                                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        Separate the score into topics.
                                      </p>
                                    </div>
                                    <Badge
                                      variant={topicTotal > paper.maxMarks ? "destructive" : "secondary"}
                                      className="text-[10px]"
                                    >
                                      Topic total: {topicTotal}
                                    </Badge>
                                  </div>

                                  {input.topics.length > 0 && (
                                    <div className="mt-2.5 space-y-1.5">
                                      <div className="grid grid-cols-[minmax(0,1fr)_88px_32px] gap-2 px-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                        <span>Topic</span>
                                        <span className="text-center">Marks</span>
                                        <span className="sr-only">Remove</span>
                                      </div>
                                      {input.topics.map((topic) => (
                                        <div
                                          key={topic.id}
                                          className="grid grid-cols-[minmax(0,1fr)_88px_32px] items-center gap-2"
                                        >
                                          <Input
                                            value={topic.topic}
                                            onChange={(event) =>
                                              updateTopic(paper.paperId, topic.id, "topic", event.target.value)
                                            }
                                            placeholder="e.g. Algebra"
                                            className="h-8 min-w-0 text-xs"
                                          />
                                          <Input
                                            type="number"
                                            min={0}
                                            max={paper.maxMarks}
                                            value={topic.marks}
                                            onChange={(event) =>
                                              updateTopic(paper.paperId, topic.id, "marks", event.target.value)
                                            }
                                            placeholder="0"
                                            aria-label={`Marks for ${topic.topic || "topic"}`}
                                            className="h-8 text-center text-xs"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeTopic(paper.paperId, topic.id)}
                                            aria-label={`Remove ${topic.topic || "topic"}`}
                                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                    <span className="mr-0.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                      <Sparkles className="h-3 w-3" />
                                      Suggested:
                                    </span>
                                    {suggestions.map((topic) => {
                                      const isAdded = addedTopics.has(topic.toLowerCase())
                                      return (
                                        <Button
                                          key={topic}
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          disabled={isAdded}
                                          onClick={() => addTopic(paper.paperId, topic)}
                                          className="h-7 rounded-full px-2.5 text-[11px]"
                                        >
                                          {isAdded ? <Check className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
                                          {topic}
                                        </Button>
                                      )
                                    })}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => addTopic(paper.paperId)}
                                      className="h-7 rounded-full px-2.5 text-[11px] text-primary"
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Custom topic
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </section>
                        )
                      })}
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
