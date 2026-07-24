"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { ChannelConfiguration, ChannelConfigUpdatePayload, CommunicationChannel } from "@/lib/api/communication"
import * as communicationApi from "@/lib/api/communication"
import { RefreshCw, Mail, MessageSquare, Bell, Smartphone } from "lucide-react"

const channelMeta: Record<CommunicationChannel, { label: string; icon: any; description: string; providerPlaceholder: string; configPlaceholder: string }> = {
  in_app: {
    label: "In-App Notifications",
    icon: Bell,
    description: "Built-in notification system. Always available.",
    providerPlaceholder: "",
    configPlaceholder: "",
  },
  email: {
    label: "Email",
    icon: Mail,
    description: "Send notifications via email. Requires an email provider.",
    providerPlaceholder: "sendgrid",
    configPlaceholder: '{\n  "apiKey": "SG.xxxx",\n  "fromAddress": "noreply@school.com"\n}',
  },
  sms: {
    label: "SMS",
    icon: MessageSquare,
    description: "Send notifications via SMS. Requires an SMS provider.",
    providerPlaceholder: "twilio",
    configPlaceholder: '{\n  "accountSid": "ACxxxx",\n  "authToken": "xxxx",\n  "fromNumber": "+1234567890"\n}',
  },
  push: {
    label: "Push Notifications",
    icon: Smartphone,
    description: "Send push notifications via Firebase. Requires FCM configuration.",
    providerPlaceholder: "firebase",
    configPlaceholder: '{\n  "serverKey": "xxxx"\n}',
  },
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, { provider: string; config: string; isEnabled: boolean }>>({})

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const data = await communicationApi.getChannelConfigurations()
      setChannels(data)
      const fd: Record<string, any> = {}
      data.forEach((c) => {
        fd[c.channel] = {
          provider: c.provider || "",
          config: c.config ? JSON.stringify(c.config, null, 2) : "",
          isEnabled: c.isEnabled,
        }
      })
      // Ensure all 4 channels exist in form
      ;(["in_app", "email", "sms", "push"] as CommunicationChannel[]).forEach((ch) => {
        if (!fd[ch]) {
          fd[ch] = { provider: "", config: "", isEnabled: ch === "in_app" }
        }
      })
      setFormData(fd)
    } catch (e: any) {
      toast.error(e.message || "Failed to load channel configs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  const handleUpdateField = (channel: CommunicationChannel, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], [field]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates: ChannelConfigUpdatePayload[] = (Object.entries(formData) as [CommunicationChannel, any][]).map(([channel, data]) => {
        let configObj: any = undefined
        if (data.config && data.config.trim()) {
          try {
            configObj = JSON.parse(data.config)
          } catch {
            toast.error(`Invalid JSON in ${channelMeta[channel].label} config`)
            throw new Error("Invalid JSON")
          }
        }
        return {
          channel,
          provider: data.provider || undefined,
          config: configObj,
          isEnabled: data.isEnabled,
        }
      })
      await communicationApi.updateChannelConfigurations(updates)
      toast.success("Channel configurations saved")
      fetchChannels()
    } catch (e: any) {
      if (e.message !== "Invalid JSON") {
        toast.error(e.message || "Failed to save")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs items={[{ label: "Communications" }, { label: "Automation" }, { label: "Channels" }]} />
        <PageHeader title="Channel Configuration" description="Configure notification delivery channels" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Automation" }, { label: "Channels" }]} />
      <PageHeader title="Channel Configuration" description="Configure notification delivery channels (email, SMS, push)">
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchChannels} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {(Object.entries(channelMeta) as [CommunicationChannel, typeof channelMeta[CommunicationChannel]][]).map(([channel, meta]) => {
          const data = formData[channel] || { provider: "", config: "", isEnabled: channel === "in_app" }
          const Icon = meta.icon
          const isInApp = channel === "in_app"

          return (
            <Card key={channel}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {meta.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{meta.description}</p>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`enabled-${channel}`}
                    checked={data.isEnabled}
                    onChange={(e) => handleUpdateField(channel, "isEnabled", e.target.checked)}
                    disabled={isInApp}
                    className="h-4 w-4 rounded"
                  />
                  <Label htmlFor={`enabled-${channel}`}>
                    {isInApp ? "Always enabled" : "Enable this channel"}
                  </Label>
                </div>

                {!isInApp && data.isEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Input
                        placeholder={meta.providerPlaceholder}
                        value={data.provider}
                        onChange={(e) => handleUpdateField(channel, "provider", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Configuration (JSON)</Label>
                      <Textarea
                        placeholder={meta.configPlaceholder}
                        value={data.config}
                        onChange={(e) => handleUpdateField(channel, "config", e.target.value)}
                        rows={6}
                        className="font-mono text-xs"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}