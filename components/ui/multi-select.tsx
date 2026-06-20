"use client"

import * as React from "react"
import Select from "react-select"
import type { Props as ReactSelectProps, GroupBase } from "react-select"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
}

// Custom styles to match shadcn/ui design
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "2.5rem",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "hsl(240 5.9% 10%)" : "hsl(240 5.9% 90%)",
    boxShadow: state.isFocused ? "0 0 0 1px hsl(240 5.9% 10%)" : "none",
    "&:hover": {
      borderColor: "hsl(240 5.9% 10%)",
    },
    backgroundColor: "hsl(0 0% 100%)",
    fontSize: "0.875rem",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    border: "1px solid hsl(240 5.9% 90%)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    zIndex: 9999,
    position: "relative" as const,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "hsl(240 5.9% 10%)"
      : state.isFocused
        ? "hsl(240 4.8% 95.9%)"
        : "transparent",
    color: state.isSelected ? "hsl(0 0% 98%)" : "hsl(240 10% 3.9%)",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": {
      backgroundColor: state.isSelected ? "hsl(240 5.9% 10%)" : "hsl(240 4.8% 95.9%)",
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "hsl(240 4.8% 95.9%)",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "hsl(240 10% 3.9%)",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "hsl(240 5% 64.9%)",
    "&:hover": {
      backgroundColor: "hsl(240 5.9% 10%)",
      color: "hsl(0 0% 98%)",
      borderRadius: "0 0.375rem 0.375rem 0",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "hsl(240 3.8% 46.1%)",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    color: "hsl(240 10% 3.9%)",
    fontSize: "0.875rem",
  }),
  noOptionsMessage: (base: any) => ({
    ...base,
    color: "hsl(240 3.8% 46.1%)",
    fontSize: "0.875rem",
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: "hsl(240 5.9% 90%)",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "hsl(240 3.8% 46.1%)",
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: "hsl(240 3.8% 46.1%)",
  }),
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  emptyText = "No items found.",
  disabled = false,
}: MultiSelectProps) {
  const selectedValues = options.filter((opt) => selected.includes(opt.value))

  const handleChange = (newValue: any) => {
    const values = newValue ? (newValue as MultiSelectOption[]).map((v) => v.value) : []
    onChange(values)
  }

  return (
    <Select
      isMulti
      options={options}
      value={selectedValues}
      onChange={handleChange}
      placeholder={placeholder}
      noOptionsMessage={() => emptyText}
      isDisabled={disabled}
      isClearable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      styles={customStyles}
      className="w-full"
      classNamePrefix="react-select"
    />
  )
}
