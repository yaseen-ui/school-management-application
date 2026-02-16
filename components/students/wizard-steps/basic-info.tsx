"use client"

import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { DatePickerInput } from "@/components/ui/date-picker"

const GENDERS = ["Male", "Female", "Other"]

export function StudentBasicInfo() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const dateOfBirth = watch("dateOfBirth")

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <DatePickerInput
            value={dateOfBirth ? new Date(dateOfBirth) : undefined}
            onChange={(date) => {
              setValue("dateOfBirth", date?.toISOString() || "", { shouldValidate: true })
            }}
            placeholder="Pick date of birth"
            maxDate={new Date()}
            minDate={new Date("1900-01-01")}
          />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message as string}</p>}
        </div>

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
      </div>

      {/* Hierarchical Filter for Grade & Section */}
      <div className="space-y-2">
        <Label>
          Grade & Section <span className="text-destructive">*</span>
        </Label>
        <HierarchicalFilter
          filters={["courses", "grades", "sections"]}
          required={{ courseId: false, gradeId: true, sectionId: true }}
          compact
        />
      </div>
    </div>
  )
}
