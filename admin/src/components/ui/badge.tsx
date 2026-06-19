import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const variants = {
  default:
    "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900",
  secondary:
    "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  destructive:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  outline:
    "border border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-300",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
} as const

type BadgeVariant = keyof typeof variants

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
