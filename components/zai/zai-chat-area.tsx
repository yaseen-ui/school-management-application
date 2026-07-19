"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Table, ChevronDown, Copy, Check, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ZaiWelcome } from "./zai-welcome";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  resultData?: any;
  resultCount?: number;
  queryUsed?: any;
  error?: string;
}

interface ZaiChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  onSend: (content: string) => Promise<void>;
  hasActiveChat: boolean;
}

export function ZaiChatArea({
  messages,
  isLoading,
  isGenerating,
  error,
  onSend,
  hasActiveChat,
}: ZaiChatAreaProps) {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    setInput("");
    await onSend(trimmed);

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Ambient background orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full
            bg-[radial-gradient(circle,oklch(0.55_0.2_260_/_0.08),oklch(0.5_0.22_280_/_0.04),transparent_70%)]
            blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin relative"
      >
        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasActiveChat && !isLoading && messages.length === 0 && (
          <ZaiWelcome onQuestionClick={(q) => {
            setInput(q);
            setTimeout(() => inputRef.current?.focus(), 100);
          }} />
        )}

        {messages.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((msg, i) => (
              <ZaiMessageBubble
                key={msg.id}
                message={msg}
                isLast={i === messages.length - 1}
              />
            ))}

            {/* Thinking indicator */}
            {isGenerating && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="glass rounded-2xl rounded-tl-md px-4 py-3 border border-border/50">
                  <div className="flex items-center gap-1.5 py-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <p className="text-sm text-destructive/80 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Scroll to bottom FAB */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 z-10 p-2 rounded-full bg-card border border-border
              shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-card rounded-2xl border border-border
            shadow-sm focus-within:shadow-md focus-within:border-primary/30
            focus-within:shadow-[0_0_30px_-8px_var(--primary)] transition-all duration-300">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ZAI anything about your school data..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm
                placeholder:text-muted-foreground/50
                focus:outline-none min-h-[44px] max-h-[120px]"
              style={{ scrollbarWidth: "thin" }}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={cn(
                "m-2 p-2 rounded-xl transition-all duration-200 flex-shrink-0",
                input.trim() && !isGenerating
                  ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground/40 mt-2">
            ZAI uses AI to query your school database • Results are read-only
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Individual Message Bubble ──────────────────────────────────

function ZaiMessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const [copied, setCopied] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const isUser = message.role === "user";
  const hasData = !!message.resultData;
  const isError = !!message.error;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3 mb-6", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">You</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[75%] flex flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-[0_4px_24px_-4px_var(--primary)]"
              : isError
                ? "rounded-tl-md bg-destructive/5 border border-destructive/10 text-destructive/80"
                : "rounded-tl-md glass border border-border/50"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Style inline code
              code({ className, children, ...props }) {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted/50 rounded px-1.5 py-0.5 text-xs" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              // Style links
              a({ children, ...props }) {
                return (
                  <a className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                );
              },
              // Style paragraphs
              p({ children }) {
                return <p className="mb-1 last:mb-0">{children}</p>;
              },
              // Style lists
              ul({ children }) {
                return <ul className="my-1 space-y-0.5 list-disc pl-4">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="my-1 space-y-0.5 list-decimal pl-4">{children}</ol>;
              },
              // Style tables
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-2 rounded-lg border border-border/30">
                    <table className="w-full text-xs">{children}</table>
                  </div>
                );
              },
              th({ children }) {
                return <th className="px-3 py-2 text-left font-medium text-muted-foreground bg-muted/30 border-b border-border/30 whitespace-nowrap">{children}</th>;
              },
              td({ children }) {
                return <td className="px-3 py-1.5 border-b border-border/20 whitespace-nowrap">{children}</td>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Data table — collapsible */}
        {hasData && Array.isArray(message.resultData) && message.resultData.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowDataTable(!showDataTable)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 
                bg-card/30 hover:bg-card/50 transition-all text-xs text-muted-foreground"
            >
              <Table className="h-3.5 w-3.5" />
              <span>
                View Query Results ({message.resultCount} row{message.resultCount !== 1 ? "s" : ""})
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", showDataTable && "rotate-180")} />
            </button>
            {showDataTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="mt-2 w-full max-w-[500px] overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className="overflow-x-auto max-h-[300px] scrollbar-thin">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/30">
                        {Object.keys(message.resultData[0] || {}).slice(0, 6).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                          >
                            {humanizeColumnHeader(key)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.resultData.slice(0, 50).map((row: any, i: number) => (
                        <tr
                          key={i}
                          className={cn(
                            "border-b border-border/20",
                            i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                          )}
                        >
                          {Object.values(row).slice(0, 6).map((val: any, j: number) => (
                            <td key={j} className="px-3 py-1.5 whitespace-nowrap text-foreground/80">
                              {formatCellValue(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Query info */}
        {message.queryUsed && (
          <p className="mt-1.5 text-[10px] text-muted-foreground/50 px-1">
            {message.queryUsed.filterSummary}
          </p>
        )}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "p-1 rounded-md opacity-0 hover:opacity-100 transition-opacity flex-shrink-0",
          isLast && "opacity-100"
        )}
        title="Copy"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </button>
    </motion.div>
  );
}

function humanizeColumnHeader(key: string): string {
  return key.split('.').pop()!
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/ Id$/i, ' ID')
    .trim();
}

function formatCellValue(val: any): string {
  if (val === null || val === undefined) return "-";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (val instanceof Date || (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val))) {
    return new Date(val).toLocaleDateString();
  }
  if (typeof val === "object") return JSON.stringify(val).substring(0, 30);
  return String(val);
}

