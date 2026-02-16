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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateUser, useUpdateUser } from "@/hooks/use-users"
import { useRoles } from "@/hooks/use-roles"
import type { User } from "@/lib/api/types"

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  roleId: z.string().min(1, "Role is required"),
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
  const { data: rolesData } = useRoles()

  const roles = Array.isArray(rolesData) ? rolesData : rolesData?.data || []

  const isEditing = mode === "edit" && user

  const {
    register,
    handleSubmit,
    reset,
    control,
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
      roleId: "",
    },
  })

  useEffect(() => {
    if (isEditing && user) {
      reset({
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        password: "",
        roleId: user.roleId || "",
      })
    } else {
      reset({
        email: "",
        fullName: "",
        phone: "",
        password: "",
        roleId: "",
      })
    }
  }, [user, isEditing, reset])

  const onSubmit = (data: UserFormValues) => {
    if (isEditing && user) {
      const updateData: Partial<UserFormValues> = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        roleId: data.roleId,
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
      createUser.mutate(data as Required<UserFormValues>, {
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
      <DialogContent className="sm:max-w-[500px]">
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

          <div className="space-y-2">
            <Label htmlFor="roleId">Role</Label>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.roleName}
                      </SelectItem>
                    ))}
                    {roles.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No roles available</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roleId && <p className="text-sm text-destructive">{errors.roleId.message}</p>}
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
