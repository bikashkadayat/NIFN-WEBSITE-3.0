'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import clsx from 'clsx'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import api from '@/lib/api'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [serverMsg, setServerMsg] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format'
    if (!formData.subject.trim()) errs.subject = 'Subject is required'
    if (!formData.message.trim()) errs.message = 'Message is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    setServerMsg('')
    try {
      const res = await api.post('/v1/contact', formData)
      setStatus('success')
      setServerMsg(res.data.message || 'Thank you! Your message has been sent.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setServerMsg('Something went wrong. Please try again later.')
    }
  }

  const inputClass = (name: string) =>
    clsx(
      'w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
      errors[name]
        ? 'border-red-300 focus:border-red-400'
        : 'border-gray-300 focus:border-cyan-500'
    )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          {serverMsg}
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {serverMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="Your name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="your@email.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+977-..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} className={inputClass('subject')} placeholder="How can we help?" />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={inputClass('message')}
          placeholder="Your message..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={clsx(
          'w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2',
          status === 'submitting' && 'opacity-50 cursor-not-allowed'
        )}
      >
        {status === 'submitting' ? (
          <>Sending...</>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Message
          </>
        )}
      </button>
    </form>
  )
}
