"use client"

import { AlertTriangle, Ban, Info } from "lucide-react"
import { Modal } from "./modal"
import { Button } from "./button"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: "danger" | "warning" | "default"
  loading?: boolean
}

const variantConfig = {
  danger: {
    icon: Ban,
    iconClass: "text-red-500",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    buttonVariant: "secondary" as const,
  },
  default: {
    icon: Info,
    iconClass: "text-zinc-500",
    buttonVariant: "primary" as const,
  },
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "default",
  loading,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 ${config.iconClass}`}>
          <Icon size={36} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={config.buttonVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export { ConfirmDialog, type ConfirmDialogProps }
