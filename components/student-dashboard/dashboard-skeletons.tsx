"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6 pb-16 md:pb-8" aria-busy="true" aria-label="Loading student dashboard">
      {/* Hero */}
      <div className="rounded-2xl sm:rounded-3xl bg-muted/60 p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-48 max-w-full" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* Exam selector + overall */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-[280px] rounded-xl" />
      </div>
      <Card className="border-border/50">
        <CardContent className="p-6 flex gap-4 items-center">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[260px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[260px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>

      {/* Attendance + timeline */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
