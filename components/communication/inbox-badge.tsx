"use client"

import { useCommunicationInbox } from "@/hooks/use-communication-inbox"
import { cn } from "@/lib/utils"

interface InboxBadgeProps {
  className?: string
}

export function InboxBadge({ className }: InboxBadgeProps) {
  const { items } = useCommunicationInbox()
  const unreadCount = items?.filter((item: any) => !item.viewedAt).length || 0

  if (unreadCount === 0) return null

  return (
    <span
      className={cn(
        "ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground",
        className,
      )}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}