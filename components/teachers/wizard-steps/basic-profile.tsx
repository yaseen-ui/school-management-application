"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/shared/file-upload"
import { useUsers } from "@/hooks/use-users"
import { DatePickerInput } from "@/components/ui/date-picker"

const GENDERS = ["Male", "Female", "Other"]
const EMPLOYEE_TYPES = [
  { value: "teacher", label: "Teacher" },
  { value: "driver", label: "Driver" },
  { value: "clerk", label: "Clerk" },
  { value: "office_boy", label: "Office Boy" },
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "security", label: "Security" },
  { value: "cleaner", label: "Cleaner" },
  { value: "other", label: "Other" },
]

const GOVERNMENT_ID_TYPES = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "voter_id", label: "Voter ID" },
  { value: "passport", label: "Passport" },
]

const VEHICLE_TYPES = [
  { value: "bus", label: "Bus" },
  { value: "van", label: "Van" },
  { value: "car", label: "Car" },
  { value: "auto", label: "Auto Rickshaw" },
]

export function TeacherBasicProfile() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const dateOfBirth = watch("dateOfBirth")
  const dateOfJoining = watch("dateOfJoining")
  const profilePhotoUrl = watch("profilePhotoUrl")
  const gender = watch("gender")
  const employeeType = watch("employeeType")
  const teacherId = watch("id")
  const governmentIdType = watch("governmentIdType")
  const drivingLicenseUrl = watch("drivingLicenseUrl")
  const medicalCertificateUrl = watch("medicalCertificateUrl")
  const governmentIdUrl = watch("governmentIdUrl")
  const licenseExpiryDate = watch("licenseExpiryDate")

  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const linkToUser = watch("linkToUser")
  const selectedUserId = watch("userId")

  // Filter unlinked users (users that don't have a teacher linked yet)
  const unlinkedUsers = users?.filter((u: any) => !u.teacher) || []

  // When a user is selected, auto-populate email and disable it
  useEffect(() => {
    if (linkToUser && selectedUserId) {
      const selectedUser = users?.find((u: any) => u.id === selectedUserId)
      if (selectedUser) {
        setValue("email", selectedUser.email || "", { shouldValidate: true })
        setValue("fullName", selectedUser.fullName || "", { shouldValidate: true })
        setValue("phone", selectedUser.phone || "", { shouldValidate: true })
      }
    }
  }, [linkToUser, selectedUserId, users, setValue])

  const isNonTeaching = employeeType && employeeType !== "teacher"
  const isDriver = employeeType === "driver"

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
            value={profilePhotoUrl}
            onUploadComplete={(url) => setValue("profilePhotoUrl", url)}
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            compact
          />
        </div>
      )}

      {/* Link to User Account - Checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="linkToUser"
          checked={linkToUser || false}
          onCheckedChange={(checked) => {
            setValue("linkToUser", !!checked)
            if (!checked) {
              setValue("userId", undefined)
            }
          }}
        />
        <Label htmlFor="linkToUser" className="cursor-pointer text-sm font-medium">
          Link to existing User Account
        </Label>
      </div>

      {/* User selection dropdown - only visible when checkbox is checked */}
      {linkToUser && (
        <div className="space-y-2 pl-7">
          <Label htmlFor="userId">Select User</Label>
          <Select
            value={selectedUserId || undefined}
            onValueChange={(value) => setValue("userId", value === "none" ? undefined : value)}
            disabled={isLoadingUsers}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select a user to link"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {unlinkedUsers.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </SelectItem>
              ))}
              {unlinkedUsers.length === 0 && !isLoadingUsers && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">No unlinked users available</div>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            {...register("fullName", { required: "Full name is required" })}
            placeholder="Enter full name"
            disabled={!!linkToUser}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message as string}</p>}
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
            placeholder="employee@example.com"
            disabled={!!linkToUser}
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
            disabled={!!linkToUser}
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
          <Select
            value={gender || undefined}
            onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
          >
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee Code */}
        <div className="space-y-2">
          <Label htmlFor="employeeCode">Employee Code (auto-generated if blank)</Label>
          <Input
            id="employeeCode"
            {...register("employeeCode")}
            placeholder="Leave blank to auto-generate"
          />
          {errors.employeeCode && <p className="text-sm text-destructive">{errors.employeeCode.message as string}</p>}
        </div>

        {/* Employee Type */}
        <div className="space-y-2">
          <Label htmlFor="employeeType">
            Employee Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={employeeType || undefined}
            onValueChange={(value) => setValue("employeeType", value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee type" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeType && <p className="text-sm text-destructive">{errors.employeeType.message as string}</p>}
        </div>

      </div>

      {/* Government ID Section - For all non-teaching staff */}
      {isNonTeaching && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Government ID</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="governmentIdType">ID Type</Label>
              <Select
                value={governmentIdType || undefined}
                onValueChange={(value) => setValue("governmentIdType", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {GOVERNMENT_ID_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="governmentIdNumber">ID Number</Label>
              <Input
                id="governmentIdNumber"
                {...register("governmentIdNumber")}
                placeholder="Enter ID number"
              />
            </div>
            {teacherId && (
              <div className="space-y-2">
                <Label>ID Document Upload</Label>
                <FileUpload
                  category="teachers"
                  entityId={teacherId}
                  documentType="government_id"
                  value={governmentIdUrl}
                  onUploadComplete={(url) => setValue("governmentIdUrl", url)}
                  accept="image/*,.pdf"
                  maxSize={5 * 1024 * 1024}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver-Specific Fields */}
      {isDriver && (
        <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            Driver Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driving License Number */}
            <div className="space-y-2">
              <Label htmlFor="drivingLicenseNumber">
                Driving License Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="drivingLicenseNumber"
                {...register("drivingLicenseNumber", { required: isDriver ? "License number is required" : false })}
                placeholder="Enter driving license number"
              />
              {errors.drivingLicenseNumber && (
                <p className="text-sm text-destructive">{errors.drivingLicenseNumber.message as string}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select
                value={watch("vehicleType") || undefined}
                onValueChange={(value) => setValue("vehicleType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Driving Experience */}
            <div className="space-y-2">
              <Label htmlFor="drivingExperienceYears">Driving Experience (Years)</Label>
              <Input
                id="drivingExperienceYears"
                type="number"
                min="0"
                {...register("drivingExperienceYears", { valueAsNumber: true })}
                placeholder="e.g. 5"
              />
            </div>

            {/* License Expiry Date */}
            <div className="space-y-2">
              <Label>License Expiry Date</Label>
              <DatePickerInput
                value={licenseExpiryDate ? new Date(licenseExpiryDate) : undefined}
                onChange={(date) => setValue("licenseExpiryDate", date?.toISOString() || "", { shouldValidate: true })}
                placeholder="Pick expiry date"
                minDate={new Date()}
              />
            </div>

            {/* Years of Experience (reuse existing field) */}
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Total Work Experience (Years)</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                step="0.5"
                {...register("yearsOfExperience", { valueAsNumber: true })}
                placeholder="e.g. 3.5"
              />
            </div>
          </div>

          {/* Document Uploads */}
          {teacherId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driving License Document</Label>
                <FileUpload
                  category="teachers"
                  entityId={teacherId}
                  documentType="driving_license"
                  value={drivingLicenseUrl}
                  onUploadComplete={(url) => setValue("drivingLicenseUrl", url)}
                  accept="image/*,.pdf"
                  maxSize={5 * 1024 * 1024}
                  compact
                />
              </div>
              <div className="space-y-2">
                <Label>Medical Certificate</Label>
                <FileUpload
                  category="teachers"
                  entityId={teacherId}
                  documentType="medical_certificate"
                  value={medicalCertificateUrl}
                  onUploadComplete={(url) => setValue("medicalCertificateUrl", url)}
                  accept="image/*,.pdf"
                  maxSize={5 * 1024 * 1024}
                  compact
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
