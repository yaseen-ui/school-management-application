import type { FieldErrors, FieldValues } from "react-hook-form"
import { toast } from "@/components/ui/sonner"

function humanizeFieldName(fieldName: string) {
  return fieldName
    .replace(/Id$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase())
}

export function showRequiredFieldsToast<T extends FieldValues>(
  errors: FieldErrors<T>,
  labels: Partial<Record<keyof T, string>> = {},
) {
  const missingFields = Object.keys(errors).map(
    (fieldName) => labels[fieldName as keyof T] || humanizeFieldName(fieldName),
  )

  if (missingFields.length === 0) {
    toast.error("Please complete the required fields")
    return
  }

  toast.error(
    missingFields.length === 1
      ? `${missingFields[0]} is required`
      : "Required fields are missing",
    {
      description:
        missingFields.length === 1
          ? `Please enter or select ${missingFields[0].toLowerCase()} before saving.`
          : `Please complete: ${missingFields.join(", ")}.`,
    },
  )
}
