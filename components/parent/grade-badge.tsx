"use client"

import { cn } from "@/lib/utils"

interface GradeBadgeProps {
  grade: string
  size?: "sm" | "md" | "lg"
}

const gradeStyles: Record<string, string> = {
  "A+": "bg-emerald-500 text-white shadow-emerald-500/30",
  "A": "bg-emerald-400 text-white shadow-emerald-400/20",
  "B+": "bg-amber-400 text-white shadow-amber-400/20",
  "B": "bg-amber-500 text-white shadow-amber-500/20",
  "C": "bg-orange-400 text-white shadow-orange-400/20",
  "D": "bg-red-400 text-white shadow-red-400/20",
  "F": "bg-red-600 text-white shadow-red-600/30",
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const style = gradeStyles[grade] ?? "bg-muted text-muted-foreground"

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-110",
        style,
        sizeClasses[size]
      )}
    >
      {grade}
    </div>
  )
}