"use client"

import { Clock3, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"))
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"))

function toDisplayTime(value?: string) {
  if (!value) return ""

  const [hourValue, minuteValue] = value.split(":").map(Number)
  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) return ""

  const period = hourValue >= 12 ? "PM" : "AM"
  const hour = hourValue % 12 || 12
  return `${String(hour).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")} ${period}`
}

function getParts(value?: string) {
  if (!value) return { hour: "09", minute: "00", period: "AM" }

  const [hourValue, minuteValue] = value.split(":").map(Number)
  return {
    hour: String(hourValue % 12 || 12).padStart(2, "0"),
    minute: String(minuteValue).padStart(2, "0"),
    period: hourValue >= 12 ? "PM" : "AM",
  }
}

function toValue(hour: string, minute: string, period: string) {
  let hourValue = Number(hour) % 12
  if (period === "PM") hourValue += 12
  return `${String(hourValue).padStart(2, "0")}:${minute}`
}

export function TimePickerInput({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerInputProps) {
  const parts = getParts(value)

  const updatePart = (part: "hour" | "minute" | "period", nextValue: string) => {
    const next = { ...parts, [part]: nextValue }
    onChange(toValue(next.hour, next.minute, next.period))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{value ? toDisplayTime(value) : placeholder}</span>
          <Clock3 className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-xl p-3">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium">Select time</p>
            <p className="text-[10px] text-muted-foreground">Hour, minute, and period</p>
          </div>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onChange("")}
              aria-label="Clear time"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-[72px_72px_68px] gap-2">
          <label className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Hour</span>
            <select
              value={parts.hour}
              onChange={(event) => updatePart("hour", event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              {hours.map((hour) => <option key={hour}>{hour}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Minute</span>
            <select
              value={parts.minute}
              onChange={(event) => updatePart("minute", event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              {minutes.map((minute) => <option key={minute}>{minute}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Period</span>
            <select
              value={parts.period}
              onChange={(event) => updatePart("period", event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </label>
        </div>
      </PopoverContent>
    </Popover>
  )
}
