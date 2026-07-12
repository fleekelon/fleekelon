import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav } from './components/Nav'
import { ParticleWave } from './components/ParticleWave'
import { EmailForm } from './components/EmailForm'

gsap.registerPlugin(ScrollTrigger)

const CABIN_IMAGE =
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1800&q=80'
const NIGHT_ROAD =
  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1800&q=80'

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/25">
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </span>
      <span className="font-display text-xs font-semibold tracking-[0.28em]">AERA</span>
    </span>
  )
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.to('[data-parallax]', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#model',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.fromTo(
        '[data-wave-band]',
        { scaleX: 0.6, opacity: 0.35 },
        {
          scaleX: 1.15,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: '#model',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} id="top" className="relative bg-black text-aera-white">
      <div className="grain" aria-hidden />
      <Nav />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(40,40,45,0.55),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(163,7,10,0.12),transparent_45%)]" />
        <ParticleWave />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-5 pb-10 pt-28 md:px-8 md:pb-16 md:pt-32">
          <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-5" data-hero>
              <p className="max-w-[18rem] text-sm leading-relaxed text-white/65 md:text-[15px]">
                An AI-driven vehicle that reads the road before you do.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/40">
                <span className="h-1.5 w-1.5 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-white" />
                Neural stack online
              </span>
            </div>

            <h1
              data-hero
              className="headline text-left text-[clamp(2.6rem,8vw,5.8rem)] text-white md:col-span-7 md:text-right"
            >
              Autonomy,
              <br />
              engineered.
            </h1>
          </div>

          <div className="mt-10 md:mt-8" data-hero>
            <EmailForm buttonLabel="Send" />
          </div>
        </div>
      </section>

      {/* MODEL */}
      <section id="model" className="relative overflow-hidden py-28 md:py-36">
        <div
          data-parallax
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
        >
          <div
            data-wave-band
            className="absolute left-1/2 top-1/2 h-[42vh] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_35%,transparent_70%)] blur-2xl"
          />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute inset-x-[8%] top-[46%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-[8%] top-[54%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="kicker" data-reveal>
            The car
          </p>
          <h2
            className="headline mt-5 text-[clamp(1.8rem,5vw,3.6rem)]"
            data-reveal
          >
            Form follows intention.
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-base"
            data-reveal
          >
            Aera One is sculpted around the neural stack — low, silent, and precise.
            Every surface serves the drive.
          </p>
        </div>
      </section>

      {/* INTELLIGENCE */}
      <section id="intelligence" className="relative py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url(${NIGHT_ROAD})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="kicker" data-reveal>
            Intelligence
          </p>
          <h2
            className="headline mt-5 text-[clamp(1.7rem,4.6vw,3.2rem)]"
            data-reveal
          >
            It doesn&apos;t react.
            <br />
            It anticipates.
          </h2>
          <p
            className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base"
            data-reveal
          >
            Multi-modal perception, continuous learning, and decision latency measured
            in milliseconds — so the cabin stays calm when the world isn&apos;t.
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative py-24 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
          <div
            className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]"
            data-reveal
          >
            <img
              src={CABIN_IMAGE}
              alt="Aera One cabin at night"
              className="h-full w-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                Experience — cabin / night interior
              </p>
            </div>
          </div>

          <div className="md:pl-4">
            <p className="kicker" data-reveal>
              Experience
            </p>
            <h2
              className="headline mt-5 text-[clamp(1.7rem,3.8vw,2.8rem)]"
              data-reveal
            >
              Quiet power.
              <br />
              Living software.
            </h2>
            <p
              className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60 md:text-base"
              data-reveal
            >
              Over-the-air intelligence, summon on demand, and a cabin tuned for
              presence — not distraction.
            </p>
          </div>
        </div>
      </section>

      {/* RESERVE */}
      <section id="reserve" className="relative border-t border-white/10 py-28 md:py-36">
        <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
          <p className="kicker" data-reveal>
            Reserve
          </p>
          <h2
            className="headline mt-5 text-[clamp(1.8rem,4.5vw,3rem)]"
            data-reveal
          >
            Join the first drive
          </h2>
          <p
            className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/55"
            data-reveal
          >
            Limited allocation for founding owners. Leave your email — we&apos;ll notify
            you when reservations open.
          </p>
          <div className="mx-auto mt-8 flex justify-center" data-reveal>
            <EmailForm buttonLabel="Request access" className="w-full max-w-md text-left" />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-white/40 md:flex-row md:px-8">
          <LogoMark />
          <p className="text-xs tracking-wide">© 2026 Aera Motor Co.</p>
        </div>
      </footer>
    </div>
  )
}
