import { useState, useEffect } from 'react'
import { personalInfo, navLinks } from '../data/portfolioData'

const STATUS_MESSAGES = [
  'SYS: OPERATIONAL',
  'STATUS: OPEN TO ROLES',
  'LOC: BANGALORE, IN',
  'FOCUS: DATA ANALYTICS',
]

export default function Hud() {
  const [currentTime, setCurrentTime] = useState('')
  const [statusIndex, setStatusIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 1. Live ticking HUD clock (1-second precision)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds} IST`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // 2. Rotating status telemetry message (every 3.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-bone/10 bg-ink/85 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        {/* Left: Brand Identity & Telemetry Status */}
        <div className="flex items-center gap-4">
          <a
            href="#home"
            className="font-mono text-xs font-bold tracking-[0.25em] text-bone hover:text-signal transition-colors uppercase flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            {personalInfo.brandName}
          </a>

          <div
            aria-live="polite"
            className="hidden sm:flex items-center gap-2 pl-4 border-l border-bone/15 font-mono text-[10px] uppercase tracking-wider text-dim"
          >
            <span className="text-signal">&gt;</span>
            <span>{STATUS_MESSAGES[statusIndex]}</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Ticking Clock & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <div
            aria-label="Live system clock"
            className="font-mono text-[11px] text-dim tracking-widest uppercase"
          >
            {currentTime || '00:00:00 IST'}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-bone hover:text-signal font-mono text-xs"
          >
            {mobileMenuOpen ? '[✕]' : '[☰]'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-bone/10 bg-ink px-6 py-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm uppercase tracking-[0.2em] text-bone/80 hover:text-signal transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-bone/10 font-mono text-[10px] text-dim uppercase tracking-wider">
            {STATUS_MESSAGES[statusIndex]}
          </div>
        </nav>
      )}
    </header>
  )
}
