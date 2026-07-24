"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePublication, useSubmitPublication, useApprovePublication, useRejectPublication, usePublishPublication, useArchivePublication, useWithdrawPublication, useDeletePublication } from "@/hooks/use-publication"
import { PublicationStatusBadge, PublicationTypeBadge } from "@/components/communication/publication-status-badge"
import { ApprovalActions } from "@/components/communication/approval-actions"
import { PublicationTimeline } from "@/components/communication/publication-timeline"
import { RevisionHistory } from "@/components/communication/revision-history"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"

export default function PublicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { publication, loading, refetch } = usePublication(id)
  const { submit, loading: submitting } = useSubmitPublication()
  const { approve, loading: approving } = useApprovePublication()
  const { reject, loading: rejecting } = useRejectPublication()
  const { publish, loading: publishing } = usePublishPublication()
  const { archive, loading: archiving } = useArchivePublication()
  const { withdraw, loading: withdrawing } = useWithdrawPublication()
  const { remove, loading: deleting } = useDeletePublication()

  useEffect(() => {
    refetch()
  }, [id])

  const handleAction = async (action: string, ...args: any[]) => {
    try {
      switch (action) {
        case "submit": await submit(id); break
        case "approve": await approve(id, args[0]); break
        case "reject": await reject(id, args[0]); break
        case "publish": await publish(id); break
        case "archive": await archive(id); break
        case "withdraw": await withdraw(id); break
        case "delete": await remove(id); router.push("/communications/publications"); return
      }
      refetch()
    } catch (e) {
      // error handled by hook
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Publication not found.</p>
        <Button variant="link" onClick={() => router.push("/communications/publications")}>
          Back to publications
        </Button>
      </div>
    )
  }

  const canSubmit = publication.status === "draft"
  const canApprove = publication.status === "pending_approval"
  const canPublish = publication.status === "approved"
  const canArchive = ["published", "approved", "withdrawn"].includes(publication.status)
  const canWithdraw = publication.status === "published"
  const canDelete = ["draft", "rejected", "withdrawn", "archived"].includes(publication.status)

  // Build timeline events from publication
  const timelineEvents = [
    { status: "draft", timestamp: publication.createdAt },
    ...(publication.submittedAt ? [{ status: "pending_approval" as const, timestamp: publication.submittedAt, by: publication.submittedBy?.fullName }] : []),
    ...(publication.approvedAt ? [{ status: "approved" as const, timestamp: publication.approvedAt, by: publication.approvedBy?.fullName, remarks: publication.approvalRemarks || undefined }] : []),
    ...(publication.rejectedAt ? [{ status: "rejected" as const, timestamp: publication.rejectedAt, by: publication.rejectedBy?.fullName, remarks: publication.rejectionReason || undefined }] : []),
    ...(publication.publishedAt ? [{ status: "published" as const, timestamp: publication.publishedAt }] : []),
    ...(publication.archivedAt ? [{ status: "archived" as const, timestamp: publication.archivedAt }] : []),
    ...(publication.withdrawnAt ? [{ status: "withdrawn" as const, timestamp: publication.withdrawnAt }] : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Communications" },
          { label: "Publications", href: "/communications/publications" },
          { label: publication.title },
        ]}
      />
      <PageHeader
        title={publication.title}
        description={`${publication.type.replace(/_/g, " ")} - ${publication.status.replace(/_/g, " ")}${publication.circularNumber ? ` - No. ${publication.circularNumber}` : ""}`}
      >
        <div className="flex gap-2">
          {canSubmit && (
            <Button onClick={() => handleAction("submit")} disabled={submitting}>
              Submit for Approval
            </Button>
          )}
          {canPublish && (
            <Button onClick={() => handleAction("publish")} disabled={publishing}>
              Publish
            </Button>
          )}
          {canWithdraw && (
            <Button variant="outline" onClick={() => handleAction("withdraw")} disabled={withdrawing}>
              Withdraw
            </Button>
          )}
          {canArchive && (
            <Button variant="outline" onClick={() => handleAction("archive")} disabled={archiving}>
              Archive
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" size="icon" onClick={() => handleAction("delete")} disabled={deleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {publication.content || "No content"}
              </div>
            </CardContent>
          </Card>

          {publication.attachments && publication.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {publication.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <span className="text-sm">{att.name}</span>
                      <span className="text-xs text-muted-foreground">({(att.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revision History</CardTitle>
            </CardHeader>
            <CardContent>
              <RevisionHistory publicationId={id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{publication.createdAt ? format(new Date(publication.createdAt), "MMM d, yyyy h:mm a") : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority</span>
                <span>{["Normal", "High", "Urgent"][publication.priority] || "Normal"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pinned</span>
                <span>{publication.isPinned ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requires Ack</span>
                <span>{publication.requireAcknowledgement ? "Yes" : "No"}</span>
              </div>
              {publication.publishDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publish Date</span>
                  <span>{format(new Date(publication.publishDate), "MMM d, yyyy")}</span>
                </div>
              )}
              {publication.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span>{format(new Date(publication.expiryDate), "MMM d, yyyy")}</span>
                </div>
              )}
              {publication.revision > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revision</span>
                  <span>{publication.revision}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {canApprove && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalActions
                  onApprove={(remarks) => handleAction("approve", remarks)}
                  onReject={(reason) => handleAction("reject", reason)}
                  isApproving={approving}
                  isRejecting={rejecting}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PublicationTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}