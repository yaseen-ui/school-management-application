"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Loader2,
  Mail,
  MailOpen,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import { useCommunicationInbox, useAcknowledgeCommunication } from "@/hooks/use-communication-inbox"
import { InboxBadge } from "@/components/communication/inbox-badge"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function CommunicationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const { items, total, loading, error, refetch } = useCommunicationInbox()
  const { acknowledge, loading: ackLoading } = useAcknowledgeCommunication()

  useEffect(() => {
    refetch()
  }, [])

  const filteredItems = items.filter((msg: any) => {
    if (filter === "unread") return !msg.isRead
    if (filter === "read") return msg.isRead
    return true
  })

  const unreadCount = items.filter((m: any) => !m.isRead).length

  const handleMarkRead = async (communicationId: string) => {
    await acknowledge(communicationId, "acknowledged")
    refetch()
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/parent-portal"
            className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground mt-0.5">School notifications & updates</p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="shrink-0 h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { value: "all" as const, label: "All" },
          { value: "unread" as const, label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          { value: "read" as const, label: "Read" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              filter === opt.value
                ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {opt.label}
          </button>
        ))}
        {unreadCount > 0 && (
          <span className="shrink-0 flex items-center text-xs">
            <InboxBadge />
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="h-10 w-10 text-primary/60" />
          </motion.div>
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Bell className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Couldn't Load Messages</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            Retry
          </button>
        </motion.div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            {filter === "unread" ? <MailOpen className="h-10 w-10 text-muted-foreground/50" /> : <Mail className="h-10 w-10 text-muted-foreground/50" />}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Messages</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {filter === "unread"
              ? "You've read all your messages!"
              : filter === "read"
                ? "No read messages yet."
                : "No messages from the school yet."}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {filteredItems.map((msg: any) => (
            <motion.div
              key={msg.id}
              variants={item}
              className={cn(
                "rounded-2xl border p-4 sm:p-5 transition-colors cursor-pointer",
                msg.isRead
                  ? "bg-card/30 border-border/30 hover:bg-card/50"
                  : "bg-card/50 border-primary/20 ring-1 ring-primary/10"
              )}
              onClick={() => !msg.isRead && handleMarkRead(msg.communicationId)}
            >
              <div className="flex items-start gap-3">
                {/* Unread dot */}
                {!msg.isRead && (
                  <div className="shrink-0 mt-1.5">
                    <motion.div
                      className="h-2.5 w-2.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      "text-sm font-semibold truncate",
                      msg.isRead ? "text-foreground" : "text-foreground"
                    )}>
                      {msg.communication?.title || msg.communication?.type || "Notification"}
                    </h3>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                        : ""}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {msg.communication?.message || msg.communication?.body || "No message content."}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {msg.communication?.type && (
                      <span className={cn(
                        "text-[9px] font-medium rounded-full px-2 py-0.5",
                        msg.communication.type === "emergency"
                          ? "bg-red-500/10 text-red-600"
                          : msg.communication.type === "action_required"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-primary/5 text-primary"
                      )}>
                        {msg.communication.type?.replace("_", " ")}
                      </span>
                    )}
                    {msg.isRead && (
                      <span className="text-[9px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Read
                      </span>
                    )}
                    {!msg.isRead && (
                      <span className="text-[9px] text-primary flex items-center gap-1">
                        Tap to mark read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}