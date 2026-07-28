"use client";

import { useState } from "react";
import { useZaiChat } from "@/hooks/use-zai-chat";
import { ZaiChatList } from "@/components/zai/zai-chat-list";
import { ZaiChatArea } from "@/components/zai/zai-chat-area";
import { cn } from "@/lib/utils";
import { usePermissionStore } from "@/stores/permission-store";
import { ForbiddenPage } from "@/components/shared/forbidden-page";

/**
 * ZAI Page — WhatsApp-style on mobile, two-panel on desktop.
 *
 * Mobile: Single view at a time — chat list or chat detail. Back button
 * returns to the list. FAB on the list creates a new chat.
 *
 * Desktop: Side-by-side panels (unchanged).
 */

type MobileView = "list" | "chat";

export default function ZaiPage() {
  const {
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
  } = useZaiChat();

  // Mobile: which view is shown
  const [mobileView, setMobileView] = useState<MobileView>("list");

  const hasPermission = usePermissionStore((s) => s.hasPermission);
  const isLoaded = usePermissionStore((s) => s.isLoaded);

  // When a chat is selected from the list on mobile, switch to chat view
  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    setMobileView("chat");
  };

  // When "New Chat" is tapped (FAB or button), create a new chat and switch to chat view
  const handleNewChat = () => {
    createNewChat();
    setMobileView("chat");
  };

  // Back from chat view to list on mobile
  const handleBackToList = () => {
    setMobileView("list");
  };

  // Get active chat title for mobile header
  const activeChat = activeChatId
    ? chats.find((c) => c.id === activeChatId)
    : null;

  // Show loading while permissions are being resolved
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading ZAI...</div>
      </div>
    );
  }

  // Check permission
  if (!hasPermission("query-bot:ask")) {
    return <ForbiddenPage />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden relative bg-background">
      {/* ========= DESKTOP: Two-panel layout ========= */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left: Chat List (desktop sidebar) */}
        <div className="w-[340px] flex-shrink-0 border-r border-border/50 bg-sidebar/30 relative">
          <ZaiChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={(id) => {
              setActiveChat(id);
              setMobileView("chat");
            }}
            onNewChat={createNewChat}
            onDeleteChat={deleteChat}
          />
        </div>

        {/* Right: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <ZaiChatArea
            messages={messages}
            isLoading={isLoading}
            isGenerating={isGenerating}
            error={error}
            onSend={sendMessage}
            hasActiveChat={!!activeChatId || messages.length > 0}
          />
        </div>
      </div>

      {/* ========= MOBILE: Single view (WhatsApp-style) ========= */}
      <div className="flex lg:hidden w-full h-full flex-col">
        {/* Chat List View */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
            mobileView === "list"
              ? "translate-x-0"
              : "-translate-x-full"
          )}
        >
          <ZaiChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={deleteChat}
          />
        </div>

        {/* Chat Detail View */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
            mobileView === "chat"
              ? "translate-x-0"
              : "translate-x-full"
          )}
        >
          <ZaiChatArea
            messages={messages}
            isLoading={isLoading}
            isGenerating={isGenerating}
            error={error}
            onSend={sendMessage}
            hasActiveChat={!!activeChatId || messages.length > 0}
            onBack={handleBackToList}
            title={
              activeChat?.title ||
              (!activeChatId && messages.length === 0 ? "New Chat" : "Chat")
            }
          />
        </div>
      </div>
    </div>
  );
}