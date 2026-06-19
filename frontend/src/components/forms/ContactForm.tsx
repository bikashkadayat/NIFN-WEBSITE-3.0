'use client'

import { useState, useEffect, useRef, useCallback, FormEvent, ChangeEvent } from 'react'
import clsx from 'clsx'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

/* ----------------------------- Types ----------------------------- */

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  /** Honeypot — must remain empty. Bots typically fill all fields. */
  website: string
}

interface FormErrors {
  [key: string]: string | undefined
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  /** Optional subject categories. If provided, subject becomes a <select>. */
  subjects?: string[]
  /** API endpoint override. Defaults to '/v1/contact'. */
  endpoint?: string
  /** Persist draft to localStorage under this key. Pass null to disable. */
  draftKey?: string | null
  /** Called after a successful submission. */
  onSuccess?: (data: FormData) => void
}

/* --------------------------- Constants --------------------------- */

const INITIAL: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '', // honeypot
}

const LIMITS = {
  name: { min: 2, max: 80 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts +977-9XXXXXXXXX, 98XXXXXXXX, or international formats
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/

/* --------------------------- Component --------------------------- */

export function ContactForm({
  subjects,
  endpoint = '/v1/contact',
  draftKey = 'nifn:contact-draft',
  onSuccess,
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successTimer = useRef<NodeJS.Timeout | null>(null)

  /* --- Restore draft on mount --- */
  useEffect(() => {
    if (!draftKey || typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>
        setFormData((prev) => ({ ...prev, ...parsed, website: '' }))
      }
    } catch {
      /* ignore corrupted draft */
    }
  }, [draftKey])

  /* --- Persist draft (debounced via effect) --- */
  useEffect(() => {
    if (!draftKey || typeof window === 'undefined') return
    if (status === 'success') return
    const t = setTimeout(() => {
      const { website, ...rest } = formData
      localStorage.setItem(draftKey, JSON.stringify(rest))
    }, 400)
    return () => clearTimeout(t)
  }, [formData, draftKey, status])

  /* --- Cleanup success timer --- */
  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current)
  }, [])

  /* --- Handlers --- */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    },
    []
  )

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {}
    const data = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    }

    if (!data.name) errs.name = 'Name is required'
    else if (data.name.length < LIMITS.name.min)
      errs.name = `Name must be at least ${LIMITS.name.min} characters`
    else if (data.name.length > LIMITS.name.max)
      errs.name = `Name must be under ${LIMITS.name.max} characters`

    if (!data.email) errs.email = 'Email is required'
    else if (!EMAIL_RE.test(data.email)) errs.email = 'Please enter a valid email address'

    if (data.phone && !PHONE_RE.test(data.phone)) errs.phone = 'Please enter a valid phone number'

    if (!data.subject) errs.subject = 'Subject is required'
    else if (data.subject.length < LIMITS.subject.min)
      errs.subject = `Subject must be at least ${LIMITS.subject.min} characters`

    if (!data.message) errs.message = 'Message is required'
    else if (data.message.length < LIMITS.message.min)
      errs.message = `Message must be at least ${LIMITS.message.min} characters`
    else if (data.message.length > LIMITS.message.max)
      errs.message = `Message must be under ${LIMITS.message.max} characters`

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [formData])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Honeypot triggered → silently "succeed" so bots don't retry
    if (formData.website) {
      setStatus('success')
      setServerMsg('Thank you! Your message has been sent.')
      setFormData(INITIAL)
      return
    }

    if (!validate()) {
      // Focus the first invalid field
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      firstInvalid?.focus()
      return
    }

    setStatus('submitting')
    setServerMsg('')

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      }

      const res = await api.post(endpoint, payload)

      setStatus('success')
      setServerMsg(res.data?.message || 'Thank you! Your message has been sent.')
      setFormData(INITIAL)
      if (draftKey) localStorage.removeItem(draftKey)
      onSuccess?.(payload as FormData)

      // Auto-dismiss success banner after 6s
      successTimer.current = setTimeout(() => setStatus('idle'), 6000)
    } catch (err: any) {
      setStatus('error')

      // Laravel-style 422 validation errors → field-level mapping
      const validationErrors = err?.response?.data?.errors
      if (validationErrors && typeof validationErrors === 'object') {
        const mapped: FormErrors = {}
        Object.entries(validationErrors).forEach(([field, msgs]) => {
          mapped[field] = Array.isArray(msgs) ? String(msgs[0]) : String(msgs)
        })
        setErrors(mapped)
        setServerMsg('Please correct the highlighted fields and try again.')
      } else {
        setServerMsg(
          err?.response?.data?.message ||
            'Something went wrong. Please try again later.'
        )
      }
    }
  }

  /* --- Styling helpers --- */
  const inputClass = (name: keyof FormData) =>
    clsx(
      'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
      'disabled:bg-gray-50 disabled:cursor-not-allowed',
      errors[name]
        ? 'border-red-300 focus:border-red-400 bg-red-50/30'
        : 'border-gray-300 focus:border-cyan-500'
    )

  const isSubmitting = status === 'submitting'
  const messageLen = formData.message.length

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
      aria-busy={isSubmitting}
    >
      {/* Status banners */}
      {status === 'success' && (
        <div
          role="status"
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700 text-sm animate-in fade-in slide-in-from-top-1"
        >
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverMsg}</span>
        </div>
      )}

      {status === 'error' && serverMsg && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverMsg}</span>
        </div>
      )}

      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field
          id="name"
          label="Name"
          required
          error={errors.name}
        >
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="name"
            maxLength={LIMITS.name.max}
            placeholder="Your full name"
            className={inputClass('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </Field>

        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>
      </div>

      {/* Row 2: Phone + Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field id="phone" label="Phone" error={errors.phone} hint="Optional">
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="tel"
            placeholder="+977-98XXXXXXXX"
            className={inputClass('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </Field>

        <Field id="subject" label="Subject" required error={errors.subject}>
          {subjects && subjects.length > 0 ? (
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClass('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            >
              <option value="">Select a topic…</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={LIMITS.subject.max}
              placeholder="How can we help?"
              className={inputClass('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
          )}
        </Field>
      </div>

      {/* Message */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <span
            className={clsx(
              'text-xs tabular-nums',
              messageLen > LIMITS.message.max ? 'text-red-500' : 'text-gray-400'
            )}
          >
            {messageLen}/{LIMITS.message.max}
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={6}
          maxLength={LIMITS.message.max}
          placeholder="Tell us a bit about your inquiry…"
          className={clsx(inputClass('message'), 'resize-y min-h-[140px]')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          'w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800',
          'text-white font-semibold rounded-lg transition-all',
          'inline-flex items-center justify-center gap-2',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
          isSubmitting && 'opacity-70 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        By submitting, you agree to our privacy policy. We typically reply within 1–2 business days.
      </p>
    </form>
  )
}

/* --------------------------- Subcomponent --------------------------- */

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{' '}
        {required ? (
          <span className="text-red-500" aria-label="required">*</span>
        ) : (
          hint && <span className="text-gray-400 font-normal">({hint})</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}