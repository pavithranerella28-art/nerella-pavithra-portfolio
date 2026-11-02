import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from './ScrambleText'
import { projects } from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

// Dynamically import all project cover images
const projectImages = import.meta.glob('../assets/projects/*.(png|jpg|jpeg|webp|svg)', {
  eager: true,
  import: 'default',
})

function getCoverImage(id) {
  const match = Object.entries(projectImages).find(([path]) =>
    new RegExp(`/${id}\\.(png|jpg|jpeg|webp|svg)$`, 'i').test(path),
  )
  return match ? match[1] : null
}

function ProjectCard({ project, index }) {
  const coverSrc = getCoverImage(project.id)
  const badgeNumber = String(index + 1).padStart(2, '0')

  return (
    <article
      data-cursor="hot"
      className="group relative flex flex-col border border-bone/10 bg-panel/60 w-full md:w-[min(560px,42vw)] shrink-0 transition-colors duration-300"
    >
      {/* Cover Media Area */}
      <div className="aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden relative">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-104 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full hud-grid flex items-center justify-center font-mono text-sm tracking-widest text-dim uppercase">
            {project.id}
          </div>
        )}

        {/* Number / Year Badge */}
        <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-xs px-2.5 py-1 border border-bone/10 font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
          {badgeNumber} / {project.year}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone mb-3">
          {project.title}
        </h3>

        <p className="text-sm md:text-base text-bone/70 leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-signal text-ink hover:bg-bone font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors"
            >
              Live ↗
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors"
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current
      const section = sectionRef.current
      const progressLine = progressRef.current
      if (!track || !section) return

      const getDistance = () => track.scrollWidth - window.innerWidth + 80

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressLine) {
              gsap.set(progressLine, { scaleX: self.progress })
            }
          },
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6 relative"
    >
      {/* Header Row */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <ScrambleText
            text="02 / Selected work"
            as="div"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-2"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>
        <div className="hidden md:block font-mono text-xs text-dim uppercase tracking-wider pb-2">
          {projects.length} projects · scroll →
        </div>
      </div>

      {/* The Track: Vertical Stack on Mobile, Single Horizontal Row on Desktop */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 md:flex-row md:w-max md:gap-8 px-5 md:px-10"
      >
        {projects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>

      {/* Horizontal Scroll Progress Line (Desktop) */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-6 md:mt-8 hidden md:block shrink-0">
        <div className="w-full h-[2px] bg-bone/10 relative overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-signal w-full origin-left transform scale-x-0"
          />
        </div>
      </div>
    </section>
  )
}
