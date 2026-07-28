"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, GraduationCap, Mail, Phone, UserRound, Users2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParents } from "@/hooks/use-parents"
import { ParentStatusBadge } from "@/components/parents/parent-status-badge"
import { InviteParentButton } from "@/components/parents/invite-parent-button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Parent, ParentStudent } from "@/lib/api/parents"

interface StudentFamily {
  student: ParentStudent
  parents: Parent[]
}

const relationOrder: Record<string, number> = {
  father: 0,
  mother: 1,
  guardian: 2,
}

function relationRank(relation: string) {
  const normalized = relation.toLowerCase()
  if (normalized.includes("father")) return relationOrder.father
  if (normalized.includes("mother")) return relationOrder.mother
  return relationOrder.guardian
}

function groupParentsByStudent(parents: Parent[]): StudentFamily[] {
  const groups = new Map<string, StudentFamily>()

  parents.forEach((parent) => {
    parent.students.forEach((student) => {
      const existing = groups.get(student.id)
      if (existing) {
        if (!existing.parents.some((item) => item.id === parent.id)) {
          existing.parents.push(parent)
        }
      } else {
        groups.set(student.id, { student, parents: [parent] })
      }
    })
  })

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      parents: [...group.parents].sort(
        (a, b) => relationRank(a.relation) - relationRank(b.relation),
      ),
    }))
    .sort((a, b) => {
      const aName = `${a.student.firstName} ${a.student.lastName}`.trim()
      const bName = `${b.student.firstName} ${b.student.lastName}`.trim()
      return aName.localeCompare(bName)
    })
}

export default function ParentsPage() {
  const { data: parents, isLoading } = useParents()
  const [selectedContacts, setSelectedContacts] = useState<Record<string, string>>({})
  const studentFamilies = useMemo(
    () => groupParentsByStudent(parents ?? []),
    [parents],
  )

  return (
    <div className="space-y-5">
      <Breadcrumbs items={[{ label: "Parents" }]} />
      <PageHeader
        title="Students & Parents"
        description="View each student with their linked parents or guardians and manage invitations"
      />

      {isLoading ? (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="gap-0 overflow-hidden py-0">
              <CardHeader className="border-b border-border/60 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36 max-w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 py-4">
                <Skeleton className="h-[168px] w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : studentFamilies.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-400 dark:ring-blue-800/50">
              <Users2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium">No student families found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Parent and guardian records appear here when they are linked to students.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid items-stretch gap-3.5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {studentFamilies.map(({ student, parents: familyMembers }, index) => {
            const studentName = `${student.firstName} ${student.lastName}`.trim()
            const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase()
            const selectedContact =
              familyMembers.find((parent) => parent.id === selectedContacts[student.id]) ??
              familyMembers[0]

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.24) }}
                className="h-full"
              >
                <Card className="group relative h-full gap-0 overflow-hidden border-border/70 bg-gradient-to-br from-blue-50/75 via-white to-violet-50/35 py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/70 hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.42)] dark:from-blue-950/20 dark:via-card dark:to-violet-950/15 dark:hover:border-blue-700/70">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.15]"
                  />

                  <CardHeader className="relative gap-0 border-b border-border/50 px-4 pt-4 pb-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-sm font-semibold text-blue-700 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-300 dark:ring-blue-800/50">
                        {initials || <GraduationCap className="h-[18px] w-[18px]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="break-words text-base leading-5 tracking-tight [overflow-wrap:anywhere]">
                          {studentName}
                        </CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-x-1 text-xs">
                          {student.gradeName && <span>{student.gradeName}</span>}
                          {student.gradeName && student.sectionName && <span>•</span>}
                          {student.sectionName && <span>{student.sectionName}</span>}
                          {(student.gradeName || student.sectionName) && student.admissionNumber && <span>•</span>}
                          {student.admissionNumber && (
                            <span title="Admission number">Adm. {student.admissionNumber}</span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      >
                        {familyMembers.length} {familyMembers.length === 1 ? "contact" : "contacts"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="relative flex flex-1 px-3.5 py-3.5">
                    <div className="grid min-h-[168px] w-full grid-cols-[118px_minmax(0,1fr)] overflow-hidden rounded-xl border border-border/60 bg-white/75 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:grid-cols-[132px_minmax(0,1fr)] dark:bg-white/[0.035]">
                      <div className="border-r border-border/60 bg-muted/25 p-2">
                        <p className="px-1 pb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Family
                        </p>
                        <div className="max-h-[136px] space-y-1 overflow-y-auto pr-0.5">
                          {familyMembers.map((parent) => {
                            const isSelected = selectedContact?.id === parent.id

                            return (
                              <button
                                key={parent.id}
                                type="button"
                                onClick={() =>
                                  setSelectedContacts((current) => ({
                                    ...current,
                                    [student.id]: parent.id,
                                  }))
                                }
                                className={`group/contact flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left transition-all ${
                                  isSelected
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                                    : "text-muted-foreground hover:bg-background/65 hover:text-foreground"
                                }`}
                                aria-pressed={isSelected}
                              >
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-semibold ${
                                    isSelected
                                      ? "bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-300"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {parent.fullName
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((part) => part[0])
                                    .join("")
                                    .toUpperCase() || "G"}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[10px] font-medium capitalize">
                                    {parent.relation || "Guardian"}
                                  </span>
                                  <span className="block truncate text-[10px]" title={parent.fullName}>
                                    {parent.fullName}
                                  </span>
                                </span>
                                <ChevronRight
                                  className={`h-3 w-3 shrink-0 transition-transform ${
                                    isSelected ? "translate-x-0.5 text-primary" : "opacity-35"
                                  }`}
                                />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {selectedContact && (
                        <div className="flex min-w-0 flex-col p-3">
                          <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                            <div className="flex min-w-0 items-start gap-2">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-300">
                                <UserRound className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0">
                                <p className="break-words text-sm font-semibold leading-5 [overflow-wrap:anywhere]">
                                  {selectedContact.fullName}
                                </p>
                                <p className="text-[10px] capitalize text-muted-foreground">
                                  {selectedContact.relation || "Guardian"}
                                </p>
                              </div>
                            </div>
                            <ParentStatusBadge isRegistered={selectedContact.isRegistered} />
                          </div>

                          <div className="mt-3 min-w-0 space-y-1.5">
                            {selectedContact.phone && (
                              <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3 shrink-0" />
                                <span className="min-w-0 truncate">{selectedContact.phone}</span>
                              </p>
                            )}
                            {selectedContact.email && (
                              <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="min-w-0 truncate">{selectedContact.email}</span>
                              </p>
                            )}
                            {!selectedContact.phone && !selectedContact.email && (
                              <p className="text-xs text-muted-foreground">No contact details available</p>
                            )}
                          </div>

                          <InviteParentButton
                            parentId={selectedContact.id}
                            parentName={selectedContact.fullName}
                            isRegistered={selectedContact.isRegistered}
                            className="mt-auto w-full justify-center"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
