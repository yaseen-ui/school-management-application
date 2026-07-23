"use client"
import { useForm } from "react-hook-form"
import { Building2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateHostelBlock } from "@/hooks/use-hostel"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  code: string
  gender: string
  description: string
}

export function CreateBlockDialog({ open, onOpenChange }: Props) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: { name: "", code: "", gender: "", description: "" },
  })
  const createBlock = useCreateHostelBlock()
  const gender = watch("gender")

  const onSubmit = async (data: FormData) => {
    await createBlock.mutateAsync({
      name: data.name,
      code: data.code || undefined,
      gender: (data.gender || undefined) as any,
      description: data.description || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add Hostel Block</DialogTitle>
              <DialogDescription>Add a new hostel block or building</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Block Name <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="e.g., Raman Block, Gandhi Block" {...register("name", { required: "Block name is required" })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g., RB, GB" {...register("code")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(v) => setValue("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select gender (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Boys</SelectItem>
                  <SelectItem value="Female">Girls</SelectItem>
                  <SelectItem value="Other">Common</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description..." {...register("description")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createBlock.isPending}>
              {createBlock.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Block
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}