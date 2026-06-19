"use client"

import { useEffect, useCallback, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] mx-4",
} as const

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: ReactNode
  size?: keyof typeof sizes
  footer?: ReactNode
}

function Modal({ open, onClose, title, description, children, size = "md", footer }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, handleEscape])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 animate-in zoom-in-95 duration-200",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="mt-4">{children}</div>}
        {footer && (
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export { Modal, type ModalProps }
