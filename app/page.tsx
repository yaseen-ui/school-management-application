import { redirect } from "next/navigation"
import { config } from "@/lib/config"

export default function RootPage() {
  // Redirect based on host type
  if (config.isCompanyHost) {
    redirect("/login")
  } else {
    redirect("/home")
  }
}
