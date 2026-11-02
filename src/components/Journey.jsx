import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from './ScrambleText'
import { journeySteps, academy } from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const lineFillRef = useRef(null)
  const nodeRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (lineFillRef.current) lineFillRef.current.style.transform = 'scaleY(1)'
        nodeRefs.current.forEach((node) => node?.classList.add('is-active'))
        return
      }

      // 1. Scrubbed vertical progress line that fills as you scroll down
      if (lineFillRef.current && timelineRef.current) {
        gsap.to(lineFillRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: true,
          },
        })
      }

      // 2. Timeline nodes light up as line reaches them, and un-light on scroll up
      nodeRefs.current.forEach((node) => {
        if (!node) return
        ScrollTrigger.create({
          trigger: node,
          start: 'top 70%',
          end: 'bottom top',
          onEnter: () => {
            node.classList.add('border-signal', 'bg-signal', 'shadow-[0_0_12px_#ff5b1f]')
            node.classList.remove('border-bone/30', 'bg-ink')
          },
          onLeaveBack: () => {
            node.classList.remove('border-signal', 'bg-signal', 'shadow-[0_0_12px_#ff5b1f]')
            node.classList.add('border-bone/30', 'bg-ink')
          },
        })
      })

      // 3. Entrance animation for cards with once: true
      gsap.utils.toArray('[data-journey="card"]').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" ref={sectionRef} className="w-full px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div className="mb-4">
          <ScrambleText
            text="03 / Journey"
            as="div"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
        </div>

        <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone mb-16">
          Career Path
        </h2>

        {/* Interactive Timeline Container */}
        <div ref={timelineRef} className="relative pl-6 md:pl-10">
          {/* Vertical Connecting Track */}
          <div className="absolute top-3 bottom-6 left-2.5 md:left-4 w-[2px] bg-bone/10 -translate-x-1/2">
            <div
              ref={lineFillRef}
              className="w-full h-full bg-signal origin-top transform scale-y-0"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {journeySteps.map((step, idx) => (
              <div key={step.period} className="relative flex items-start gap-6 md:gap-8">
                {/* Node indicator */}
                <div
                  ref={(el) => { nodeRefs.current[idx] = el }}
                  className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 border-bone/30 bg-ink shrink-0 mt-6 -ml-[23px] md:-ml-[32px] transition-colors duration-300 z-10"
                />

                {/* Step Card */}
                <div
                  data-journey="card"
                  className="hud-frame border border-bone/10 bg-panel/60 p-6 md:p-8 flex-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs text-signal tracking-[0.2em] mb-4 gap-2">
                    <span>{step.period}</span>
                    <span className="text-dim">{String(idx + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-bone mb-2">
                    {step.role}
                  </h3>

                  <div className="font-mono text-xs text-dim uppercase tracking-wider mb-6">
                    {step.organization === academy.name ? (
                      <a
                        href={academy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-signal hover:underline"
                      >
                        {step.organization} ↗
                      </a>
                    ) : (
                      step.organization
                    )}{' '}
                    · {step.location}
                  </div>

                  <p className="text-sm md:text-base text-bone/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
