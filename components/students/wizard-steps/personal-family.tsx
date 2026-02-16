"use client"

import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function StudentPersonalFamily() {
  const { register, watch, setValue } = useFormContext()
  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
            <Input id="aadhaarNumber" placeholder="XXXX-XXXX-XXXX" {...register("aadhaarNumber")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="casteCategory">Caste Category</Label>
            <Select
              value={watch("casteCategory")}
              onValueChange={(value) => setValue("casteCategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCaste">Sub-Caste</Label>
            <Input id="subCaste" {...register("subCaste")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Input id="religion" {...register("religion")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Input id="motherTongue" {...register("motherTongue")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" defaultValue="Indian" {...register("nationality")} />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="identificationMarks">Identification Marks</Label>
            <Textarea
              id="identificationMarks"
              placeholder="Any visible identification marks"
              {...register("identificationMarks")}
            />
          </div>
        </div>
      </div>

      {/* Father's Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Father's Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fatherName">Full Name</Label>
            <Input id="fatherName" {...register("fatherName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherOccupation">Occupation</Label>
            <Input id="fatherOccupation" {...register("fatherOccupation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherPhone">Phone Number</Label>
            <Input id="fatherPhone" type="tel" {...register("fatherPhone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherAadhaar">Aadhaar Number</Label>
            <Input id="fatherAadhaar" {...register("fatherAadhaar")} />
          </div>
        </div>
      </div>

      {/* Mother's Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mother's Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motherName">Full Name</Label>
            <Input id="motherName" {...register("motherName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherOccupation">Occupation</Label>
            <Input id="motherOccupation" {...register("motherOccupation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherPhone">Phone Number</Label>
            <Input id="motherPhone" type="tel" {...register("motherPhone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherAadhaar">Aadhaar Number</Label>
            <Input id="motherAadhaar" {...register("motherAadhaar")} />
          </div>
        </div>
      </div>

      {/* Guardian Details (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian Details (Optional)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianName">Full Name</Label>
            <Input id="guardianName" {...register("guardianName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianRelation">Relation</Label>
            <Input id="guardianRelation" {...register("guardianRelation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianContact">Phone Number</Label>
            <Input id="guardianContact" type="tel" {...register("guardianContact")} />
          </div>
        </div>
      </div>
    </div>
  )
}
