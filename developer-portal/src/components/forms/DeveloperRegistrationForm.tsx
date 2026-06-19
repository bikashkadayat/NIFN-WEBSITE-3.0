'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { submitDeveloperRegistration } from '@/lib/api'

/* ============================== Types ============================== */

interface FormErrors {
  contact_name?: string
  email?: string
  organization_type?: string
  use_case?: string
  terms?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  contact_name: string
  email: string
  organization_name: string
  organization_type: string
  use_case: string
  terms: boolean
  hp_field: string
}

/* ============================ Constants ============================ */

const INITIAL: FormData = {
  contact_name: '',
  email: '',
  organization_name: '',
  organization_type: '',
  use_case: '',
  terms: false,
  hp_field: '',
}

const ORG_TYPES = [
  { value: 'Cooperative', desc: 'Savings and credit cooperatives' },
  { value: 'Bank', desc: 'Commercial or development bank' },
  { value: 'Fintech', desc: 'Fintech or startup' },
  { value: 'Remittance Provider', desc: 'Money transfer services' },
  { value: 'Independent Developer', desc: 'Solo developer or hobbyist' },
  { value: 'Other', desc: 'Something else' },
]

const USE_CASE_TEMPLATES = [
  { label: 'Mobile wallet', text: 'Building a mobile wallet integration for end users.' },
  { label: 'E-commerce checkout', text: 'Adding NIFN payment checkout to an e-commerce store.' },
  { label: 'Remittance', text: 'Cross-border remittance solution targeting the Nepali diaspora.' },
  { label: 'Just exploring', text: 'Exploring the platform to evaluate it for a future project.' },
]

const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']
const TYPO_MAP: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USE_CASE_MAX = 5000
const DRAFT_KEY = 'nifn:dev-register-draft'

/* ============================ Component ============================ */

