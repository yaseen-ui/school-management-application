"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Package, Globe, Layers } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStoreProduct, useStoreCategories } from "@/hooks/use-store"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      basePrice: 0,
      isGeneral: true,
      isActive: true,
      stockQuantity: 0,
    },
  })
  const createProduct = useCreateStoreProduct()
  const { data: categories } = useStoreCategories({ isActive: "true" })
  const coursesResponse = useCourses()
  const courses = Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data?.data?.rows || []
  const isGeneral = watch("isGeneral")

  // Course → Grade → Section hierarchy
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])

  const gradesResponse = useGrades(selectedCourseId || undefined)
  const sectionsResponse = useSections(selectedGradeId || undefined)
  const gradesList = Array.isArray(gradesResponse.data) ? gradesResponse.data : gradesResponse.data?.rows || []
  const sectionsList = Array.isArray(sectionsResponse.data) ? sectionsResponse.data : sectionsResponse.data?.data?.rows || []

  // Reset hierarchy when isGeneral changes or dialog opens
  useEffect(() => {
    if (!open) {
      setSelectedCourseId("")
      setSelectedGradeId("")
      setSelectedSectionIds([])
    }
  }, [open])

  const onSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync({
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || undefined,
        basePrice: Number(data.basePrice),
        isGeneral: data.isGeneral,
        stockQuantity: Number(data.stockQuantity) || 0,
        isActive: data.isActive,
        sectionIds: data.isGeneral ? undefined : selectedSectionIds,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedCourseId("")
    setSelectedGradeId("")
    setSelectedSectionIds([])
    onOpenChange(false)
  }

  const toggleSection = (sectionId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>Add a new product to the store inventory.</DialogDescription>
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
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Physics Textbook, School Tie"
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this product"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">
                  Base Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("basePrice", { required: "Price is required", valueAsNumber: true })}
                />
                {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  placeholder="0"
                  {...register("stockQuantity", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Availability Type */}
            <div className="space-y-3 rounded-lg border p-4">
              <Label className="text-base font-medium">Availability</Label>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="isGeneral"
                  checked={isGeneral}
                  onCheckedChange={(checked) => {
                    setValue("isGeneral", checked === true)
                    if (checked) {
                      setSelectedCourseId("")
                      setSelectedGradeId("")
                      setSelectedSectionIds([])
                    }
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="isGeneral" className="text-base font-medium cursor-pointer">
                      General Product
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available to all sections. Uncheck to restrict to specific sections.
                  </p>
                </div>
              </div>
            </div>

            {/* Section-specific selection (only when not general) */}
            {!isGeneral && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <Label className="text-base font-medium">Assign to Sections</Label>
                </div>

                {/* Course Select */}
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={selectedCourseId} onValueChange={(value) => {
                    setSelectedCourseId(value)
                    setSelectedGradeId("")
                    setSelectedSectionIds([])
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.courseName || course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Grade Select */}
                {selectedCourseId && (
                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Select value={selectedGradeId} onValueChange={(value) => {
                      setSelectedGradeId(value)
                      setSelectedSectionIds([])
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradesList.map((grade: any) => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.gradeName || grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Section Multi-Select */}
                {selectedGradeId && (
                  <div className="space-y-2">
                    <Label>Sections</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-2">
                      {sectionsList.length === 0 ? (
                        <p className="text-sm text-muted-foreground col-span-2 p-2">No sections found for this grade.</p>
                      ) : (
                        sectionsList.map((section: any) => (
                          <label
                            key={section.id}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                              selectedSectionIds.includes(section.id)
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted border border-transparent"
                            }`}
                          >
                            <Checkbox
                              checked={selectedSectionIds.includes(section.id)}
                              onCheckedChange={() => toggleSection(section.id)}
                            />
                            <span className="text-sm">{section.sectionName}</span>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedSectionIds.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {selectedSectionIds.length} section(s) selected
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex items-end space-x-2 rounded-lg border p-4">
              <Checkbox
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked === true)}
              />
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">Active</Label>
                <p className="text-sm text-muted-foreground">Product is available for purchase</p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
