import {
  personalInfo,
  socialLinks,
  navLinks,
  footerContent,
  academy,
} from '../data/portfolioData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8 bg-ink">
      <div className="max-w-[1440px] mx-auto">
        {/* Three Columns on Desktop / Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-14">
          {/* Column 1: Navigation */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-4">
              Navigate
            </span>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-bone/75 hover:text-signal transition-colors font-mono text-xs uppercase tracking-wider block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Elsewhere */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-4">
              Elsewhere
            </span>
            <ul className="space-y-2">
              {socialLinks
                .filter((link) => Boolean(link.url))
                .map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bone/75 hover:text-signal transition-colors font-mono text-xs uppercase tracking-wider block"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 3: Say hello */}
          <div className="md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block mb-4">
              Say hello
            </span>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-bone/75 hover:text-signal transition-colors font-mono text-xs md:text-sm block break-all"
            >
              {personalInfo.email}
            </a>
            <div className="font-mono text-xs text-dim mt-2">
              {personalInfo.city}
            </div>
          </div>
        </div>

        {/* Brand Watermark */}
        <div
          aria-hidden="true"
          className="overflow-hidden py-4 text-center select-none pointer-events-none"
        >
          <div className="uppercase whitespace-nowrap text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-bone/[0.07]">
            {personalInfo.brandName}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </div>
          <div>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-signal transition-colors"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
