"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Phone, MapPin, FileText, Heart } from "lucide-react"
import type { Student } from "@/lib/api/students"

interface ViewStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
}

export function ViewStudentDialog({ open, onOpenChange, student }: ViewStudentDialogProps) {
  if (!student) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <User className="h-4 w-4" />
              Basic Information
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {student.firstName} {student.middleName} {student.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <Badge variant="secondary" className="capitalize">
                  {student.gender}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <Badge variant="outline">{student.bloodGroup}</Badge>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          {(student.aadhaarNumber || student.nationality || student.religion) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <FileText className="h-4 w-4" />
                Personal Details
              </div>
              <div className="grid grid-cols-2 gap-4 pl-6">
                {student.aadhaarNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                    <p className="font-medium">{student.aadhaarNumber}</p>
                  </div>
                )}
                {student.nationality && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{student.nationality}</p>
                  </div>
                )}
                {student.religion && (
                  <div>
                    <p className="text-sm text-muted-foreground">Religion</p>
                    <p className="font-medium">{student.religion}</p>
                  </div>
                )}
                {student.motherTongue && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mother Tongue</p>
                    <p className="font-medium">{student.motherTongue}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Family Information */}
          {(student.fatherFirstName || student.motherFirstName) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Heart className="h-4 w-4" />
                Family Information
              </div>
              <div className="grid grid-cols-2 gap-4 pl-6">
                {student.fatherFirstName && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Father's Name</p>
                    <p className="font-medium">
                      {student.fatherFirstName} {student.fatherMiddleName} {student.fatherLastName}
                    </p>
                    {student.fatherPhone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {student.fatherPhone}
                      </p>
                    )}
                  </div>
                )}
                {student.motherFirstName && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Mother's Name</p>
                    <p className="font-medium">
                      {student.motherFirstName} {student.motherMiddleName} {student.motherLastName}
                    </p>
                    {student.motherPhone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {student.motherPhone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {student.permanentAddress && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Address
              </div>
              <div className="pl-6">
                <p className="font-medium">{student.permanentAddress}</p>
                <p className="text-sm text-muted-foreground">
                  {student.state} - {student.pincode}
                </p>
              </div>
            </div>
          )}

          {/* Enrollment Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Enrollment Information
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Enrolled On</p>
                <p className="font-medium">{formatDate(student.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(student.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
