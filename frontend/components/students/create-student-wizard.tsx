"use client"

import { useState } from "react"
import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { filterNullValues } from "@/lib/utils"
import { useCreateStudent, useUpdateStudent } from "@/hooks/use-students"
import { StudentBasicInfo } from "./wizard-steps/basic-info"
import { StudentPersonalFamily } from "./wizard-steps/personal-family"
import { StudentAcademicTransport } from "./wizard-steps/academic-transport"
import { StudentDocumentsAddress } from "./wizard-steps/documents-address"

import type { Student } from "@/lib/api/students"

interface CreateStudentWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentToEdit?: Student | null
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Student details" },
  { id: 2, title: "Personal & Family", description: "Personal and family information" },
  { id: 3, title: "Academic", description: "Academic background" },
  { id: 4, title: "Documents & Address", description: "Upload documents and address" },
]

export function CreateStudentWizard({ open, onOpenChange, studentToEdit }: CreateStudentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null)
  const isEditMode = !!studentToEdit

  const methods = useForm()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  // Initialize form with student data if editing
  const studentId = studentToEdit?.id || createdStudentId

  React.useEffect(() => {
    if (isEditMode && studentToEdit && open) {
      methods.reset({
        firstName: studentToEdit.firstName,
        middleName: studentToEdit.middleName,
        lastName: studentToEdit.lastName,
        dateOfBirth: studentToEdit.dateOfBirth,
        gender: studentToEdit.gender,
        gradeId: studentToEdit.gradeId,
        sectionId: studentToEdit.sectionId,
        aadhaarNumber: studentToEdit.aadhaarNumber,
        casteCategory: studentToEdit.casteCategory,
        subCaste: studentToEdit.subCaste,
        religion: studentToEdit.religion,
        motherTongue: studentToEdit.motherTongue,
        nationality: studentToEdit.nationality,
        identificationMarks: studentToEdit.identificationMarks,
        fatherName: studentToEdit.fatherName,
        fatherOccupation: studentToEdit.fatherOccupation,
        fatherPhone: studentToEdit.fatherPhone,
        fatherAadhaar: studentToEdit.fatherAadhaar,
        motherName: studentToEdit.motherName,
        motherOccupation: studentToEdit.motherOccupation,
        motherPhone: studentToEdit.motherPhone,
        motherAadhaar: studentToEdit.motherAadhaar,
        guardianName: studentToEdit.guardianName,
        guardianRelation: studentToEdit.guardianRelation,
        guardianContact: studentToEdit.guardianContact,
        classApplyingFor: studentToEdit.classApplyingFor,
        mediumOfInstruction: studentToEdit.mediumOfInstruction,
        previousSchoolName: studentToEdit.previousSchoolName,
        previousClassAttended: studentToEdit.previousClassAttended,
        transferCertificateNo: studentToEdit.transferCertificateNo,
        dateOfIssueTC: studentToEdit.dateOfIssueTC,
        modeOfTransport: studentToEdit.modeOfTransport,
        studentPassportPhoto: studentToEdit.studentPassportPhoto,
        fatherPassportPhoto: studentToEdit.fatherPassportPhoto,
        motherPassportPhoto: studentToEdit.motherPassportPhoto,
        guardianPassportPhoto: studentToEdit.guardianPassportPhoto,
        studentAadhaarCopy: studentToEdit.studentAadhaarCopy,
        parentsAadharCopy: studentToEdit.parentsAadharCopy,
        birthCertificateCopy: studentToEdit.birthCertificateCopy,
        casteCertificateCopy: studentToEdit.casteCertificateCopy,
        tcCopy: studentToEdit.tcCopy,
        conductCertificateCopy: studentToEdit.conductCertificateCopy,
        previousYearsMarksheetCopy: studentToEdit.previousYearsMarksheetCopy,
        incomeCertificateCopy: studentToEdit.incomeCertificateCopy,
        permanentAddress: studentToEdit.permanentAddress,
        state: studentToEdit.state,
        pincode: studentToEdit.pincode,
        feePaymentMode: studentToEdit.feePaymentMode,
        bankAccountDetails: studentToEdit.bankAccountDetails,
        midDayMealEligibility: studentToEdit.midDayMealEligibility,
      })
      // In edit mode, start from step 1 but use existing student ID
      setCreatedStudentId(studentToEdit.id)
      setCurrentStep(1)
    }
  }, [isEditMode, studentToEdit, open, methods])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === STEPS.length
  const isLoading = createStudent.isPending || updateStudent.isPending

  const handleNext = async () => {
    // Validate current step
    const isValid = await methods.trigger()
    if (!isValid) return

    const formData = methods.getValues()

    if (!isEditMode && currentStep === 1) {
      // Step 1: Create student (only if not in edit mode)
      createStudent.mutate(
        {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          gradeId: formData.gradeId,
          sectionId: formData.sectionId,
        },
        {
          onSuccess: (response: any) => {
            // Response structure: { status, data: { id, ... }, message }
            const studentId = response.data?.id || response.data?.data?.id
            if (studentId) {
              setCreatedStudentId(studentId)
              setCurrentStep(2)
            }
          },
        },
      )
    } else if (currentStep === 2) {
      // Step 2: Save personal/family data
      if (!studentId) return
      updateStudent.mutate(
        {
          id: studentId,
          data: filterNullValues({
            aadhaarNumber: formData.aadhaarNumber,
            casteCategory: formData.casteCategory,
            subCaste: formData.subCaste,
            religion: formData.religion,
            motherTongue: formData.motherTongue,
            nationality: formData.nationality,
            identificationMarks: formData.identificationMarks,
            fatherName: formData.fatherName,
            fatherOccupation: formData.fatherOccupation,
            fatherPhone: formData.fatherPhone,
            fatherAadhaar: formData.fatherAadhaar,
            motherName: formData.motherName,
            motherOccupation: formData.motherOccupation,
            motherPhone: formData.motherPhone,
            motherAadhaar: formData.motherAadhaar,
            guardianName: formData.guardianName,
            guardianRelation: formData.guardianRelation,
            guardianOccupation: formData.guardianOccupation,
            guardianContact: formData.guardianContact,
            guardianAadhaar: formData.guardianAadhaar,
          }),
        },
        {
          onSuccess: () => {
            setCurrentStep(3)
          },
        },
      )
    } else if (currentStep === 3) {
      // Step 3: Save academic/transport data
      if (!studentId) return
      updateStudent.mutate(
        {
          id: studentId,
          data: filterNullValues({
            classApplyingFor: formData.classApplyingFor,
            mediumOfInstruction: formData.mediumOfInstruction,
            previousSchoolName: formData.previousSchoolName,
            previousClassAttended: formData.previousClassAttended,
            transferCertificateNo: formData.transferCertificateNo,
            dateOfIssueTC: formData.dateOfIssueTC,
            modeOfTransport: formData.modeOfTransport,
          }),
        },
        {
          onSuccess: () => {
            setCurrentStep(4)
          },
        },
      )
    } else if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = async () => {
    const isValid = await methods.trigger()
    if (!isValid || !studentId) return

    const formData = methods.getValues()

    if (isEditMode) {
      // In edit mode, update all remaining fields
      updateStudent.mutate(
        {
          id: studentId,
          data: filterNullValues({
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
            gradeId: formData.gradeId,
            sectionId: formData.sectionId,
            aadhaarNumber: formData.aadhaarNumber,
            casteCategory: formData.casteCategory,
            subCaste: formData.subCaste,
            religion: formData.religion,
            motherTongue: formData.motherTongue,
            nationality: formData.nationality,
            identificationMarks: formData.identificationMarks,
            fatherName: formData.fatherName,
            fatherOccupation: formData.fatherOccupation,
            fatherPhone: formData.fatherPhone,
            fatherAadhaar: formData.fatherAadhaar,
            motherName: formData.motherName,
            motherOccupation: formData.motherOccupation,
            motherPhone: formData.motherPhone,
            motherAadhaar: formData.motherAadhaar,
            guardianName: formData.guardianName,
            guardianRelation: formData.guardianRelation,
            guardianContact: formData.guardianContact,
            classApplyingFor: formData.classApplyingFor,
            mediumOfInstruction: formData.mediumOfInstruction,
            previousSchoolName: formData.previousSchoolName,
            previousClassAttended: formData.previousClassAttended,
            transferCertificateNo: formData.transferCertificateNo,
            dateOfIssueTC: formData.dateOfIssueTC,
            modeOfTransport: formData.modeOfTransport,
            studentPassportPhoto: formData.studentPassportPhoto,
            fatherPassportPhoto: formData.fatherPassportPhoto,
            motherPassportPhoto: formData.motherPassportPhoto,
            guardianPassportPhoto: formData.guardianPassportPhoto,
            studentAadhaarCopy: formData.studentAadhaarCopy,
            parentsAadharCopy: formData.parentsAadharCopy,
            birthCertificateCopy: formData.birthCertificateCopy,
            casteCertificateCopy: formData.casteCertificateCopy,
            tcCopy: formData.tcCopy,
            conductCertificateCopy: formData.conductCertificateCopy,
            previousYearsMarksheetCopy: formData.previousYearsMarksheetCopy,
            incomeCertificateCopy: formData.incomeCertificateCopy,
            permanentAddress: formData.permanentAddress,
            state: formData.state,
            pincode: formData.pincode,
            feePaymentMode: formData.feePaymentMode,
            bankAccountDetails: formData.bankAccountDetails,
            midDayMealEligibility: formData.midDayMealEligibility,
          }),
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            methods.reset()
            setCurrentStep(1)
            setCreatedStudentId(null)
          },
        },
      )
    } else {
      // In create mode, save remaining document and address data (steps 2-4 already saved)
      updateStudent.mutate(
        {
          id: studentId,
          data: filterNullValues({
            studentPassportPhoto: formData.studentPassportPhoto,
            fatherPassportPhoto: formData.fatherPassportPhoto,
            motherPassportPhoto: formData.motherPassportPhoto,
            guardianPassportPhoto: formData.guardianPassportPhoto,
            studentAadhaarCopy: formData.studentAadhaarCopy,
            parentsAadharCopy: formData.parentsAadharCopy,
            birthCertificateCopy: formData.birthCertificateCopy,
            casteCertificateCopy: formData.casteCertificateCopy,
            tcCopy: formData.tcCopy,
            conductCertificateCopy: formData.conductCertificateCopy,
            previousYearsMarksheetCopy: formData.previousYearsMarksheetCopy,
            incomeCertificateCopy: formData.incomeCertificateCopy,
            permanentAddress: formData.permanentAddress,
            state: formData.state,
            pincode: formData.pincode,
            feePaymentMode: formData.feePaymentMode,
            bankAccountDetails: formData.bankAccountDetails,
            midDayMealEligibility: formData.midDayMealEligibility,
          }),
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            methods.reset()
            setCurrentStep(1)
            setCreatedStudentId(null)
          },
        },
      )
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    methods.reset()
    setCurrentStep(1)
    setCreatedStudentId(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Student" : "Add New Student"}</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center mt-2 hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <FormProvider {...methods}>
          <form className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && <StudentBasicInfo />}
                {currentStep === 2 && <StudentPersonalFamily />}
                {currentStep === 3 && <StudentAcademicTransport />}
                {currentStep === 4 && <StudentDocumentsAddress studentId={createdStudentId || ""} />}
              </motion.div>
            </AnimatePresence>
          </form>
        </FormProvider>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleBack} disabled={isFirstStep || isLoading}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>

            {isLastStep ? (
              <Button type="button" onClick={handleFinish} disabled={isLoading}>
                {isLoading ? "Saving..." : isEditMode ? "Update" : "Finish"}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                {isLoading ? isEditMode ? "Updating..." : "Creating..." : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
