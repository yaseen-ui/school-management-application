"use client"

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react"
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
  AreaChart,
  Area,
  Cell,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GradeBadge } from "@/components/parent/grade-badge"
import { RankShieldCard } from "@/components/student-dashboard/rank-shield-card"
import { TrendingUp, TrendingDown, Minus, Sparkles, Layers3, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProgressPoint, SelectedExam, DashboardSubject, TopicBreakupItem } from "@/lib/api/student-dashboard"

const ALL_SUBJECTS = "__all__"

interface PerformancePanelProps {
  selectedExam: SelectedExam | null
  progress: ProgressPoint[]
  trendDelta: number | null
}

/** Vibrant subject palette — cycles so charts never look monochrome */
const SUBJECT_PALETTE = [
  { fill: "#6366f1", soft: "rgba(99,102,241,0.18)", name: "indigo" },
  { fill: "#06b6d4", soft: "rgba(6,182,212,0.18)", name: "cyan" },
  { fill: "#f59e0b", soft: "rgba(245,158,11,0.18)", name: "amber" },
  { fill: "#10b981", soft: "rgba(16,185,129,0.18)", name: "emerald" },
  { fill: "#ec4899", soft: "rgba(236,72,153,0.18)", name: "pink" },
  { fill: "#8b5cf6", soft: "rgba(139,92,246,0.18)", name: "violet" },
  { fill: "#f97316", soft: "rgba(249,115,22,0.18)", name: "orange" },
  { fill: "#14b8a6", soft: "rgba(20,184,166,0.18)", name: "teal" },
]

const CLASS_AVG_COLOR = "#94a3b8"
const PROGRESS_GRADIENT = { from: "#6366f1", to: "#06b6d4" }

function subjectPct(obtained: number | null, max: number, isAbsent: boolean) {
  if (isAbsent || obtained == null || max <= 0) return null
  return Math.round((obtained / max) * 1000) / 10
}

function paletteAt(index: number) {
  return SUBJECT_PALETTE[index % SUBJECT_PALETTE.length]
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function parseTopics(subject: DashboardSubject): TopicBreakupItem[] {
  const breakup = subject.breakup
  if (!breakup || typeof breakup !== "object") return []
  const raw = Array.isArray(breakup.topics) ? (breakup.topics as unknown[]) : []

  const parsed: TopicBreakupItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const row = item as Record<string, unknown>
    const topic =
      typeof row.topic === "string" && row.topic.trim() ? row.topic.trim() : "Topic"
    const marks = asFiniteNumber(row.marks)
    if (marks == null) continue
    const maxMarks =
      asFiniteNumber(row.maxMarks) ?? asFiniteNumber(row.totalMarks)

    parsed.push({ topic, marks, maxMarks })
  }
  return parsed
}

function pctTone(pct: number | null) {
  if (pct == null) return "text-muted-foreground"
  if (pct >= 85) return "text-emerald-600 dark:text-emerald-400"
  if (pct >= 70) return "text-cyan-600 dark:text-cyan-400"
  if (pct >= 50) return "text-amber-600 dark:text-amber-400"
  return "text-rose-600 dark:text-rose-400"
}

function pctBarTone(pct: number | null) {
  if (pct == null) return "bg-muted"
  if (pct >= 85) return "from-emerald-400 to-emerald-600"
  if (pct >= 70) return "from-cyan-400 to-indigo-500"
  if (pct >= 50) return "from-amber-400 to-orange-500"
  return "from-rose-400 to-rose-600"
}

function ChartTooltipShell({
  active,
  label,
  children,
}: {
  active?: boolean
  label?: string
  children: ReactNode
}) {
  if (!active) return null
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 px-3 py-2.5 shadow-xl backdrop-blur-md">
      {label ? <p className="mb-1.5 text-xs font-semibold text-foreground">{label}</p> : null}
      <div className="space-y-1 text-xs text-muted-foreground">{children}</div>
    </div>
  )
}

