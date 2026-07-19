"use client";

import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ZaiHistoryPanelProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onClose: () => void;
}

export function ZaiHistoryPanel({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClose,
}: ZaiHistoryPanelProps) {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-sm">ZAI Chats</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
            bg-primary text-primary-foreground hover:opacity-90 transition-all
            active:scale-[0.98] shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border 
              text-sm placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
              transition-all"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              {search ? "No chats found" : "No chats yet"}
            </p>
          </div>
        )}
        {Object.entries(groupedChats).map(([label, chatList]) => (
          <div key={label} className="mb-3">
            <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
              {label}
            </p>
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full group flex items-start gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-sm",
                  activeChatId === chat.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground/80"
                )}
              >
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="flex-1 truncate leading-snug">
                  {chat.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className={cn(
                    "p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all",
                    "hover:bg-destructive/10 hover:text-destructive",
                    activeChatId === chat.id ? "opacity-100" : ""
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
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