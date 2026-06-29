"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  FolderTree,
  Package,
  ShoppingBag,
  ClipboardList,
  Clock,
  Hand,
  DollarSign,
  RotateCcw,
  ArrowRight,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modules = [
  {
    title: "Categories",
    description: "Manage store categories — create, edit, and organize product categories with sort order and status control.",
    icon: FolderTree,
    href: "/store/categories",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Products",
    description: "Manage store products — add, edit, and track inventory. Assign products to categories and sections.",
    icon: Package,
    href: "/store/products",
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Kits",
    description: "Create and manage kit templates — group products together as reusable kits for quick order placement.",
    icon: ShoppingBag,
    href: "/store/kits",
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Orders",
    description: "View and manage all store orders. Track order status, confirm, collect, or cancel orders as needed.",
    icon: ClipboardList,
    href: "/store/orders",
    color: "from-amber-500 to-amber-600",
    lightColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Pending Items",
    description: "Track items that were out of stock at order time. Mark items as collected when they become available.",
    icon: Clock,
    href: "/store/pending-items",
    color: "from-rose-500 to-rose-600",
    lightColor: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    title: "Distribute",
    description: "Quick order placement interface. Select products or kits, manage cart, apply discounts, and process payments.",
    icon: Hand,
    href: "/store/distribute",
    color: "from-orange-500 to-orange-600",
    lightColor: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Dues",
    description: "Track and manage outstanding payments. View due amounts, record payments, and settle pending balances.",
    icon: DollarSign,
    href: "/store/dues",
    color: "from-cyan-500 to-cyan-600",
    lightColor: "bg-cyan-50 dark:bg-cyan-950/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Returns",
    description: "Process product returns and exchanges. Issue refunds and restock returned items automatically.",
    icon: RotateCcw,
    href: "/store/returns",
    color: "from-pink-500 to-pink-600",
    lightColor: "bg-pink-50 dark:bg-pink-950/30",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function StorePage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Store" }]} />
      <PageHeader
        title="Store"
        description="Manage store categories, products, kits, orders, and track dues and returns"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <motion.div key={module.href} variants={cardVariants}>
              <Link href={module.href} className="block h-full group">
                <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color}`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-xl p-3 ${module.lightColor}`}>
                        <Icon className={`h-6 w-6 ${module.iconColor}`} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
