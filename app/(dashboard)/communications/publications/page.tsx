"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { usePublications } from "@/hooks/use-publication"
import { PublicationStatusBadge, PublicationTypeBadge } from "@/components/communication/publication-status-badge"
import { Plus, FileText } from "lucide-react"
import { format } from "date-fns"

export default function PublicationsListPage() {
  const router = useRouter()
  const [tab, setTab] = useState("all")
  const { publications, loading, refetch } = usePublications()

  useEffect(() => {
    refetch()
  }, [])

  const filtered = tab === "all" ? publications : publications.filter((p) => p.status === tab)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Communications" }, { label: "Publications" }]} />
      <PageHeader title="Publications" description="Manage circulars, announcements, and notices">
        <Button onClick={() => router.push("/communications/publications/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Publication
        </Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending_approval">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No publications found.</p>
              <Button variant="link" onClick={() => router.push("/communications/publications/create")}>
                Create your first publication
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((pub) => (
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
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {pub.createdAt ? format(new Date(pub.createdAt), "MMM d, yyyy") : ""}
                        </p>
                        {pub.revision > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">Rev {pub.revision}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}