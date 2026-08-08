"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradeBadge } from "@/components/parent/grade-badge"
import { cn } from "@/lib/utils"
import type { SelectedExam } from "@/lib/api/student-dashboard"

interface MarksTableProps {
  selectedExam: SelectedExam | null
}

export function MarksTable({ selectedExam }: MarksTableProps) {
  if (!selectedExam || !selectedExam.subjects.length) {
    return null
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Marks detail · {selectedExam.scheduleName || selectedExam.examName}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <th className="pb-2 pr-3 font-semibold">Subject</th>
              <th className="pb-2 pr-3 font-semibold">Marks</th>
              <th className="pb-2 pr-3 font-semibold">Pass</th>
              <th className="pb-2 pr-3 font-semibold">Grade</th>
              <th className="pb-2 font-semibold">Class avg</th>
            </tr>
          </thead>
          <tbody>
            {selectedExam.subjects.map((s, i) => {
              const pct =
                !s.isAbsent && s.marksObtained != null && s.maxMarks > 0
                  ? Math.round((s.marksObtained / s.maxMarks) * 100)
                  : null
              return (
                <motion.tr
                  key={`${s.subjectId ?? s.subjectName}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="py-3 pr-3">
                    <p className="font-medium text-foreground">{s.subjectName}</p>
                    {s.remarks && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        “{s.remarks}”
                      </p>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    {s.isAbsent ? (
                      <span className="text-muted-foreground">Absent</span>
                    ) : (
                      <span>
                        {s.marksObtained ?? "—"}/{s.maxMarks}
                        {pct != null && (
                          <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">{s.passMarks}</td>
                  <td className="py-3 pr-3">
                    {s.gradeLabel ? (
                      <div className="scale-75 origin-left">
                        <GradeBadge grade={s.gradeLabel} size="sm" />
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3">
                    {s.classAverage ? (
                      <span
                        className={cn(
                          "text-sm",
                          pct != null &&
                            s.classAverage.avgPercentage != null &&
                            pct >= s.classAverage.avgPercentage
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        )}
                      >
                        {s.classAverage.avgPercentage != null
                          ? `${s.classAverage.avgPercentage}%`
                          : s.classAverage.avgMarks}
                        <span className="text-[10px] ml-1 opacity-70">
                          (n={s.classAverage.sampleSize})
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
