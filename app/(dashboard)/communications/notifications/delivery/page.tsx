"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDeliveryReport } from "@/hooks/use-communication"
import { DeliveryStatusBadge } from "@/components/communication/delivery-status-badge"
import { Search } from "lucide-react"

export default function DeliveryReportPage() {
  const [communicationId, setCommunicationId] = useState("")
  const { report, loading, refetch } = useDeliveryReport(communicationId || null)

  useEffect(() => {
    if (communicationId) refetch()
  }, [communicationId])

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Notifications" }, { label: "Delivery" }]} />
      <PageHeader title="Delivery Report" description="Track delivery status of sent notifications" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Communication ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter communication ID..."
                value={communicationId}
                onChange={(e) => setCommunicationId(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {report && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{report.communication.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "Total", value: report.summary.total, color: "text-muted-foreground" },
                  { label: "Pending", value: report.summary.pending, color: "text-gray-500" },
                  { label: "Sent", value: report.summary.sent, color: "text-blue-600" },
                  { label: "Delivered", value: report.summary.delivered, color: "text-emerald-600" },
                  { label: "Failed", value: report.summary.failed, color: "text-red-600" },
                  { label: "Viewed", value: report.summary.viewed, color: "text-sky-600" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipients ({report.recipients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">User</th>
                      <th className="text-left py-2 px-3 font-medium">Channel</th>
                      <th className="text-left py-2 px-3 font-medium">Status</th>
                      <th className="text-left py-2 px-3 font-medium">Delivered At</th>
                      <th className="text-left py-2 px-3 font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.recipients.map((r) => (
                      <tr key={r.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">{r.user?.fullName || r.userId}</td>
                        <td className="py-2 px-3 capitalize">{r.channel.replace(/_/g, " ")}</td>
                        <td className="py-2 px-3">
                          <DeliveryStatusBadge status={r.deliveryStatus} />
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {r.deliveredAt ? new Date(r.deliveredAt).toLocaleString() : "-"}
                        </td>
                        <td className="py-2 px-3 text-red-600 text-xs max-w-[200px] truncate">
                          {r.lastError || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}