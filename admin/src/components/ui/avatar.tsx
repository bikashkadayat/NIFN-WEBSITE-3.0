import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

interface AvatarProps {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
  fallback?: ReactNode
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function Avatar({ src, name, size = "md", fallback }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
        sizeClasses[size],
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : fallback ? (
        fallback
      ) : (
        <span className="flex items-center justify-center h-full w-full">
          {name ? getInitials(name) : <User size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
        </span>
      )}
    </div>
  )
}

export { Avatar, type AvatarProps }
