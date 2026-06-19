
'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  ChangeEvent,
  ReactNode,
} from 'react'
import clsx from 'clsx'
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  User,
  Code2,
  Target,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import api from '@/lib/api'

/* ============================== Types ============================== */

interface JoinFormData {
  // Organization
  orgName: string
  orgType: string
  registrationNumber: string
  country: string
  website: string
  yearEstablished: string
  orgAddress: string

  // Primary contact
  contactName: string
  contactRole: string
  contactEmail: string
  contactPhone: string

  // Technical contact
  techName: string
  techEmail: string
  techPhone: string

  // Membership intent
  membershipTier: '' | 'observer' | 'associate' | 'full'
  servicesInterested: string[]
  expectedVolume: string
  targetGoLive: string
  useCase: string

  // Compliance
  regulatorLicense: string
  amlKycReady: '' | 'yes' | 'no' | 'in-progress'
  agreeTerms: boolean
  agreePrivacy: boolean

  // Honeypot
  hp_field: string
}

type FormErrors = Partial<Record<keyof JoinFormData | string, string>>
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface JoinNetworkFormProps {
  endpoint?: string
  draftKey?: string | null
  onSuccess?: (data: Omit<JoinFormData, 'hp_field'>) => void
}

/* ============================ Constants ============================ */

const INITIAL: JoinFormData = {
  orgName: '',
  orgType: '',
  registrationNumber: '',
  country: 'Nepal',
  website: '',
  yearEstablished: '',
  orgAddress: '',
  contactName: '',
  contactRole: '',
  contactEmail: '',
  contactPhone: '',
  techName: '',
  techEmail: '',
  techPhone: '',
  membershipTier: '',
  servicesInterested: [],
  expectedVolume: '',
  targetGoLive: '',
  useCase: '',
  regulatorLicense: '',
  amlKycReady: '',
  agreeTerms: false,
  agreePrivacy: false,
  hp_field: '',
}

const ORG_TYPES = [
  'Commercial Bank',
  'Development Bank',
  'Finance Company',
  'Microfinance Institution (MFI)',
  'Payment Service Provider (PSP)',
  'Payment System Operator (PSO)',
  'Fintech / Startup',
  'Remittance Company',
  'Cooperative',
  'NGO / Non-profit',
  'Government Agency',
  'Other',
]

const COUNTRIES = ['Nepal', 'India', 'Bangladesh', 'Bhutan', 'Sri Lanka', 'Other']

const SERVICES = [
  'Domestic Payments',
  'Cross-border Remittance',
  'Merchant Acceptance',
  'Wallet-to-Wallet Transfers',
  'API / Developer Integration',
  'Settlement Services',
]

const VOLUME_TIERS = [
  '< 1,000 tx/month',
  '1,000 – 10,000 tx/month',
  '10,000 – 100,000 tx/month',
  '100,000 – 1M tx/month',
  '> 1M tx/month',
]

const TIMELINES = [
  'Within 3 months',
  '3–6 months',
  '6–12 months',
  '12+ months',
  'Exploring only',
]

const TIERS = [
  { id: 'observer', title: 'Observer', desc: 'Access docs & sandbox' },
  { id: 'associate', title: 'Associate', desc: 'Pilot integration' },
  { id: 'full', title: 'Full Member', desc: 'Production & settlement' },
] as const

const AML_OPTIONS = [
  { v: 'yes', l: 'Yes, ready' },
  { v: 'in-progress', l: 'In progress' },
  { v: 'no', l: 'Not yet' },
] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/.+\..+/
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/

/* ============================== Steps ============================== */

const STEPS = [
  { id: 'org', label: 'Organization', icon: Building2 },
  { id: 'contact', label: 'Primary Contact', icon: User },
  { id: 'tech', label: 'Technical Contact', icon: Code2 },
  { id: 'intent', label: 'Membership Intent', icon: Target },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
] as const

/* ============================ Component ============================ */

