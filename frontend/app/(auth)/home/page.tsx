"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { GraduationCap, Loader2, MapPin, Phone, Mail, ArrowRight, Building2 } from "lucide-react"
import { useDomainResolver } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function TenantHomePage() {
  const { data: tenantInfo, isLoading, error } = useDomainResolver()
  const [showLogin, setShowLogin] = useState(false)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-muted-foreground">Loading institution details...</p>
        </motion.div>
      </div>
    )
  }

  // Error state - institution not found
  if (error || !tenantInfo) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Institution Not Found</h1>
            <p className="text-muted-foreground">
              We couldn't find an institution associated with this domain. Please check the URL or contact your
              administrator.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Panel - Institution Branding */}
      <div className="w-full lg:w-1/2 gradient-primary relative overflow-hidden min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 h-full text-white">
          {/* Logo and School Name */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            {tenantInfo.logo ? (
              <Image
                src={tenantInfo.logo || "/placeholder.svg"}
                alt={tenantInfo.schoolName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl object-cover bg-white/20"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="h-8 w-8" />
              </div>
            )}
            <div>
              <h1 className="text-xl lg:text-2xl font-bold leading-tight">{tenantInfo.schoolName}</h1>
              {tenantInfo.caption && <p className="text-sm text-white/80 mt-1">{tenantInfo.caption}</p>}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 py-8 lg:py-0"
          >
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                Welcome to our
                <br />
                Learning Portal
              </h2>
              <p className="text-lg text-white/80 max-w-md">
                Access your courses, grades, schedules, and connect with teachers and classmates all in one place.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 text-sm text-white/80">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>
                {tenantInfo.contactAddress.street}, {tenantInfo.contactAddress.city}, {tenantInfo.contactAddress.state}{" "}
                - {tenantInfo.contactAddress.zip}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{tenantInfo.contactPhone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>{tenantInfo.contactEmail}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        <div className="flex items-center justify-end p-6">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {!showLogin ? (
                // Welcome Screen with Login Button
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 text-center"
                >
                  {/* Mobile Logo */}
                  <div className="lg:hidden flex flex-col items-center gap-3">
                    {tenantInfo.logo ? (
                      <Image
                        src={tenantInfo.logo || "/placeholder.svg"}
                        alt={tenantInfo.schoolName}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <h2 className="text-lg font-semibold text-foreground">{tenantInfo.schoolName}</h2>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">Ready to get started?</h3>
                    <p className="text-muted-foreground">
                      Sign in to access your personalized dashboard and resources.
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowLogin(true)}
                    className="w-full h-12 text-base font-medium gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Sign In to Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Contact school admin
                    </a>
                  </p>
                </motion.div>
              ) : (
                // Login Form
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-center">
                    <button
                      onClick={() => setShowLogin(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      Back
                    </button>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in to your account</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your credentials to access {tenantInfo.schoolName}
                    </p>
                  </div>

                  <LoginForm />

                  <p className="text-center text-sm text-muted-foreground">
                    {"Forgot your password? "}
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Reset it here
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium text-foreground">EduManage</span>
        </div>
      </div>
    </div>
  )
}
