'use client'

import { useState, FormEvent } from 'react'
import clsx from 'clsx'
import api from '@/lib/api'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await api.post('/v1/newsletter/subscribe', { email })
      setStatus('success')
      setMessage(res.data.message || 'Thank you!')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {status === 'success' ? (
        <p className="text-green-400 text-sm font-medium">{message}</p>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={clsx(
              'px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap',
              status === 'loading' && 'opacity-50 cursor-not-allowed'
            )}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </form>
  )
}
