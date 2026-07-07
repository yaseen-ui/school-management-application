"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useCreatePickupPoint } from "@/hooks/use-transportation"
import { Loader2, ArrowLeft, Save, MapPin } from "lucide-react"
import { toast } from "@/components/ui/sonner"

export default function CreatePickupPointPage() {
  const router = useRouter()
  const createPickupPoint = useCreatePickupPoint()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.latitude) newErrors.latitude = "Latitude is required"
    if (!formData.longitude) newErrors.longitude = "Longitude is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createPickupPoint.mutateAsync({
        name: formData.name,
        address: formData.address || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        isActive: formData.isActive,
      })
      toast.success("Pickup point created successfully")
      router.push("/transportation/pickup-points")
    } catch (error) {
      toast.error("Failed to create pickup point")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Pickup Points", href: "/transportation/pickup-points" },
          { label: "Create" },
        ]}
      />
      <PageHeader title="Create Pickup Point" description="Add a new pickup point with GPS coordinates.">
        <Button variant="outline" onClick={() => router.push("/transportation/pickup-points")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold">Pickup Point Details</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pickup Point Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Main Gate, Bus Stop A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Full address of the pickup point..."
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 12.9716"
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 77.5946"
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
                </div>
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
            <Button type="button" variant="outline" onClick={() => router.push("/transportation/pickup-points")}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Pickup Point
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
