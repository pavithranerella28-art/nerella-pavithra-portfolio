import { useState, useRef, useEffect } from 'react'
import ScrambleText from './ScrambleText'
import {
  personalInfo,
  socialLinks,
  contactContent,
  emailjsConfig,
} from '../data/portfolioData'

export default function Contact() {
  const [status, setStatus] = useState(null)
  const formRef = useRef(null)
  const clearTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  const firstName = (personalInfo.name.split(' ')[0] || 'nerella').toLowerCase()

  const isConfigured =
    emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
    emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
    emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !formRef.current) return

    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)

    if (!isConfigured) {
      // Fallback: trigger a formatted mailto window and reset form
      const formData = new FormData(formRef.current)
      const name = formData.get('user_name') || ''
      const email = formData.get('user_email') || ''
      const msg = formData.get('message') || ''
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        'Portfolio contact',
      )}&body=${encodeURIComponent(body)}`

      window.open(mailtoUrl, '_blank')
      setStatus('success')
      formRef.current.reset()
      clearTimerRef.current = setTimeout(() => setStatus(null), 4000)
      return
    }

    try {
      setStatus('sending')
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey,
      )
      setStatus('success')
      formRef.current.reset()
    } catch (err) {
      console.error('EmailJS transmission failed:', err)
      setStatus('error')
    } finally {
      clearTimerRef.current = setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <section id="contact" className="w-full hud-grid px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT: Contact Information & Direct Links */}
        <div>
          <div className="mb-4">
            <ScrambleText
              text={contactContent.label}
              as="div"
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
            />
          </div>

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone mb-6">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md mb-8 leading-relaxed">
            {contactContent.note}
          </p>

          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-lg md:text-2xl text-bone underline decoration-signal decoration-2 underline-offset-8 hover:text-signal transition-colors mb-4 inline-block"
          >
            {personalInfo.email}
          </a>

          {personalInfo.phone && (
            <div className="font-mono text-sm text-dim mb-8">
              {personalInfo.phone}
            </div>
          )}

          <div className="flex flex-wrap gap-6 mt-6">
            {socialLinks
              .filter((link) => Boolean(link.url))
              .map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-bone hover:text-signal transition-colors"
                >
                  {link.label} ↗
                </a>
              ))}
          </div>
        </div>

        {/* RIGHT: Terminal HUD Form Box */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10">
          <div className="font-mono text-xs text-dim mb-8 flex items-center gap-2">
            <span className="text-signal">$</span>
            <span>new message --to {firstName}</span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                &gt; name
              </span>
              <input
                name="user_name"
                required
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone py-3 focus:outline-none transition-colors"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                &gt; email
              </span>
              <input
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone py-3 focus:outline-none transition-colors"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-2">
                &gt; message
              </span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone py-3 focus:outline-none resize-none transition-colors"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-signal text-ink font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 hover:bg-bone transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between mt-4"
            >
              <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
              <span>→</span>
            </button>

            <div className="min-h-[1.5rem] mt-4">
              {status === 'success' && (
                <p role="status" className="font-mono text-xs text-emerald-400">
                  ✓ Message sent. Talk soon.
                </p>
              )}
              {status === 'error' && (
                <p role="status" className="font-mono text-xs text-red-400">
                  ✕ Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
