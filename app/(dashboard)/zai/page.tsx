"use client";

import { useState } from "react";
import { useZaiChat } from "@/hooks/use-zai-chat";
import { ZaiChatList } from "@/components/zai/zai-chat-list";
import { ZaiChatArea } from "@/components/zai/zai-chat-area";
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
    <div className="relative isolate flex h-full min-h-0 w-full min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
      {/* Wide screens: familiar two-panel messenger layout */}
      <div className="hidden h-full min-h-0 w-full xl:flex">
        {/* Left: Chat List (desktop sidebar) */}
        <aside className="relative w-[310px] 2xl:w-[340px] flex-shrink-0 border-r border-border/60">
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
        </aside>

        {/* Right: Chat Area */}
        <section className="flex h-full min-w-0 flex-1 flex-col">
          <ZaiChatArea
            messages={messages}
            isLoading={isLoading}
            isGenerating={isGenerating}
            error={error}
            onSend={sendMessage}
            hasActiveChat={!!activeChatId || messages.length > 0}
            title={activeChat?.title || "New conversation"}
          />
        </section>
      </div>

      {/* Tablet/mobile: render one stable pane, never an off-screen sliding pane. */}
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col xl:hidden">
        {mobileView === "list" ? (
          <ZaiChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={deleteChat}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
