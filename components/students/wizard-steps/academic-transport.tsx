"use client"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerInput } from "@/components/ui/date-picker"

export function StudentAcademicTransport() {
  const { register, watch, setValue } = useFormContext()
  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Academic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classApplyingFor">Class Applying For</Label>
            <Input id="classApplyingFor" {...register("classApplyingFor")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediumOfInstruction">Medium of Instruction</Label>
            <Select
              value={watch("mediumOfInstruction")}
              onValueChange={(value) => setValue("mediumOfInstruction", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousSchoolName">Previous School Name</Label>
            <Input id="previousSchoolName" {...register("previousSchoolName")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousClass">Previous Class</Label>
            <Input id="previousClass" {...register("previousClassAttended")} />
          </div>
        </div>
      </div>

      {/* Transfer Certificate Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transfer Certificate Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transferCertificateNo">TC Number</Label>
            <Input id="transferCertificateNo" {...register("transferCertificateNo")} />
          </div>

          <div className="space-y-2">
            <Label>TC Issue Date</Label>
            <DatePickerInput
              value={watch("dateOfIssueTC") ? new Date(watch("dateOfIssueTC")) : undefined}
              onChange={(date) => {
                setValue("dateOfIssueTC", date?.toISOString() || "")
              }}
              placeholder="Pick TC issue date"
              maxDate={new Date()}
              minDate={new Date("1900-01-01")}
            />
          </div>
        </div>
      </div>

      {/* Transport Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transport Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modeOfTransport">Mode of Transport</Label>
            <Select
              value={watch("modeOfTransport")}
              onValueChange={(value) => setValue("modeOfTransport", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="School Bus">School Bus</SelectItem>
                <SelectItem value="Private Transport">Private Transport</SelectItem>
                <SelectItem value="Walking">Walking</SelectItem>
                <SelectItem value="Bicycle">Bicycle</SelectItem>
                <SelectItem value="Public Transport">Public Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
