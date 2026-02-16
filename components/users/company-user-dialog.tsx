"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCompanyUser } from "@/hooks/use-users"
import type { User } from "@/lib/api/types"

const companyUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

type CompanyUserFormValues = z.infer<typeof companyUserSchema>

interface CompanyUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  mode: "create" | "edit"
}

export function CompanyUserDialog({ open, onOpenChange, user, mode }: CompanyUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const createUser = useCreateCompanyUser()

  const isEditing = mode === "edit" && user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyUserFormValues>({
    resolver: zodResolver(
      isEditing ? companyUserSchema.extend({ password: z.string().optional() }) : companyUserSchema,
    ),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isEditing && user) {
      reset({
        fullName: user.fullName || "",
        email: user.email,
        password: "",
      })
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
      })
    }
  }, [user, isEditing, reset])

  const onSubmit = (data: CompanyUserFormValues) => {
    createUser.mutate(
      { ...data, userType: "company" },
      {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company User" : "Add Company User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update company user details below." : "Fill in the details to add a new company user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password {isEditing && "(leave blank to keep current)"}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isEditing ? "••••••••" : "Enter password"}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update User" : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
