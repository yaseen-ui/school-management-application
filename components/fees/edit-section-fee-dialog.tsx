"use client"
import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, DollarSign, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateSectionFee } from "@/hooks/use-fees"
import { useFeeHeads } from "@/hooks/use-fees"
import type { SectionFee, CreateSectionFeeRequest } from "@/lib/api/fees"

interface EditSectionFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionFee: SectionFee | null
}

export function EditSectionFeeDialog({ open, onOpenChange, sectionFee }: EditSectionFeeDialogProps) {
  const { data: feeHeadsData } = useFeeHeads()
  const updateSectionFee = useUpdateSectionFee()
  const feeHeads: any[] = feeHeadsData || []

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateSectionFeeRequest>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "heads",
  })

  useEffect(() => {
    if (sectionFee) {
      reset({
        sectionId: sectionFee.sectionId,
        academicYearId: sectionFee.academicYearId,
        termCount: sectionFee.termCount,
        heads: sectionFee.heads?.map((h) => ({
          feeHeadId: h.feeHeadId,
          amount: h.amount,
        })) || [{ feeHeadId: "", amount: 0 }],
      })
    }
  }, [sectionFee, reset])

  const onSubmit = async (data: CreateSectionFeeRequest) => {
    if (!sectionFee) return
    try {
      await updateSectionFee.mutateAsync({ id: sectionFee.id, data })
      reset()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Section Fee</DialogTitle>
              <DialogDescription>Update fee structure for {sectionFee?.section?.sectionName}</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="termCount">
                  Number of Terms <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="termCount"
                  type="number"
                  min={1}
                  placeholder="1"
                  {...register("termCount", { valueAsNumber: true, min: 1 })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fee Heads</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ feeHeadId: "", amount: 0 })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Head
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 rounded-lg border p-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Fee Head</Label>
                    <Select onValueChange={(value) => setValue(`heads.${index}.feeHeadId`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee head" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeHeads.map((head: any) => (
                          <SelectItem key={head.id} value={head.id}>
                            {head.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(`heads.${index}.amount`, { valueAsNumber: true })}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateSectionFee.isPending}>
              {updateSectionFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Section Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
