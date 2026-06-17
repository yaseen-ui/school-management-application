"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  iconClassName?: string
  /** Theme color for the icon container: 'primary' | 'emerald' | 'amber' | 'violet' | 'sky' */
  iconTheme?: 'primary' | 'emerald' | 'amber' | 'violet' | 'sky'
}

const iconThemeStyles: Record<string, { container: string; icon: string }> = {
  primary: { container: 'bg-primary/10', icon: 'text-primary' },
  emerald: { container: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400' },
  amber: { container: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-600 dark:text-amber-400' },
  violet: { container: 'bg-violet-50 dark:bg-violet-500/10', icon: 'text-violet-600 dark:text-violet-400' },
  sky: { container: 'bg-sky-50 dark:bg-sky-500/10', icon: 'text-sky-600 dark:text-sky-400' },
}

export function StatCard({ title, value, description, icon: Icon, trend, className, iconClassName, iconTheme = 'primary' }: StatCardProps) {
  const theme = iconThemeStyles[iconTheme] || iconThemeStyles.primary

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card
        className={cn(
          "relative overflow-hidden border-border/60 bg-card transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          className,
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
              {trend && (
                <p
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}% from last month
                </p>
              )}
            </div>
            <div className={cn("rounded-xl p-3", theme.container, iconClassName)}>
              <Icon className={cn("h-5 w-5", theme.icon)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
