"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Bell, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChannelToggleGroupProps {
  value: string[]
  onChange: (value: string[]) => void
  enabledChannels?: string[]
  disabled?: boolean
}

const channels = [
  { value: "in_app", label: "In-App", icon: Bell },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "push", label: "Push", icon: Smartphone },
]

export function ChannelToggleGroup({ value, onChange, enabledChannels, disabled }: ChannelToggleGroupProps) {
  const toggle = (channelValue: string) => {
    if (value.includes(channelValue)) {
      onChange(value.filter((v) => v !== channelValue))
    } else {
      onChange([...value, channelValue])
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {channels.map((ch) => {
          const isEnabled = !enabledChannels || enabledChannels.includes(ch.value)
          const isSelected = value.includes(ch.value)
          const Icon = ch.icon

          const button = (
            <Button
              key={ch.value}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={!isEnabled || disabled}
              onClick={() => toggle(ch.value)}
              className={cn(
                "gap-2",
                !isEnabled && "opacity-40 cursor-not-allowed",
              )}
            >
              <Icon className="h-4 w-4" />
              {ch.label}
            </Button>
          )

          if (!isEnabled) {
            return (
              <Tooltip key={ch.value}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p>Disabled via environment configuration</p>
                </TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </div>
    </TooltipProvider>
  )
}