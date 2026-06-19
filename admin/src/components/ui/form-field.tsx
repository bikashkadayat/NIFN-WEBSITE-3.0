"use client"

import type { Control, FieldValues, Path, FieldError } from "react-hook-form"
import type { ReactNode } from "react"
import { useController } from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  render: (field: {
    value: unknown
    onChange: (...event: unknown[]) => void
    onBlur: () => void
    ref: React.Ref<unknown>
    name: string
  }) => ReactNode
  errors?: Partial<Record<Path<T>, FieldError | undefined>>
}

function FormField<T extends FieldValues>({
  name,
  control,
  label,
  render,
  errors,
}: FormFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  const errorMessage = error?.message || errors?.[name]?.message

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      {render({
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        ref: field.ref,
        name: field.name,
      })}
      {errorMessage && (
        <p className="text-sm text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export { FormField, type FormFieldProps }
