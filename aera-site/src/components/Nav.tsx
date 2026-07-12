import { useEffect, useState } from 'react'

const links = [
  { href: '#model', label: 'Model' },
  { href: '#intelligence', label: 'Intelligence' },
  { href: '#experience', label: 'Experience' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="AERA home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 transition group-hover:border-white/50">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.28em]">AERA</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#reserve"
            className="ml-3 inline-flex items-center justify-center rounded-full bg-[#f5f5f5] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
          >
            Reserve
          </a>
        </nav>

        <a
          href="#reserve"
          className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black md:hidden"
        >
          Reserve
        </a>
      </div>
    </header>
  )
}
