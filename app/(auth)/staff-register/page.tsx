"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock, User, Phone, Mail, Users, Briefcase, Hash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { teachersApi } from "@/lib/api/teachers"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

function buildRegisterSchema(missingFields: string[]) {
  const shape: Record<string, any> = {
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  }
  if (missingFields.includes("email")) {
    shape.email = z.string().email("Please enter a valid email address")
  }
  return z.object(shape).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
}

export default function StaffRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data: inviteData, isLoading: isValidating, error: tokenError } = useQuery({
    queryKey: ["staff-invite-token", token],
    queryFn: async () => {
      const r = await teachersApi.validateInviteToken(token!)
      return r.data
    },
    enabled: !!token,
    retry: false,
  })

  const registerMutation = useMutation({
    mutationFn: (data: { token: string; password: string; email?: string; phone?: string }) =>
      teachersApi.register(data),
    onSuccess: (response) => {
      toast.success(response?.message || "Registration successful")
      setTimeout(() => router.push("/login"), 2000)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed")
    },
  })

  const missingFields = inviteData?.missingFields || []
  const RegisterSchema = buildRegisterSchema(missingFields)
  type RegisterFormValues = z.infer<typeof RegisterSchema>

  const defaultValues: any = { password: "", confirmPassword: "" }
  if (missingFields.includes("email")) defaultValues.email = ""

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  })

  const onSubmit = (data: RegisterFormValues) => {
    if (!token) return
    const payload: any = { token, password: data.password }
    if (missingFields.includes("email")) payload.email = (data as any).email
    registerMutation.mutate(payload)
  }

  // No token
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Invalid Link</CardTitle>
            <CardDescription>No registration token found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Loading
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <CardTitle className="text-xl mt-4">Verifying...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Token error
  if (tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Invalid or Expired Link</CardTitle>
            <CardDescription>
              {(tokenError as Error)?.message || "This link is not valid."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" asChild><Link href="/login">Go to Login</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success
  if (registerMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-emerald-600">Registration Complete!</CardTitle>
              <CardDescription>Your account has been created. Redirecting to sign in...</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full"><Link href="/login">Sign In Now</Link></Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Complete Your Registration</CardTitle>
            <CardDescription>Set a password to access your staff account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {inviteData && (
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" /><span className="font-medium">{inviteData.fullName}</span>
                </div>
                {inviteData.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" /><span>{inviteData.phone}</span>
                  </div>
                )}
                {inviteData.email ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" /><span>{inviteData.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-amber-600">
                    <Mail className="h-4 w-4 shrink-0" /><span>No email on file — please provide one below</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" /><span className="capitalize">{inviteData.employeeType}</span>
                </div>
                {inviteData.employeeCode && (
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" /><span>{inviteData.employeeCode}</span>
                  </div>
                )}
              </div>
            )}

            {missingFields.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">Some required details are missing. Please provide them below.</p>
              </div>
            )}

            <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {missingFields.includes("email") && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email" className="pl-10" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{(errors.email as any)?.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password (min 6 characters)" className="pl-10 pr-10" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" className="pl-10 pr-10" {...register("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
              </Button>

              {registerMutation.error && (
                <p className="text-sm text-destructive text-center">{registerMutation.error instanceof Error ? registerMutation.error.message : "Registration failed"}</p>
              )}
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}