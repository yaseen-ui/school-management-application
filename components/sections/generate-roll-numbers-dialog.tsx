"use client"

import { Loader2, ListOrdered, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGenerateRollNumbers } from "@/hooks/use-sections"
import type { Section } from "@/lib/api/sections"

interface GenerateRollNumbersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
}

export function GenerateRollNumbersDialog({
  open,
  onOpenChange,
  section,
}: GenerateRollNumbersDialogProps) {
  const generateRollNumbers = useGenerateRollNumbers()

  const handleGenerate = async () => {
    if (!section) return
    await generateRollNumbers.mutateAsync(section.id)
    onOpenChange(false)
  }

  if (!section) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Generate Roll Numbers</DialogTitle>
              <DialogDescription>
                Assign sequential roll numbers to all students in this section
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Section: {section.sectionName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This will assign sequential roll numbers (1, 2, 3...) to all active students
              in <strong>{section.sectionName}</strong> for the current academic year.
            </p>
          </div>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive font-medium">
              ⚠️ This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Once roll numbers are generated, they cannot be regenerated or reset.
              Please ensure all students have been enrolled correctly before proceeding.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generateRollNumbers.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleGenerate}
            disabled={generateRollNumbers.isPending}
          >
            {generateRollNumbers.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Roll Numbers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}