"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePublications } from "@/hooks/use-publication"
import { PublicationStatusBadge, PublicationTypeBadge } from "@/components/communication/publication-status-badge"
import { Clock } from "lucide-react"
import { format } from "date-fns"

export default function PendingApprovalPage() {
  const router = useRouter()
  const { publications, loading, refetch } = usePublications({ status: "pending_approval" })

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Publications" }, { label: "Pending Approval" }]} />
      <PageHeader title="Pending Approval" description="Publications awaiting your approval" />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No publications pending approval.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => (
            <Card
              key={pub.id}
              className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => router.push(`/communications/publications/${pub.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <PublicationTypeBadge type={pub.type} />
                      <PublicationStatusBadge status={pub.status} />
                      {pub.isPinned && (
                        <span className="text-xs text-amber-600 font-medium">📌 Pinned</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{pub.title}</h3>
                    {pub.circularNumber && (
                      <p className="text-xs text-muted-foreground">No. {pub.circularNumber}</p>
                    )}
                    {pub.submittedBy && (
                      <p className="text-xs text-muted-foreground">
                        Submitted by {pub.submittedBy.fullName}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {pub.submittedAt ? format(new Date(pub.submittedAt), "MMM d, yyyy") : ""}
                    </p>
                    <Button variant="link" size="sm" className="mt-1" onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/communications/publications/${pub.id}`)
                    }}>
                      Review
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