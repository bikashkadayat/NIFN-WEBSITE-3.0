import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  disabled?: boolean
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-600 text-white hover:bg-cyan-700 border border-transparent',
  secondary: 'bg-transparent text-white border border-white hover:bg-white/10',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
  outline: 'bg-transparent text-cyan-600 border border-cyan-600 hover:bg-cyan-50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    className,
    children,
  } = props

  const classes = clsx(
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
    'hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    variantStyles[variant],
    sizeStyles[size],
    loading && 'cursor-wait',
    className
  )

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </>
  )

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    )
  }

  const { href: _h, variant: _v, size: _s, icon: _i, ...rest } = props as ButtonAsButton
  return (
    <button {...rest} disabled={disabled || loading} className={classes}>
      {content}
    </button>
  )
}