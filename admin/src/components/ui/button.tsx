import { forwardRef, type ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const variants = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600",
  outline:
    "border border-zinc-300 bg-transparent hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
  link:
    "bg-transparent underline-offset-4 hover:underline text-zinc-900 dark:text-zinc-100",
} as const

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button, type ButtonProps, type Variant, type Size }
