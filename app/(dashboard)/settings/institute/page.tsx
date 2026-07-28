"use client"

import { FormEvent, useEffect, useState } from "react"
import { Building2, ImageIcon, Loader2, MapPin, Phone, Save } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { instituteSettingsApi } from "@/lib/api/institute-settings"
import { useAuthStore } from "@/stores/auth-store"
import { usePermissionStore } from "@/stores/permission-store"
import type { Tenant } from "@/lib/api/types"

interface InstituteForm {
  schoolName: string
  caption: string
  logo: string
  contactPhone: string
  contactEmail: string
  street: string
  city: string
  state: string
  zip: string
}

const emptyForm: InstituteForm = {
  schoolName: "",
  caption: "",
  logo: "",
  contactPhone: "",
  contactEmail: "",
  street: "",
  city: "",
  state: "",
  zip: "",
}

function toForm(tenant: Tenant): InstituteForm {
  return {
    schoolName: tenant.schoolName || "",
    caption: tenant.caption || "",
    logo: tenant.logo || "",
    contactPhone: tenant.contactPhone || "",
    contactEmail: tenant.contactEmail || "",
    street: tenant.contactAddress?.street || "",
    city: tenant.contactAddress?.city || "",
    state: tenant.contactAddress?.state || "",
    zip: tenant.contactAddress?.zip || "",
  }
}

export default function InstituteSettingsPage() {
  const [form, setForm] = useState<InstituteForm>(emptyForm)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState("")
  const tenantInfo = useAuthStore((state) => state.tenantInfo)
  const setTenantInfo = useAuthStore((state) => state.setTenantInfo)
  const hasPermission = usePermissionStore((state) => state.hasPermission)
  const canEdit = hasPermission("settings:write")

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        setLoading(true)
        setLoadError("")
        const data = await instituteSettingsApi.get()
        if (!active) return
        setTenant(data)
        setForm(toForm(data))
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : "Unable to load institute settings.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSettings()
    return () => {
      active = false
    }
  }, [])

  const updateField = (field: keyof InstituteForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canEdit) return

    try {
      setSaving(true)
      const updated = await instituteSettingsApi.update({
        schoolName: form.schoolName,
        caption: form.caption,
        logo: form.logo,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        contactAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
      })

      setTenant(updated)
      setForm(toForm(updated))

      if (tenantInfo) {
        setTenantInfo({
          ...tenantInfo,
          schoolName: updated.schoolName,
          caption: updated.caption ?? null,
          logo: updated.logo ?? null,
          contactPhone: updated.contactPhone,
          contactEmail: updated.contactEmail,
          contactAddress: updated.contactAddress,
          updatedAt: updated.updatedAt,
        })
      }

      toast.success("Institute settings updated")
    } catch (error) {
      toast.error("Could not save institute settings", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          { label: "System Grouping", href: "/settings" },
          { label: "Institute Settings" },
        ]}
      />
      <PageHeader
        title="Institute Settings"
        description="Keep your institute profile, branding, and contact information up to date"
      />

      {loading ? (
        <Card className="max-w-5xl">
          <CardContent className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading institute settings…
            </div>
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="max-w-5xl border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center">
            <p className="font-medium text-destructive">Institute settings could not be loaded</p>
            <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-5xl">
          <Card className="relative gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" />
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-blue-50/70 via-transparent to-violet-50/60 px-5 py-4 dark:from-blue-950/20 dark:to-violet-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-violet-950/60 dark:text-blue-400 dark:ring-blue-800/50">
                  <Building2 className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <CardTitle className="text-base">Institute Profile</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    Changes appear across your institute workspace.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-5 py-5">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  Identity and branding
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Institute name</Label>
                    <Input
                      id="schoolName"
                      value={form.schoolName}
                      onChange={(event) => updateField("schoolName", event.target.value)}
                      required
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={form.logo}
                      onChange={(event) => updateField("logo", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="caption">Tagline</Label>
                    <Textarea
                      id="caption"
                      rows={2}
                      placeholder="A short description of your institute"
                      value={form.caption}
                      onChange={(event) => updateField("caption", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-border/70" />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  Contact details
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={(event) => updateField("contactEmail", event.target.value)}
                      required
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact phone</Label>
                    <Input
                      id="contactPhone"
                      value={form.contactPhone}
                      onChange={(event) => updateField("contactPhone", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-border/70" />

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  Address
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street address</Label>
                    <Input
                      id="street"
                      value={form.street}
                      onChange={(event) => updateField("street", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2 md:max-w-xs">
                    <Label htmlFor="zip">Postal code</Label>
                    <Input
                      id="zip"
                      value={form.zip}
                      onChange={(event) => updateField("zip", event.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </section>
            </CardContent>

            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-3.5">
              <p className="text-xs text-muted-foreground">
                {!canEdit
                  ? "You have view-only access to institute settings."
                  : tenant?.domain
                    ? `Workspace: ${tenant.domain}`
                    : "Institute profile"}
              </p>
              {canEdit && (
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              )}
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}
