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
import { useCreateTeacher, useUpdateTeacher } from "@/hooks/use-teachers"
import { TeacherBasicProfile } from "./wizard-steps/basic-profile"
import { TeacherQualifications } from "./wizard-steps/qualifications"
import { TeacherEmploymentHistory } from "./wizard-steps/employment-history"
import type { Teacher } from "@/lib/api/teachers"

interface CreateTeacherWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacherToEdit?: Teacher | null
}

const STEPS = [
  { id: 1, title: "Basic Profile", description: "Teacher information" },
  { id: 2, title: "Qualifications", description: "Academic qualifications" },
  { id: 3, title: "Employment History", description: "Work experience" },
]

export function CreateTeacherWizard({ open, onOpenChange, teacherToEdit }: CreateTeacherWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [createdTeacherId, setCreatedTeacherId] = useState<string | null>(null)
  const isEditMode = !!teacherToEdit

  const methods = useForm()
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()

  const teacherId = teacherToEdit?.id || createdTeacherId

  React.useEffect(() => {
    if (isEditMode && teacherToEdit && open) {
      methods.reset({
        fullName: teacherToEdit.fullName,
        email: teacherToEdit.email,
        phone: teacherToEdit.phone,
        gender: teacherToEdit.gender,
        employeeCode: teacherToEdit.employeeCode,
        profilePhotoUrl: teacherToEdit.profilePhotoUrl,
        yearsOfExperience: teacherToEdit.yearsOfExperience,
        userId: teacherToEdit.userId,
      })
      setCreatedTeacherId(teacherToEdit.id)
      setCurrentStep(1)
    }
  }, [isEditMode, teacherToEdit, open, methods])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === STEPS.length
  const isLoading = createTeacher.isPending || updateTeacher.isPending

  const handleNext = async () => {
    const isValid = await methods.trigger()
    if (!isValid) return

    const formData = methods.getValues()

    if (!isEditMode && currentStep === 1) {
      // Step 1: Create teacher
      createTeacher.mutate(
        filterNullValues({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          employeeCode: formData.employeeCode,
          profilePhotoUrl: formData.profilePhotoUrl,
          yearsOfExperience: formData.yearsOfExperience,
          userId: formData.userId,
        }),
        {
          onSuccess: (response: any) => {
            const teacherId = response.data?.id || response.data?.data?.id
            if (teacherId) {
              setCreatedTeacherId(teacherId)
              setCurrentStep(2)
            }
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
    if (isEditMode && teacherId) {
      const formData = methods.getValues()
      updateTeacher.mutate(
        {
          id: teacherId,
          data: filterNullValues({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            employeeCode: formData.employeeCode,
            profilePhotoUrl: formData.profilePhotoUrl,
            yearsOfExperience: formData.yearsOfExperience,
            userId: formData.userId,
          }),
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            methods.reset()
            setCurrentStep(1)
            setCreatedTeacherId(null)
          },
        },
      )
    } else {
      // In create mode, just close (qualifications and employment already saved)
      onOpenChange(false)
      methods.reset()
      setCurrentStep(1)
      setCreatedTeacherId(null)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    methods.reset()
    setCurrentStep(1)
    setCreatedTeacherId(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
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
                {currentStep === 1 && <TeacherBasicProfile />}
                {currentStep === 2 && <TeacherQualifications teacherId={teacherId || ""} />}
                {currentStep === 3 && <TeacherEmploymentHistory teacherId={teacherId || ""} />}
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
                {isLoading ? (isEditMode ? "Updating..." : "Creating...") : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
