"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

interface ZaiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  queryUsed?: any;
  resultData?: any;
  resultCount?: number;
  error?: string;
  createdAt: string;
}

interface ZaiChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface UseZaiChatReturn {
  chats: ZaiChat[];
  activeChatId: string | null;
  messages: ZaiMessage[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  setActiveChat: (chatId: string) => void;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export function useZaiChat(): UseZaiChatReturn {
  const token = useAuthStore((s) => s.token);
  const storeTenantId = useAuthStore((s) => s.tenantId);
  const userTenantId = useAuthStore((s) => s.user?.tenantId ?? null);
  const tenantId = storeTenantId || userTenantId;
  const [chats, setChats] = useState<ZaiChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ZaiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (tenantId) {
      headers["x-tenant-id"] = tenantId;
    }

    return headers;
  }, [tenantId, token]);

  const refreshChats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/query-bot`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Unable to load conversations");
      }

      setChats(data?.chats || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversations");
    }
  }, [getAuthHeaders, token]);

  const fetchMessages = useCallback(async (chatId: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/query-bot?chatId=${chatId}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load messages");
      }

      setMessages(data?.messages || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, token]);

  const setActiveChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setError(null);
    fetchMessages(chatId);
  }, [fetchMessages]);

  const createNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!token) {
      toast.error("Please log in to use ZAI");
      return;
    }

    // Add user message optimistically
    const tempUserMsg: ZaiMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/query-bot`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          question: content,
          chatId: activeChatId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.summary || "Failed to get a response");
      }

      // Add assistant response
      const assistantMsg: ZaiMessage = {
        id: `resp-${Date.now()}`,
        role: "assistant",
        content: data.summary || "",
        resultData: data.data,
        resultCount: data.rowCount,
        queryUsed: data.queryUsed,
        error: data.error || undefined,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Set active chat ID if this was a new chat
      if (!activeChatId && data.chatId) {
        setActiveChatId(data.chatId);
      }

      // Refresh chat list
      refreshChats();
    } catch (err: any) {
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      const errorAssistantMsg: ZaiMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `I couldn't complete that request. ${errorMsg}`,
        error: errorMsg,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsGenerating(false);
    }
  }, [token, activeChatId, getAuthHeaders, refreshChats]);

  const deleteChat = useCallback(async (chatId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/query-bot?chatId=${chatId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        if (activeChatId === chatId) {
          setActiveChatId(null);
          setMessages([]);
        }
        refreshChats();
        toast.success("Chat deleted");
      }
    } catch {
      toast.error("Failed to delete chat");
    }
  }, [token, activeChatId, getAuthHeaders, refreshChats]);

  // Load chats on mount
  useEffect(() => {
    if (token) {
      refreshChats();
    }
  }, [token, refreshChats]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    chats,
    activeChatId,
    messages,
    isLoading,
    isGenerating,
    error,
    setActiveChat,
    createNewChat,
    sendMessage,
    deleteChat,
    refreshChats,
  };
}
