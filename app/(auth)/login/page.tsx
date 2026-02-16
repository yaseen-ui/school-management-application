import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign In - Company Portal",
  description: "Sign in to the EduManage Company Portal",
}

export default function CompanyLoginPage() {
  return (
    <>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">EduManage</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Company Operations
              <br />
              Portal
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Manage institutions, monitor subscriptions, and oversee platform operations from a single dashboard.
            </p>
          </div>

          <p className="text-sm text-white/60">Internal operations access only</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">EduManage Ops</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Company Sign In</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the operations portal</p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-muted-foreground">
              Need access?{" "}
              <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Contact IT Support
              </a>
            </p>
          </div>
        </div>

        <div className="p-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </a>
          {" and "}
          <a href="#" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </>
  )
}
