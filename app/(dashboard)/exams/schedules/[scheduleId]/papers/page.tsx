"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Plus, ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExamPapers, useUpdateExamPaper, useDeleteExamPaper, useExamSchedule } from "@/hooks/use-exams"
import { useSectionSubjects } from "@/hooks/use-section-subjects"
import { useTeachers } from "@/hooks/use-teachers"
import { RoomSelectorDialog } from "@/components/shared/room-selector-dialog"
import { toast } from "@/components/ui/sonner"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { ExamSchedulePaper } from "@/lib/api/exams"

/**
 * Calculate duration in minutes between two time strings (HH:mm)
 */
function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return ""

  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return ""

  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (endMinutes <= startMinutes) return ""

  return String(endMinutes - startMinutes)
}

export default function SchedulePapersPage() {
  const params = useParams()
  const scheduleId = params.scheduleId as string

  const { data: schedule } = useExamSchedule(scheduleId)
  const { data: papersData, isLoading } = useExamPapers(scheduleId)
  const updatePaper = useUpdateExamPaper()
  const deletePaper = useDeleteExamPaper()

  const sectionId = schedule?.data?.sectionId
  const { data: sectionSubjects } = useSectionSubjects(sectionId ? { sectionId } : undefined)
  const { data: teachers } = useTeachers()

  const [newPaper, setNewPaper] = useState({
    sectionSubjectId: "",
    examDate: "",
    startTime: "",
    endTime: "",
    durationMinutes: "",
    roomId: "",
    roomDisplay: "",
    inChargeId: "",
  })

  const papers: ExamSchedulePaper[] = papersData || []

  // Auto-calculate duration for new paper form
  useEffect(() => {
    if (newPaper.startTime && newPaper.endTime) {
      const duration = calculateDuration(newPaper.startTime, newPaper.endTime)
      if (duration) {
        setNewPaper((prev) => ({ ...prev, durationMinutes: duration }))
      }
    }
  }, [newPaper.startTime, newPaper.endTime])

  const handleAddPaper = async () => {
    if (!newPaper.sectionSubjectId || !newPaper.examDate) {
      toast.error("Subject and date are required")
      return
    }

    try {
      const existingPapers = papers.map((p) => ({
        sectionSubjectId: p.sectionSubjectId,
        examDate: p.examDate,
        startTime: p.startTime,
        endTime: p.endTime,
        durationMinutes: p.durationMinutes || undefined,
        room: p.room || undefined,
        inChargeId: p.inChargeId || undefined,
        maxMarks: p.maxMarks,
        passMarks: p.passMarks,
      }))

      const updatedPapers = [
        ...existingPapers,
        {
          sectionSubjectId: newPaper.sectionSubjectId,
          examDate: newPaper.examDate,
          startTime: newPaper.startTime || "",
          endTime: newPaper.endTime || "",
          durationMinutes: newPaper.durationMinutes ? Number.parseInt(newPaper.durationMinutes) : undefined,
          room: newPaper.roomId || undefined,
          inChargeId: newPaper.inChargeId || undefined,
          maxMarks: 100,
          passMarks: 35,
        },
      ]

      const response = await fetch(`/api/exams/schedules/${scheduleId}/papers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers: updatedPapers }),
      })

      if (!response.ok) throw new Error("Failed to add paper")

      setNewPaper({
        sectionSubjectId: "",
        examDate: "",
        startTime: "",
        endTime: "",
        durationMinutes: "",
        roomId: "",
        roomDisplay: "",
        inChargeId: "",
      })
      toast.success("Paper added successfully")
      window.location.reload()
    } catch (error) {
      toast.error("Failed to add paper")
    }
  }

  const handleUpdatePaper = async (paperId: string, field: string, value: string) => {
    try {
      await updatePaper.mutateAsync({
        id: paperId,
        data: { [field]: value },
      })
    } catch (error) {
      toast.error("Failed to update paper")
    }
  }

  const handleDeletePaper = async (paperId: string) => {
    try {
      await deletePaper.mutateAsync(paperId)
      toast.success("Paper removed")
    } catch (error) {
      toast.error("Failed to delete paper")
    }
  }

  const getSubjectName = (sectionSubjectId: string) => {
    const ss = sectionSubjects?.find((s: any) => s.id === sectionSubjectId)
    return ss?.subject?.subjectName || "Unknown Subject"
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers?.find((t: any) => t.id === teacherId)
    return teacher ? teacher.fullName || "Not assigned" : "Not assigned"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/exams/${schedule?.data?.examId || "#"}/schedules`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Schedules
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Papers${schedule?.data?.name ? ` - ${schedule.data.name}` : ""}`}
        description="Configure subject-wise exam schedule with dates, times, rooms, and invigilators"
      />

      {/* Add New Paper Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Subject Paper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Subject <span className="text-destructive">*</span></Label>
              <Select
                value={newPaper.sectionSubjectId}
                onValueChange={(value) => setNewPaper((prev) => ({ ...prev, sectionSubjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {(sectionSubjects || []).map((ss: any) => (
                    <SelectItem key={ss.id} value={ss.id}>
                      {ss.subject?.subjectName || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={newPaper.examDate}
                onChange={(e) => setNewPaper((prev) => ({ ...prev, examDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={newPaper.startTime}
                onChange={(e) => setNewPaper((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={newPaper.endTime}
                onChange={(e) => setNewPaper((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="Auto-calculated"
                value={newPaper.durationMinutes}
                readOnly
                className="bg-muted/50 cursor-not-allowed"
                tabIndex={-1}
              />
            </div>

            <div className="space-y-2">
              <Label>Classroom</Label>
              <RoomSelectorDialog
                selectedRoomId={newPaper.roomId}
                onRoomSelect={(info) =>
                  setNewPaper((prev) => ({ ...prev, roomId: info.roomId, roomDisplay: info.display }))
                }
                triggerLabel={newPaper.roomId ? newPaper.roomDisplay : "Select Room"}
              />
            </div>

            <div className="space-y-2">
              <Label>In-Charge</Label>
              <Select
                value={newPaper.inChargeId}
                onValueChange={(value) => setNewPaper((prev) => ({ ...prev, inChargeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {(teachers || []).map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddPaper} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Paper
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Subject Papers ({papers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No papers added yet. Add subjects above to create the exam schedule.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">From</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">To</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Classroom</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">In-Charge</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((paper) => (
                    <tr key={paper.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {paper.sectionSubject?.subject?.subjectName || getSubjectName(paper.sectionSubjectId)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          type="date"
                          defaultValue={paper.examDate?.split("T")[0] || ""}
                          onBlur={(e) => {
                            if (e.target.value !== paper.examDate?.split("T")[0]) {
                              handleUpdatePaper(paper.id, "examDate", e.target.value)
                            }
                          }}
                          className="h-8 w-36"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          type="time"
                          defaultValue={paper.startTime || ""}
                          onBlur={(e) => {
                            if (e.target.value !== paper.startTime) {
                              handleUpdatePaper(paper.id, "startTime", e.target.value)
                            }
                          }}
                          className="h-8 w-28"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          type="time"
                          defaultValue={paper.endTime || ""}
                          onBlur={(e) => {
                            if (e.target.value !== paper.endTime) {
                              handleUpdatePaper(paper.id, "endTime", e.target.value)
                            }
                          }}
                          className="h-8 w-28"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          type="number"
                          defaultValue={paper.durationMinutes?.toString() || ""}
                          placeholder="Minutes"
                          readOnly
                          className="h-8 w-24 bg-muted/50 cursor-not-allowed"
                          tabIndex={-1}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <RoomSelectorDialog
                          selectedRoomId={paper.room || undefined}
                          onRoomSelect={(info) => handleUpdatePaper(paper.id, "room", info.roomId)}
                          triggerLabel={paper.room ? "Change Room" : "Select Room"}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          defaultValue={paper.inChargeId || ""}
                          onValueChange={(value) => handleUpdatePaper(paper.id, "inChargeId", value)}
                        >
                          <SelectTrigger className="h-8 w-40">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {(teachers || []).map((teacher: any) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePaper(paper.id)}
                          disabled={deletePaper.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
