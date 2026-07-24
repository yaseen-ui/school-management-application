"use client"

import { useEffect } from "react"
import { usePublicationRevisions } from "@/hooks/use-publication"
import { format } from "date-fns"
import type { PublicationRevision } from "@/lib/api/communication"

interface RevisionHistoryProps {
  publicationId: string
}

export function RevisionHistory({ publicationId }: RevisionHistoryProps) {
  const { data, loading, refetch } = usePublicationRevisions(publicationId)

  useEffect(() => {
    refetch()
  }, [publicationId])

  if (loading) {
    return <div className="h-16 bg-muted animate-pulse rounded" />
  }

  const revisions = data?.revisions || []

  if (revisions.length === 0) {
    return <p className="text-sm text-muted-foreground">No revisions yet.</p>
  }

  return (
    <div className="space-y-3">
      {revisions.map((rev: PublicationRevision) => (
        <div key={rev.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            v{rev.revision}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{rev.title}</p>
            {rev.changeSummary && (
              <p className="text-xs text-muted-foreground mt-1">{rev.changeSummary}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{rev.createdAt ? format(new Date(rev.createdAt), "MMM d, yyyy h:mm a") : ""}</span>
              {rev.changedBy && <span>by {rev.changedBy.fullName}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}