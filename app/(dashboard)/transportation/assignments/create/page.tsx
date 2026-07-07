"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import {
  useCreateTransportAssignment,
  usePickupPoints,
  useVehicles,
  useVehicleCategories,
  useVehicleAvailability,
} from "@/hooks/use-transportation"
import { useEnrollments } from "@/hooks/use-enrollments"
import { Loader2, ArrowLeft, Save, Bus } from "lucide-react"
import { toast } from "@/components/ui/sonner"

export default function CreateTransportAssignmentPage() {
  const router = useRouter()
  const createAssignment = useCreateTransportAssignment()
  const { data: enrollmentsData } = useEnrollments()
  const { data: pickupPointsData } = usePickupPoints()
  const { data: vehiclesData } = useVehicles()
  const { data: categoriesData } = useVehicleCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    enrollmentId: "",
    pickupPointId: "",
    vehicleId: "",
    categoryId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const enrollments = enrollmentsData || []
  const pickupPoints = pickupPointsData || []
  const vehicles = vehiclesData || []
  const categories = categoriesData || []

  const { data: availability } = useVehicleAvailability(formData.vehicleId)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.enrollmentId) newErrors.enrollmentId = "Student is required"
    if (!formData.pickupPointId) newErrors.pickupPointId = "Pickup point is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return

    if (formData.vehicleId && availability?.data?.isFull) {
      toast.error("Selected vehicle is fully booked. Please choose another vehicle or leave it for auto-assign.")
      return
    }

    setIsSubmitting(true)
    try {
      await createAssignment.mutateAsync({
        enrollmentId: formData.enrollmentId,
        pickupPointId: formData.pickupPointId,
        vehicleId: formData.vehicleId || null,
        categoryId: formData.categoryId || null,
        isActive: true,
      })
      toast.success("Transport assignment created successfully")
      router.push("/transportation/assignments")
    } catch (error) {
      toast.error("Failed to create transport assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Assignments", href: "/transportation/assignments" },
          { label: "Create" },
        ]}
      />
      <PageHeader title="Create Transport Assignment" description="Assign a student to a pickup point and vehicle.">
        <Button variant="outline" onClick={() => router.push("/transportation/assignments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                <span className="font-semibold">Assignment Details</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentId">Student *</Label>
                <Select
                  value={formData.enrollmentId}
                  onValueChange={(value) => setFormData({ ...formData, enrollmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollments.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.student?.firstName} {e.student?.lastName} - {e.grade?.gradeName} {e.section?.sectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.enrollmentId && <p className="text-sm text-destructive">{errors.enrollmentId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupPointId">Pickup Point *</Label>
                <Select
                  value={formData.pickupPointId}
                  onValueChange={(value) => setFormData({ ...formData, pickupPointId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup point" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupPoints.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.latitude}, {p.longitude})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pickupPointId && <p className="text-sm text-destructive">{errors.pickupPointId}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Vehicle Category (Optional)</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle (Optional)</Label>
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
                          {v.name} {v.registrationNumber ? `(${v.registrationNumber})` : ""} - Cap: {v.capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availability?.data && (
                    <p className={`text-xs ${availability.data.isFull ? "text-destructive" : "text-green-600"}`}>
                      {availability.data.isFull
                        ? "This vehicle is fully booked"
                        : `${availability.data.availableSeats} seat(s) available`}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/transportation/assignments")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Assignment
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
