"use client";

import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ZaiChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ZaiChatList({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ZaiChatListProps) {
  const [search, setSearch] = useState("");

  const filteredChats = search
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : chats;

  const groupedChats = filteredChats.reduce(
    (acc, chat) => {
      const label = getTimeLabel(chat.createdAt);
      if (!acc[label]) acc[label] = [];
      acc[label].push(chat);
      return acc;
    },
    {} as Record<string, Chat[]>
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-card">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-violet-600 to-indigo-700 px-4 py-4 text-primary-foreground">
        <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mb-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight">AI Assistant</p>
            <p className="text-[11px] text-white/70">School insights, ready to help</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/12 py-2.5 pl-10 pr-4 text-sm text-white shadow-inner shadow-black/5 outline-none placeholder:text-white/55 transition focus:border-white/25 focus:bg-white/18 focus:ring-2 focus:ring-white/10"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-20 scrollbar-thin">
        {filteredChats.length === 0 && (
          <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/10">
              <MessageSquare className="h-7 w-7 text-primary/45" />
            </span>
            <p className="text-sm font-medium">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {search ? "Try a different search" : "Tap + to start a new chat"}
            </p>
          </div>
        )}

        {Object.entries(groupedChats).map(([label, chatList]) => (
          <div key={label}>
            <p className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-primary/70">
              {label}
            </p>
            {chatList.map((chat, i) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "group mx-2 flex items-center rounded-xl border border-transparent transition-colors",
                  "hover:bg-muted/55",
                  activeChatId === chat.id &&
                    "border-primary/10 bg-gradient-to-r from-primary/12 to-violet-500/5 shadow-sm"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ring-1",
                      activeChatId === chat.id
                        ? "bg-primary/15 text-primary ring-primary/15"
                        : "bg-muted text-muted-foreground ring-border/50"
                    )}
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      activeChatId === chat.id ? "text-primary" : "text-foreground"
                    )}>
                      {chat.title}
                    </p>
                    <span className="flex-shrink-0 text-[10px] text-muted-foreground/70">
                      {formatTimeAgo(chat.updatedAt || chat.createdAt)}
                    </span>
                    </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {chat._count?.messages
                      ? `${chat._count.messages} message${chat._count.messages !== 1 ? "s" : ""}`
                      : "No messages yet"}
                  </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="mr-2 rounded-lg p-2 text-muted-foreground opacity-60 transition hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete chat"
                  aria-label={`Delete ${chat.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* FAB — New Chat */}
      <div className="absolute bottom-11 right-5 z-20">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 text-primary-foreground shadow-lg shadow-primary/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          aria-label="Start new conversation"
        >
          <Plus className="h-6 w-6" strokeWidth={2.4} />
        </button>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/50 bg-card/90 px-4 py-2 backdrop-blur">
        <p className="text-center text-[10px] text-muted-foreground/60">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""} • ZAI v1.0
        </p>
      </div>
    </div>
  );
}

function getTimeLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This Week";
  if (diffDays < 30) return "This Month";
  return format(date, "MMMM yyyy");
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return format(date, "dd/MM/yy");
}
