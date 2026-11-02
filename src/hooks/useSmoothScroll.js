import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    // Respect prefers-reduced-motion setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    // Sync Lenis scroll events with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's shared animation ticker
    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Smoothly scroll in-page anchor links
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -60 })
      }
    }
    document.addEventListener('click', handleAnchorClick)

    // Refresh ScrollTrigger calculations after resources load
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 800)

    // Clean up all resources, listeners, and loops on unmount
    return () => {
      window.removeEventListener('load', onLoad)
      clearTimeout(timer)
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
