"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradeBadge } from "@/components/parent/grade-badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProgressPoint, SelectedExam } from "@/lib/api/student-dashboard"

interface PerformancePanelProps {
  selectedExam: SelectedExam | null
  progress: ProgressPoint[]
  trendDelta: number | null
}

function subjectPct(obtained: number | null, max: number, isAbsent: boolean) {
  if (isAbsent || obtained == null || max <= 0) return null
  return Math.round((obtained / max) * 1000) / 10
}

export function PerformancePanel({ selectedExam, progress, trendDelta }: PerformancePanelProps) {
  const overall = selectedExam?.overall
  const subjects = selectedExam?.subjects ?? []

  const radarData = useMemo(
    () =>
      subjects
        .map((s) => {
          const pct = subjectPct(s.marksObtained, s.maxMarks, s.isAbsent)
          if (pct == null) return null
          return {
            subject: s.subjectName.length > 12 ? s.subjectName.slice(0, 11) + "…" : s.subjectName,
            fullName: s.subjectName,
            me: pct,
            class: s.classAverage?.avgPercentage ?? 0,
            hasClass: s.classAverage != null,
          }
        })
        .filter(Boolean) as { subject: string; fullName: string; me: number; class: number; hasClass: boolean }[],
    [subjects]
  )

  const barData = useMemo(
    () =>
      subjects.map((s) => {
        const me = subjectPct(s.marksObtained, s.maxMarks, s.isAbsent)
        return {
          subject: s.subjectName.length > 10 ? s.subjectName.slice(0, 9) + "…" : s.subjectName,
          fullName: s.subjectName,
          me: me ?? 0,
          classAvg: s.classAverage?.avgPercentage ?? null,
          isAbsent: s.isAbsent,
          marks: s.isAbsent ? "Absent" : s.marksObtained != null ? `${s.marksObtained}/${s.maxMarks}` : "—",
        }
      }),
    [subjects]
  )

  const progressData = useMemo(
    () =>
      progress
        .filter((p) => p.percentage != null)
        .map((p) => ({
          name: p.name.length > 14 ? p.name.slice(0, 13) + "…" : p.name,
          fullName: p.name,
          percentage: p.percentage as number,
        })),
    [progress]
  )

  if (!selectedExam) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No released results yet. Charts will appear once exams are published.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Overall summary */}
      <motion.div
        key={selectedExam.scheduleId + "-summary"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {overall?.gradeLabel && <GradeBadge grade={overall.gradeLabel} size="lg" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overall · {selectedExam.scheduleName || selectedExam.examName}
                </p>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {overall?.percentage != null ? `${overall.percentage}%` : "—"}
                  </span>
                  {overall?.total != null && overall?.max != null && (
                    <span className="text-sm text-muted-foreground">
                      {overall.total}/{overall.max} marks
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm">
                  {overall?.classAvgPercentage != null && (
                    <span className="text-muted-foreground">
                      Class avg{" "}
                      <span className="font-semibold text-foreground">
                        {overall.classAvgPercentage}%
                      </span>
                    </span>
                  )}
                  {trendDelta != null && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-medium",
                        trendDelta > 0
                          ? "text-emerald-600"
                          : trendDelta < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                      )}
                    >
                      {trendDelta > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : trendDelta < 0 ? (
                        <TrendingDown className="h-3.5 w-3.5" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                      {trendDelta > 0 ? "+" : ""}
                      {trendDelta}% vs previous
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Radar */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subject radar</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] sm:h-[300px]">
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <Radar
                    name="Your child"
                    dataKey="me"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.35}
                  />
                  {radarData.some((d) => d.hasClass) && (
                    <Radar
                      name="Class avg"
                      dataKey="class"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.12}
                    />
                  )}
                  <Legend />
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { fullName?: string })?.fullName ?? ""
                    }
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
                {radarData.length === 0
                  ? "No subject scores to chart for this exam."
                  : "Need at least 3 scored subjects for a radar chart."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bars vs class avg */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Marks vs class average</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] sm:h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    width={72}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value != null ? `${value}%` : "—",
                      name === "me" ? "Your child" : "Class avg",
                    ]}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as {
                        fullName?: string
                        marks?: string
                      }
                      return p ? `${p.fullName} (${p.marks})` : ""
                    }}
                  />
                  <Legend
                    formatter={(value) => (value === "me" ? "Your child" : "Class avg")}
                  />
                  <Bar dataKey="me" name="me" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar
                    dataKey="classAvg"
                    name="classAvg"
                    fill="hsl(var(--muted-foreground) / 0.45)"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No subject marks for this exam.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress across exams */}
      {progressData.length >= 2 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Progress across released exams</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px] sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" width={40} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Overall"]}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { fullName?: string })?.fullName ?? ""
                  }
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
