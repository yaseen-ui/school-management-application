"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  ClipboardCheck,
  Plus,
  Calendar,
  Users,
  Loader2,
  Eye,
  Trash2,
  BarChart3,
} from "lucide-react"
import { format } from "date-fns"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/shared/stat-card"

import { useAttendanceSessions, useDeleteAttendanceSession, useAttendanceSummary } from "@/hooks/use-attendance"
import { useSections } from "@/hooks/use-sections"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { CreateAttendanceSessionDialog } from "@/components/attendance/create-attendance-session-dialog"
import { AttendanceMarkingGrid } from "@/components/attendance/attendance-marking-grid"
import { ATTENDANCE_CONTEXT_TYPES, type AttendanceSession } from "@/lib/api/attendance"
import { toast } from "@/components/ui/sonner"

export default function AttendancePage() {
  const { data: sectionsData } = useSections()
  const { data: academicYearsData } = useAcademicYears()
  const deleteSession = useDeleteAttendanceSession()

  const sections: any[] = ((sectionsData as any)?.data?.rows as any[]) || (sectionsData as unknown as any[]) || []
  const academicYears: any[] = ((academicYearsData as any)?.data?.rows as any[]) || (academicYearsData as unknown as any[]) || []

  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedContextType, setSelectedContextType] = useState<string>("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<AttendanceSession | null>(null)
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null)

  // Auto-select active academic year
  const activeAcademicYear = useMemo(() => {
    return academicYears.find((y: any) => y.status === "active")
  }, [academicYears])

  useMemo(() => {
    if (!selectedAcademicYearId && activeAcademicYear) {
      setSelectedAcademicYearId(activeAcademicYear.id)
    }
  }, [activeAcademicYear, selectedAcademicYearId])

  // Build filters
  const filters = useMemo(() => {
    const f: Record<string, string> = {}
    if (selectedAcademicYearId) f.academicYearId = selectedAcademicYearId
    if (selectedSectionId) f.sectionId = selectedSectionId
    if (selectedDate) f.date = selectedDate
    if (selectedContextType) f.contextType = selectedContextType
    return f
  }, [selectedAcademicYearId, selectedSectionId, selectedDate, selectedContextType])

  const { data: sessions, isLoading } = useAttendanceSessions(Object.keys(filters).length > 0 ? filters : undefined)
  const { data: summary } = useAttendanceSummary(Object.keys(filters).length > 0 ? filters : undefined)

  const handleCreateSession = () => {
    setEditingSession(null)
    setCreateDialogOpen(true)
  }

  const handleEditSession = (session: AttendanceSession) => {
    setEditingSession(session)
    setCreateDialogOpen(true)
  }

  const handleDeleteSession = async (session: AttendanceSession) => {
    try {
      await deleteSession.mutateAsync(session.id)
      toast.success("Attendance session deleted")
      if (activeSession?.id === session.id) {
        setActiveSession(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session")
    }
  }

  const handleMarkAttendance = (session: AttendanceSession) => {
    setActiveSession(session)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Attendance"
          description="Create attendance sessions and mark student attendance"
        >
          <Button onClick={handleCreateSession}>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </PageHeader>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard
              title="Sessions"
              value={summary.totalSessions}
              icon={ClipboardCheck}
            />
            <StatCard
              title="Present"
              value={summary.present}
              icon={Users}
              className="border-green-200 bg-green-50/50"
            />
            <StatCard
              title="Absent"
              value={summary.absent}
              icon={Users}
              className="border-red-200 bg-red-50/50"
            />
            <StatCard
              title="Late"
              value={summary.late}
              icon={Users}
              className="border-yellow-200 bg-yellow-50/50"
            />
            <StatCard
              title="Half Day"
              value={summary.halfDay}
              icon={Users}
              className="border-orange-200 bg-orange-50/50"
            />
            <StatCard
              title="Excused"
              value={summary.excused}
              icon={Users}
              className="border-blue-200 bg-blue-50/50"
            />
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={selectedAcademicYearId} onValueChange={setSelectedAcademicYearId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {academicYears.map((y: any) => (
                      <SelectItem key={y.id} value={y.id}>
                        {y.name} {y.status === "active" ? "(Active)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.sectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Context Type</label>
                <Select value={selectedContextType} onValueChange={setSelectedContextType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {ATTENDANCE_CONTEXT_TYPES.map((ct) => (
                      <SelectItem key={ct.value} value={ct.value}>
                        {ct.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !sessions || sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <ClipboardCheck className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No sessions found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Create a new session to start marking attendance
                    </p>
                  </div>
                ) : (
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {sessions.map((session: AttendanceSession) => (
                      <div
                        key={session.id}
                        className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                          activeSession?.id === session.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                        }`}
                        onClick={() => handleMarkAttendance(session)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {session.section?.sectionName || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(session.date), "MMM d, yyyy")}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto">
                                {ATTENDANCE_CONTEXT_TYPES.find((ct) => ct.value === session.contextType)?.label || session.contextType}
                              </Badge>
                              {session._count && (
                                <span className="text-[10px] text-muted-foreground">
                                  {session._count.marks} marks
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditSession(session)
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSession(session)
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Marking grid */}
          <div className="lg:col-span-2">
            {activeSession ? (
              <AttendanceMarkingGrid session={activeSession} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardCheck className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">Select a session</h3>
                  <p className="text-sm text-muted-foreground/70 mt-1 max-w-md">
                    Choose an attendance session from the list to start marking student attendance
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      <CreateAttendanceSessionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        session={editingSession}
      />
    </>
  )
}
