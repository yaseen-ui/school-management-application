"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useCreateVehicleCategory } from "@/hooks/use-transportation"
import { Loader2, ArrowLeft, Save, Car } from "lucide-react"
import { toast } from "@/components/ui/sonner"

const vehicleTypes = ["Bus", "Van", "Car", "Auto", "Mini Bus", "School Bus", "Other"] as const

export default function CreateVehicleCategoryPage() {
  const router = useRouter()
  const createCategory = useCreateVehicleCategory()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    occupancy: 1,
    amenities: "",
    description: "",
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.occupancy || formData.occupancy < 1) newErrors.occupancy = "Occupancy must be at least 1"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createCategory.mutateAsync({
        name: formData.name,
        type: formData.type,
        occupancy: formData.occupancy,
        amenities: formData.amenities || null,
        description: formData.description || null,
        isActive: formData.isActive,
      })
      toast.success("Vehicle category created successfully")
      router.push("/transportation/vehicle-categories")
    } catch (error) {
      toast.error("Failed to create vehicle category")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Vehicle Categories", href: "/transportation/vehicle-categories" },
          { label: "Create" },
        ]}
      />
      <PageHeader title="Create Vehicle Category" description="Define a new vehicle category like Deluxe Bus, AC Van, etc.">
        <Button variant="outline" onClick={() => router.push("/transportation/vehicle-categories")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="font-semibold">Category Details</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Deluxe Bus, AC Van"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupancy">Occupancy (seats) *</Label>
                  <Input
                    id="occupancy"
                    type="number"
                    min={1}
                    placeholder="e.g. 40"
                    value={formData.occupancy}
                    onChange={(e) => setFormData({ ...formData, occupancy: parseInt(e.target.value) || 0 })}
                  />
                  {errors.occupancy && <p className="text-sm text-destructive">{errors.occupancy}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input
                    id="amenities"
                    placeholder="e.g. AC, WiFi, Pushback Seats"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this vehicle category..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/transportation/vehicle-categories")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Category
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
