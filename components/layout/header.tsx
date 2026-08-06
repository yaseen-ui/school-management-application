"use client"

import { Search, Menu, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { NotificationBell } from "@/components/communication/notification-bell"
import { useAuth } from "@/hooks/use-auth"
import { useUIStore } from "@/stores/ui-store"

export function Header() {
  const { user, logout } = useAuth()
  const { toggleMobileSidebar } = useUIStore()

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U"

  const displayName = user?.fullName || user?.email || "User"

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/70 bg-card/90 px-4 text-card-foreground shadow-[0_8px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 sm:px-6">

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 border border-border/70 bg-background/70 shadow-sm hover:border-primary/30 hover:bg-accent lg:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="max-w-xl flex-1">
        <div className="group relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-10 rounded-xl border-border/70 bg-background/75 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all placeholder:text-muted-foreground/80 hover:border-primary/25 hover:bg-background focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-primary/15 dark:bg-background/55 dark:hover:bg-background/75 dark:focus-visible:bg-background/90"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full border border-primary/20 bg-background/70 p-0 shadow-sm ring-offset-card hover:border-primary/40 hover:bg-accent focus-visible:ring-primary/25"
              aria-label="Open user menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 text-sm font-semibold text-white shadow-inner">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-xl border-border/70 p-1.5 shadow-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
