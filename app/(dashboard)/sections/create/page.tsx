"use client"

import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { Loader2, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateSection } from "@/hooks/use-sections"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { RoomSelector } from "@/components/shared/room-selector"
import { motion } from "framer-motion"

interface FormData {
  sectionName: string
  gradeId: string
  roomId: string
}

export default function CreateSectionPage() {
  const router = useRouter()
  const methods = useForm<FormData>({
    defaultValues: {
      sectionName: "",
      gradeId: "",
      roomId: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  const createSection = useCreateSection()

  const onSubmit = async (data: FormData) => {
    await createSection.mutateAsync({
      sectionName: data.sectionName,
      gradeId: data.gradeId,
      roomId: data.roomId || undefined,
    })
    reset()
    router.push("/sections")
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
          <h1 className="text-2xl font-semibold tracking-tight">Create Section</h1>
          <p className="text-sm text-muted-foreground">Add a new section to your institute</p>
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
              <CardDescription>Fill in the information below to create a new section</CardDescription>
            </div>
          </div>
        </CardHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  required={{ gradeId: true }}
                  labels={{
                    courseId: "Course (Optional)",
                    gradeId: "Grade",
                  }}
                />
                {errors.gradeId && <p className="text-sm text-destructive">{errors.gradeId.message}</p>}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Classroom Assignment (Optional)</h4>
                <RoomSelector fieldName="roomId" />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={createSection.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createSection.isPending}>
                {createSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Section
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </motion.div>
  )
}
