"use client"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, UserCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStudentFee, useSectionFees } from "@/hooks/use-fees"
import { useEnrollments } from "@/hooks/use-enrollments"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import type { CreateStudentFeeRequest } from "@/lib/api/fees"
import type { Course } from "@/lib/api/courses"
import type { Grade } from "@/lib/api/grades"
import type { Section } from "@/lib/api/sections"
import type { Enrollment } from "@/lib/api/enrollments"

interface CreateStudentFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStudentFeeDialog({ open, onOpenChange }: CreateStudentFeeDialogProps) {
  const { data: coursesData } = useCourses()
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState(0)

  const { data: gradesData } = useGrades(selectedCourseId || undefined)
  const { data: sectionsData } = useSections(selectedGradeId || undefined)
  const { data: enrollmentsData } = useEnrollments(
    selectedSectionId ? { sectionId: selectedSectionId } : undefined
  )
  const { data: sectionFeesData } = useSectionFees(
    selectedSectionId ? { sectionId: selectedSectionId } : undefined
  )

  const createStudentFee = useCreateStudentFee()

  const courses: Course[] = useMemo(() => {
    const rows = (coursesData as any)?.data?.rows
    return Array.isArray(rows) ? rows : []
  }, [coursesData])

  const grades: Grade[] = useMemo(() => {
    const rows = (gradesData as any)?.rows
    return Array.isArray(rows) ? rows : []
  }, [gradesData])

  const sections: Section[] = useMemo(() => {
    const rows = (sectionsData as any)?.data?.rows
    return Array.isArray(rows) ? rows : []
  }, [sectionsData])

  const enrollments: Enrollment[] = useMemo(() => {
    return Array.isArray(enrollmentsData) ? enrollmentsData : []
  }, [enrollmentsData])

  // Find the section fee for the selected section
  const sectionFee = useMemo(() => {
    if (!sectionFeesData || !selectedSectionId) return null
    const fees = Array.isArray(sectionFeesData) ? sectionFeesData : []
    return fees.find((fee: any) => fee.sectionId === selectedSectionId) || null
  }, [sectionFeesData, selectedSectionId])

  const sectionHeads = useMemo(() => {
    return sectionFee?.heads || []
  }, [sectionFee])

  const totalActualFee = useMemo(() => {
    if (!sectionHeads.length) return 0
    return sectionHeads.reduce((sum: number, head: any) => sum + (head.amount || 0), 0)
  }, [sectionHeads])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateStudentFeeRequest>({
    defaultValues: {
      enrollmentId: "",
      totalActualFee: 0,
      totalNegotiatedFee: 0,
      allocationMethod: "equal",
      discountType: undefined,
      discountValue: 0,
      heads: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: "heads",
  })

  // When section fee loads, populate heads and totalActualFee
  useEffect(() => {
    if (sectionHeads.length > 0) {
      const heads = sectionHeads.map((head: any) => ({
        feeHeadId: head.feeHeadId,
        actualAmount: head.amount,
        negotiatedAmount: head.amount,
      }))
      replace(heads)
      setValue("totalActualFee", totalActualFee)
      setValue("totalNegotiatedFee", totalActualFee)
    } else {
      replace([])
      setValue("totalActualFee", 0)
      setValue("totalNegotiatedFee", 0)
    }
  }, [sectionHeads, totalActualFee, replace, setValue])

  // Recalculate negotiated amounts when discount changes
  const recalculateNegotiatedAmounts = useCallback(
    (discountVal: number, discType: string | undefined) => {
      if (!sectionHeads.length || !totalActualFee) return

      const discount = discType === "percentage" ? (discountVal / 100) * totalActualFee : discountVal
      const ratio = totalActualFee > 0 ? (totalActualFee - discount) / totalActualFee : 1

      const updatedHeads = sectionHeads.map((head: any) => ({
        feeHeadId: head.feeHeadId,
        actualAmount: head.amount,
        negotiatedAmount: Math.round((head.amount * ratio * 100) / 100),
      }))

      replace(updatedHeads)
      setValue("totalNegotiatedFee", Math.round((totalActualFee - discount) * 100) / 100)
    },
    [sectionHeads, totalActualFee, replace, setValue]
  )

  // Watch discount fields
  const discountType = watch("discountType")
  const discountValue = watch("discountValue")

  // When discount type changes, reset values
  const handleDiscountTypeChange = (value: string) => {
    setValue("discountType", value)
    setValue("discountValue", 0)
    setDiscountPercentage(0)
    // Reset to full amounts
    if (sectionHeads.length > 0) {
      const heads = sectionHeads.map((head: any) => ({
        feeHeadId: head.feeHeadId,
        actualAmount: head.amount,
        negotiatedAmount: head.amount,
      }))
      replace(heads)
      setValue("totalNegotiatedFee", totalActualFee)
    }
  }

  // When discount value changes (for "fixed" type)
  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0
    setValue("discountValue", val)
    const pct = totalActualFee > 0 ? (val / totalActualFee) * 100 : 0
    setDiscountPercentage(Math.round(pct * 100) / 100)
    recalculateNegotiatedAmounts(val, "fixed")
  }

