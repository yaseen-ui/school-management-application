"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { HierarchicalFilter } from "./hierarchical-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Example 1: With react-hook-form
export function ExampleWithForm() {
  const form = useForm({
    defaultValues: {
      courseId: "",
      gradeId: "",
      sectionId: "",
    },
  })

  const onSubmit = (data: any) => {
    console.log("Form data:", data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Enrollment (With Form)</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <HierarchicalFilter
              filters={["courses", "grades", "sections"]}
              required={{ courseId: true, gradeId: true, sectionId: true }}
              compact
            />
            <Button type="submit">Enroll Student</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

// Example 2: Standalone (without form)
export function ExampleStandalone() {
  const [values, setValues] = useState<{
    courseId?: string
    gradeId?: string
    sectionId?: string
  }>({})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Reports (Standalone)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <HierarchicalFilter
          filters={["courses", "grades"]}
          values={values}
          onChange={(newValues) => {
            console.log("Filter changed:", newValues)
            setValues(newValues)
          }}
        />
        <div className="text-sm text-muted-foreground">
          Selected: Course={values.courseId || "none"}, Grade={values.gradeId || "none"}
        </div>
      </CardContent>
    </Card>
  )
}

// Example 3: Just courses and grades
export function ExamplePartial() {
  const form = useForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Assignment (Partial)</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <HierarchicalFilter
            filters={["courses", "grades"]}
            labels={{
              courseId: "Teaching Course",
              gradeId: "Teaching Grade",
            }}
            required={{ courseId: true, gradeId: true }}
          />
        </FormProvider>
      </CardContent>
    </Card>
  )
}