export function DeveloperRegistrationForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [copied, setCopied] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>
        if (parsed.contact_name || parsed.email || parsed.use_case) {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            terms: false,
            hp_field: '',
          }))
          setDraftRestored(true)
          setTimeout(() => setDraftRestored(false), 6000)
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || formState === 'success') return
    const t = setTimeout(() => {
      const { terms, hp_field, ...rest } = formData
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
      } catch {
        /* quota */
      }
    }, 600)
    return () => clearTimeout(t)
  }, [formData, formState])

  useEffect(() => {
    if (!formData.email.includes('@')) {
      setEmailSuggestion(null)
      return
    }
    const [local, domain] = formData.email.split('@')
    if (!domain || !local) return

    if (TYPO_MAP[domain.toLowerCase()]) {
      setEmailSuggestion(`${local}@${TYPO_MAP[domain.toLowerCase()]}`)
      return
    }

    const closest = COMMON_DOMAINS.find(
      (d) => d !== domain.toLowerCase() && isOneCharOff(domain.toLowerCase(), d)
    )
    setEmailSuggestion(closest ? `${local}@${closest}` : null)
  }, [formData.email])

  const updateField = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement
      const { name, type } = target
      const value = type === 'checkbox' ? target.checked : target.value

      setFormData((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => {
        const key = name as keyof FormErrors
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    []
  )

  const selectOrgType = (value: string) => {
    setFormData((prev) => ({ ...prev, organization_type: value }))
    setErrors((prev) => {
      if (!prev.organization_type) return prev
      const next = { ...prev }
      delete next.organization_type
      return next
    })
  }

  const insertTemplate = (text: string) => {
    setFormData((prev) => ({ ...prev, use_case: text }))
  }

  const acceptEmailSuggestion = () => {
    if (emailSuggestion) {
      setFormData((prev) => ({ ...prev, email: emailSuggestion }))
      setEmailSuggestion(null)
    }
  }

  const clearDraft = () => {
    setFormData(INITIAL)
    setErrors({})
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
    setDraftRestored(false)
  }

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {}
    const name = formData.contact_name.trim()
    const email = formData.email.trim()
    const useCase = formData.use_case.trim()

    if (!name) errs.contact_name = 'Please enter your name.'
    else if (name.length < 2)
      errs.contact_name = 'That looks a bit short — at least 2 characters please.'
    else if (name.length > 100)
      errs.contact_name = 'Please keep your name under 100 characters.'

    if (!email) errs.email = 'We need an email to send your credentials.'
    else if (!EMAIL_RE.test(email))
      errs.email = "That doesn't look like a valid email address."

    if (!formData.organization_type)
      errs.organization_type = 'Pick the option that best describes you.'

    if (useCase && useCase.length > USE_CASE_MAX)
      errs.use_case = `Please keep this under ${USE_CASE_MAX} characters.`

    if (!formData.terms)
      errs.terms = 'You need to agree to the terms before we can continue.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [formData])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.hp_field) {
      setFormState('success')
      return
    }

    if (!validate()) {
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        first?.focus()
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }

    setFormState('submitting')
    setServerError('')

    const result = await submitDeveloperRegistration({
      contact_name: formData.contact_name.trim(),
      email: formData.email.trim().toLowerCase(),
      organization_name: formData.organization_name.trim(),
      organization_type: formData.organization_type,
      use_case: formData.use_case.trim(),
      agreed_terms: formData.terms,
    })

    if (result.success) {
      setFormState('success')
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      setFormState('error')
      setServerError(
        result.error ||
          'Something went wrong on our end. Please try again in a moment.'
      )
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && formState !== 'submitting') {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(formData.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  /* ====================== SUCCESS SCREEN ====================== */
  if (formState === 'success') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-5">
            <svg
              className="w-7 h-7 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Thanks, we&apos;ve got your registration
          </h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            We&apos;ll review your details and send your sandbox credentials within 2
            business days.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  Confirmation will be sent to
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {formData.email}
                </div>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              What happens next
            </h3>
            <ol className="space-y-4">
              {[
                {
                  title: 'We review your application',
                  desc: 'Our team will look over the details you submitted.',
                  state: 'done',
                },
                {
                  title: 'You receive sandbox credentials',
                  desc: 'Within 2 business days — please check your spam folder too.',
                  state: 'next',
                },
                {
                  title: 'You start building',
                  desc: 'Test your integration in our sandbox environment.',
                  state: 'future',
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div
                    className={clsx(
                      'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border',
                      item.state === 'done' &&
                        'bg-emerald-50 border-emerald-200 text-emerald-700',
                      item.state === 'next' &&
                        'bg-cyan-50 border-cyan-200 text-cyan-700',
                      item.state === 'future' &&
                        'bg-gray-50 border-gray-200 text-gray-500'
                    )}
                  >
                    {item.state === 'done' ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <Link
              href="/docs"
              className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition"
            >
              Browse documentation
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition"
            >
              Back to portal
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500">
            Have a question?{' '}
            <Link
              href="/contact"
              className="text-gray-900 underline hover:no-underline"
            >
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    )
  }

  /* ====================== MAIN FORM ====================== */
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-8">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Register for sandbox access
          </h2>
          <p className="text-sm text-gray-500">
            Tell us a bit about yourself and what you&apos;d like to build. We&apos;ll
            send your credentials shortly.
          </p>
        </div>

        {draftRestored && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 p-3 mb-6 bg-blue-50 border border-blue-100 rounded-md text-sm"
          >
            <div>
              <span className="font-medium text-blue-900">
                We picked up where you left off.
              </span>{' '}
              <span className="text-blue-700">
                Your previous answers have been restored.
              </span>
            </div>
            <button
              type="button"
              onClick={clearDraft}
              className="shrink-0 text-blue-700 hover:text-blue-900 text-xs font-medium underline"
            >
              Start over
            </button>
          </div>
        )}

        {formState === 'error' && serverError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 p-3 mb-6 bg-red-50 border border-red-200 rounded-md text-sm"
          >
            <div>
              <div className="font-medium text-red-900">
                We couldn&apos;t submit your registration.
              </div>
              <div className="text-red-700 mt-0.5">{serverError}</div>
            </div>
            <button
              type="button"
              onClick={() => setFormState('idle')}
              className="shrink-0 text-red-700 hover:text-red-900 text-lg leading-none px-1"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          noValidate
          className="space-y-8"
        >
          <div
            className="absolute -left-[9999px] w-px h-px overflow-hidden"
            aria-hidden="true"
          >
            <input
              type="text"
              name="hp_field"
              tabIndex={-1}
              autoComplete="off"
              value={formData.hp_field}
              onChange={updateField}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              id="contact_name"
              label="Your name"
              required
              error={errors.contact_name}
            >
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={updateField}
                autoComplete="name"
                placeholder="Bikash Kadayat"
                className={inputClass(!!errors.contact_name)}
                aria-invalid={!!errors.contact_name}
                maxLength={100}
              />
            </Field>

            <Field id="email" label="Work email" required error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={updateField}
                autoComplete="email"
                placeholder="you@organization.com"
                className={inputClass(!!errors.email)}
                aria-invalid={!!errors.email}
              />
              {emailSuggestion && !errors.email && (
                <button
                  type="button"
                  onClick={acceptEmailSuggestion}
                  className="mt-2 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md px-3 py-1.5 transition w-full text-left"
                >
                  Did you mean{' '}
                  <strong className="font-semibold">{emailSuggestion}</strong>?{' '}
                  <span className="text-amber-700 font-medium underline">
                    Use this
                  </span>
                </button>
              )}
            </Field>
          </div>

          <Field id="organization_name" label="Organization" hint="Optional">
            <input
              id="organization_name"
              name="organization_name"
              type="text"
              value={formData.organization_name}
              onChange={updateField}
              autoComplete="organization"
              placeholder="Your company, cooperative, or project"
              className={inputClass(false)}
              maxLength={150}
            />
          </Field>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              What best describes you? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              This helps us tailor your onboarding experience.
            </p>
            <div
              role="radiogroup"
              aria-label="Organization Type"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {ORG_TYPES.map((opt) => {
                const selected = formData.organization_type === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectOrgType(opt.value)}
                    className={clsx(
                      'text-left px-4 py-3 rounded-md border transition-colors',
                      selected
                        ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                        : errors.organization_type
                          ? 'border-red-200 hover:border-red-300'
                          : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {opt.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                      </div>
                      <div
                        className={clsx(
                          'shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 transition',
                          selected
                            ? 'border-gray-900 bg-gray-900'
                            : 'border-gray-300'
                        )}
                      >
                        {selected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[3px]" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {errors.organization_type && (
              <p className="text-xs text-red-600 mt-2" role="alert">
                {errors.organization_type}
              </p>
            )}
          </div>

          <Field
            id="use_case"
            label="What are you building?"
            hint={`${formData.use_case.length} / ${USE_CASE_MAX}`}
            error={errors.use_case}
          >
            <textarea
              id="use_case"
              name="use_case"
              rows={5}
              value={formData.use_case}
              onChange={updateField}
              maxLength={USE_CASE_MAX}
              placeholder="A few sentences about your project, target users, or how you plan to integrate with NIFN."
              className={clsx(
                inputClass(!!errors.use_case),
                'resize-y min-h-[120px]'
              )}
              aria-invalid={!!errors.use_case}
            />
            {!formData.use_case && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1.5">
                  Not sure where to start?
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {USE_CASE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => insertTemplate(tpl.text)}
                      className="text-xs px-2.5 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer pt-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={updateField}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-700"
                aria-invalid={!!errors.terms}
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I&apos;ve read and agree to the{' '}
                <Link
                  href="/terms"
                  className="text-gray-900 underline hover:no-underline font-medium"
                >
                  Developer Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-gray-900 underline hover:no-underline font-medium"
                >
                  Privacy Policy
                </Link>
                . <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-600 mt-1.5 ml-7" role="alert">
                {errors.terms}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={formState === 'submitting'}
              className={clsx(
                'w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition',
                'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                formState === 'submitting' && 'opacity-60 cursor-not-allowed'
              )}
            >
              {formState === 'submitting' ? 'Submitting…' : 'Submit registration'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Takes about a minute. No credit card required. Free sandbox access.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================ Subcomponents ============================ */

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && (
          <span
            className={clsx(
              'text-xs tabular-nums',
              error ? 'text-red-500' : 'text-gray-400'
            )}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/* ============================ Helpers ============================ */

function inputClass(hasError: boolean) {
  return clsx(
    'w-full px-3.5 py-2.5 border rounded-md text-sm transition-colors bg-white',
    'focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900',
    'placeholder:text-gray-400',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 hover:border-gray-400'
  )
}

function isOneCharOff(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false
  let differences = 0
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      differences++
      if (differences > 1) return false
      if (a.length > b.length) i++
      else if (b.length > a.length) j++
      else {
        i++
        j++
      }
    } else {
      i++
      j++
    }
  }
  return differences + (a.length - i) + (b.length - j) <= 1
}