import type React from "react"
import { Suspense } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex">
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  )
}
