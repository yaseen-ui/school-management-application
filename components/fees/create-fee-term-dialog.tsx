"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, CalendarDays } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateFeeTerm, useSectionFees } from "@/hooks/use-fees"
import type { CreateFeeTermRequest } from "@/lib/api/fees"

interface CreateFeeTermDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFeeTermDialog({ open, onOpenChange }: CreateFeeTermDialogProps) {
  const { data: sectionFeesData } = useSectionFees()
  const createFeeTerm = useCreateFeeTerm()
  const sectionFees: any[] = sectionFeesData || []

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateFeeTermRequest>()

  const onSubmit = async (data: CreateFeeTermRequest) => {
    try {
      await createFeeTerm.mutateAsync(data)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Fee Term</DialogTitle>
              <DialogDescription>Add a new fee payment term</DialogDescription>
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
              <Label htmlFor="sectionFeeId">
                Section Fee <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("sectionFeeId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section fee" />
                </SelectTrigger>
                <SelectContent>
                  {sectionFees.map((sf: any) => (
                    <SelectItem key={sf.id} value={sf.id}>
                      {sf.section?.sectionName} — {sf.academicYear?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Term Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Term 1, First Installment"
                  {...register("name", { required: "Term name is required" })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">
                  Sort Order <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={1}
                  placeholder="1"
                  {...register("sortOrder", { valueAsNumber: true, min: 1 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate", { required: "Due date is required" })}
              />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFeeTerm.isPending}>
              {createFeeTerm.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Fee Term
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
