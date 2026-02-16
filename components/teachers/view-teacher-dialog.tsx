"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Teacher } from "@/lib/api/teachers"
import { format } from "date-fns"
import { FileText } from "lucide-react"

interface ViewTeacherDialogProps {
  teacher: Teacher
  onClose: () => void
}

export function ViewTeacherDialog({ teacher, onClose }: ViewTeacherDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo */}
          {teacher.photoUrl && (
            <div className="flex justify-center">
              <img
                src={teacher.photoUrl || "/placeholder.svg"}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-border"
              />
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">
                  {teacher.firstName} {teacher.middleName} {teacher.lastName}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Employee Code:</span>
                <p className="font-medium">{teacher.employeeCode}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{teacher.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{teacher.phone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <p className="font-medium">{teacher.gender}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p className="font-medium">
                  {teacher.dateOfBirth ? format(new Date(teacher.dateOfBirth), "MMM dd, yyyy") : "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Joining:</span>
                <p className="font-medium">
                  {teacher.dateOfJoining ? format(new Date(teacher.dateOfJoining), "MMM dd, yyyy") : "—"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Qualifications */}
          <div>
            <h3 className="font-semibold mb-3">Qualifications</h3>
            {teacher.qualifications && teacher.qualifications.length > 0 ? (
              <div className="space-y-3">
                {teacher.qualifications.map((qual) => (
                  <div key={qual.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{qual.degreeName}</p>
                        <p className="text-sm text-muted-foreground">{qual.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Year: {format(new Date(qual.yearOfCompletion), "yyyy")}
                        </p>
                      </div>
                      {qual.certificateUrl && (
                        <a href={qual.certificateUrl} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="cursor-pointer">
                            <FileText className="h-3 w-3 mr-1" />
                            Certificate
                          </Badge>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No qualifications added</p>
            )}
          </div>

          <Separator />

          {/* Employment History */}
          <div>
            <h3 className="font-semibold mb-3">Employment History</h3>
            {teacher.employmentHistory && teacher.employmentHistory.length > 0 ? (
              <div className="space-y-3">
                {teacher.employmentHistory.map((history) => (
                  <div key={history.id} className="border rounded-lg p-3">
                    <p className="font-medium">{history.designation}</p>
                    <p className="text-sm text-muted-foreground">{history.institutionName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(history.startDate), "MMM yyyy")} -{" "}
                      {history.endDate ? format(new Date(history.endDate), "MMM yyyy") : "Present"}
                    </p>
                    {history.responsibilities && (
                      <p className="text-sm mt-2 text-muted-foreground">{history.responsibilities}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No employment history added</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
