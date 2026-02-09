"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateTenant } from "@/hooks/use-tenants"
import type { UpdateTenantRequest } from "@/lib/api/types"
import { FileUpload } from "@/components/shared/file-upload"

interface TenantData {
  id: string
  schoolName: string
  domain?: string | null
  logo?: string | null
  caption?: string | null
  contactAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  contactPhone: string
  contactEmail: string
  adminFullName?: string
  adminPhone?: string
  adminEmail: string
  subscriptionPlan: string
  status?: string
  createdAt: string
  updatedAt: string
}

interface EditTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantData | null
}

interface FormData {
  schoolName: string
  domain: string
  caption: string
  logo: string
  contactAddressStreet: string
  contactAddressCity: string
  contactAddressState: string
  contactAddressZip: string
  contactPhone: string
  contactEmail: string
  adminFullName: string
  adminPhone: string
  adminEmail: string
  subscriptionPlan: "basic" | "standard" | "premium"
}

export function EditTenantDialog({ open, onOpenChange, tenant }: EditTenantDialogProps) {
  const { mutate: updateTenant, isPending } = useUpdateTenant()
  const [subscriptionPlan, setSubscriptionPlan] = useState<"basic" | "standard" | "premium">("basic")
  const [logoUrl, setLogoUrl] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (tenant && open) {
      reset({
        schoolName: tenant.schoolName,
        domain: tenant.domain || "",
        caption: tenant.caption || "",
        logo: tenant.logo || "",
        contactAddressStreet: tenant.contactAddress?.street || "",
        contactAddressCity: tenant.contactAddress?.city || "",
        contactAddressState: tenant.contactAddress?.state || "",
        contactAddressZip: tenant.contactAddress?.zip || "",
        contactPhone: tenant.contactPhone || "",
        contactEmail: tenant.contactEmail || "",
        adminFullName: tenant.adminFullName || "",
        adminPhone: tenant.adminPhone || "",
        adminEmail: tenant.adminEmail || "",
      })
      setSubscriptionPlan((tenant.subscriptionPlan as "basic" | "standard" | "premium") || "basic")
      setLogoUrl(tenant.logo || "")
    }
  }, [tenant, open, reset])

  const onSubmit = (data: FormData) => {
    if (!tenant) return

    const payload: UpdateTenantRequest = {
      schoolName: data.schoolName,
      domain: data.domain,
      caption: data.caption,
      logo: logoUrl,
      contactAddress: {
        street: data.contactAddressStreet,
        city: data.contactAddressCity,
        state: data.contactAddressState,
        zip: data.contactAddressZip,
      },
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      adminFullName: data.adminFullName,
      adminPhone: data.adminPhone,
      adminEmail: data.adminEmail,
      subscriptionPlan: subscriptionPlan,
    }

    updateTenant(
      { id: tenant.id, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
          <DialogDescription>Update the information for {tenant.schoolName}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b pb-2">School Information</h3>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                placeholder="Enter school name"
                {...register("schoolName", { required: "School name is required" })}
                className={errors.schoolName ? "border-destructive" : ""}
              />
              {errors.schoolName && <p className="text-sm text-destructive">{errors.schoolName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>School Logo</Label>
              <FileUpload
                category="tenants"
                entityId={tenant.id}
                documentType="logo"
                value={logoUrl}
                onUploadComplete={(url) => {
                  setLogoUrl(url)
                  setValue("logo", url)
                }}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                compact
              />
              <p className="text-xs text-muted-foreground">Upload a logo for the school (max 2MB)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="https://school.example.com"
                {...register("domain", { required: "Domain is required" })}
                className={errors.domain ? "border-destructive" : ""}
              />
              {errors.domain && <p className="text-sm text-destructive">{errors.domain.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Enter a brief description or tagline for the school"
                rows={2}
                {...register("caption", { required: "Caption is required" })}
                className={errors.caption ? "border-destructive" : ""}
              />
              {errors.caption && <p className="text-sm text-destructive">{errors.caption.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
              <Select
                value={subscriptionPlan}
                onValueChange={(v) => setSubscriptionPlan(v as "basic" | "standard" | "premium")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b pb-2">Contact Address</h3>

            <div className="space-y-2">
              <Label htmlFor="contactAddressStreet">Street</Label>
              <Input
                id="contactAddressStreet"
                placeholder="123 Main St"
                {...register("contactAddressStreet", { required: "Street is required" })}
                className={errors.contactAddressStreet ? "border-destructive" : ""}
              />
              {errors.contactAddressStreet && (
                <p className="text-sm text-destructive">{errors.contactAddressStreet.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactAddressCity">City</Label>
                <Input
                  id="contactAddressCity"
                  placeholder="Springfield"
                  {...register("contactAddressCity", { required: "City is required" })}
                  className={errors.contactAddressCity ? "border-destructive" : ""}
                />
                {errors.contactAddressCity && (
                  <p className="text-sm text-destructive">{errors.contactAddressCity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddressState">State</Label>
                <Input
                  id="contactAddressState"
                  placeholder="IL"
                  {...register("contactAddressState", { required: "State is required" })}
                  className={errors.contactAddressState ? "border-destructive" : ""}
                />
                {errors.contactAddressState && (
                  <p className="text-sm text-destructive">{errors.contactAddressState.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddressZip">ZIP Code</Label>
              <Input
                id="contactAddressZip"
                placeholder="515591"
                {...register("contactAddressZip", { required: "ZIP code is required" })}
                className={errors.contactAddressZip ? "border-destructive" : ""}
              />
              {errors.contactAddressZip && (
                <p className="text-sm text-destructive">{errors.contactAddressZip.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b pb-2">Contact Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="+917416557472"
                  {...register("contactPhone", { required: "Contact phone is required" })}
                  className={errors.contactPhone ? "border-destructive" : ""}
                />
                {errors.contactPhone && <p className="text-sm text-destructive">{errors.contactPhone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@school.com"
                  {...register("contactEmail", {
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.contactEmail ? "border-destructive" : ""}
                />
                {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b pb-2">Admin Information</h3>

            <div className="space-y-2">
              <Label htmlFor="adminFullName">Admin Full Name</Label>
              <Input
                id="adminFullName"
                placeholder="John Doe"
                {...register("adminFullName", { required: "Admin name is required" })}
                className={errors.adminFullName ? "border-destructive" : ""}
              />
              {errors.adminFullName && <p className="text-sm text-destructive">{errors.adminFullName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminPhone">Admin Phone</Label>
                <Input
                  id="adminPhone"
                  placeholder="+917416557472"
                  {...register("adminPhone", { required: "Admin phone is required" })}
                  className={errors.adminPhone ? "border-destructive" : ""}
                />
                {errors.adminPhone && <p className="text-sm text-destructive">{errors.adminPhone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@school.com"
                  {...register("adminEmail", {
                    required: "Admin email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.adminEmail ? "border-destructive" : ""}
                />
                {errors.adminEmail && <p className="text-sm text-destructive">{errors.adminEmail.message}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
