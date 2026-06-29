"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Package, Plus, Trash2, Layers } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStoreKit, useStoreProducts } from "@/hooks/use-store"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"

interface CreateKitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface KitItemEntry {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export function CreateKitDialog({ open, onOpenChange }: CreateKitDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  })
  const createKit = useCreateStoreKit()
  const { data: products } = useStoreProducts({ isActive: "true" })
  const coursesResponse = useCourses()
  const courses = Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data?.data?.rows || []
  const [kitItems, setKitItems] = useState<KitItemEntry[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")

  // Section selection state
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])

  const gradesResponse = useGrades(selectedCourseId || undefined)
  const sectionsResponse = useSections(selectedGradeId || undefined)
  const gradesList = Array.isArray(gradesResponse.data) ? gradesResponse.data : gradesResponse.data?.rows || []
  const sectionsList = Array.isArray(sectionsResponse.data) ? sectionsResponse.data : sectionsResponse.data?.data?.rows || []

  // Reset hierarchy when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedCourseId("")
      setSelectedGradeId("")
      setSelectedSectionIds([])
    }
  }, [open])

  const addItem = () => {
    if (!selectedProductId) return
    const product = products?.find((p) => p.id === selectedProductId)
    if (!product) return
    if (kitItems.some((item) => item.productId === selectedProductId)) return

    setKitItems([
      ...kitItems,
      {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: Number(product.basePrice),
      },
    ])
    setSelectedProductId("")
  }

  const removeItem = (productId: string) => {
    setKitItems(kitItems.filter((item) => item.productId !== productId))
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    setKitItems(
      kitItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const totalPrice = kitItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const toggleSection = (sectionId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const onSubmit = async (data: any) => {
    if (kitItems.length === 0) return
    try {
      await createKit.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        sectionIds: selectedSectionIds.length > 0 ? selectedSectionIds : undefined,
        items: kitItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      reset()
      setKitItems([])
      setSelectedCourseId("")
      setSelectedGradeId("")
      setSelectedSectionIds([])
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setKitItems([])
    setSelectedCourseId("")
    setSelectedGradeId("")
    setSelectedSectionIds([])
    onOpenChange(false)
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
              <DialogTitle>Create Kit</DialogTitle>
              <DialogDescription>Create a new kit bundle with products and assign to sections.</DialogDescription>
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
              <Label htmlFor="name">
                Kit Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Class 10 Annual Kit"
                {...register("name", { required: "Kit name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this kit"
                {...register("description")}
              />
            </div>

            {/* Section Assignment */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <Label className="text-base font-medium">Assign to Sections</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Select the sections this kit will be available for. Leave empty for all sections.
              </p>

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
            </div>

            {/* Kit Items Section */}
            <div className="space-y-3">
              <Label>Kit Items <span className="text-destructive">*</span></Label>

              <div className="flex gap-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a product to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} — ₹{Number(product.basePrice).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={addItem} disabled={!selectedProductId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {kitItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No items added yet. Select products above.</p>
              ) : (
                <div className="space-y-2">
                  {kitItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-2 rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                      <p className="text-sm font-medium w-20 text-right">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex justify-end border-t pt-2">
                    <p className="text-sm font-semibold">
                      Total: <span className="text-lg">₹{totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createKit.isPending || kitItems.length === 0}>
              {createKit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Kit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
