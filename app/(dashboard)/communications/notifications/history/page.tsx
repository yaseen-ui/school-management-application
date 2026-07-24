"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCommunications } from "@/hooks/use-communication"
import { NotificationCard } from "@/components/communication/notification-card"
import { Plus } from "lucide-react"

export default function NotificationHistoryPage() {
  const router = useRouter()
  const { communications, loading, refetch } = useCommunications()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Notifications" }, { label: "History" }]} />
      <PageHeader title="Notification History" description="View all sent and scheduled notifications">
        <Button onClick={() => router.push("/communications/notifications")}>
          <Plus className="h-4 w-4 mr-2" />
          New Notification
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : communications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No notifications sent yet.</p>
          <Button variant="link" onClick={() => router.push("/communications/notifications")}>
            Send your first notification
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {communications.map((comm) => (
            <NotificationCard key={comm.id} communication={comm} showActions={false} />
          ))}
        </div>
      )}
    </div>
  )
}