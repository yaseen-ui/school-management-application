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
import { useCreatePublication } from "@/hooks/use-publication"
import { Save, Send } from "lucide-react"

const publicationTypes = [
  { value: "circular", label: "Circular" },
  { value: "announcement", label: "Announcement" },
  { value: "notice_board", label: "Notice Board" },
  { value: "holiday_notice", label: "Holiday Notice" },
  { value: "event_notice", label: "Event Notice" },
  { value: "academic_notice", label: "Academic Notice" },
]

export default function CreatePublicationPage() {
  const router = useRouter()
  const createPub = useCreatePublication()

  const [type, setType] = useState("circular")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [circularNumber, setCircularNumber] = useState("")
  const [priority, setPriority] = useState("0")
  const [isPinned, setIsPinned] = useState(false)
  const [requireAcknowledgement, setRequireAcknowledgement] = useState(false)
  const [sendNotification, setSendNotification] = useState(false)
  const [publishDate, setPublishDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [audience, setAudience] = useState<any>({})

  const handleSave = async (status: "draft" | "pending_approval") => {
    if (!title.trim()) return

    const payload: any = {
      type,
      title: title.trim(),
      content: content.trim(),
      priority: parseInt(priority),
      isPinned,
      requireAcknowledgement,
      sendNotification,
      ...audience,
    }

    if (type === "circular" && circularNumber) {
      payload.circularNumber = circularNumber
    }

    if (publishDate) payload.publishDate = new Date(publishDate).toISOString()
    if (expiryDate) payload.expiryDate = new Date(expiryDate).toISOString()

    const result = await createPub.create(payload)
    if (result) {
      router.push("/communications/publications")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Publications" }, { label: "Create" }]} />
      <PageHeader title="Create Publication" description="Create a new circular, announcement, or notice">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={!title.trim() || createPub.loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave("pending_approval")} disabled={!title.trim() || createPub.loading}>
            <Send className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publication Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {publicationTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {type === "circular" && (
              <div className="space-y-2">
                <Label>Circular Number</Label>
                <Input
                  placeholder="e.g. CIRC-2024-001"
                  value={circularNumber}
                  onChange={(e) => setCircularNumber(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Publication title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your publication content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {[
                  { value: "0", label: "Normal" },
                  { value: "1", label: "High" },
                  { value: "2", label: "Urgent" },
                ].map((p) => (
                  <Button
                    key={p.value}
                    type="button"
                    variant={priority === p.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriority(p.value)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is-pinned">Pin to top</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="require-ack"
                  checked={requireAcknowledgement}
                  onChange={(e) => setRequireAcknowledgement(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="require-ack">Require acknowledgement</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="send-notif"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="send-notif">Also send as notification</Label>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
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