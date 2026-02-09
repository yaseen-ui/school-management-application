"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Building2, Phone, MapPin, User, Globe, Calendar } from "lucide-react"

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

interface ViewTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantData | null
}

const subscriptionColors: Record<string, string> = {
  basic: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  standard: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  inactive: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function ViewTenantDialog({ open, onOpenChange, tenant }: ViewTenantDialogProps) {
  if (!tenant) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              {tenant.logo ? (
                <img
                  src={tenant.logo || "/placeholder.svg"}
                  alt={tenant.schoolName}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <span className="text-xl">{tenant.schoolName}</span>
              {tenant.caption && <p className="text-sm font-normal text-muted-foreground">{tenant.caption}</p>}
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Badge
              variant="secondary"
              className={subscriptionColors[tenant.subscriptionPlan] || subscriptionColors.basic}
            >
              {tenant.subscriptionPlan}
            </Badge>
            <Badge variant="secondary" className={statusColors[tenant.status || "active"]}>
              {tenant.status || "active"}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 border-b pb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Contact Address
            </h3>
            <div className="pl-6 space-y-1 text-sm">
              <p className="text-foreground">{tenant.contactAddress?.street}</p>
              <p className="text-muted-foreground">
                {tenant.contactAddress?.city}, {tenant.contactAddress?.state} {tenant.contactAddress?.zip}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 border-b pb-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Contact Information
            </h3>
            <div className="pl-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">{tenant.contactPhone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{tenant.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 border-b pb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Admin Information
            </h3>
            <div className="pl-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{tenant.adminFullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{tenant.adminEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">{tenant.adminPhone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Domain */}
          {tenant.domain && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 border-b pb-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Domain
              </h3>
              <div className="pl-6 text-sm">
                <a
                  href={tenant.domain.startsWith("http") ? tenant.domain : `https://${tenant.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {tenant.domain}
                </a>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 border-b pb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Timeline
            </h3>
            <div className="pl-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-foreground font-medium">{formatDate(tenant.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="text-foreground font-medium">{formatDate(tenant.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
