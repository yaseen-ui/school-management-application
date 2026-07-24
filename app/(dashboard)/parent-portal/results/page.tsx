"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Trophy,
  Loader2,
  ChevronRight,
  Medal,
  Target,
  FileText,
} from "lucide-react"
import { useParentProfile, useChildrenResults, type ExamResult, type ChildResult } from "@/hooks/use-parent-portal"
import { GradeBadge } from "@/components/parent/grade-badge"
import { ResultCard } from "@/components/parent/result-card"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function ResultsPage() {
  const { data: parent } = useParentProfile()
  const { data: examResults, isLoading } = useChildrenResults()
  const [selectedExamIdx, setSelectedExamIdx] = useState(0)
  const [selectedChildIdx, setSelectedChildIdx] = useState<Record<string, number>>({})

  const students = parent?.students ?? []
  const selectedExam = examResults?.[selectedExamIdx] ?? null

  const getSelectedChild = (examIdx: number): ChildResult | null => {
    const exam = examResults?.[examIdx]
    if (!exam) return null
    const childIdx = selectedChildIdx[exam.examId] ?? 0
    return exam.children[childIdx] ?? null
  }

  const selectedChild = selectedExam ? getSelectedChild(selectedExamIdx) : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="h-10 w-10 text-primary/60" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/parent-portal"
          className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Results</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Exam performance & grades</p>
        </div>
      </motion.div>

      {/* Empty state */}
      {!examResults || examResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Results Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Results haven't been published yet. Check back once exams are completed and graded.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Exam tabs selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {examResults.map((exam: ExamResult, idx: number) => (
              <button
                key={exam.examId}
                onClick={() => setSelectedExamIdx(idx)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  selectedExamIdx === idx
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {exam.examName}
                <span className="ml-1.5 text-[10px] opacity-70">{exam.examType}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedExam && selectedChild && (
              <motion.div
                key={selectedExam.examId + selectedChild.studentId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Child selector & Grade ribbon */}
                {selectedExam.children.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {selectedExam.children.map((child, idx) => (
                      <button
                        key={child.studentId}
                        onClick={() =>
                          setSelectedChildIdx((prev) => ({
                            ...prev,
                            [selectedExam.examId]: idx,
                          }))
                        }
                        className={cn(
                          "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                          (selectedChildIdx[selectedExam.examId] ?? 0) === idx
                            ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        {child.studentName.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                )}

                {/* Result Hero Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Grade Badge */}
                    <div className="shrink-0">
                      <GradeBadge grade={selectedChild.gradeLabel || "—"} size="lg" />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-xl font-bold text-foreground">{selectedChild.studentName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedChild.gradeName}
                        {selectedChild.sectionName ? ` · ${selectedChild.sectionName}` : ""}
                        {selectedChild.rollNumber ? ` · Roll #${selectedChild.rollNumber}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {selectedExam.examName} · {selectedChild.scheduleName}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {selectedChild.percentage !== null ? `${selectedChild.percentage}%` : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Percentage</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {selectedChild.totalMarks}/{selectedChild.totalMaxMarks}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            selectedChild.isPassed === true
                              ? "text-emerald-600"
                              : selectedChild.isPassed === false
                                ? "text-red-600"
                                : "text-muted-foreground"
                          )}
                        >
                          {selectedChild.isPassed === true ? "PASS" : selectedChild.isPassed === false ? "FAIL" : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Result</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Subject-wise Results */}
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 px-1">
                    Subject Performance
                  </h3>
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 sm:p-4 divide-y divide-border/30">
                    {selectedChild.subjects.map((subject, i) => (
                      <ResultCard key={subject.subjectName} subject={subject} index={i} />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}