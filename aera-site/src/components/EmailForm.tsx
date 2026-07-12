import { useState } from 'react'
import type { FormEvent } from 'react'

type EmailFormProps = {
  buttonLabel?: string
  className?: string
  compact?: boolean
}

export function EmailForm({
  buttonLabel = 'Send',
  className = '',
  compact = false,
}: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok'>('idle')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('ok')
    setEmail('')
  }

  return (
    <div className={className}>
      <form
        onSubmit={onSubmit}
        className={`flex w-full max-w-md overflow-hidden rounded-full border border-white/15 bg-black/40 ${
          compact ? '' : 'backdrop-blur-sm'
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'ok') setStatus('idle')
          }}
          placeholder="you@domain.com"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/35"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="shrink-0 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white/90"
        >
          {buttonLabel}
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-white/45">
        {status === 'ok'
          ? 'You\'re on the list. We\'ll be in touch when reservations open.'
          : 'Join the first drive. Limited allocation for founding owners — no spam, just the road ahead.'}
      </p>
    </div>
  )
}
