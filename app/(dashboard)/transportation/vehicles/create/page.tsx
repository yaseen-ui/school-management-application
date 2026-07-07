"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useCreateVehicle, useVehicleCategories } from "@/hooks/use-transportation"
import { Loader2, ArrowLeft, Save, Truck } from "lucide-react"
import { toast } from "@/components/ui/sonner"

const vehicleStatuses = ["Active", "Inactive", "Maintenance", "Retired"] as const

export default function CreateVehiclePage() {
  const router = useRouter()
  const createVehicle = useCreateVehicle()
  const { data: categoriesData } = useVehicleCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    registrationNumber: "",
    capacity: 1,
    description: "",
    status: "Active" as string,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = categoriesData || []

  // Auto-populate capacity when category is selected
  const handleCategoryChange = (value: string) => {
    const cat = categories.find((c: any) => c.id === value)
    setFormData({
      ...formData,
      categoryId: value,
      capacity: cat?.occupancy || 1,
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.categoryId) newErrors.categoryId = "Category is required"
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = "Capacity must be at least 1"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createVehicle.mutateAsync({
        categoryId: formData.categoryId,
        name: formData.name,
        registrationNumber: formData.registrationNumber || null,
        capacity: formData.capacity,
        description: formData.description || null,
        status: formData.status,
      })
      toast.success("Vehicle created successfully")
      router.push("/transportation/vehicles")
    } catch (error) {
      toast.error("Failed to create vehicle")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Vehicles", href: "/transportation/vehicles" },
          { label: "Create" },
        ]}
      />
      <PageHeader title="Create Vehicle" description="Add a new vehicle to the fleet.">
        <Button variant="outline" onClick={() => router.push("/transportation/vehicles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-semibold">Vehicle Details</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Bus 01, Van 05"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.type} - {cat.occupancy} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    placeholder="e.g. KA-01-AB-1234"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (seats) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    placeholder="e.g. 40"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                  {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about this vehicle..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/transportation/vehicles")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Vehicle
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
