"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import * as communicationApi from "@/lib/api/communication"
import type { AutomationRule, AutomationRuleCreatePayload, NotificationTemplate } from "@/lib/api/communication"
import { Plus, Trash2, RefreshCw } from "lucide-react"

const modules = [
  { value: "attendance", label: "Attendance" },
  { value: "leave", label: "Leave" },
  { value: "exam", label: "Exams" },
  { value: "result", label: "Results" },
  { value: "fee", label: "Fees" },
  { value: "visitor", label: "Visitors" },
  { value: "transport", label: "Transport" },
  { value: "library", label: "Library" },
  { value: "inventory", label: "Inventory" },
]

const eventsByModule: Record<string, { value: string; label: string }[]> = {
  attendance: [
    { value: "student_absent", label: "Student Absent" },
    { value: "student_late", label: "Student Late" },
  ],
  leave: [
    { value: "leave_submitted", label: "Leave Submitted" },
    { value: "leave_approved", label: "Leave Approved" },
    { value: "leave_rejected", label: "Leave Rejected" },
  ],
  exam: [{ value: "exam_scheduled", label: "Exam Scheduled" }],
  result: [{ value: "results_published", label: "Results Published" }],
  fee: [
    { value: "payment_overdue", label: "Payment Overdue" },
    { value: "payment_received", label: "Payment Received" },
  ],
  visitor: [{ value: "visitor_arrived", label: "Visitor Arrived" }],
  transport: [{ value: "bus_delayed", label: "Bus Delayed" }],
  library: [{ value: "book_overdue", label: "Book Overdue" }],
  inventory: [{ value: "low_stock", label: "Low Stock" }],
}

export default function AutomationRulesPage() {
  const router = useRouter()
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [sourceModule, setSourceModule] = useState("")
  const [event, setEvent] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [cooldownMinutes, setCooldownMinutes] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rulesResult, templatesResult] = await Promise.all([
        communicationApi.getAutomationRules(),
        communicationApi.getTemplates({ isActive: true }),
      ])
      setRules(rulesResult.items)
      setTemplates(templatesResult.items)
    } catch (e: any) {
      toast.error(e.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!name || !sourceModule || !event || !templateId) return
    const payload: AutomationRuleCreatePayload = {
      name,
      sourceModule,
      event,
      templateId,
    }
    if (cooldownMinutes) payload.cooldownMinutes = parseInt(cooldownMinutes)
    try {
      await communicationApi.createAutomationRule(payload)
      toast.success("Automation rule created")
      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (e: any) {
      toast.error(e.message || "Failed to create rule")
    }
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await communicationApi.toggleAutomationRule(id, !enabled)
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isEnabled: !enabled } : r)))
    } catch (e: any) {
      toast.error(e.message || "Failed to toggle rule")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await communicationApi.deleteAutomationRule(id)
      setRules((prev) => prev.filter((r) => r.id !== id))
      toast.success("Rule deleted")
    } catch (e: any) {
      toast.error(e.message || "Failed to delete rule")
    }
  }

  const resetForm = () => {
    setName("")
    setSourceModule("")
    setEvent("")
    setTemplateId("")
    setCooldownMinutes("")
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Automation" }]} />
      <PageHeader title="Automation Rules" description="Configure automated notifications for system events">
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input placeholder="e.g. Student Absence Alert" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Source Module</Label>
                  <Select value={sourceModule} onValueChange={(v) => { setSourceModule(v); setEvent("") }}>
                    <SelectTrigger><SelectValue placeholder="Select module..." /></SelectTrigger>
                    <SelectContent>
                      {modules.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {sourceModule && (
                  <div className="space-y-2">
                    <Label>Event</Label>
                    <Select value={event} onValueChange={setEvent}>
                      <SelectTrigger><SelectValue placeholder="Select event..." /></SelectTrigger>
                      <SelectContent>
                        {(eventsByModule[sourceModule] || []).map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={templateId} onValueChange={setTemplateId}>
                    <SelectTrigger><SelectValue placeholder="Select template..." /></SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cooldown (minutes)</Label>
                  <Input type="number" placeholder="Optional" value={cooldownMinutes} onChange={(e) => setCooldownMinutes(e.target.value)} />
                </div>
                <Button onClick={handleCreate} className="w-full">Create Rule</Button>
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
      ) : rules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No automation rules configured.</p>
          <Button variant="link" onClick={() => router.push("/communications/automation/templates")}>
            Create a template first
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{rule.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
                        {rule.sourceModule} → {rule.event}
                      </span>
                    </div>
                    {rule.template && (
                      <p className="text-xs text-muted-foreground">
                        Template: {rule.template.name} — {rule.template.subject}
                      </p>
                    )}
                    {rule.cooldownMinutes && (
                      <p className="text-xs text-muted-foreground">
                        Cooldown: {rule.cooldownMinutes} min
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={rule.isEnabled}
                        onClick={() => handleToggle(rule.id, rule.isEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rule.isEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.isEnabled ? "translate-x-[18px]" : "translate-x-[2px]"}`}
                        />
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {rule.isEnabled ? "On" : "Off"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
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