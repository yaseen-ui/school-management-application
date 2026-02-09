"use client"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  showYearDropdown?: boolean
  showMonthDropdown?: boolean
  className?: string
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  showYearDropdown = true,
  showMonthDropdown = true,
  className,
}: DatePickerProps) {
  return (
    <div className={cn("relative", className)}>
      <DatePicker
        selected={value}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        dropdownMode="select"
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        customInput={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        }
        className="w-full"
        wrapperClassName="w-full"
        calendarClassName="shadow-lg border rounded-lg"
        popperClassName="z-[9999]"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          {
            name: "preventOverflow",
            options: {
              padding: 8,
            },
          },
        ]}
      />
    </div>
  )
}
