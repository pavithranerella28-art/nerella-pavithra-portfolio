import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from './ScrambleText'
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

// Dynamically load portrait image if present
const portraitModules = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
})
const portraitSrc = Object.values(portraitModules)[0] || null

export default function About() {
  const sectionRef = useRef(null)
  const statsRef = useRef(null)
  const counterRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Reveal animation for all marked elements
      if (prefersReducedMotion) {
        gsap.set('[data-about="reveal"]', { opacity: 1, y: 0 })
      } else {
        gsap.fromTo(
          '[data-about="reveal"]',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          },
        )
      }

      // 2. Count-up animation for stats numbers
      aboutContent.stats.forEach((stat, idx) => {
        const el = counterRefs.current[idx]
        if (!el) return

        if (prefersReducedMotion) {
          el.textContent = String(stat.value)
          return
        }

        const counter = { val: 0 }
        gsap.to(counter, {
          val: stat.value,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toString()
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="w-full px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            as="div"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Portrait HUD Box */}
          <div
            data-about="reveal"
            className="hud-frame aspect-[4/5] max-w-[420px] w-full border border-bone/10 bg-panel overflow-hidden relative mx-auto lg:mx-0"
          >
            {portraitSrc ? (
              <img
                src={portraitSrc}
                alt={`${personalInfo.name} — ${personalInfo.role}`}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-dim">
                PORTRAIT NOT LOADED
              </div>
            )}

            {/* Signal Orange Multiply Overlay */}
            <div className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none" />

            {/* Bottom-left HUD Tag */}
            <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-bone/60 bg-ink/80 px-2 py-0.5 border border-bone/10 backdrop-blur-xs">
              ID · {personalInfo.brandName}
            </div>
          </div>

          {/* RIGHT: Heading, Bio, Stats, and Skills */}
          <div>
            {/* (1) Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone mb-6"
            >
              {aboutContent.heading}
            </h2>

            {/* (2) Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl mb-10"
            >
              {aboutContent.paragraph}
            </p>

            {/* (3) Stats Grid */}
            <dl
              ref={statsRef}
              data-about="reveal"
              className="grid grid-cols-3 gap-4 border-y border-bone/10 py-8 mb-12"
            >
              {aboutContent.stats.map((stat, idx) => (
                <div key={stat.label} className="flex flex-col">
                  <dd className="text-4xl md:text-6xl font-bold text-bone">
                    <span ref={(el) => { counterRefs.current[idx] = el }}>
                      0
                    </span>
                    <span className="text-signal">{stat.suffix}</span>
                  </dd>
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim mt-2">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* (4) Skill Modules */}
            <div
              data-about="reveal"
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10 overflow-hidden"
            >
              {skillGroups.map((group, idx) => (
                <div
                  key={group.title}
                  className="bg-ink p-6 hover:bg-panel transition-colors duration-200"
                >
                  <div className="flex items-center justify-between border-b border-bone/10 pb-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-medium">
                      {group.title}
                    </span>
                    <span className="font-mono text-xs text-dim">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/90 bg-bone/5 hover:border-signal/50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
