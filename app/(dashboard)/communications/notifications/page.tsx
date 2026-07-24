"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AudienceSelector } from "@/components/communication/audience-selector"
import { ChannelToggleGroup } from "@/components/communication/channel-toggle-group"
import { useSendCommunication } from "@/hooks/use-communication"
import { Send, Clock } from "lucide-react"

const communicationTypes = [
  { value: "notification", label: "Notification" },
  { value: "alert", label: "Alert" },
  { value: "reminder", label: "Reminder" },
  { value: "action_required", label: "Action Required" },
  { value: "emergency", label: "Emergency" },
]

export default function CreateNotificationPage() {
  const router = useRouter()
  const sendComm = useSendCommunication()

  const [type, setType] = useState("notification")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("0")
  const [channels, setChannels] = useState<string[]>(["in_app"])
  const [scheduleLater, setScheduleLater] = useState(false)
  const [scheduledAt, setScheduledAt] = useState("")
  const [actionLabel, setActionLabel] = useState("")
  const [actionLink, setActionLink] = useState("")
  const [audience, setAudience] = useState<any>({})

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return

    const payload: any = {
      type,
      title: title.trim(),
      message: message.trim(),
      priority: parseInt(priority),
      channels,
      audience: {
        targetUserIds: audience.targetUserIds,
        targetRoles: audience.targetRoles,
        targetGroups: audience.targetGroups,
        targetGrades: audience.targetGrades,
        targetSections: audience.targetSections,
        targetEmployeeTypes: audience.targetEmployeeTypes,
        targetAudience: audience.targetAudience,
      },
    }

    if (actionLabel && actionLink) {
      payload.actionButton = { label: actionLabel, link: actionLink }
    }

    if (scheduleLater && scheduledAt) {
      payload.scheduledAt = new Date(scheduledAt).toISOString()
    }

    const result = await sendComm.send(payload)
    if (result) {
      router.push("/communications/notifications/history")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Notifications" }]} />
      <PageHeader title="Send Notification" description="Compose and send notifications to selected audiences">
        <Button onClick={handleSend} disabled={!title.trim() || !message.trim() || sendComm.loading}>
          {scheduleLater ? <Clock className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          {sendComm.loading ? "Sending..." : scheduleLater ? "Schedule" : "Send"}
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {communicationTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Notification title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {[
                  { value: "0", label: "Normal", className: "" },
                  { value: "1", label: "High", className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
                  { value: "2", label: "Urgent", className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" },
                ].map((p) => (
                  <Button
                    key={p.value}
                    type="button"
                    variant={priority === p.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriority(p.value)}
                    className={priority === p.value ? "" : p.className}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Channels</Label>
              <ChannelToggleGroup value={channels} onChange={setChannels} />
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="schedule-later"
                checked={scheduleLater}
                onChange={(e) => setScheduleLater(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="schedule-later">Schedule for later</Label>
            </div>

            {scheduleLater && (
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Action Button (optional)</Label>
              <Input
                placeholder="Button label (e.g. View Details)"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
              />
              <Input
                placeholder="Button link (e.g. /leave/123)"
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <AudienceSelector value={audience} onChange={setAudience} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}