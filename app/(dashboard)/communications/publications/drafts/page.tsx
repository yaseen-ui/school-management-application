"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePublications } from "@/hooks/use-publication"
import { PublicationStatusBadge, PublicationTypeBadge } from "@/components/communication/publication-status-badge"
import { Plus, FileEdit } from "lucide-react"
import { format } from "date-fns"

export default function PublicationDraftsPage() {
  const router = useRouter()
  const { publications, loading, refetch } = usePublications({ status: "draft" })

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Publications" }, { label: "Drafts" }]} />
      <PageHeader title="Publication Drafts" description="Draft publications awaiting submission">
        <Button onClick={() => router.push("/communications/publications/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Publication
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No draft publications.</p>
          <Button variant="link" onClick={() => router.push("/communications/publications/create")}>
            Create a new publication
          </Button>
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
                    </div>
                    <h3 className="font-semibold text-sm">{pub.title}</h3>
                    {pub.circularNumber && (
                      <p className="text-xs text-muted-foreground">No. {pub.circularNumber}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {pub.createdAt ? format(new Date(pub.createdAt), "MMM d, yyyy") : ""}
                    </p>
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