"use client";

import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col h-full bg-background">
      {/* Header — WhatsApp-style green bar */}
      <div className="px-4 py-3 bg-emerald-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight">ZAI</h1>
          <Sparkles className="h-5 w-5 opacity-80" />
        </div>
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 text-white 
              placeholder:text-white/50 text-sm
              focus:outline-none focus:bg-white/30 transition-all"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <MessageSquare className="h-12 w-12 opacity-20" />
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
            <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600/80">
              {label}
            </p>
            {chatList.map((chat, i) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  "border-b border-border/30 last:border-b-0",
                  "hover:bg-muted/50 active:bg-muted",
                  activeChatId === chat.id && "bg-emerald-50 border-l-[3px] border-l-emerald-500"
                )}
              >
                {/* Avatar circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                    activeChatId === chat.id
                      ? "bg-emerald-100"
                      : "bg-muted"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "h-5 w-5",
                      activeChatId === chat.id
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    )}
                  />
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      activeChatId === chat.id ? "text-emerald-800" : "text-foreground"
                    )}>
                      {chat.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground/60 flex-shrink-0">
                      {formatTimeAgo(chat.updatedAt || chat.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {chat._count?.messages
                      ? `${chat._count.messages} message${chat._count.messages !== 1 ? "s" : ""}`
                      : "No messages yet"}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 
                    hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      {/* FAB — New Chat */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={onNewChat}
          className="w-14 h-14 rounded-2xl bg-emerald-500 text-white 
            shadow-lg shadow-emerald-500/30
            hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40
            active:scale-95 transition-all duration-200
            flex items-center justify-center"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border/30 bg-muted/20">
        <p className="text-[10px] text-center text-muted-foreground/50">
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