  // When discount percentage changes (for "percentage" type)
  const handleDiscountPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value) || 0
    setDiscountPercentage(pct)
    const val = (pct / 100) * totalActualFee
    setValue("discountValue", Math.round(val * 100) / 100)
    recalculateNegotiatedAmounts(pct, "percentage")
  }

  const onSubmit = async (data: CreateStudentFeeRequest) => {
    try {
      await createStudentFee.mutateAsync(data)
      reset()
      setSelectedCourseId("")
      setSelectedGradeId("")
      setSelectedSectionId("")
      setDiscountPercentage(0)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedCourseId("")
    setSelectedGradeId("")
    setSelectedSectionId("")
    setDiscountPercentage(0)
    onOpenChange(false)
  }


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Student Fee</DialogTitle>
              <DialogDescription>Assign fee structure to a student</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Hierarchical Filters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="courseId">
                  Course <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedCourseId}
                  onValueChange={(value) => {
                    setSelectedCourseId(value)
                    setSelectedGradeId("")
                    setSelectedSectionId("")
                    setValue("enrollmentId", "")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeId">
                  Grade <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedGradeId}
                  onValueChange={(value) => {
                    setSelectedGradeId(value)
                    setSelectedSectionId("")
                    setValue("enrollmentId", "")
                  }}
                  disabled={!selectedCourseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.gradeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionId">
                  Section <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedSectionId}
                  onValueChange={(value) => {
                    setSelectedSectionId(value)
                    setValue("enrollmentId", "")
                  }}
                  disabled={!selectedGradeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.sectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="enrollmentId">
                Student <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("enrollmentId")}
                onValueChange={(value) => setValue("enrollmentId", value)}
                disabled={!selectedSectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {enrollments.map((enr) => (
                    <SelectItem key={enr.id} value={enr.id}>
                      {enr.student?.firstName} {enr.student?.lastName} ({enr.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee Amounts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalActualFee">
                  Actual Fee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalActualFee"
                  type="number"
                  placeholder="0"
                  value={totalActualFee}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalNegotiatedFee">
                  Negotiated Fee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalNegotiatedFee"
                  type="number"
                  placeholder="0"
                  disabled
                  className="bg-muted"
                  {...register("totalNegotiatedFee", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Discount Section */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={discountType || ""}
                  onValueChange={handleDiscountTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder="0"
                  value={discountValue || ""}
                  onChange={handleDiscountValueChange}
                  disabled={!discountType || discountType === "percentage"}
                  className={!discountType || discountType === "percentage" ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount %</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  placeholder="0"
                  value={discountPercentage || ""}
                  onChange={handleDiscountPercentageChange}
                  disabled={!discountType || discountType === "fixed"}
                  className={!discountType || discountType === "fixed" ? "bg-muted" : ""}
                />
              </div>
            </div>


            {/* Fee Heads (auto-populated from section fee) */}
            <div className="space-y-3">
              <Label>Fee Heads</Label>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedSectionId
                    ? "No fee heads configured for this section."
                    : "Select a section to load fee heads."}
                </p>
              )}

              {fields.map((field, index) => {
                const head = sectionHeads[index]
                return (
                  <div key={field.id} className="flex items-end gap-2 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Fee Head</Label>
                      <Input
                        value={head?.feeHead?.name || "Unknown Head"}
                        disabled
                        className="bg-muted"
                      />
                      <input type="hidden" {...register(`heads.${index}.feeHeadId`)} />
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs">Actual</Label>
                      <Input
                        type="number"
                        value={head?.amount || 0}
                        disabled
                        className="bg-muted"
                      />
                      <input
                        type="hidden"
                        {...register(`heads.${index}.actualAmount`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs">Negotiated</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...register(`heads.${index}.negotiatedAmount`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createStudentFee.isPending || !watch("enrollmentId")}>
              {createStudentFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Student Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