export function PerformancePanel({ selectedExam, progress, trendDelta }: PerformancePanelProps) {
  const overall = selectedExam?.overall
  const subjects = selectedExam?.subjects ?? []
  const [topicSubjectFilter, setTopicSubjectFilter] = useState<string>(ALL_SUBJECTS)

  // Reset subject filter when exam (or subject set) changes
  useEffect(() => {
    setTopicSubjectFilter(ALL_SUBJECTS)
  }, [selectedExam?.scheduleId])

  const radarData = useMemo(
    () =>
      subjects
        .map((s, i) => {
          const pct = subjectPct(s.marksObtained, s.maxMarks, s.isAbsent)
          if (pct == null) return null
          const color = paletteAt(i)
          return {
            subject: s.subjectName.length > 12 ? s.subjectName.slice(0, 11) + "…" : s.subjectName,
            fullName: s.subjectName,
            me: pct,
            class: s.classAverage?.avgPercentage ?? 0,
            hasClass: s.classAverage != null,
            color: color.fill,
            soft: color.soft,
          }
        })
        .filter(Boolean) as {
        subject: string
        fullName: string
        me: number
        class: number
        hasClass: boolean
        color: string
        soft: string
      }[],
    [subjects],
  )

  const barData = useMemo(
    () =>
      subjects.map((s, i) => {
        const me = subjectPct(s.marksObtained, s.maxMarks, s.isAbsent)
        const color = paletteAt(i)
        return {
          subject: s.subjectName.length > 12 ? s.subjectName.slice(0, 11) + "…" : s.subjectName,
          fullName: s.subjectName,
          me: me ?? 0,
          classAvg: s.classAverage?.avgPercentage ?? null,
          isAbsent: s.isAbsent,
          marks: s.isAbsent
            ? "Absent"
            : s.marksObtained != null
              ? `${s.marksObtained}/${s.maxMarks}`
              : "—",
          fill: color.fill,
          soft: color.soft,
        }
      }),
    [subjects],
  )

  const progressData = useMemo(
    () =>
      progress
        .filter((p) => p.percentage != null)
        .map((p, i) => ({
          name: p.name.length > 16 ? p.name.slice(0, 15) + "…" : p.name,
          fullName: p.name,
          percentage: p.percentage as number,
          fill: paletteAt(i).fill,
        })),
    [progress],
  )

  /** Flattened topic rows for stacked / horizontal topic chart */
  const topicChartData = useMemo(() => {
    const rows: {
      key: string
      label: string
      topic: string
      subject: string
      percentage: number
      marks: number
      maxMarks: number
      fill: string
      subjectIndex: number
    }[] = []

    subjects.forEach((s, si) => {
      if (s.isAbsent) return
      const topics = parseTopics(s)
      const color = paletteAt(si)
      topics.forEach((t, ti) => {
        const max = t.maxMarks && t.maxMarks > 0 ? t.maxMarks : null
        const marks = t.marks
        if (marks == null) return
        const percentage =
          max != null ? Math.round((marks / max) * 1000) / 10 : null
        if (percentage == null) return
        rows.push({
          key: `${s.subjectName}-${t.topic}-${ti}`,
          label: t.topic.length > 14 ? t.topic.slice(0, 13) + "…" : t.topic,
          topic: t.topic,
          subject: s.subjectName,
          percentage,
          marks,
          maxMarks: max ?? 0,
          fill: color.fill,
          subjectIndex: si,
        })
      })
    })
    return rows
  }, [subjects])

  const topicsBySubject = useMemo(() => {
    return subjects
      .map((s, i) => {
        const topics = parseTopics(s)
          .map((t) => {
            const max = t.maxMarks && t.maxMarks > 0 ? t.maxMarks : null
            const marks = t.marks
            if (marks == null) return null
            const percentage =
              max != null ? Math.round((marks / max) * 1000) / 10 : null
            return {
              topic: t.topic,
              marks,
              maxMarks: max,
              percentage,
            }
          })
          .filter(Boolean) as {
          topic: string
          marks: number
          maxMarks: number | null
          percentage: number | null
        }[]
        if (!topics.length) return null
        return {
          subject: s.subjectName,
          subjectPct: subjectPct(s.marksObtained, s.maxMarks, s.isAbsent),
          color: paletteAt(i),
          topics,
        }
      })
      .filter(Boolean) as {
      subject: string
      subjectPct: number | null
      color: (typeof SUBJECT_PALETTE)[number]
      topics: {
        topic: string
        marks: number
        maxMarks: number | null
        percentage: number | null
      }[]
    }[]
  }, [subjects])

  const subjectFilterOptions = useMemo(
    () => topicsBySubject.map((g) => g.subject),
    [topicsBySubject],
  )

  const filteredTopicChartData = useMemo(() => {
    if (topicSubjectFilter === ALL_SUBJECTS) return topicChartData
    return topicChartData.filter((row) => row.subject === topicSubjectFilter)
  }, [topicChartData, topicSubjectFilter])

  const filteredTopicsBySubject = useMemo(() => {
    if (topicSubjectFilter === ALL_SUBJECTS) return topicsBySubject
    return topicsBySubject.filter((g) => g.subject === topicSubjectFilter)
  }, [topicsBySubject, topicSubjectFilter])

  // If selected subject no longer exists (e.g. switched exam), fall back to all
  useEffect(() => {
    if (
      topicSubjectFilter !== ALL_SUBJECTS &&
      !subjectFilterOptions.includes(topicSubjectFilter)
    ) {
      setTopicSubjectFilter(ALL_SUBJECTS)
    }
  }, [topicSubjectFilter, subjectFilterOptions])

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

  const chartId = selectedExam.scheduleId.replace(/[^a-zA-Z0-9]/g, "")

  return (
    <div className="space-y-4">
      {/* Overall summary */}
      <motion.div
        key={selectedExam.scheduleId + "-summary"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-indigo-500/[0.07] via-card/80 to-cyan-500/[0.07] backdrop-blur-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:gap-6">
                {overall?.gradeLabel && <GradeBadge grade={overall.gradeLabel} size="lg" />}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Overall · {selectedExam.scheduleName || selectedExam.examName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl dark:from-indigo-400 dark:to-cyan-400">
                      {overall?.percentage != null ? `${overall.percentage}%` : "—"}
                    </span>
                    {overall?.total != null && overall?.max != null && (
                      <span className="text-sm text-muted-foreground">
                        {overall.total}/{overall.max} marks
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    {overall?.classAvgPercentage != null && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-muted-foreground">
                        Class avg{" "}
                        <span className="font-semibold text-foreground">
                          {overall.classAvgPercentage}%
                        </span>
                      </span>
                    )}
                    {overall?.rank != null && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-800 dark:text-amber-200">
                        Rank #{overall.rank}
                        {overall.cohortSize != null ? ` / ${overall.cohortSize}` : ""}
                      </span>
                    )}
                    {trendDelta != null && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium",
                          trendDelta > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : trendDelta < 0
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-muted text-muted-foreground",
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

              <RankShieldCard
                rank={overall?.rank ?? null}
                cohortSize={overall?.cohortSize ?? null}
                className="mx-auto sm:mx-0 sm:shrink-0"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Radar — multi-tone gradients */}
        <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Subject radar
                </CardTitle>
                <CardDescription className="mt-1">
                  Strength profile vs class average
                </CardDescription>
              </div>
            </div>
            {radarData.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {radarData.map((d) => (
                  <Badge
                    key={d.fullName}
                    variant="outline"
                    className="border-0 px-2 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: d.soft, color: d.color }}
                  >
                    {d.fullName}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[320px]">
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="52%" outerRadius="72%">
                  <defs>
                    <linearGradient id={`radarMe-${chartId}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.45} />
                    </linearGradient>
                    <linearGradient id={`radarClass-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.08} />
                    </linearGradient>
                    <filter id={`radarGlow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <PolarGrid
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.7}
                    gridType="polygon"
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    tickCount={5}
                    axisLine={false}
                  />
                  {radarData.some((d) => d.hasClass) && (
                    <Radar
                      name="Class avg"
                      dataKey="class"
                      stroke={CLASS_AVG_COLOR}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill={`url(#radarClass-${chartId})`}
                      fillOpacity={1}
                      isAnimationActive
                    />
                  )}
                  <Radar
                    name="Your child"
                    dataKey="me"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill={`url(#radarMe-${chartId})`}
                    fillOpacity={1}
                    filter={`url(#radarGlow-${chartId})`}
                    dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                    isAnimationActive
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    formatter={(value) => (
                      <span className="text-muted-foreground">{value}</span>
                    )}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      const row = payload?.[0]?.payload as
                        | (typeof radarData)[number]
                        | undefined
                      if (!active || !row) return null
                      return (
                        <ChartTooltipShell active label={row.fullName}>
                          <p className="flex items-center gap-2">
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ background: row.color }}
                            />
                            Score{" "}
                            <span className={cn("font-semibold", pctTone(row.me))}>
                              {row.me}%
                            </span>
                          </p>
                          {row.hasClass && (
                            <p>
                              Class avg{" "}
                              <span className="font-semibold text-foreground">{row.class}%</span>
                            </p>
                          )}
                        </ChartTooltipShell>
                      )
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : radarData.length > 0 ? (
              /* 1–2 subjects: colorful radial-style bars instead of a flat radar */
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={radarData}
                  layout="vertical"
                  margin={{ left: 8, right: 16, top: 12, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    width={80}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      const row = payload?.[0]?.payload as
                        | (typeof radarData)[number]
                        | undefined
                      if (!active || !row) return null
                      return (
                        <ChartTooltipShell active label={row.fullName}>
                          <p>
                            Score <span className="font-semibold text-foreground">{row.me}%</span>
                          </p>
                          {row.hasClass && (
                            <p>
                              Class avg{" "}
                              <span className="font-semibold text-foreground">{row.class}%</span>
                            </p>
                          )}
                        </ChartTooltipShell>
                      )
                    }}
                  />
                  <Bar dataKey="me" name="Your child" radius={[0, 8, 8, 0]} barSize={18}>
                    {radarData.map((d) => (
                      <Cell key={d.fullName} fill={d.color} />
                    ))}
                  </Bar>
                  {radarData.some((d) => d.hasClass) && (
                    <Bar
                      dataKey="class"
                      name="Class avg"
                      fill={CLASS_AVG_COLOR}
                      fillOpacity={0.45}
                      radius={[0, 8, 8, 0]}
                      barSize={10}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                No subject scores to chart for this exam.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bars vs class avg — multi-color cells */}
        <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-600 dark:text-cyan-400">
                <Activity className="h-4 w-4" />
              </span>
              Marks vs class average
            </CardTitle>
            <CardDescription>Each subject in its own color</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[320px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 4, right: 16, top: 12, bottom: 8 }}
                  barCategoryGap="18%"
                >
                  <defs>
                    {barData.map((d, i) => (
                      <linearGradient
                        key={`barGrad-${chartId}-${i}`}
                        id={`barGrad-${chartId}-${i}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={d.fill} stopOpacity={0.75} />
                        <stop offset="100%" stopColor={d.fill} stopOpacity={1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.55}
                  />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    width={78}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                  />
                  <ReferenceLine x={35} stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity={0.45} />
                  <Tooltip
                    content={({ active, payload }) => {
                      const row = payload?.[0]?.payload as (typeof barData)[number] | undefined
                      if (!active || !row) return null
                      return (
                        <ChartTooltipShell active label={`${row.fullName} · ${row.marks}`}>
                          <p className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-sm"
                              style={{ background: row.fill }}
                            />
                            Score{" "}
                            <span className={cn("font-semibold", pctTone(row.me || null))}>
                              {row.isAbsent ? "Absent" : `${row.me}%`}
                            </span>
                          </p>
                          {row.classAvg != null && (
                            <p className="flex items-center gap-2">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-sm"
                                style={{ background: CLASS_AVG_COLOR }}
                              />
                              Class avg{" "}
                              <span className="font-semibold text-foreground">{row.classAvg}%</span>
                            </p>
                          )}
                        </ChartTooltipShell>
                      )
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value) =>
                      value === "me" ? (
                        <span className="text-muted-foreground">Your child</span>
                      ) : (
                        <span className="text-muted-foreground">Class avg</span>
                      )
                    }
                  />
                  <Bar dataKey="me" name="me" radius={[0, 8, 8, 0]} barSize={14} maxBarSize={18}>
                    {barData.map((d, i) => (
                      <Cell
                        key={d.fullName}
                        fill={`url(#barGrad-${chartId}-${i})`}
                        opacity={d.isAbsent ? 0.35 : 1}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="classAvg"
                    name="classAvg"
                    fill={CLASS_AVG_COLOR}
                    fillOpacity={0.4}
                    radius={[0, 6, 6, 0]}
                    barSize={8}
                    maxBarSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No subject marks for this exam.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Topic-wise breakup */}
      {topicsBySubject.length > 0 && (
        <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-pink-500/20 text-amber-600 dark:text-amber-400">
                    <Layers3 className="h-4 w-4" />
                  </span>
                  Topic-wise breakup
                </CardTitle>
                <CardDescription>
                  Detailed topic scores from marks entry — where strength and gaps show up
                </CardDescription>
              </div>
              <div className="w-full shrink-0 space-y-1.5 sm:w-[220px]">
                <Label htmlFor="topic-subject-filter" className="text-xs text-muted-foreground">
                  Subject
                </Label>
                <Select value={topicSubjectFilter} onValueChange={setTopicSubjectFilter}>
                  <SelectTrigger id="topic-subject-filter" className="w-full rounded-xl bg-background/80">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_SUBJECTS}>All subjects</SelectItem>
                    {subjectFilterOptions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compact multi-color topic bars chart when we have topics */}
            {filteredTopicChartData.length > 0 ? (
              <div
                className="min-h-[200px] w-full"
                style={
                  {
                    height: Math.min(380, Math.max(200, 56 + filteredTopicChartData.length * 30)),
                  } as CSSProperties
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredTopicChartData}
                    layout="vertical"
                    margin={{ left: 4, right: 20, top: 4, bottom: 4 }}
                    barCategoryGap="22%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={96}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <ReferenceLine x={50} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} />
                    <Tooltip
                      content={({ active, payload }) => {
                        const row = payload?.[0]?.payload as
                          | (typeof filteredTopicChartData)[number]
                          | undefined
                        if (!active || !row) return null
                        return (
                          <ChartTooltipShell active label={`${row.subject} · ${row.topic}`}>
                            <p>
                              {row.marks}/{row.maxMarks}{" "}
                              <span className={cn("font-semibold", pctTone(row.percentage))}>
                                ({row.percentage}%)
                              </span>
                            </p>
                          </ChartTooltipShell>
                        )
                      }}
                    />
                    <Bar dataKey="percentage" name="Topic %" radius={[0, 8, 8, 0]} barSize={12}>
                      {filteredTopicChartData.map((d) => (
                        <Cell key={d.key} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                No topic scores for this subject.
              </div>
            )}

            {/* Subject cards with topic progress strips */}
            <div
              className={cn(
                "grid gap-3",
                filteredTopicsBySubject.length === 1
                  ? "grid-cols-1"
                  : "sm:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {filteredTopicsBySubject.map((group) => (
                <motion.div
                  key={group.subject}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4 shadow-sm"
                  style={{
                    boxShadow: `inset 3px 0 0 0 ${group.color.fill}`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: group.color.fill }}
                      />
                      <p className="truncate text-sm font-semibold text-foreground">
                        {group.subject}
                      </p>
                    </div>
                    {group.subjectPct != null && (
                      <span className={cn("text-sm font-bold tabular-nums", pctTone(group.subjectPct))}>
                        {group.subjectPct}%
                      </span>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {group.topics.map((t) => (
                      <div key={t.topic} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="truncate text-muted-foreground">{t.topic}</span>
                          <span className="shrink-0 tabular-nums text-foreground/80">
                            {t.marks}
                            {t.maxMarks != null ? `/${t.maxMarks}` : ""}
                            {t.percentage != null ? (
                              <span className={cn("ml-1 font-semibold", pctTone(t.percentage))}>
                                {t.percentage}%
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted/80">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, t.percentage ?? 0)}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              pctBarTone(t.percentage),
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress across exams — gradient area */}
      {progressData.length >= 2 && (
        <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-600 dark:text-violet-400">
                <TrendingUp className="h-4 w-4" />
              </span>
              Progress across released exams
            </CardTitle>
            <CardDescription>Overall percentage journey over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ left: 4, right: 16, top: 16, bottom: 4 }}>
                <defs>
                  <linearGradient id={`progressFill-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PROGRESS_GRADIENT.from} stopOpacity={0.45} />
                    <stop offset="55%" stopColor={PROGRESS_GRADIENT.to} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={PROGRESS_GRADIENT.to} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id={`progressStroke-${chartId}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={PROGRESS_GRADIENT.from} />
                    <stop offset="100%" stopColor={PROGRESS_GRADIENT.to} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.55} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" width={42} />
                <Tooltip
                  content={({ active, payload }) => {
                    const row = payload?.[0]?.payload as
                      | (typeof progressData)[number]
                      | undefined
                    if (!active || !row) return null
                    return (
                      <ChartTooltipShell active label={row.fullName}>
                        <p>
                          Overall{" "}
                          <span className={cn("font-semibold", pctTone(row.percentage))}>
                            {row.percentage}%
                          </span>
                        </p>
                      </ChartTooltipShell>
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke={`url(#progressStroke-${chartId})`}
                  strokeWidth={3}
                  fill={`url(#progressFill-${chartId})`}
                  dot
                  activeDot
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
