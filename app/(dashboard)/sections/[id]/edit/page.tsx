"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, FormProvider, type FieldErrors } from "react-hook-form"
import { Loader2, Users, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSection, useUpdateSection } from "@/hooks/use-sections"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { RoomSelector } from "@/components/shared/room-selector"
import { TeacherSelector } from "@/components/shared/teacher-selector"
import { motion } from "framer-motion"
import { CardSkeleton } from "@/components/shared/loading-skeleton"
import { useGrade } from "@/hooks/use-grades"
import { showRequiredFieldsToast } from "@/lib/form-validation"

interface FormData {
  sectionName: string
  courseId: string
  gradeId: string
  roomId: string
  sectionInChargeId: string
}

export default function EditSectionPage() {
  const router = useRouter()
  const params = useParams()
  const sectionId = params.id as string

  const { data: sectionData, isLoading, isError, error, refetch } = useSection(sectionId)
  const section = (sectionData as any)?.data || sectionData
  const {
    data: sectionGrade,
    isLoading: isGradeLoading,
    isError: isGradeError,
  } = useGrade(section?.gradeId || "")

  const form = useForm<FormData>({
    defaultValues: {
      sectionName: "",
      courseId: "",
      gradeId: "",
      roomId: "",
      sectionInChargeId: "",
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const updateSection = useUpdateSection()

  // Prefer the grade included with the section and fall back to the grade endpoint.
  // This keeps both hierarchy selectors populated even if a lean section response is returned.
  useEffect(() => {
    const courseId = section?.grade?.courseId || sectionGrade?.courseId
    if (section && courseId) {
      reset({
        sectionName: section.sectionName,
        gradeId: section.gradeId,
        roomId: section.roomId ?? "",
        courseId,
        sectionInChargeId: section.sectionInChargeId ?? "",
      })
    }
  }, [section, sectionGrade, reset])

  const onSubmit = async (data: FormData) => {
    if (!section) return

    await updateSection.mutateAsync({
      id: section.id,
      data: {
        sectionId: section.id,
        sectionName: data.sectionName,
        gradeId: data.gradeId,
        roomId: data.roomId || undefined,
        sectionInChargeId: data.sectionInChargeId || undefined,
      },
    })
    router.push("/sections")
  }

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    showRequiredFieldsToast(formErrors, {
      sectionName: "Section name",
      courseId: "Course",
      gradeId: "Grade",
    })
  }

  const isLoadingDetails =
    isLoading || Boolean(section && !section.grade?.courseId && isGradeLoading)

  if (isLoadingDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Section</h1>
            <p className="text-sm text-muted-foreground">Loading section details...</p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <CardSkeleton />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isError || !section || (!section.grade?.courseId && isGradeError)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Unable to Open Section</h1>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "The section details could not be loaded. Please try again."}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Section</h1>
          <p className="text-sm text-muted-foreground">Update section information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Section Details</CardTitle>
              <CardDescription>Update the information for {section.sectionName}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sectionName">
                  Section Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sectionName"
                  placeholder="e.g., Section A"
                  {...register("sectionName", { required: "Section name is required" })}
                />
                {errors.sectionName && <p className="text-sm text-destructive">{errors.sectionName.message}</p>}
              </div>

              <div className="space-y-2">
                <HierarchicalFilter
                  filters={["courses", "grades"]}
                  required={{ courseId: true, gradeId: true }}
                  labels={{
                    courseId: "Course",
                    gradeId: "Grade",
                  }}
                />
                {errors.gradeId && <p className="text-sm text-destructive">{errors.gradeId.message}</p>}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Section In-Charge (Optional)</h4>
                <TeacherSelector fieldName="sectionInChargeId" initialTeacherId={section.sectionInChargeId ?? undefined} />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Classroom Assignment (Optional)</h4>
                <RoomSelector fieldName="roomId" initialRoomId={section.roomId ?? undefined} />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateSection.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateSection.isPending}>
                {updateSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Section
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </motion.div>
  )
}