export function JoinNetworkForm({
  endpoint = '/v1/join-network',
  draftKey = 'nifn:join-draft',
  onSuccess,
}: JoinNetworkFormProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<JoinFormData>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  /* ---------- Restore draft ---------- */
  useEffect(() => {
    if (!draftKey || typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<JoinFormData>
        setFormData((prev) => ({ ...prev, ...parsed, hp_field: '' }))
      }
    } catch {
      /* ignore corrupted draft */
    }
  }, [draftKey])

  /* ---------- Persist draft (debounced) ---------- */
  useEffect(() => {
    if (!draftKey || typeof window === 'undefined') return
    if (status === 'success') return
    const t = setTimeout(() => {
      const { hp_field, ...rest } = formData
      try {
        localStorage.setItem(draftKey, JSON.stringify(rest))
      } catch {
        /* quota exceeded - silent */
      }
    }, 500)
    return () => clearTimeout(t)
  }, [formData, draftKey, status])

  /* ---------- Handlers ---------- */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement
      const { name, value, type } = target
      const newValue = type === 'checkbox' ? target.checked : value

      setFormData((prev) => ({ ...prev, [name]: newValue }))
      setErrors((prev) => {
        if (!prev[name]) return prev
        const next = { ...prev }
        delete next[name]
        return next
      })
    },
    []
  )

  const toggleService = useCallback((svc: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesInterested: prev.servicesInterested.includes(svc)
        ? prev.servicesInterested.filter((s) => s !== svc)
        : [...prev.servicesInterested, svc],
    }))
    setErrors((prev) => {
      if (!prev.servicesInterested) return prev
      const next = { ...prev }
      delete next.servicesInterested
      return next
    })
  }, [])

  /* ---------- Per-step validation ---------- */
  const validateStep = useCallback(
    (stepIdx: number): boolean => {
      const errs: FormErrors = {}
      const id = STEPS[stepIdx].id

      if (id === 'org') {
        if (!formData.orgName.trim()) errs.orgName = 'Organization name is required'
        else if (formData.orgName.trim().length < 2)
          errs.orgName = 'Name must be at least 2 characters'

        if (!formData.orgType) errs.orgType = 'Select organization type'

        if (!formData.registrationNumber.trim())
          errs.registrationNumber = 'Registration number is required'

        if (!formData.country) errs.country = 'Country is required'

        if (formData.website && !URL_RE.test(formData.website))
          errs.website = 'Enter a valid URL (https://…)'

        if (formData.yearEstablished) {
          const y = Number(formData.yearEstablished)
          const now = new Date().getFullYear()
          if (!y || y < 1900 || y > now)
            errs.yearEstablished = `Enter a year between 1900–${now}`
        }
      }

      if (id === 'contact') {
        if (!formData.contactName.trim()) errs.contactName = 'Contact name is required'
        if (!formData.contactRole.trim()) errs.contactRole = 'Role / designation is required'

        if (!formData.contactEmail.trim()) errs.contactEmail = 'Email is required'
        else if (!EMAIL_RE.test(formData.contactEmail))
          errs.contactEmail = 'Enter a valid email address'

        if (!formData.contactPhone.trim()) errs.contactPhone = 'Phone is required'
        else if (!PHONE_RE.test(formData.contactPhone))
          errs.contactPhone = 'Enter a valid phone number'
      }

      if (id === 'tech') {
        // Optional, but if provided must be valid
        if (formData.techEmail && !EMAIL_RE.test(formData.techEmail))
          errs.techEmail = 'Enter a valid email address'
        if (formData.techPhone && !PHONE_RE.test(formData.techPhone))
          errs.techPhone = 'Enter a valid phone number'
      }

      if (id === 'intent') {
        if (!formData.membershipTier) errs.membershipTier = 'Select a membership tier'
        if (formData.servicesInterested.length === 0)
          errs.servicesInterested = 'Select at least one service'
        if (!formData.expectedVolume) errs.expectedVolume = 'Select expected volume'
        if (!formData.targetGoLive) errs.targetGoLive = 'Select target timeline'

        const useCase = formData.useCase.trim()
        if (!useCase) errs.useCase = 'Describe your use case'
        else if (useCase.length < 30)
          errs.useCase = `Please add more detail (${useCase.length}/30 minimum)`
        else if (useCase.length > 2000) errs.useCase = 'Keep under 2000 characters'
      }

      if (id === 'compliance') {
        if (!formData.amlKycReady) errs.amlKycReady = 'Select AML/KYC readiness'
        if (!formData.agreeTerms) errs.agreeTerms = 'You must accept the terms'
        if (!formData.agreePrivacy) errs.agreePrivacy = 'You must accept the privacy policy'
      }

      setErrors(errs)
      return Object.keys(errs).length === 0
    },
    [formData]
  )

  const goNext = () => {
    if (!validateStep(step)) {
      // focus first invalid field
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]'
        )
        firstInvalid?.focus()
      })
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({
      top: (formRef.current?.offsetTop ?? 0) - 80,
      behavior: 'smooth',
    })
  }

  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Honeypot triggered
    if (formData.hp_field) {
      setStatus('success')
      setServerMsg('Application received. Our team will reach out shortly.')
      setReferenceId(`NIFN-${Date.now().toString().slice(-8)}`)
      return
    }

    // Validate every step before final submit
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        setStep(i)
        return
      }
    }

    setStatus('submitting')
    setServerMsg('')

    try {
      const { hp_field, ...payload } = formData
      const res = await api.post(endpoint, {
        ...payload,
        contactEmail: payload.contactEmail.trim().toLowerCase(),
        techEmail: payload.techEmail.trim().toLowerCase() || null,
      })

      setStatus('success')
      setServerMsg(
        res.data?.message ||
          'Application submitted! Our partnerships team will contact you within 3 business days.'
      )
      setReferenceId(
        res.data?.reference || `NIFN-${Date.now().toString().slice(-8)}`
      )
      onSuccess?.(payload)
      if (draftKey) localStorage.removeItem(draftKey)
    } catch (err: unknown) {
      setStatus('error')
      // Map Laravel-style 422 validation errors back to fields
      const error = err as {
        response?: { data?: { errors?: Record<string, string | string[]>; message?: string } }
      }
      const validationErrors = error?.response?.data?.errors
      if (validationErrors && typeof validationErrors === 'object') {
        const mapped: FormErrors = {}
        Object.entries(validationErrors).forEach(([f, m]) => {
          mapped[f] = Array.isArray(m) ? String(m[0]) : String(m)
        })
        setErrors(mapped)
        setServerMsg('Please correct the highlighted fields and try again.')

        // Jump to step containing first error
        const firstErrorField = Object.keys(mapped)[0]
        const stepIdx = findStepForField(firstErrorField)
        if (stepIdx !== -1) setStep(stepIdx)
      } else {
        setServerMsg(
          error?.response?.data?.message ||
            'Something went wrong. Please try again later.'
        )
      }
    }
  }

  /* ---------- Styling helpers ---------- */
  const inputClass = (name: string) =>
    clsx(
      'w-full px-4 py-2.5 rounded-lg border text-sm transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
      'disabled:bg-gray-50 disabled:cursor-not-allowed',
      errors[name]
        ? 'border-red-300 focus:border-red-400 bg-red-50/30'
        : 'border-gray-300 focus:border-cyan-500'
    )

  const isSubmitting = status === 'submitting'
  const progress = ((step + 1) / STEPS.length) * 100

  /* ---------- Success screen ---------- */
  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">{serverMsg}</p>
        {referenceId && (
          <p className="text-sm text-gray-400">
            Reference: <span className="font-mono text-gray-600">{referenceId}</span>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setStep(0)
            setFormData(INITIAL)
            setServerMsg('')
            setReferenceId('')
          }}
          className="mt-6 text-sm text-cyan-600 hover:text-cyan-700 font-medium underline"
        >
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      aria-busy={isSubmitting}
    >
      {/* ============ Progress + Stepper ============ */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-cyan-700 font-semibold uppercase tracking-wider">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-lg font-bold text-gray-900 mt-1">
              {STEPS[step].label}
            </h2>
          </div>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = i === step
            const isDone = i < step
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition',
                  isActive && 'bg-cyan-600 text-white',
                  isDone &&
                    !isActive &&
                    'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer',
                  !isActive && !isDone && 'bg-gray-100 text-gray-500 cursor-not-allowed'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* ============ Server error banner ============ */}
        {status === 'error' && serverMsg && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{serverMsg}</span>
          </div>
        )}

        {/* ============ Honeypot ============ */}
        <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
          <label htmlFor="hp_field">Website (leave blank)</label>
          <input
            id="hp_field"
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            value={formData.hp_field}
            onChange={handleChange}
          />
        </div>

        {/* ============ STEP 1: ORGANIZATION ============ */}
        {step === 0 && (
          <div className="space-y-4">
            <Field id="orgName" label="Organization Name" required error={errors.orgName}>
              <input
                id="orgName"
                name="orgName"
                type="text"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="e.g. Nepal Bank Limited"
                className={inputClass('orgName')}
                aria-invalid={!!errors.orgName}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="orgType" label="Organization Type" required error={errors.orgType}>
                <select
                  id="orgType"
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  className={inputClass('orgType')}
                  aria-invalid={!!errors.orgType}
                >
                  <option value="">Select type…</option>
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="registrationNumber"
                label="Registration Number"
                required
                hint="Company/PAN/license"
                error={errors.registrationNumber}
              >
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. 123456/078/079"
                  className={inputClass('registrationNumber')}
                  aria-invalid={!!errors.registrationNumber}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field id="country" label="Country" required error={errors.country}>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClass('country')}
                  aria-invalid={!!errors.country}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="yearEstablished"
                label="Year Established"
                error={errors.yearEstablished}
              >
                <input
                  id="yearEstablished"
                  name="yearEstablished"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={formData.yearEstablished}
                  onChange={handleChange}
                  placeholder="e.g. 2010"
                  className={inputClass('yearEstablished')}
                  aria-invalid={!!errors.yearEstablished}
                />
              </Field>

              <Field id="website" label="Website" error={errors.website}>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={inputClass('website')}
                  aria-invalid={!!errors.website}
                />
              </Field>
            </div>

            <Field id="orgAddress" label="Registered Address" error={errors.orgAddress}>
              <textarea
                id="orgAddress"
                name="orgAddress"
                rows={2}
                value={formData.orgAddress}
                onChange={handleChange}
                placeholder="Street, City, Province"
                className={inputClass('orgAddress')}
              />
            </Field>
          </div>
        )}

        {/* ============ STEP 2: PRIMARY CONTACT ============ */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="contactName"
                label="Full Name"
                required
                error={errors.contactName}
              >
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="e.g. Bikash Kadayat"
                  className={inputClass('contactName')}
                  aria-invalid={!!errors.contactName}
                />
              </Field>

              <Field
                id="contactRole"
                label="Role / Designation"
                required
                error={errors.contactRole}
              >
                <input
                  id="contactRole"
                  name="contactRole"
                  type="text"
                  value={formData.contactRole}
                  onChange={handleChange}
                  placeholder="e.g. Head of Partnerships"
                  className={inputClass('contactRole')}
                  aria-invalid={!!errors.contactRole}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="contactEmail"
                label="Work Email"
                required
                error={errors.contactEmail}
              >
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@organization.com"
                  className={inputClass('contactEmail')}
                  aria-invalid={!!errors.contactEmail}
                />
              </Field>

              <Field
                id="contactPhone"
                label="Phone"
                required
                error={errors.contactPhone}
              >
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+977-98XXXXXXXX"
                  className={inputClass('contactPhone')}
                  aria-invalid={!!errors.contactPhone}
                />
              </Field>
            </div>

            <div className="text-xs text-gray-600 bg-cyan-50/60 border border-cyan-100 rounded-lg p-3">
              💡 This person will be the authorized signatory and primary point of
              communication for the application.
            </div>
          </div>
        )}

        {/* ============ STEP 3: TECHNICAL CONTACT ============ */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Optional — fill this if your integration team is different from the primary
              contact.
            </p>

            <Field id="techName" label="Technical Lead Name" error={errors.techName}>
              <input
                id="techName"
                name="techName"
                type="text"
                value={formData.techName}
                onChange={handleChange}
                placeholder="e.g. CTO / Engineering Lead"
                className={inputClass('techName')}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="techEmail" label="Technical Email" error={errors.techEmail}>
                <input
                  id="techEmail"
                  name="techEmail"
                  type="email"
                  value={formData.techEmail}
                  onChange={handleChange}
                  placeholder="tech@organization.com"
                  className={inputClass('techEmail')}
                  aria-invalid={!!errors.techEmail}
                />
              </Field>

              <Field id="techPhone" label="Technical Phone" error={errors.techPhone}>
                <input
                  id="techPhone"
                  name="techPhone"
                  type="tel"
                  value={formData.techPhone}
                  onChange={handleChange}
                  placeholder="+977-…"
                  className={inputClass('techPhone')}
                  aria-invalid={!!errors.techPhone}
                />
              </Field>
            </div>
          </div>
        )}

        {/* ============ STEP 4: MEMBERSHIP INTENT ============ */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Membership Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Tier <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIERS.map((t) => (
                  <label
                    key={t.id}
                    className={clsx(
                      'border rounded-lg p-3 cursor-pointer transition',
                      formData.membershipTier === t.id
                        ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="membershipTier"
                      value={t.id}
                      checked={formData.membershipTier === t.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="font-semibold text-sm text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                  </label>
                ))}
              </div>
              {errors.membershipTier && (
                <p className="text-red-500 text-xs mt-1">{errors.membershipTier}</p>
              )}
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services of Interest <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICES.map((svc) => (
                  <label
                    key={svc}
                    className={clsx(
                      'flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition text-sm',
                      formData.servicesInterested.includes(svc)
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={formData.servicesInterested.includes(svc)}
                      onChange={() => toggleService(svc)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    {svc}
                  </label>
                ))}
              </div>
              {errors.servicesInterested && (
                <p className="text-red-500 text-xs mt-1">{errors.servicesInterested}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="expectedVolume"
                label="Expected Transaction Volume"
                required
                error={errors.expectedVolume}
              >
                <select
                  id="expectedVolume"
                  name="expectedVolume"
                  value={formData.expectedVolume}
                  onChange={handleChange}
                  className={inputClass('expectedVolume')}
                  aria-invalid={!!errors.expectedVolume}
                >
                  <option value="">Select…</option>
                  {VOLUME_TIERS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="targetGoLive"
                label="Target Go-Live"
                required
                error={errors.targetGoLive}
              >
                <select
                  id="targetGoLive"
                  name="targetGoLive"
                  value={formData.targetGoLive}
                  onChange={handleChange}
                  className={inputClass('targetGoLive')}
                  aria-invalid={!!errors.targetGoLive}
                >
                  <option value="">Select…</option>
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              id="useCase"
              label="Describe Your Use Case"
              required
              error={errors.useCase}
              hint={`${formData.useCase.length}/30 min · 2000 max`}
            >
              <textarea
                id="useCase"
                name="useCase"
                rows={4}
                maxLength={2000}
                value={formData.useCase}
                onChange={handleChange}
                placeholder="Tell us how you plan to use NIFN — target customers, products, integration approach…"
                className={inputClass('useCase')}
                aria-invalid={!!errors.useCase}
              />
            </Field>
          </div>
        )}

        {/* ============ STEP 5: COMPLIANCE ============ */}
        {step === 4 && (
          <div className="space-y-5">
            <Field
              id="regulatorLicense"
              label="Regulator / License Details"
              hint="e.g. NRB License No., or 'N/A'"
              error={errors.regulatorLicense}
            >
              <input
                id="regulatorLicense"
                name="regulatorLicense"
                type="text"
                value={formData.regulatorLicense}
                onChange={handleChange}
                placeholder="e.g. NRB/PSO/2023/12"
                className={inputClass('regulatorLicense')}
              />
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AML / KYC Readiness <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AML_OPTIONS.map((opt) => (
                  <label
                    key={opt.v}
                    className={clsx(
                      'border rounded-lg p-2.5 text-center cursor-pointer text-sm transition',
                      formData.amlKycReady === opt.v
                        ? 'border-cyan-500 bg-cyan-50 font-semibold text-cyan-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="amlKycReady"
                      value={opt.v}
                      checked={formData.amlKycReady === opt.v}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {opt.l}
                  </label>
                ))}
              </div>
              {errors.amlKycReady && (
                <p className="text-red-500 text-xs mt-1">{errors.amlKycReady}</p>
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-gray-700">
                  I agree to the{' '}
                  <a
                    href="/terms"
                    className="text-cyan-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NIFN Membership Terms
                  </a>{' '}
                  and confirm that the information provided is accurate.{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs ml-7">{errors.agreeTerms}</p>
              )}

              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-gray-700">
                  I consent to NIFN processing this data per the{' '}
                  <a
                    href="/privacy"
                    className="text-cyan-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  . <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreePrivacy && (
                <p className="text-red-500 text-xs ml-7">{errors.agreePrivacy}</p>
              )}
            </div>
          </div>
        )}

        {/* ============ NAVIGATION ============ */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0 || isSubmitting}
            className={clsx(
              'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition',
              step === 0 || isSubmitting
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                'inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700',
                'text-white rounded-lg text-sm font-semibold transition',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
                isSubmitting && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

/* ====================== Helper: field → step lookup ====================== */

function findStepForField(field: string): number {
  const map: Record<string, number> = {
    orgName: 0,
    orgType: 0,
    registrationNumber: 0,
    country: 0,
    website: 0,
    yearEstablished: 0,
    orgAddress: 0,
    contactName: 1,
    contactRole: 1,
    contactEmail: 1,
    contactPhone: 1,
    techName: 2,
    techEmail: 2,
    techPhone: 2,
    membershipTier: 3,
    servicesInterested: 3,
    expectedVolume: 3,
    targetGoLive: 3,
    useCase: 3,
    regulatorLicense: 4,
    amlKycReady: 4,
    agreeTerms: 4,
    agreePrivacy: 4,
  }
  return map[field] ?? -1
}

/* ============================ Subcomponent ============================ */

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
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
