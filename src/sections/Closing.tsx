import { useState } from 'react'
import { useLang } from '../i18n'
import { BatShape } from '../components/BatSymbol'

export function Record() {
  const { t } = useLang()
  const r = t.record
  return (
    <section aria-labelledby="ficha" className="bg-blood pb-20 pt-10 md:pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="ficha" className="display text-5xl font-black text-paper">
          {r.title}
        </h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3">
          <div>
            <dt className="text-lg italic text-fog">{r.study}</dt>
            {r.items.map(([a, b]) => (
              <dd key={a} className="mt-3">
                <span className="display block text-2xl font-bold text-paper">{a}</span>
                <span className="text-paper/70">{b}</span>
              </dd>
            ))}
          </div>
          <div>
            <dt className="text-lg italic text-fog">{r.award}</dt>
            <dd className="mt-3">
              <span className="display block text-2xl font-bold text-signal">{r.awardText[0]}</span>
              <span className="text-paper/70">{r.awardText[1]}</span>
            </dd>
          </div>
          <div>
            <dt className="text-lg italic text-fog">{r.lang}</dt>
            {r.langs.map(([a, b]) => (
              <dd key={a} className="mt-3 flex items-baseline justify-between border-b border-paper/15 pb-2">
                <span className="display text-2xl font-bold text-paper">{a}</span>
                <span className="text-paper/70">{b}</span>
              </dd>
            ))}
          </div>
        </dl>
      </div>
    </section>
  )
}

export function Contact() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${t.email}`
    }
  }

  const link =
    'display text-xl font-bold text-paper underline decoration-signal decoration-2 underline-offset-4 hover:text-signal'

  // Background starts on the Record section's maroon (no seam), glows behind the signal and ends on the footer's black.
  return (
    <section
      id="contato"
      className="relative isolate scroll-mt-16 overflow-hidden pb-28 pt-16 sm:pb-36 md:pt-36
        bg-[radial-gradient(75%_17%_at_50%_19%,rgb(168_38_26/0.9),transparent),linear-gradient(180deg,#3B0B0A_0%,#2A0807_70%,#000_100%)]
        md:bg-[radial-gradient(38%_44%_at_80%_52%,rgb(168_38_26/0.95),transparent),linear-gradient(180deg,#3B0B0A_0%,#2A0807_70%,#000_100%)]"
    >
      {/* the signal, already lit, resting on the clouds */}
      <svg
        aria-hidden
        viewBox="0 0 400 260"
        className="mx-auto mb-4 block w-64 md:absolute md:right-[4vw] md:top-1/2 md:-z-10 md:mb-0 md:w-[min(440px,38vw)] md:-translate-y-1/2"
      >
        <defs>
          <radialGradient id="contact-disc">
            <stop offset="0" stopColor="#FFE680" />
            <stop offset="0.7" stopColor="#F2C230" stopOpacity="0.85" />
            <stop offset="1" stopColor="#F2C230" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="130" rx="190" ry="118" fill="url(#contact-disc)" />
        <g transform="translate(95 72) scale(1.05)">
          <BatShape fill="#1A0303" />
        </g>
      </svg>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="display max-w-3xl text-[clamp(3.75rem,10vw,7.5rem)] font-black text-paper">{t.contact.title}</h2>
        <p className="mt-6 max-w-md text-xl text-paper/85">{t.contact.text}</p>

        <a
          href={`mailto:${t.email}`}
          className="display mt-10 inline-block break-all text-[clamp(1.6rem,4.5vw,3rem)] font-extrabold text-signal hover:underline"
        >
          {t.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={copy}
            className="display rounded-sm bg-paper px-5 py-2.5 text-xl font-bold text-ink transition-colors hover:bg-signal"
            aria-live="polite"
          >
            {copied ? t.contact.copied : t.contact.copy}
          </button>
          <a className={link} href={t.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className={link} href={t.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className={link} href={t.cv} target="_blank" rel="noreferrer">
            CV
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-ink py-8">
      <p className="mx-auto max-w-6xl px-4 text-sm text-fog sm:px-6">{t.footer}</p>
    </footer>
  )
}
