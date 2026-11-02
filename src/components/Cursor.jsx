import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only enable custom cursor on fine-pointer devices without reduced motion
    if (!isFinePointer || prefersReducedMotion) {
      return
    }

    document.body.classList.add('has-cursor')

    // Center elements on coordinates and make them visible
    gsap.set([dotRef.current, ringRef.current], {
      opacity: 1,
      xPercent: -50,
      yPercent: -50,
    })

    // Create high-performance smooth follower for the outer ring
    const xTo = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3.out' })

    const onPointerMove = (e) => {
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onPointerOver = (e) => {
      const isHot = Boolean(e.target.closest('a, button, input, textarea, [data-cursor="hot"]'))
      if (isHot) {
        gsap.to(ringRef.current, {
          scale: 1.8,
          borderColor: '#ff5b1f',
          duration: 0.2,
        })
      } else {
        gsap.to(ringRef.current, {
          scale: 1,
          borderColor: 'rgba(232, 230, 223, 0.6)',
          duration: 0.2,
        })
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerover', onPointerOver)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-signal pointer-events-none z-[999] opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-full border border-bone/60 pointer-events-none z-[999] opacity-0"
      />
    </>
  )
}
