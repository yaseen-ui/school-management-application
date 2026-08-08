"use client"

import * as React from "react"
import Select from "react-select"

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

// Keep the menu visually consistent with the application while allowing
// react-select to render it in a portal without changing the form layout.
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "2.5rem",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
    boxShadow: state.isFocused
      ? "0 0 0 3px color-mix(in oklab, var(--ring) 18%, transparent)"
      : "0 1px 2px rgb(15 23 42 / 0.04)",
    "&:hover": {
      borderColor: state.isFocused ? "var(--ring)" : "var(--border)",
    },
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontSize: "0.875rem",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
  }),
  valueContainer: (base: any) => ({
    ...base,
    gap: "0.25rem",
    padding: "0.25rem 0.625rem",
  }),
  menu: (base: any) => ({
    ...base,
    marginTop: "0.375rem",
    borderRadius: "0.75rem",
    border: "1px solid var(--border)",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    boxShadow: "0 18px 45px -20px rgb(15 23 42 / 0.38), 0 6px 16px rgb(15 23 42 / 0.08)",
    overflow: "hidden",
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "14rem",
    padding: "0.375rem",
    backgroundColor: "var(--popover)",
  }),
  // Radix Dialog (and similar modals) set body { pointer-events: none } while open
  // and only re-enable pointer-events on dialog content. Portaled menus live under
  // body, so without this clicks fall through — menu closes, nothing is selected.
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
    pointerEvents: "auto",
  }),
  option: (base: any, state: any) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    minHeight: "2.375rem",
    margin: "0.125rem 0",
    padding: "0.5rem 0.625rem",
    borderRadius: "0.5rem",
    backgroundColor: state.isSelected
      ? "color-mix(in oklab, var(--primary) 12%, var(--popover))"
      : state.isFocused
        ? "var(--accent)"
        : "transparent",
    color: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? "var(--accent-foreground)"
        : "var(--popover-foreground)",
    fontWeight: state.isSelected ? 600 : 400,
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "color-mix(in oklab, var(--primary) 16%, var(--popover))",
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    margin: 0,
    border: "1px solid color-mix(in oklab, var(--primary) 18%, var(--border))",
    borderRadius: "0.4rem",
    backgroundColor: "color-mix(in oklab, var(--primary) 8%, var(--background))",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    padding: "0.2rem 0.15rem 0.2rem 0.45rem",
    color: "var(--foreground)",
    fontSize: "0.8125rem",
    fontWeight: 500,
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    borderRadius: "0 0.35rem 0.35rem 0",
    color: "var(--muted-foreground)",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "color-mix(in oklab, var(--destructive) 12%, transparent)",
      color: "var(--destructive)",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "0.875rem",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--foreground)",
  }),
  noOptionsMessage: (base: any) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: "0.875rem",
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: "var(--border)",
  }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    padding: "0.5rem",
    color: state.isFocused ? "var(--primary)" : "var(--muted-foreground)",
    transition: "color 150ms ease, transform 150ms ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    "&:hover": {
      color: "var(--primary)",
    },
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: "var(--muted-foreground)",
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
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    setPortalTarget(document.body)
  }, [])

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
      menuPortalTarget={portalTarget ?? undefined}
      menuPosition="fixed"
      menuPlacement="auto"
      menuShouldScrollIntoView={false}
      maxMenuHeight={224}
      className="w-full"
      classNamePrefix="react-select"
    />
  )
}
