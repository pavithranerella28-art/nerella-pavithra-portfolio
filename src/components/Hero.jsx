import { lazy, Suspense } from 'react'
import ScrambleText from './ScrambleText'
import { personalInfo } from '../data/portfolioData'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full px-5 md:px-10 pt-28 pb-16 flex items-center">
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">
            <ScrambleText text={`// HUD SYSTEM ONLINE · ${personalInfo.city}`} trigger="mount" />
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-bone mb-6">
            <ScrambleText text={personalInfo.name} as="span" trigger="mount" delay={150} />
          </h1>
          <p className="font-mono text-sm md:text-base uppercase tracking-[0.2em] text-signal mb-6">
            {personalInfo.role}
          </p>
          <p className="text-base md:text-lg text-bone/70 max-w-lg mb-8 leading-relaxed">
            Data Analyst specializing in turning complex datasets into executive dashboards and actionable business intelligence.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#about"
              className="px-6 py-3 bg-signal text-ink font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-signal/90 transition-colors"
            >
              Explore Profile
            </a>
            <a
              href="#projects"
              className="px-6 py-3 border border-bone/20 text-bone font-mono text-xs uppercase tracking-[0.2em] hover:border-signal hover:text-signal transition-colors"
            >
              View Work
            </a>
          </div>
        </div>

        <div className="relative aspect-square max-w-[500px] w-full mx-auto lg:ml-auto h-[380px] md:h-[500px]">
          <Suspense
            fallback={
              <div className="w-full h-full hud-grid flex items-center justify-center font-mono text-xs text-dim">
                LOADING 3D CORE...
              </div>
            }
          >
            <HeroScene />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
