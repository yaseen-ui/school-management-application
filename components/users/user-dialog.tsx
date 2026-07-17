"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateUser, useUpdateUser } from "@/hooks/use-users"
import { useRoles } from "@/hooks/use-roles"
import type { User } from "@/lib/api/types"

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  roleIds: z.array(z.string()).min(1, "Select at least one role"),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  mode: "create" | "edit"
}

export function UserDialog({ open, onOpenChange, user, mode }: UserDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const { data: rolesData } = useRoles() as { data: any }

  const roles = Array.isArray(rolesData) ? rolesData : rolesData?.data || []

  const isEditing = mode === "edit" && user

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(
      isEditing
        ? userSchema.extend({ password: z.string().optional() })
        : userSchema.extend({ password: z.string().min(6, "Password must be at least 6 characters") }),
    ),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      password: "",
      roleIds: [],
    },
  })

  const selectedRoleIds = watch("roleIds")

  useEffect(() => {
    if (isEditing && user) {
      reset({
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        password: "",
        // RBAC v2: user now has multiple roles; legacy fallback to single roleId
        roleIds: (user as any).roleIds ?? (user.roleId ? [user.roleId] : []),
      })
    } else {
      reset({
        email: "",
        fullName: "",
        phone: "",
        password: "",
        roleIds: [],
      })
    }
  }, [user, isEditing, reset])

  const toggleRole = (roleId: string) => {
    const current = selectedRoleIds || []
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId]
    setValue("roleIds", updated)
  }

  const onSubmit = (data: UserFormValues) => {
    if (isEditing && user) {
      const updateData: any = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        roleIds: data.roleIds,
      }
      if (data.password) {
        updateData.password = data.password
      }
      updateUser.mutate(
        { id: user.id, data: updateData },
        {
          onSuccess: () => {
            onOpenChange(false)
            reset()
          },
        },
      )
    } else {
      createUser.mutate(data as any, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      })
    }
  }

  const isPending = createUser.isPending || updateUser.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update user details below." : "Fill in the details to create a new user."}
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
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1234567890" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
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

          {/* ── RBAC v2: Multi-Role Picker ── */}
          <div className="space-y-2">
            <Label>Roles</Label>
            {errors.roleIds && <p className="text-sm text-destructive">{errors.roleIds.message}</p>}
            <div className="rounded-lg border border-border p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {roles.length === 0 && (
                <p className="text-sm text-muted-foreground">No roles available</p>
              )}
              {roles.map((role: any) => (
                <div key={role.id} className="flex items-start gap-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoleIds?.includes(role.id)}
                    onCheckedChange={() => toggleRole(role.id)}
                  />
                  <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer leading-tight">
                    <span className="font-medium">{role.roleName}</span>
                    {role.description && (
                      <span className="text-muted-foreground ml-1">— {role.description}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Users can have multiple roles. Permissions are the union of all assigned roles.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}