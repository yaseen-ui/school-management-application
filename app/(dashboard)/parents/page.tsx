"use client"

import { motion } from "framer-motion"
import { Users2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParents } from "@/hooks/use-parents"
import { ParentStatusBadge } from "@/components/parents/parent-status-badge"
import { InviteParentButton } from "@/components/parents/invite-parent-button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ParentsPage() {
  const { data: parents, isLoading } = useParents()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        description="Manage parent registrations and send invites."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !parents || parents.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Parents Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Parents are added when students are enrolled. Check your student records.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {parents.map((parent) => (
            <Card key={parent.id} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{parent.fullName}</CardTitle>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{parent.relation}</p>
                  </div>
                  <ParentStatusBadge isRegistered={parent.isRegistered} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Contact info */}
                <div className="space-y-1 text-sm">
                  {parent.phone && (
                    <p className="text-muted-foreground truncate">{parent.phone}</p>
                  )}
                  {parent.email && (
                    <p className="text-muted-foreground truncate text-xs">{parent.email}</p>
                  )}
                </div>

                {/* Linked students */}
                {parent.students.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Linked Students:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parent.students.map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-xs font-normal">
                          {s.firstName} {s.lastName}
                          {s.gradeName && ` · ${s.gradeName}`}
                          {s.sectionName && ` ${s.sectionName}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invite button */}
                <InviteParentButton
                  parentId={parent.id}
                  parentName={parent.fullName}
                  isRegistered={parent.isRegistered}
                />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  )
}