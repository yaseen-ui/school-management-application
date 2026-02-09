"use client"

import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/shared/file-upload"

interface StudentDocumentsAddressProps {
  studentId?: string
}

export function StudentDocumentsAddress({ studentId }: StudentDocumentsAddressProps) {
  const { watch, setValue, register } = useFormContext()
  if (!studentId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Student must be created first to upload documents.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Document Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Document Uploads</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Student Passport Photo</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="passport_photo"
              value={watch("studentPassportPhoto")}
              onUploadComplete={(url) => setValue("studentPassportPhoto", url)}
              accept="image/*"
              maxSize={2 * 1024 * 1024}
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Father's Photo</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="father_photo"
              value={watch("fatherPassportPhoto")}
              onUploadComplete={(url) => setValue("fatherPassportPhoto", url)}
              accept="image/*"
              maxSize={2 * 1024 * 1024}
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Mother's Photo</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="mother_photo"
              value={watch("motherPassportPhoto")}
              onUploadComplete={(url) => setValue("motherPassportPhoto", url)}
              accept="image/*"
              maxSize={2 * 1024 * 1024}
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Guardian's Photo</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="guardian_photo"
              value={watch("guardianPassportPhoto")}
              onUploadComplete={(url) => setValue("guardianPassportPhoto", url)}
              accept="image/*"
              maxSize={2 * 1024 * 1024}
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Student Aadhaar Copy</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="student_aadhaar"
              value={watch("studentAadhaarCopy")}
              onUploadComplete={(url) => setValue("studentAadhaarCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Parents Aadhaar Copy</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="parents_aadhaar"
              value={watch("parentsAadharCopy")}
              onUploadComplete={(url) => setValue("parentsAadharCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Birth Certificate</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="birth_certificate"
              value={watch("birthCertificateCopy")}
              onUploadComplete={(url) => setValue("birthCertificateCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Caste Certificate</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="caste_certificate"
              value={watch("casteCertificateCopy")}
              onUploadComplete={(url) => setValue("casteCertificateCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Transfer Certificate</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="transfer_certificate"
              value={watch("tcCopy")}
              onUploadComplete={(url) => setValue("tcCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Conduct Certificate Copy</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="conduct_certificate"
              value={watch("conductCertificateCopy")}
              onUploadComplete={(url) => setValue("conductCertificateCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Previous Years Marksheet Copy</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="previous_marksheet"
              value={watch("previousYearsMarksheetCopy")}
              onUploadComplete={(url) => setValue("previousYearsMarksheetCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>

          <div className="space-y-2">
            <Label>Income Certificate Copy</Label>
            <FileUpload
              category="students"
              entityId={studentId}
              documentType="income_certificate"
              value={watch("incomeCertificateCopy")}
              onUploadComplete={(url) => setValue("incomeCertificateCopy", url)}
              accept="application/pdf,image/*"
              compact
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="permanentAddress">Permanent Address</Label>
            <Textarea id="permanentAddress" {...register("permanentAddress")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("state")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" {...register("pincode")} />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Financial Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="feePaymentMode">Fee Payment Mode</Label>
            <Select
              value={watch("feePaymentMode")}
              onValueChange={(value) => setValue("feePaymentMode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccountDetails">Bank Account Details</Label>
            <Input id="bankAccountDetails" {...register("bankAccountDetails")} />
          </div>

          <div className="space-y-2 flex items-center gap-2">
            <Checkbox
              id="midDayMealEligibility"
              checked={watch("midDayMealEligibility")}
              onCheckedChange={(checked) => setValue("midDayMealEligibility", checked)}
            />
            <Label htmlFor="midDayMealEligibility" className="cursor-pointer">
              Mid-Day Meal Eligible
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
