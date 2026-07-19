"use client";

import { useState } from "react";
import { useZaiChat } from "@/hooks/use-zai-chat";
import { ZaiHistoryPanel } from "@/components/zai/zai-history-panel";
import { ZaiChatArea } from "@/components/zai/zai-chat-area";
import { Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissionStore } from "@/stores/permission-store";
import { ForbiddenPage } from "@/components/shared/forbidden-page";

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

  const [historyOpen, setHistoryOpen] = useState(false);
  const hasPermission = usePermissionStore((s) => s.hasPermission);
  const isLoaded = usePermissionStore((s) => s.isLoaded);

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
    return <ForbiddenPage message="You don't have permission to use ZAI. Required: query-bot:ask" />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden relative bg-background">
      {/* Mobile overlay */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setHistoryOpen(false)}
        />
      )}

      {/* History Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[300px] lg:w-[320px] bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto flex-shrink-0",
          historyOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ZaiHistoryPanel
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChat(id);
            setHistoryOpen(false);
          }}
          onNewChat={() => {
            createNewChat();
            setHistoryOpen(false);
          }}
          onDeleteChat={deleteChat}
          onClose={() => setHistoryOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-sidebar/50 backdrop-blur-sm">
          <button
            onClick={() => setHistoryOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">ZAI Assistant</span>
          </div>
        </div>
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
  );
}