"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { CalendarDays, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateHoliday, useHolidayCategories } from "@/hooks/use-holidays"
import { useAcademicYears } from "@/hooks/use-academic-years"
import type { HolidayCategory } from "@/lib/api/holidays"

interface FormData {
  name: string
  date: string
  academicYearId: string
  categoryId: string
  type: string
  isMandatory: boolean
  remarks: string
}

export default function CreateHolidayPage() {
  const router = useRouter()
  const createHoliday = useCreateHoliday()
  const { data: categoriesData } = useHolidayCategories()
  const { data: academicYearsData } = useAcademicYears()

  const categories: HolidayCategory[] = categoriesData || []
  const academicYears = (academicYearsData as any)?.data?.rows || (academicYearsData as any)?.rows || []
  const activeYear = academicYears.find((y: any) => y.status === "active")

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
      academicYearId: activeYear?.id || "",
      categoryId: "",
      type: "school",
      isMandatory: true,
      remarks: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    await createHoliday.mutateAsync({
      name: data.name,
      date: data.date,
      academicYearId: data.academicYearId || null,
      categoryId: data.categoryId || null,
      type: data.type,
      isMandatory: data.isMandatory,
      fullDay: true,
      remarks: data.remarks || undefined,
    })
    router.push("/holidays")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add Holiday</h1>
          <p className="text-sm text-muted-foreground">Add a new holiday to the calendar</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Holiday Details</CardTitle>
              <CardDescription>Fill in the information below to add a new holiday</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Holiday Name <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="e.g., Independence Day" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
              <Input id="date" type="date" {...register("date", { required: "Date is required" })} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select defaultValue={activeYear?.id || ""} onValueChange={(v: string) => setValue("academicYearId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>{year.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(v: string) => setValue("categoryId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="school" onValueChange={(v: string) => setValue("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mandatory / Optional</Label>
                <Select defaultValue="true" onValueChange={(v: string) => setValue("isMandatory", v === "true")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Mandatory</SelectItem>
                    <SelectItem value="false">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" placeholder="Any additional notes..." {...register("remarks")} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={createHoliday.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createHoliday.isPending}>
              {createHoliday.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Holiday
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}