import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text)
  const containerRef = useRef(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    let intervalId = null
    let timeoutId = null

    const playScramble = () => {
      if (hasPlayedRef.current) return
      hasPlayedRef.current = true

      timeoutId = setTimeout(() => {
        let frame = 0
        intervalId = setInterval(() => {
          frame += 1
          const lockedCount = Math.floor(frame / 2)

          if (lockedCount >= text.length) {
            setDisplay(text)
            clearInterval(intervalId)
            return
          }

          let output = ''
          for (let i = 0; i < text.length; i += 1) {
            if (i < lockedCount) {
              output += text[i]
            } else if (text[i] === ' ') {
              output += ' '
            } else {
              output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            }
          }
          setDisplay(output)
        }, speed)
      }, delay)
    }

    if (trigger === 'mount') {
      playScramble()
      return () => {
        clearTimeout(timeoutId)
        clearInterval(intervalId)
      }
    }

    // Trigger on viewport intersection (40% visible)
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          playScramble()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, delay, speed, trigger])

  return (
    <Tag ref={containerRef} aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}
