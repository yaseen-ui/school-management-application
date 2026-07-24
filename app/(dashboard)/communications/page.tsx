"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CommunicationsLandingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/communications/notifications")
  }, [router])

  return null
}