import ScrambleText from './ScrambleText'
import { journeySteps, academy } from '../data/portfolioData'

export default function Journey() {
  return (
    <section id="journey" className="w-full px-5 md:px-10 py-28 md:py-40">
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

        {/* Timeline List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {journeySteps.map((step, idx) => (
            <div
              key={step.period}
              className="hud-frame border border-bone/10 bg-panel/60 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-signal tracking-[0.2em] mb-4">
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
    </section>
  )
}
