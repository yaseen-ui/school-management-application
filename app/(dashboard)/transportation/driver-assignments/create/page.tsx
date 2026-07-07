"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useCreateDriverAssignment, useVehicles } from "@/hooks/use-transportation"
import { useTeachers } from "@/hooks/use-teachers"
import { Loader2, ArrowLeft, Save, UserCheck } from "lucide-react"
import { toast } from "@/components/ui/sonner"

export default function CreateDriverAssignmentPage() {
  const router = useRouter()
  const createAssignment = useCreateDriverAssignment()
  const { data: vehiclesData } = useVehicles()
  const { data: teachersData } = useTeachers()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    isPrimaryDriver: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const vehicles = vehiclesData || []
  const teachers = teachersData || []

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required"
    if (!formData.driverId) newErrors.driverId = "Driver is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createAssignment.mutateAsync({
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        isPrimaryDriver: formData.isPrimaryDriver,
        assignedDate: new Date().toISOString(),
        status: "Active",
      })
      toast.success("Driver assigned to vehicle successfully")
      router.push("/transportation/driver-assignments")
    } catch (error) {
      toast.error("Failed to assign driver")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Driver Assignments", href: "/transportation/driver-assignments" },
          { label: "Create" },
        ]}
      />
      <PageHeader title="Assign Driver to Vehicle" description="Assign a driver to a vehicle.">
        <Button variant="outline" onClick={() => router.push("/transportation/driver-assignments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <span className="font-semibold">Assignment Details</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} {v.registrationNumber ? `(${v.registrationNumber})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverId">Driver *</Label>
                <Select
                  value={formData.driverId}
                  onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.fullName} {t.employeeCode ? `(${t.employeeCode})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driverId && <p className="text-sm text-destructive">{errors.driverId}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPrimaryDriver"
                  checked={formData.isPrimaryDriver}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrimaryDriver: checked === true })}
                />
                <Label htmlFor="isPrimaryDriver">Primary Driver</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/transportation/driver-assignments")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Assign Driver
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
