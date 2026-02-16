"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerInput } from "@/components/ui/date-picker"
import { useUpdateTeacher } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"
import { useState } from "react"

const GENDERS = ["Male", "Female", "Other"]

interface EditTeacherDialogProps {
  teacher: Teacher
  onClose: () => void
}

export function EditTeacherDialog({ teacher, onClose }: EditTeacherDialogProps) {
  const [formData, setFormData] = useState({
    firstName: teacher.firstName,
    middleName: teacher.middleName || "",
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth,
    dateOfJoining: teacher.dateOfJoining,
    employeeCode: teacher.employeeCode,
  })

  const updateTeacher = useUpdateTeacher()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTeacher.mutate(
      { teacherId: teacher.id, data: formData },
      {
        onSuccess: () => onClose(),
      },
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Middle Name</Label>
              <Input
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <DatePickerInput
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                onChange={(date) => setFormData({ ...formData, dateOfBirth: date?.toISOString() || "" })}
                maxDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Joining *</Label>
              <DatePickerInput
                value={formData.dateOfJoining ? new Date(formData.dateOfJoining) : undefined}
                onChange={(date) => setFormData({ ...formData, dateOfJoining: date?.toISOString() || "" })}
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Employee Code *</Label>
            <Input
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateTeacher.isPending}>
              {updateTeacher.isPending ? "Updating..." : "Update Teacher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
