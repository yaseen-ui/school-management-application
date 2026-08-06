"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCommunicationInbox, useAcknowledgeCommunication } from "@/hooks/use-communication-inbox"
import { cn } from "@/lib/utils"
import type { CommunicationRecipient } from "@/lib/api/communication"

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

const typeStyles: Record<string, string> = {
  emergency: "bg-red-500/10 text-red-600",
  action_required: "bg-amber-500/10 text-amber-600",
  alert: "bg-orange-500/10 text-orange-600",
  reminder: "bg-blue-500/10 text-blue-600",
  notification: "bg-primary/5 text-primary",
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { items, loading, error, refetch } = useCommunicationInbox({ isRead: false, limit: 5 })
  const { acknowledge } = useAcknowledgeCommunication()

  // Refetch on mount and when dropdown opens
  useEffect(() => {
    refetch()
  }, [open])

  const unreadItems = items || []
  const unreadCount = unreadItems.length

  const handleItemClick = async (item: CommunicationRecipient) => {
    await acknowledge(item.communicationId, "viewed")
    setOpen(false)
    refetch()
  }

  const handleViewAll = () => {
    setOpen(false)
  }

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation()
    refetch()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative border border-border/70 bg-background/70 text-foreground shadow-sm hover:border-primary/30 hover:bg-accent hover:text-accent-foreground dark:bg-background/55"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-card">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl border-border/70 p-1.5 shadow-xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between font-normal px-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-6 px-2 text-center">
            <p className="text-xs text-muted-foreground">Failed to load notifications</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        ) : unreadItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 px-2 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[320px]">
              <div className="space-y-0.5">
                {unreadItems.map((item) => {
                  const comm = item.communication
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="w-full text-left px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/70"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "shrink-0 mt-0.5 inline-block rounded-full px-1.5 py-px text-[9px] font-medium",
                            typeStyles[comm?.type || "notification"] || typeStyles.notification,
                          )}
                        >
                          {comm?.type?.replace("_", " ") || "notification"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {comm?.title || "Notification"}
                          </p>
                          {comm?.message && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {comm.message}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {item.createdAt ? timeAgo(item.createdAt) : ""}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>

            <DropdownMenuSeparator />
            <Link
              href="/communications/notifications/inbox"
              onClick={handleViewAll}
              className="block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              View all notifications
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}