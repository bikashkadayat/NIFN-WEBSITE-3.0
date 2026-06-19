'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { submitDeveloperRegistration } from '@/lib/api'

interface FormErrors {
  contact_name?: string
  email?: string
  organization_type?: string
  terms?: string
}

export function DeveloperRegistrationForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationType, setOrganizationType] = useState('')
  const [useCase, setUseCase] = useState('')
  const [terms, setTerms] = useState(false)

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!contactName || contactName.trim().length < 2) errs.contact_name = 'Name is required (min 2 characters)'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'A valid email is required'
    if (!organizationType) errs.organization_type = 'Please select an organization type'
    if (!terms) errs.terms = 'You must agree to the terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setFormState('submitting')
    setError('')

    const result = await submitDeveloperRegistration({
      contact_name: contactName.trim(),
      email: email.trim(),
      organization_name: organizationName.trim(),
      organization_type: organizationType,
      use_case: useCase.trim(),
      agreed_terms: terms,
    })

    if (result.success) {
      setFormState('success')
    } else {
      setFormState('error')
      setError(result.error || 'Registration failed. Please try again.')
    }
  }

  if (formState === 'success') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration received!</h2>
        <p className="text-gray-500 mb-2">
          You will receive sandbox credentials within 2 business days at <strong className="text-gray-700">{email}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Check your spam folder if you don&apos;t see them.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/docs"
            className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
          >
            Browse Documentation
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {formState === 'error' && error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact_name"
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${errors.contact_name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            placeholder="Your full name"
          />
          {errors.contact_name && <p className="text-xs text-red-500 mt-1">{errors.contact_name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            placeholder="you@organization.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            id="organization_name"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Your company or organization"
          />
        </div>

        <div>
          <label htmlFor="organization_type" className="block text-sm font-medium text-gray-700 mb-1">
            Organization Type <span className="text-red-500">*</span>
          </label>
          <select
            id="organization_type"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${errors.organization_type ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">Select an option...</option>
            {['Cooperative', 'Bank', 'Fintech', 'Remittance Provider', 'Independent Developer', 'Other'].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.organization_type && <p className="text-xs text-red-500 mt-1">{errors.organization_type}</p>}
        </div>

        <div>
          <label htmlFor="use_case" className="block text-sm font-medium text-gray-700 mb-1">
            What are you building?
          </label>
          <textarea
            id="use_case"
            rows={4}
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            maxLength={5000}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            placeholder="Tell us about your integration..."
          />
          <p className="text-xs text-gray-400 mt-1">{useCase.length}/5000</p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the developer terms of service <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {formState === 'submitting' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
          ) : (
            'Submit Registration'
          )}
        </button>
      </form>
    </div>
  )
}
