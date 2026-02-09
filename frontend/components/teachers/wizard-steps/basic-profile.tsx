"use client"

import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/shared/file-upload"
import { useUsers } from "@/hooks/use-users"
import { DatePickerInput } from "@/components/ui/date-picker"

const GENDERS = ["Male", "Female", "Other"]

export function TeacherBasicProfile() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const dateOfBirth = watch("dateOfBirth")
  const dateOfJoining = watch("dateOfJoining")
  const photoUrl = watch("photoUrl")
  const teacherId = watch("id")

  const { data: users, isLoading: isLoadingUsers } = useUsers()

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      {teacherId && (
        <div className="space-y-2">
          <Label>Profile Photo</Label>
          <FileUpload
            category="teachers"
            entityId={teacherId}
            documentType="profile_photo"
            value={photoUrl}
            onUploadComplete={(url) => setValue("photoUrl", url)}
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            compact
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message as string}</p>}
        </div>

        {/* Middle Name */}
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" {...register("middleName")} placeholder="Enter middle name" />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            placeholder="teacher@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            {...register("phone", { required: "Phone is required" })}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender.message as string}</p>}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <DatePickerInput
            value={dateOfBirth ? new Date(dateOfBirth) : undefined}
            onChange={(date) => setValue("dateOfBirth", date?.toISOString() || "", { shouldValidate: true })}
            placeholder="Pick date of birth"
            maxDate={new Date()}
            minDate={new Date("1940-01-01")}
          />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message as string}</p>}
        </div>

        {/* Date of Joining */}
        <div className="space-y-2">
          <Label>
            Date of Joining <span className="text-destructive">*</span>
          </Label>
          <DatePickerInput
            value={dateOfJoining ? new Date(dateOfJoining) : undefined}
            onChange={(date) => setValue("dateOfJoining", date?.toISOString() || "", { shouldValidate: true })}
            placeholder="Pick joining date"
            maxDate={new Date()}
          />
          {errors.dateOfJoining && <p className="text-sm text-destructive">{errors.dateOfJoining.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee Code */}
        <div className="space-y-2">
          <Label htmlFor="employeeCode">
            Employee Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employeeCode"
            {...register("employeeCode", { required: "Employee code is required" })}
            placeholder="Enter employee code"
          />
          {errors.employeeCode && <p className="text-sm text-destructive">{errors.employeeCode.message as string}</p>}
        </div>

        {/* User Linking */}
        <div className="space-y-2">
          <Label htmlFor="userId">Link to User Account (Optional)</Label>
          <Select onValueChange={(value) => setValue("userId", value)} disabled={isLoadingUsers}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select user"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
