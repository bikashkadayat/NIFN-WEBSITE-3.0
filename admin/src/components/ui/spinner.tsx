import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: number
  className?: string
}

function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-zinc-400", className)}
      size={size}
      aria-label="Loading"
    />
  )
}

export { Spinner, type SpinnerProps }
