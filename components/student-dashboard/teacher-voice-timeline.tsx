"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, BookOpen, CalendarCheck, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { TimelineItem } from "@/lib/api/student-dashboard"
import { format, parseISO, isValid } from "date-fns"

const typeMeta: Record<
  string,
  { label: string; icon: typeof BookOpen; color: string; bg: string }
> = {
  exam_remark: {
    label: "Exam",
    icon: BookOpen,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  attendance_remark: {
    label: "Attendance",
    icon: CalendarCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  communication: {
    label: "Message",
    icon: MessageSquare,
    color: "text-sky-600",
    bg: "bg-sky-500/10",
  },
}

function formatAt(at: string) {
  try {
    const d = typeof at === "string" ? parseISO(at) : new Date(at)
    if (!isValid(d)) return ""
    return format(d, "d MMM")
  } catch {
    return ""
  }
}

interface TeacherVoiceTimelineProps {
  timeline: TimelineItem[]
  from: "parent" | "staff"
}

export function TeacherVoiceTimeline({ timeline, from }: TeacherVoiceTimelineProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-sky-600" />
          Teacher voice
        </CardTitle>
        {from === "parent" && (
          <Link
            href="/parent-portal/communications"
            className="text-xs font-medium text-primary inline-flex items-center hover:underline"
          >
            Inbox <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No remarks or messages yet. Notes from teachers and school will show up here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {timeline.map((item, i) => {
              const meta = typeMeta[item.type] ?? typeMeta.communication
              const Icon = meta.icon
              const content = (
                <div
                  className={cn(
                    "flex gap-3 p-3 rounded-xl hover:bg-accent/40 transition-colors",
                    item.deepLink && from === "parent" && "cursor-pointer group"
                  )}
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                      meta.bg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", meta.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {formatAt(item.at)}
                      </span>
                      <span className={cn("text-[10px] font-medium", meta.color)}>
                        {meta.label}
                      </span>
                      {item.subjectName && (
                        <span className="text-[10px] text-muted-foreground">
                          · {item.subjectName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                      {item.title}
                    </p>
                    {item.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {item.body}
                      </p>
                    )}
                    {item.teacherName && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        — {item.teacherName}
                      </p>
                    )}
                  </div>
                  {item.deepLink && from === "parent" && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 self-center transition-colors" />
                  )}
                </div>
              )

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  {item.deepLink && from === "parent" ? (
                    <Link href={item.deepLink} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </motion.li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
