"use client"

import * as React from "react"
import { Check, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="border border-border/70 bg-background/70 text-foreground shadow-sm"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const activeTheme = theme || "system"
  const ThemeIcon = activeTheme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun

  const themeOptions = [
    { value: "light", label: "Light", description: "Bright and airy", icon: Sun },
    { value: "dark", label: "Dark", description: "Soft navy contrast", icon: Moon },
    { value: "system", label: "System", description: "Match this device", icon: Monitor },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative border border-border/70 bg-background/70 text-foreground shadow-sm hover:border-primary/30 hover:bg-accent hover:text-accent-foreground dark:bg-background/55"
          aria-label={`Theme: ${activeTheme}`}
          title={`Theme: ${activeTheme}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme}
              initial={{ scale: 0, rotate: -70 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 70 }}
              transition={{ duration: 0.15 }}
            >
              <ThemeIcon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/70 p-1.5 shadow-xl">
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isActive = activeTheme === option.value

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={
                isActive
                  ? "rounded-lg bg-primary/10 text-primary focus:bg-primary/15 focus:text-primary"
                  : "rounded-lg"
              }
            >
              <Icon className="mr-2 h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-[11px] font-normal text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {isActive && <Check className="ml-2 h-4 w-4 shrink-0" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
