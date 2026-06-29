"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DistributePage } from "@/components/store/distribute-page"

export default function StoreDistributePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Distribute" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Distribute" description="Quick order placement interface" />
        <DistributePage />
      </motion.div>
    </>
  )
}
