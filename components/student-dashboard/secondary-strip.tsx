"use client"

import Link from "next/link"
import { DollarSign, CalendarClock, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SecondaryStripProps {
  feesDue: number | null
  from: "parent" | "staff"
}

function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `₹${n}`
  }
}

export function SecondaryStrip({ feesDue, from }: SecondaryStripProps) {
  if (from !== "parent") {
    return null
  }

  const items = [
    {
      title: "Fees",
      desc:
        feesDue != null && feesDue > 0
          ? `${formatCurrency(feesDue)} due`
          : feesDue === 0
            ? "All clear"
            : "View fees",
      href: "/parent-portal/fees",
      icon: DollarSign,
      accent: "bg-violet-500/10 text-violet-600",
    },
    {
      title: "Leave",
      desc: "Apply for your child",
      href: "/parent-portal/leave",
      icon: CalendarClock,
      accent: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "Messages",
      desc: "School inbox",
      href: "/parent-portal/communications",
      icon: Bell,
      accent: "bg-sky-500/10 text-sky-600",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <Link key={item.title} href={item.href}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-md transition-all h-full">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
