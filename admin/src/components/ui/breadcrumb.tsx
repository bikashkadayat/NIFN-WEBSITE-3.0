import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    isLast
                      ? "font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem }
