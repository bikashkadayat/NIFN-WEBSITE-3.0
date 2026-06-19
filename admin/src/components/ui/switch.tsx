import { cn } from "@/lib/utils"

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
}

function Switch({ checked, onCheckedChange, disabled, label, id }: SwitchProps) {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <label
      htmlFor={switchId}
      className={cn(
        "inline-flex items-center gap-2",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-pointer",
      )}
    >
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
          checked
            ? "bg-zinc-900 dark:bg-zinc-50"
            : "bg-zinc-200 dark:bg-zinc-700",
          disabled && "pointer-events-none",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-xs ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}
    </label>
  )
}

export { Switch, type SwitchProps }
