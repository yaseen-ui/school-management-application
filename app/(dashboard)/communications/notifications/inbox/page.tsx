"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { useCommunicationInbox, useAcknowledgeCommunication } from "@/hooks/use-communication-inbox"
import { NotificationCard } from "@/components/communication/notification-card"
import { Inbox } from "lucide-react"

export default function NotificationInboxPage() {
  const { items, loading, refetch } = useCommunicationInbox()
  const { acknowledge } = useAcknowledgeCommunication()
  const [acknowledging, setAcknowledging] = useState<string | null>(null)

  useEffect(() => {
    refetch()
  }, [])

  const handleAcknowledge = async (id: string) => {
    setAcknowledging(id)
    await acknowledge(id, "viewed")
    setAcknowledging(null)
    refetch()
  }

  const unreadItems = items?.filter((item) => !item.viewedAt) || []
  const readItems = items?.filter((item) => item.viewedAt) || []

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Notifications" }, { label: "Inbox" }]} />
      <PageHeader title="Notification Inbox" description="View your received notifications">
        <Button variant="outline" onClick={refetch} disabled={loading}>
          Refresh
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No notifications in your inbox.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unreadItems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Unread ({unreadItems.length})
              </h3>
              <div className="space-y-3">
                {unreadItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    communication={item.communication as any}
                    isUnread
                    onAcknowledge={handleAcknowledge}
                  />
                ))}
              </div>
            </div>
          )}

          {readItems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Read ({readItems.length})
              </h3>
              <div className="space-y-3">
                {readItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    communication={item.communication as any}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}