"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { NotificationTemplate, TemplateCreatePayload, CommunicationType, CommunicationChannel } from "@/lib/api/communication"
import * as communicationApi from "@/lib/api/communication"
import { Plus, Trash2, FileType, RefreshCw } from "lucide-react"

const communicationTypes: { value: CommunicationType; label: string }[] = [
  { value: "notification", label: "Notification" },
  { value: "alert", label: "Alert" },
  { value: "reminder", label: "Reminder" },
  { value: "action_required", label: "Action Required" },
  { value: "emergency", label: "Emergency" },
]

const channels: { value: CommunicationChannel; label: string }[] = [
  { value: "in_app", label: "In-App" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<CommunicationType>("notification")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [defaultChannel, setDefaultChannel] = useState<CommunicationChannel>("in_app")
  const [defaultPriority, setDefaultPriority] = useState("0")
  const [isSystem, setIsSystem] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const result = await communicationApi.getTemplates()
      setTemplates(result.items)
    } catch (e: any) {
      toast.error(e.message || "Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const openCreate = () => {
    setEditingTemplate(null)
    setName("")
    setDescription("")
    setType("notification")
    setSubject("")
    setBody("")
    setDefaultChannel("in_app")
    setDefaultPriority("0")
    setIsSystem(false)
    setIsActive(true)
    setDialogOpen(true)
  }

  const openEdit = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setName(template.name)
    setDescription(template.description || "")
    setType(template.type)
    setSubject(template.subject)
    setBody(template.body)
    setDefaultChannel(template.defaultChannel)
    setDefaultPriority(String(template.defaultPriority))
    setIsSystem(template.isSystem)
    setIsActive(template.isActive)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !subject || !body) return
    const payload: TemplateCreatePayload = {
      name,
      description: description || undefined,
      type,
      subject,
      body,
      defaultChannel,
      defaultPriority: parseInt(defaultPriority),
      isSystem,
      isActive,
    }
    try {
      if (editingTemplate) {
        await communicationApi.updateTemplate(editingTemplate.id, payload)
        toast.success("Template updated")
      } else {
        await communicationApi.createTemplate(payload)
        toast.success("Template created")
      }
      setDialogOpen(false)
      fetchTemplates()
    } catch (e: any) {
      toast.error(e.message || "Failed to save template")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await communicationApi.deleteTemplate(id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
      toast.success("Template deleted")
    } catch (e: any) {
      toast.error(e.message || "Failed to delete template")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Automation" }, { label: "Templates" }]} />
      <PageHeader title="Notification Templates" description="Manage reusable notification templates with placeholders">
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTemplates} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Template name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as CommunicationType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {communicationTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Channel</Label>
                    <Select value={defaultChannel} onValueChange={(v) => setDefaultChannel(v as CommunicationChannel)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {channels.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Priority</Label>
                  <div className="flex gap-2">
                    {[
                      { value: "0", label: "Normal" },
                      { value: "1", label: "High" },
                      { value: "2", label: "Urgent" },
                    ].map((p) => (
                      <Button
                        key={p.value}
                        type="button"
                        variant={defaultPriority === p.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDefaultPriority(p.value)}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Notification subject (use {{placeholders}})"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    placeholder="Notification body (use {{placeholders}} for dynamic content)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Available placeholders: {"{{"}studentName{"}} {{"}applicantName{"}} {{"}examName{"}} {{"}date{"}} {{"}amount{"}} {{"}visitorName{"}} {{"}route{"}} {{"}minutes{"}} {{"}bookName{"}} {{"}itemName{"}}"}
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is-system"
                      checked={isSystem}
                      onChange={(e) => setIsSystem(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor="is-system">System template (for automation only)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is-active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingTemplate ? "Update" : "Create"} Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileType className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No templates created yet.</p>
          <Button variant="link" onClick={openCreate}>
            Create your first template
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => openEdit(tpl)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{tpl.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary capitalize">
                        {tpl.type.replace(/_/g, " ")}
                      </span>
                      {tpl.isSystem && (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">System</span>
                      )}
                      {!tpl.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{tpl.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tpl.body}</p>
                    {tpl._count && tpl._count.automationRules > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Used in {tpl._count.automationRules} automation rule(s)
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
                      {tpl.defaultChannel.replace(/_/g, " ")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(tpl.id)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}